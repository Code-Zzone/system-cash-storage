let contentSales = `
   <h1> بيع المنتجات</h1>
                    <label>البحث عن المنتج بالـ ID:</label>
                    <input type="text" id="searchInput" oninput="searchProduct()" autofocus><br><br>
                    <div id="searchResults"></div>
                    <h2>فاتورة البيع</h2>
                    <div id="invoice"></div>
                    <p id="totalCount">إجمالي عدد الأصناف: 0</p>
                    <p id="totalPrice">إجمالي السعر: 0</p>
                    <button onclick="completeSale()">إتمام عملية البيع</button>
                    <button onclick="printInvoice()" id="printBill">طباعة الفاتوره</button>
                    <input type="text" id="searchSaleId" placeholder="البحث عن العملية برقم العملية"
                        oninput="searchSaleById()">
                    <div id="salesList"></div>
`;
document.getElementById('sales').innerHTML = contentSales;

const database = firebase.database();
const productsRef = database.ref('products');
const salesRef = database.ref('sales');

let invoiceItems = [];  // لتخزين المنتجات في الفاتورة

// دالة البحث عن المنتج بالـ ID أو الاسم
window.searchProduct = function searchProduct() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchInput === "") {
        document.getElementById('searchResults').innerHTML = "";
        return;
    }

    const isNumeric = /^\d+$/.test(searchInput); // التحقق إذا كان المدخل رقمًا (ID)

    if (isNumeric) {
        // البحث باستخدام الـ ID
        productsRef.child(searchInput).once('value', (snapshot) => {
            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = "";

            if (snapshot.exists()) {
                const product = snapshot.val();
                displayProduct(product, searchInput);
            } else {
                resultsDiv.innerHTML = "<p>لا يوجد منتج بهذا الـ ID.</p>";
            }
        });
    } else {
        // البحث باستخدام الاسم
        productsRef.once('value', (snapshot) => {
            const resultsDiv = document.getElementById('searchResults');
            resultsDiv.innerHTML = "";
            let found = false;

            snapshot.forEach((childSnapshot) => {
                const product = childSnapshot.val();
                const productId = childSnapshot.key;

                // البحث إذا كان الاسم يطابق المدخل
                if (product.name.toLowerCase().includes(searchInput)) {
                    displayProduct(product, productId);
                    found = true;
                }
            });

            if (!found) {
                resultsDiv.innerHTML = "<p>لا يوجد منتج بهذا الاسم.</p>";
            }
        });
    }
}

// دالة لعرض المنتج
window.displayProduct = function displayProduct(product, productId) {
    const resultsDiv = document.getElementById('searchResults');
    const productItem = document.createElement('div');
    productItem.className = 'product-item';

    // التحقق من الكمية المتاحة
    const availableQuantityText = product.quantity > 0 ? `<span id="availableQuantity">${product.quantity}</span>` : '<span id="availableQuantity">لا يوجد ولا قطعة</span>';

    productItem.innerHTML = `
        <h3>${product.name}</h3>
        <p>السعر: ${product.price}</p>
        <p>الكمية المتاحة: ${availableQuantityText}</p>
        <label for="requestedQuantity">الكمية المطلوبة:</label>
        <input type="number" id="requestedQuantity" min="1" max="${product.quantity}" oninput="updateAvailableQuantity('${productId}', this.value, ${product.quantity})">
        <button onclick="addToInvoice('${productId}', '${product.name}', ${product.price}, ${product.quantity})" ${product.quantity <= 0 ? 'disabled' : ''}>اختيار</button>
    `;
    resultsDiv.appendChild(productItem);
}

// دالة لتحديث الكمية المتاحة لحظيًا
window.updateAvailableQuantity = function updateAvailableQuantity(productId, requestedQuantity, availableQuantity) {
    const availableQuantitySpan = document.getElementById('availableQuantity');
    const requested = parseInt(requestedQuantity);

    if (requested > 0 && requested <= availableQuantity) {
        availableQuantitySpan.innerText = availableQuantity - requested;
    } else {
        availableQuantitySpan.innerText = availableQuantity > 0 ? availableQuantity : 'لا يوجد ولا قطعة';
    }
}

