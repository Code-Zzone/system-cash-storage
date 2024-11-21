let contentTimeReport = `
 <h1>إنشاء تقارير مفصلة</h1>
                    <!-- حقل إدخال لتاريخ البداية والنهاية -->
                    <div class="inputs-labels-time-report">
                        <label for="startDate">تاريخ البداية:</label>
                        <input type="datetime-local" id="startDate">
                        <label for="endDate">تاريخ النهاية:</label>
                        <input type="datetime-local" id="endDate">
                    </div>
                    <br><br>
                    <button onclick="generateReport()" id="create-report">إنشاء تقرير</button>
                    <!-- لودر التحميل -->
                    <p id="loader">تحميل...</p>
                    <!-- عرض التقرير في جدول -->
                    <table id="reportTable" style="display:none;">
                        <thead>
                            <tr>
                                <th>رقم العملية</th>
                                <th>اسم المنتج</th>
                                <th>السعر</th>
                                <th>الكمية</th>
                                <th>التاريخ والوقت</th>
                                <th>إجمالي المبلغ</th>
                                <th>العمليات</th> <!-- عمود للعمليات -->
                            </tr>
                        </thead>
                        <tbody id="reportBody"></tbody>
                    </table>
                    <!-- أزرار الطباعة -->
                    <button onclick="printFullReport()" style="display:none;" id="printReportButton">طباعة التقرير
                        الكامل</button>
                    <button onclick="printSingleSale(saleId)" style="display:none;" id="printSaleButton">طباعة هذه
                        العملية</button>
`;
document.getElementById('timeReport').innerHTML = contentTimeReport;

const database = firebase.database();
const salesRef = database.ref('sales'); // تأكد من استخدام المسار الصحيح لمبيعاتك

