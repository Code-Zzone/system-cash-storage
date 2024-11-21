let contentShowSales = `
<h1> جميع العمليات</h1>
<div class="content-ShowSales"> 
    <div>
        <input type="text" id="saleSearchInput" placeholder="البحث عن المبيعات">
        <button onclick="searchSales()">بحث عن المبيعات</button>
    </div>
    
    <div id="dataDisplay"></div>
    <a href="../html/edit-delete.html" target="__blank" style="color: white;">شاهد العمليات المعدله والمحذوفه</a>
    </div>
    `;
    
    document.getElementById('ShowSales').innerHTML = contentShowSales;

// تعريف المراجع لقاعدة البيانات
const database = firebase.database();
const productsRef = database.ref('products');
const salesRef = database.ref('sales');




// عرض المبيعات
window.showSales = function showSales() {
    salesRef.on('value', (snapshot) => {
        const dataDisplay = document.getElementById('dataDisplay');
        dataDisplay.innerHTML = '';

        snapshot.forEach(childSnapshot => {
            const sale = childSnapshot.val();
            const saleId = childSnapshot.key;

            dataDisplay.innerHTML += `
                <div class="item">
                    <h3>عملية بيع ${saleId}</h3>
                    <p>التاريخ: ${new Date(sale.timestamp).toLocaleString()}</p>
                    <div class="btns-sales"> 
                        <button onclick="printSale('${saleId}')">طباعة</button>
                        <button onclick="editSale('${saleId}')">تعديل</button>
                    </div>
                </div>
            `;
        });
    });
}

// حذف عملية البيع وإعادة الكمية إلى المخزن  مطلوب مستقبلا اضافه امكانيه الحذف بالطريقه المناسبه

// دالة لتعديل عملية البيع
window.editSale = function editSale(saleId) {
    salesRef.child(saleId).once('value', (snapshot) => {
        const sale = snapshot.val();
        const dataDisplay = document.getElementById('dataDisplay');
        dataDisplay.innerHTML = `<h3>تعديل عملية بيع ${saleId}</h3>`;
        
        // حفظ بيانات العملية القديمة في قائمة جديدة
        const modifiedSaleRef = database.ref('modifiedSales/' + saleId);
        modifiedSaleRef.set({
            originalData: sale, // بيانات العملية الأصلية
            timestamp: new Date().toISOString() // حفظ الوقت
        });

        sale.items.forEach((item, index) => {
            dataDisplay.innerHTML += `
                <div>
                    <p>${item.name}</p>
                    <p>السعر: ${item.price}</p>
                    <p>
                        الكمية الحالية: ${item.quantity} 
                        <input type="number" id="newQuantity${index}" value="${item.quantity}" min="0">
                    </p>
                </div>
            `;
        });

        const saveButton = document.createElement('button');
        saveButton.innerText = "حفظ التعديلات";
        saveButton.onclick = () => saveEdit(saleId, sale.items);
        dataDisplay.appendChild(saveButton);
    });
}