// // دالة لإضافة المنتج إلى الفاتورة
// window.addToInvoice = function addToInvoice(id, name, price, availableQuantity) {
//     const quantityInput = document.getElementById('requestedQuantity');
//     const quantity = parseInt(quantityInput.value);

//     // التحقق من صحة الكمية المطلوبة
//     if (quantity && quantity > 0 && quantity <= availableQuantity) {
//         const item = { id, name, price, quantity };
//         invoiceItems.push(item);
//         updateInvoice();

//         // مسح الـ ID من حقل البحث
//         document.getElementById('searchId').value = "";
//         document.getElementById('searchResults').innerHTML = ""; // مسح النتائج
//     } else {
//         alert("كمية غير صحيحة.");
//     }
// }
// ظظ
// دالة لإضافة المنتج إلى الفاتورة
window.addToInvoice = function addToInvoice(id, name, price, availableQuantity) {
    const quantityInput = document.getElementById('requestedQuantity'); // التأكد من استخدام الـ ID الصحيح
    const quantity = parseInt(quantityInput.value);

    // التحقق من صحة الكمية المطلوبة
    if (quantity && quantity > 0 && quantity <= availableQuantity) {
        const item = { id, name, price, quantity };
        invoiceItems.push(item);
        updateInvoice();

        // مسح قيمة حقل الكمية
        quantityInput.value = ""; // تعديل هذا السطر ليكون صحيحاً
        document.getElementById('searchResults').innerHTML = ""; // مسح النتائج
    } else {
        alert("كمية غير صحيحة.");
    }
}