// دالة لإنشاء التقرير
window.generateReport = function generateReport() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert("يرجى إدخال تاريخ بداية ونهاية صحيحين.");
        return;
    }

    const reportBody = document.getElementById('reportBody');
    reportBody.innerHTML = ""; // مسح البيانات السابقة

    // عرض جدول التقرير
    document.getElementById('reportTable').style.display = 'table';
    document.getElementById('loader').style.display = 'block'; // عرض اللودر

    // مراقبة التحديثات بشكل مستمر
    salesRef.on('value', (snapshot) => {
        document.getElementById('loader').style.display = 'none'; // إخفاء اللودر
        let hasSales = false; // متغير للتحقق من وجود مبيعات
        const salesMap = {}; // كائن لتجميع بيانات المبيعات
        let totalAmountOverall = 0; // إجمالي المبلغ لكل المبيعات
        let totalQuantityOverall = 0; // إجمالي الكمية لكل المبيعات

        snapshot.forEach(saleSnapshot => {
            const sale = saleSnapshot.val();
            const saleTimestamp = new Date(sale.timestamp);
            if (saleTimestamp >= startDate && saleTimestamp <= endDate) {
                hasSales = true; // وجدنا مبيعات
                if (!salesMap[sale.saleId]) {
                    salesMap[sale.saleId] = {
                        items: [],
                        timestamp: saleTimestamp
                    };
                }
                sale.items.forEach(item => {
                    salesMap[sale.saleId].items.push(item);
                    totalAmountOverall += item.price * item.quantity;
                    totalQuantityOverall += item.quantity;
                });
            }
        });

        // مسح البيانات القديمة قبل إعادة الرسم
        reportBody.innerHTML = "";

        // إضافة الصفوف إلى الجدول
        for (const saleId in salesMap) {
            const { items, timestamp } = salesMap[saleId];
            let totalAmount = 0;
            items.forEach(item => {
                totalAmount += item.price * item.quantity;
            });

            // إنشاء صف لكل عملية
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${saleId}</td>
                <td>${items.map(item => item.name).join(', ')}</td>
                <td>${items.map(item => item.price).join(', ')}</td>
                <td>${items.map(item => item.quantity).join(', ')}</td>
                <td>${timestamp.toLocaleString()}</td>
                <td>${totalAmount}</td>
                <td>
                    <button onclick="printSingleSale('${saleId}')" id="printSalesProcess">طباعة</button>
                </td>
            `;
            reportBody.appendChild(row);
        }

        // إضافة صف في نهاية التقرير لإجمالي المبلغ والكمية
        const summaryRow = document.createElement('tr');
        summaryRow.innerHTML = `
        <td></td>
        <td></td>
        <td>${totalAmountOverall}</td>
        <td>${totalQuantityOverall}</td>
        <td></td>
        <td>الإجمالي</td>
        `;
        reportBody.appendChild(summaryRow);

        // إظهار زر الطباعة إذا كانت هناك مبيعات
        if (hasSales) {
            document.getElementById('printReportButton').style.display = 'block';
        } else {
            alert("لا توجد مبيعات في هذا النطاق الزمني.");
        }
    });
}

// دالة لطباعة العمليات فقط بشكل منسق وبعناوين بدون العمود الزائد
window.printFullReport = function printFullReport() {
    const reportBody = document.getElementById('reportBody');
    const printButtons = reportBody.querySelectorAll('button'); // الحصول على جميع أزرار الطباعة الموجودة في كل عملية

    // إخفاء كل أزرار الطباعة الخاصة بكل عملية قبل البدء في الطباعة
    printButtons.forEach(button => {
        button.style.display = 'none';
    });

    // إنشاء نافذة جديدة للطباعة
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write('<html><head><title>تقرير المبيعات</title>');
    
    // إضافة التنسيقات
    newWindow.document.write(`
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background-color: #f2f2f2; font-weight: bold; }
            td { vertical-align: middle; }
            .total-row { font-weight: bold; background-color: #f9f9f9; }
        </style>
    `);
    
    newWindow.document.write('</head><body>');
    newWindow.document.write('<h1>تقرير المبيعات</h1>');
    
    // إضافة عناوين الجدول بدون عمود الطباعة
    newWindow.document.write(`
        <table>
            <thead>
                <tr>
                    <th>رقم العملية</th>
                    <th>أسماء المنتجات</th>
                    <th>الأسعار</th>
                    <th>الكميات</th>
                    <th>التاريخ</th>
                    <th>المجموع</th>
                </tr>
            </thead>
            <tbody>
    `);

    // إضافة الصفوف من التقرير
    reportBody.querySelectorAll('tr').forEach(row => {
        // نسخ الصف بدون العمود الأخير (عمود زر الطباعة)
        const rowClone = row.cloneNode(true);
        rowClone.removeChild(rowClone.lastElementChild); // إزالة العمود الأخير (زر الطباعة)
        newWindow.document.write(rowClone.outerHTML);
    });

    // إغلاق الجدول
    newWindow.document.write(`
            </tbody>
        </table>
    `);
    
    newWindow.document.write('</body></html>');
    newWindow.document.close(); // إغلاق المستند
    newWindow.print(); // طباعة المحتوى

    // إعادة إظهار أزرار الطباعة بعد الانتهاء من الطباعة
    newWindow.onafterprint = function() {
        printButtons.forEach(button => {
            button.style.display = 'inline'; // إعادة إظهار الأزرار بعد الطباعة
        });
    };
};


// دالة لطباعة عملية معينة بتنسيق احترافي
window.printSingleSale = function printSingleSale(saleId) {
    const saleRow = [...document.querySelectorAll('#reportBody tr')].find(row => row.cells[0].innerText === saleId);
    if (saleRow) {
        const saleContent = saleRow.outerHTML; // الحصول على محتوى العملية
        const items = saleRow.cells[1].innerText.split(', '); // الحصول على أسماء الأصناف من الخلية الثانية
        const itemPrices = saleRow.cells[2].innerText.split(', '); // تفصيل الأسعار
        const itemQuantities = saleRow.cells[3].innerText.split(', '); // تفصيل الكميات
        
        const totalItems = items.length; // حساب إجمالي عدد الأصناف
        let totalAmountPaid = 0; // متغير لحساب إجمالي المبلغ المدفوع
        
        // حساب إجمالي المبلغ المدفوع
        let amountsPerItem = []; // مصفوفة لتخزين إجمالي المبلغ لكل صنف
        itemPrices.forEach((price, index) => {
            const amount = parseFloat(price) * parseInt(itemQuantities[index]);
            amountsPerItem.push(amount); // إضافة إجمالي المبلغ للصنف
            totalAmountPaid += amount; // جمع المبالغ المدفوعة
        });

        const newWindow = window.open('', '', 'width=800,height=600');
        newWindow.document.write('<html><head><title>طباعة عملية</title>');
        
        // إضافة تنسيق CSS
        newWindow.document.write(`
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { text-align: center; }
                h2 { margin-top: 20px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th, td { border: 1px solid #000; padding: 8px; text-align: center; }
                th { background-color: #f2f2f2; font-weight: bold; }
                td { vertical-align: middle; }
                .summary { margin-top: 20px; font-weight: bold; text-align: right; }
            </style>
        `);
        
        newWindow.document.write('</head><body>');
        newWindow.document.write('<h1>تفاصيل العملية رقم: ' + saleId + '</h1>');
        
        // عرض إجمالي عدد الأصناف
        newWindow.document.write('<h2>إجمالي عدد الأصناف: ' + totalItems + '</h2>');
        
        // إضافة عناوين الجدول
        newWindow.document.write(`
            <h2>تفاصيل الأصناف:</h2>
            <table>
                <thead>
                    <tr>
                        <th>اسم المنتج</th>
                        <th>السعر</th>
                        <th>الكمية</th>
                        <th>إجمالي المبلغ</th>
                    </tr>
                </thead>
                <tbody>
        `);

        // إضافة تفاصيل الأصناف
        items.forEach((item, index) => {
            newWindow.document.write(`
                <tr>
                    <td>${item}</td>
                    <td>${itemPrices[index]}</td>
                    <td>${itemQuantities[index]}</td>
                    <td>${amountsPerItem[index].toFixed(2)}</td> <!-- إضافة إجمالي المبلغ لكل صنف -->
                </tr>
            `);
        });

        // إغلاق الجدول
        newWindow.document.write(`
                </tbody>
            </table>
        `);

        // إضافة إجمالي المبلغ المدفوع تحت الجدول
        newWindow.document.write(`
            <div class="summary">
                <h3>إجمالي المبلغ المدفوع: ${totalAmountPaid.toFixed(2)} ريال</h3>
            </div>
        `);

        newWindow.document.write('</body></html>');
        newWindow.document.close(); // إغلاق المستند
        newWindow.print(); // طباعة المحتوى
    }
};