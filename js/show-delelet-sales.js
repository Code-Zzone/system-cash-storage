let contentDeleteShowSales = `

<h1>قائمة العمليات المحذوفة</h1>

<div class="container text-center">
    <div class="input-group mb-3">
        <input type="text" id="searchInputSales" class="form-control" placeholder="أدخل رقم العملية للبحث">
        <button class="btn btn-primary" onclick="searchSale()">بحث</button>
    </div>
</div>

<div class="table-container">
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>رقم العملية</th>
                    <th>العناصر</th>
                    <th>الإجمالي</th>
                    <th>وقت إتمام العملية</th>
                    <th>وقت حذف العملية</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody id="deletedSalesTable">
                <!-- سيتم ملء هذا الجدول ديناميكيًا -->
            </tbody>
        </table>
    </div>
</div>

`;

document.getElementById('ShowDeleteSales').innerHTML = contentDeleteShowSales;

// تهيئة Firebase
const deletedSalesRef = database.ref('deletedSales');

// تحميل بيانات العمليات المحذوفة والتحديث اللحظي
window.loadDeletedSales = function() {
    const salesTableBody = document.getElementById('deletedSalesTable');
    salesTableBody.innerHTML = ''; // تفريغ الجدول

    deletedSalesRef.on('child_added', (snapshot) => {
        window.addSaleRow(snapshot);
    });

    deletedSalesRef.on('child_changed', (snapshot) => {
        const existingRow = document.getElementById(`sale-${snapshot.key}`);
        if (existingRow) {
            existingRow.remove();
        }
        window.addSaleRow(snapshot);
    });

    deletedSalesRef.on('child_removed', (snapshot) => {
        const rowToRemove = document.getElementById(`sale-${snapshot.key}`);
        if (rowToRemove) {
            rowToRemove.remove();
        }
    });
}

// دالة لإضافة صف إلى الجدول
window.addSaleRow = function(saleSnapshot) {
    const saleId = saleSnapshot.key;
    const saleData = saleSnapshot.val();
    const salesTableBody = document.getElementById('deletedSalesTable');
    
    // حساب العناصر وعرضها
    const items = saleData.items.map(item => `${item.name} (كمية: ${item.quantity})`).join(', ');

    // حساب الإجمالي
    let totalAmount = 0;
    saleData.items.forEach(item => {
        totalAmount += item.price * item.quantity;
    });

    // وقت إتمام العملية ووقت الحذف
    const completionTime = saleData.timestamp ? new Date(saleData.timestamp).toLocaleString() : 'غير متوفر';
    const deletionTime = saleData.deletionTime ? new Date(saleData.deletionTime).toLocaleString() : 'غير متوفر';

    // إنشاء صف جديد للجدول
    const row = document.createElement('tr');
    row.setAttribute('id', `sale-${saleId}`);
    row.innerHTML = `
        <td>${saleId}</td>
        <td>${items}</td>
        <td>${totalAmount} جنيه</td>
        <td>${completionTime}</td>
        <td>${deletionTime}</td>
        <td>
            <button class="btn btn-sm btn-delete" onclick="deletePermanently('${saleId}')">حذف نهائي</button>
            <button class="btn btn-sm btn-print" onclick="printSale('${saleId}')">طباعة</button>
        </td>
    `;
    salesTableBody.appendChild(row);
}

// دالة الحذف النهائي (في النطاق العام)
window.deletePermanently = function(saleId) {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذه العملية نهائيًا؟")) {
        deletedSalesRef.child(saleId).remove((error) => {
            if (error) {
                alert("حدث خطأ أثناء حذف العملية نهائيًا.");
            } else {
                alert("تم حذف العملية نهائيًا.");
            }
        });
    }
}

// دالة الطباعة (في النطاق العام)
window.printSale = function(saleId) {
    deletedSalesRef.child(saleId).once('value', (snapshot) => {
        const saleData = snapshot.val();
        const items = saleData.items.map(item => `${item.name} (كمية: ${item.quantity})`).join('<br>');
        let totalAmount = 0;
        saleData.items.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        const completionTime = saleData.timestamp ? new Date(saleData.timestamp).toLocaleString() : 'غير متوفر';
        const deletionTime = saleData.deletionTime ? new Date(saleData.deletionTime).toLocaleString() : 'غير متوفر';

        const printContent = `
            <h1>تفاصيل العملية المحذوفة</h1>
            <p><strong>رقم العملية:</strong> ${saleId}</p>
            <p><strong>العناصر:</strong> ${items}</p>
            <p><strong>الإجمالي:</strong> ${totalAmount} جنيه</p>
            <p><strong>وقت إتمام العملية:</strong> ${completionTime}</p>
            <p><strong>وقت حذف العملية:</strong> ${deletionTime}</p>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    });
}

// دالة البحث عن عملية
window.searchSale = function() {
    const searchInput = document.getElementById('searchInputSales').value.trim();
    const salesTableBody = document.getElementById('deletedSalesTable');

    // تفريغ الجدول
    salesTableBody.innerHTML = '';

    if (searchInput) {
        deletedSalesRef.child(searchInput).once('value', (snapshot) => {
            if (snapshot.exists()) {
                window.addSaleRow(snapshot);
            } else {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="6" class="text-center">لم يتم العثور على عملية بهذا الرقم.</td>`;
                salesTableBody.appendChild(row);
            }
        });
    } else {
        // إعادة تحميل كل العمليات المحذوفة إذا لم يكن هناك إدخال
        loadDeletedSales();
    }
}

// تحميل البيانات عند فتح الصفحة
window.onload = loadDeletedSales;