// دالة تحديث الفاتورة لإضافة زر الطباعة
window.updateInvoice = function updateInvoice() {
    const invoiceDiv = document.getElementById('invoice');
    invoiceDiv.innerHTML = "";

    let totalPrice = 0;
    let totalCount = 0;

    invoiceItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <p>${index + 1}. ${item.name} - سعر الوحدة: ${item.price} - الكمية: ${item.quantity} 
            <button onclick="removeFromInvoice(${index})">حذف</button></p>
        `;
        invoiceDiv.appendChild(itemDiv);
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;
    });

    document.getElementById('totalCount').innerText = `إجمالي عدد الأصناف: ${totalCount}`;
    document.getElementById('totalPrice').innerText = `إجمالي السعر: ${totalPrice}`;

    // إضافة زر الطباعة
    const printButton = document.createElement('button');
    printButton.innerText = "طباعة الفاتورة";
    printButton.onclick = printInvoice; // ربط الزر بدالة الطباعة
    invoiceDiv.appendChild(printButton);
}

// دالة لإتمام عملية البيع
window.completeSale = function completeSale() {
    if (invoiceItems.length === 0) {
        alert("لا يوجد منتجات في الفاتورة.");
        return;
    }

    const saleId = 10 + Math.floor(Math.random() * 1000); // توليد ID عشوائي يبدأ من 10
    const saleData = {
        saleId,
        items: invoiceItems,
        timestamp: new Date().toISOString() // الوقت والتاريخ
    };

    salesRef.child(saleId).set(saleData, (error) => {
        if (error) {
            alert("حدث خطأ أثناء إتمام عملية البيع.");
        } else {
            // تحديث الكميات في المخزن
            invoiceItems.forEach(item => {
                const productRef = productsRef.child(item.id);
                productRef.once('value').then(snapshot => {
                    const currentQuantity = snapshot.val().quantity;
                    const newQuantity = currentQuantity - item.quantity;

                    // تحديث الكمية في المخزن مع منع السالب
                    productRef.update({ quantity: newQuantity >= 0 ? newQuantity : 0 });
                });
            });

            alert("تم إتمام عملية البيع بنجاح.");
            printInvoice(saleId); // استدعاء دالة الطباعة بعد إتمام العملية
            invoiceItems = []; // إعادة ضبط الفاتورة
            updateInvoice();
            loadSales(); // تحميل العمليات السابقة بعد البيع
            location.reload(); // بعد اتمام العمليه بنجاح يتم تحديث الصفحه كاملا
        }
    });
}

// دالة لطباعة الفاتورة

// نسخ الكود
window.printInvoice = function printInvoice(saleId = null) {
    if (invoiceItems.length === 0) {
        alert("لا يوجد منتجات في الفاتورة.");
        return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write('<html><head><title>فاتورة البيع</title></head><body>');
    printWindow.document.write('<h1>فاتورة البيع</h1>');

    // إضافة رقم العملية إذا كان متاحًا
    if (saleId) {
        printWindow.document.write(`<h3>رقم العملية: ${saleId}</h3>`);
    }

    printWindow.document.write(`<h4>تاريخ العملية: ${new Date().toLocaleString()}</h4>`);
    printWindow.document.write('<table border="1"><tr><th>الاسم</th><th>السعر</th><th>الكمية</th></tr>');

    let totalPrice = 0;

    invoiceItems.forEach(item => {
        printWindow.document.write(`<tr><td>${item.name}</td><td>${item.price}</td><td>${item.quantity}</td></tr>`);
        totalPrice += item.price * item.quantity;
    });

    printWindow.document.write('</table>');
    printWindow.document.write(`<h4>الإجمالي: ${totalPrice}</h4>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// تحميل العمليات عند تحميل الصفحة
window.onload = function() {
    loadSales();
};

// دالة لتحميل عمليات البيع السابقة
window.loadSales = function loadSales() {
    const salesListDiv = document.getElementById('salesList');
    const loader = document.getElementById('loader');

    salesListDiv.innerHTML = ""; // مسح القائمة السابقة
    loader.style.display = "block"; // إظهار اللودر

    salesRef.once('value', (snapshot) => {
        snapshot.forEach(childSnapshot => {
            const sale = childSnapshot.val();
            const saleId = sale.saleId;

            const saleItem = document.createElement('div');
            saleItem.innerHTML = `<h4>عملية بيع رقم: ${saleId}</h4>
                                  <p>تاريخ العملية: ${sale.timestamp}</p>`;
            sale.items.forEach(item => {
                saleItem.innerHTML += `<p>اسم المنتج: ${item.name} - سعر الوحدة: ${item.price} - الكمية: ${item.quantity}</p>`;
            });

            // إضافة زر لحذف عملية البيع وإعادة الكميات
            const deleteButton = document.createElement('button');
            deleteButton.innerText = "حذف العملية";
            deleteButton.onclick = function() {
                deleteSale(saleId, sale.items);
            };
            saleItem.appendChild(deleteButton);

            salesListDiv.appendChild(saleItem);
        });
        loader.style.display = "none"; // إخفاء اللودر بعد التحميل
    });
}

// دالة حذف عملية البيع وإعادة الكميات للمخزن
window.deleteSale = function deleteSale(saleId, items) {
    // استرجاع بيانات عملية البيع لحفظها قبل الحذف
    salesRef.child(saleId).once('value', (snapshot) => {
        const saleData = snapshot.val();
        
        // إنشاء كائن لتخزين تفاصيل العملية المحذوفة
        const deletedSaleData = {
            saleId: saleData.saleId,
            items: saleData.items,
            completedAt: saleData.timestamp, // وقت إتمام العملية
            deletedAt: new Date().toISOString() // وقت الحذف
        };

        // تخزين البيانات المحذوفة في قاعدة البيانات
        const deletedSalesRef = database.ref('deletedSales').child(saleId);
        deletedSalesRef.set(deletedSaleData, (error) => {
            if (error) {
                alert("حدث خطأ أثناء تخزين عملية البيع المحذوفة.");
            } else {
                // حذف العملية من قاعدة البيانات
                salesRef.child(saleId).remove((error) => {
                    if (error) {
                        alert("حدث خطأ أثناء حذف عملية البيع.");
                    } else {
                        // إعادة الكمية للمخزن
                        let updatePromises = []; // مصفوفة لتخزين وعود التحديث
                        items.forEach(item => {
                            const productRef = productsRef.child(item.id);
                            updatePromises.push(productRef.once('value').then(snapshot => {
                                const currentQuantity = snapshot.val().quantity;
                                const newQuantity = currentQuantity + item.quantity; // إضافة الكمية المحذوفة
                                
                                // تحديث الكمية في قاعدة البيانات
                                return productRef.update({ quantity: newQuantity });
                            }));
                        });

                        // الانتظار حتى يتم تحديث جميع الكميات
                        Promise.all(updatePromises)
                            .then(() => {
                                alert("تم حذف عملية البيع وإعادة الكمية للمخزن.");
                                loadSales(); // تحديث قائمة العمليات
                            })
                            .catch((error) => {
                                console.error("حدث خطأ أثناء تحديث الكميات:", error);
                            });
                    }
                });
            }
        });
    });
}


// دالة البحث عن عملية بيع بالـ ID
window.searchSaleById = function searchSaleById() {
    const searchSaleId = document.getElementById('searchSaleId').value.trim();
    const salesListDiv = document.getElementById('salesList');
    salesListDiv.innerHTML = ""; // مسح القائمة السابقة

    if (searchSaleId === "") {
        salesListDiv.innerHTML = "<p>يرجى إدخال ID للبحث عن عملية بيع.</p>";
        return;
    }

    salesRef.child(searchSaleId).once('value', (snapshot) => {
        if (snapshot.exists()) {
            const sale = snapshot.val();
            const saleItem = document.createElement('div');
            saleItem.innerHTML = `<h4>عملية بيع رقم: ${sale.saleId}</h4>
                                  <p>تاريخ العملية: ${sale.timestamp}</p>`;
            sale.items.forEach(item => {
                saleItem.innerHTML += `<p>اسم المنتج: ${item.name} - سعر الوحدة: ${item.price} - الكمية: ${item.quantity}</p>`;
            });

            // زر لحذف العملية وإعادة الكميات
            const deleteButton = document.createElement('button');
            deleteButton.innerText = "حذف العملية";
            deleteButton.onclick = function() {
                deleteSale(sale.saleId, sale.items);
            };
            saleItem.appendChild(deleteButton);

            salesListDiv.appendChild(saleItem);
        } else {
            salesListDiv.innerHTML = "<p>لا توجد عملية بيع بهذا الـ ID.</p>";
            console.log("لا توجد عملية بيع بهذا الـ ID:", searchSaleId); // طباعة الخطأ في الكونسول
        }
    }).catch(error => {
        console.error("حدث خطأ أثناء استرجاع عملية البيع:", error);
        salesListDiv.innerHTML = "<p>حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.</p>";
    });
}


// دالة لحذف منتج من الفاتورة
window.removeFromInvoice = function removeFromInvoice(index) {
    const item = invoiceItems[index];
    
    // إعادة الكمية إلى المخزن
    const productRef = productsRef.child(item.id);
    productRef.once('value', (snapshot) => {
        const currentQuantity = snapshot.val().quantity;
        const newQuantity = currentQuantity + item.quantity; // إضافة الكمية المحذوفة

        // تحديث الكمية في قاعدة البيانات
        productRef.update({ quantity: newQuantity })
            .then(() => {
                console.log(`تمت إضافة ${item.quantity} إلى المخزن للمنتج ${item.id}.`);
                
                // بعد إرجاع الكمية، حذف المنتج من الفاتورة
                invoiceItems.splice(index, 1);
                updateInvoice(); // تحديث الفاتورة
            })
            .catch((error) => {
                console.error("حدث خطأ أثناء تحديث الكمية:", error);
            });
    });
};