window.saveEdit = function saveEdit(saleId, items) {
    const updatedItems = [];

    const promises = items.map((item, index) => {
        const newQuantity = parseInt(document.getElementById(`newQuantity${index}`).value);

        // إذا كانت الكمية المعدلة 0، لا نضيف العنصر إلى updatedItems
        if (newQuantity === 0) {
            return Promise.resolve(); // اجعلها وعود فارغة
        } else {
            updatedItems.push({ ...item, quantity: newQuantity });
        }

        // تحديث المخزون
        const productRef = productsRef.child(item.id);
        return productRef.once('value').then(snapshot => {
            const currentQuantity = snapshot.val().quantity;

            // تحقق من الكمية الجديدة مقابل المخزون
            if (currentQuantity + item.quantity >= newQuantity) {
                // تحديث الكمية في المخزون
                productRef.update({ quantity: currentQuantity - (newQuantity - item.quantity) });
            } else {
                // إذا كانت الكمية غير متاحة، إظهار رسالة تنبيه
                alert(`لا توجد كمية كافية من ${item.name} في المخزون.`);
                throw new Error(`Insufficient quantity for ${item.name}`);
            }
        });
    });
    
    // بعد أن يتم تنفيذ جميع الوعود بنجاح، يتم تحديث الصفحة
    Promise.all(promises)
        .then(() => {
            // تحديث الصفحة
            window.location.reload();
        })
        .catch(error => {
            console.error("حدث خطأ:", error);
        });
    // انتظار جميع التحديثات
    Promise.all(promises)
        .then(() => {
            // تحديث عملية البيع فقط إذا كان هناك عناصر محدثة
            if (updatedItems.length > 0) {
                // حفظ التعديلات في العمليات المعدلة
                const modifiedSaleRef = database.ref('modifiedSales/' + saleId);

                // إضافة القيم الجديدة إلى نفس العملية
                modifiedSaleRef.update({
                    updatedData: {
                        items: updatedItems,
                        timestamp: new Date().toISOString() // حفظ الوقت
                    }
                });

                return salesRef.child(saleId).update({ items: updatedItems }); // تحديث عملية البيع الأصلية
            } else {
                return salesRef.child(saleId).remove(); // إذا كانت جميع العناصر تمت إزالتها
            }
        })
        .then(() => {
            alert('تم حفظ التعديلات بنجاح.');
            showSales(); // إعادة عرض عمليات البيع
        })
        .catch(error => {
            console.error('حدث خطأ:', error.message);
        });
}


// طباعة تفاصيل عملية البيع
window.printSale = function printSale(saleId) {
    salesRef.child(saleId).once('value', (snapshot) => {
        const sale = snapshot.val();

        if (!sale || !sale.items) {
            alert('لا توجد بيانات للبيع أو العناصر غير موجودة.');
            return;
        }

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write('<html><head><title>طباعة عملية بيع</title></head><body>');
        printWindow.document.write(`<h2>فاتورة بيع - ${saleId}</h2>`);
        printWindow.document.write(`<p><strong>التاريخ:</strong> ${new Date(sale.timestamp).toLocaleString()}</p>`);
        printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse; text-align: center;">');
        printWindow.document.write('<thead><tr><th>الصنف</th><th>السعر</th><th>الكمية</th><th>الإجمالي</th></tr></thead>');
        printWindow.document.write('<tbody>');

        let totalAmount = 0;

        // المرور على جميع العناصر
        sale.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            printWindow.document.write(`<tr>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>${itemTotal}</td>
            </tr>`);
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write(`<h3>إجمالي المبلغ: ${totalAmount}</h3>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });
}

// دالة البحث عن المبيعات
window.searchSales = function searchSales() {
    const query = document.getElementById('saleSearchInput').value.trim().toLowerCase();
    salesRef.once('value', (snapshot) => {
        const dataDisplay = document.getElementById('dataDisplay');
        dataDisplay.innerHTML = ''; // مسح المحتوى السابق
        let found = false;

        snapshot.forEach(childSnapshot => {
            const sale = childSnapshot.val();
            const saleId = childSnapshot.key;

            if (saleId.includes(query)) {
                found = true;
                dataDisplay.innerHTML += `
                    <div class="item">
                        <h3>عملية بيع ${saleId}</h3>
                        <p>التاريخ: ${new Date(sale.timestamp).toLocaleString()}</p>
                        <div class="btns-sales"> 
                            <button onclick="printSale('${saleId}')">طباعة</button>
                            <button onclick="editSale('${saleId}')">تعديل</button>
                        </div>
                    </div>
                `;
            }
        });      
        if (!found) {
            dataDisplay.innerHTML = '<p>لم يتم العثور على نتائج.</p>';
        }
    });


}

// عرض المبيعات عند التحميل
showSales();