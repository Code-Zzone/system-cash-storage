

let contentReport = `
 <h1>تقارير المنتجات والمبيعات</h1>
                    <h2>تقرير المنتجات</h2>
                    <button onclick="generateProductReport()">إنشاء تقرير المنتجات</button>
                    <h2>تقرير المبيعات</h2>
                    <button onclick="generateSalesReport()">إنشاء تقرير المبيعات</button>
                    <div id="reportContainer">
                        <h2>التقرير</h2>
                        <div id="reportContent"></div>
                        <button onclick="downloadPDF()">تحميل PDF</button>
                        <button onclick="printReport()">طباعة التقرير</button>
                    </div>
`;
document.getElementById('fullReport').innerHTML = contentReport;


// دالة لإنشاء تقرير المنتجات
window.generateProductReport = function generateProductReport() {
    productsRef.once('value').then((snapshot) => {
        let reportContent = `
            <h2 style="text-align:center; margin-bottom: 20px;">تقرير المنتجات</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">ID</th>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">الاسم</th>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">السعر</th>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">الكمية الحالية</th>
                    </tr>
                </thead>
                <tbody>`;

        let totalItems = 0; // إجمالي عدد الأصناف
        let totalQuantity = 0; // إجمالي الكمية

        // تمرير على كل منتج وإضافة البيانات إلى التقرير
        snapshot.forEach(childSnapshot => {
            const product = childSnapshot.val();
            const productId = childSnapshot.key;

            // التأكد من أن الكمية رقمية وإذا لم تكن، تحويلها إلى صفر
            const quantity = parseInt(product.quantity, 10) || 0;

            // زيادة عدد الأصناف وزيادة إجمالي الكمية
            totalItems++;
            totalQuantity += quantity; // جمع الكميات

            reportContent += `
                <tr>
                    <td style="border: 1px solid black; padding: 8px;">${productId}</td>
                    <td style="border: 1px solid black; padding: 8px;">${product.name}</td>
                    <td style="border: 1px solid black; padding: 8px;">${product.price}</td>
                    <td style="border: 1px solid black; padding: 8px;">${quantity}</td>
                </tr>`;
        });

        // إضافة إجمالي الأصناف وإجمالي الكمية في نهاية التقرير
        reportContent += `
            <tr>
                <td colspan="3" style="text-align: right; border: 1px solid black; padding: 8px;"><strong>إجمالي الأصناف:</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${totalItems}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right; border: 1px solid black; padding: 8px;"><strong>إجمالي الكمية:</strong></td>
                <td style="border: 1px solid black; padding: 8px;">${totalQuantity}</td>
            </tr>
        `;

        reportContent += '</tbody></table>';
        document.getElementById('reportContent').innerHTML = reportContent;
        document.getElementById('reportContainer').style.display = 'block';
    }).catch((error) => {
        console.error("Error fetching product data: ", error);
    });
}

// دالة لطباعة التقرير
window.printReport = function printReport() {
    const reportContent = document.getElementById('reportContent').innerHTML;
    const newWin = window.open('');
    newWin.document.write(`
        <html>
            <head>
                <title>طباعة التقرير</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>${reportContent}</body>
        </html>`);
    newWin.document.close();
    newWin.print();
}

// دالة لتحميل التقرير كملف PDF
window.downloadPDF = function downloadPDF() {
    const reportContent = document.getElementById('reportContent');
    html2canvas(reportContent).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save("report.pdf");
    }).catch(error => {
        console.error("Error generating PDF: ", error);
    });
}

// دالة لإنشاء تقرير المبيعات
window.generateSalesReport = function generateSalesReport() {
    salesRef.once('value').then((snapshot) => {
        let reportContent = `
            <h2 style="text-align:center; margin-bottom: 20px;">تقرير المبيعات</h2>`;
        let grandTotalSalesAmount = 0; // لتخزين إجمالي المبيعات لكل العمليات
        let grandTotalItems = 0; // لتخزين إجمالي عدد الأصناف لكل العمليات
        let totalSalesCount = 0; // لتخزين إجمالي عدد عمليات البيع

        snapshot.forEach(childSnapshot => {
            const sale = childSnapshot.val();
            const saleId = childSnapshot.key;
            let totalSalesAmount = 0; // لتخزين إجمالي المبيعات لهذه العملية فقط
            let totalItems = 0; // لتخزين إجمالي عدد الأصناف لهذه العملية
            
            reportContent += `
                <h3>عملية رقم: ${saleId}</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">اسم المنتج</th>
                            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">السعر</th>
                            <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">الكمية</th>
                        </tr>
                    </thead>
                    <tbody>`;

            // إضافة تفاصيل كل عملية
            sale.items.forEach(item => {
                reportContent += `
                    <tr>
                        <td style="border: 1px solid black; padding: 8px;">${item.name}</td>
                        <td style="border: 1px solid black; padding: 8px;">${item.price}</td>
                        <td style="border: 1px solid black; padding: 8px;">${item.quantity}</td>
                    </tr>`;
                totalSalesAmount += item.price * item.quantity; // حساب المبلغ الإجمالي لهذه العملية
                totalItems += item.quantity; // حساب إجمالي عدد الأصناف لهذه العملية
            });

            reportContent += `
                    </tbody>
                </table>
                <p class="total-sales" style="margin-top: 10px;">إجمالي المبيعات لهذه العملية: ${totalSalesAmount} ج.م</p>
                <p class="total-items">إجمالي عدد الأصناف: ${totalItems}</p>`;
            
            // زر لطباعة العملية
            reportContent += `
                <button onclick="printSaleReport('${saleId}')">طباعة عملية رقم ${saleId}</button>
                <hr>`;
            
            // زيادة المجموع الإجمالي
            grandTotalSalesAmount += totalSalesAmount;
            grandTotalItems += totalItems;
            totalSalesCount++;
        });

        // إضافة الإجمالي الكلي
        reportContent += `
            <h2>الإجمالي الكلي</h2>
            <p>إجمالي عدد عمليات البيع: ${totalSalesCount}</p>
            <p>إجمالي المبيعات: ${grandTotalSalesAmount} ج.م</p>
            <p>إجمالي عدد الأصناف المباعة: ${grandTotalItems}</p>`;

        document.getElementById('reportContent').innerHTML = reportContent;
        document.getElementById('reportContainer').style.display = 'block';
    }).catch((error) => {
        console.error("Error fetching sales data: ", error);
    });
}

// دالة لطباعة تقرير عملية واحدة
window.printSaleReport = function printSaleReport(saleId) {
    // الحصول على تفاصيل العملية المعنية
    salesRef.child(saleId).once('value').then((snapshot) => {
        const sale = snapshot.val();
        let reportContent = `
            <h2 style="text-align:center; margin-bottom: 20px;">عملية رقم: ${saleId}</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">اسم المنتج</th>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">السعر</th>
                        <th style="border: 1px solid black; padding: 8px; background-color: #f2f2f2;">الكمية</th>
                    </tr>
                </thead>
                <tbody>`;

        let totalSalesAmount = 0; // لتخزين إجمالي المبيعات لهذه العملية فقط
        let totalItems = 0; // لتخزين إجمالي عدد الأصناف لهذه العملية
        
        // إضافة تفاصيل كل عملية
        sale.items.forEach(item => {
            reportContent += `
                <tr>
                    <td style="border: 1px solid black; padding: 8px;">${item.name}</td>
                    <td style="border: 1px solid black; padding: 8px;">${item.price}</td>
                    <td style="border: 1px solid black; padding: 8px;">${item.quantity}</td>
                </tr>`;
            totalSalesAmount += item.price * item.quantity; // حساب المبلغ الإجمالي لهذه العملية
            totalItems += item.quantity; // حساب إجمالي عدد الأصناف لهذه العملية
        });

        reportContent += `
                </tbody>
            </table>
            <p style="margin-top: 10px;">إجمالي المبيعات لهذه العملية: ${totalSalesAmount} ج.م</p>
            <p>إجمالي عدد الأصناف: ${totalItems}</p>`;

        // فتح نافذة جديدة للطباعة
        const newWin = window.open('');
        newWin.document.write(`
            <html>
                <head>
                    <title>طباعة تقرير عملية رقم ${saleId}</title>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        h2 {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                    </style>
                </head>
                <body>${reportContent}</body>
            </html>`);
        newWin.document.close();
        newWin.print();
    }).catch(error => {
        console.error("Error fetching sale data: ", error);
    });
}

// إضافة جميع الدوال إلى النطاق العام
window.generateProductReport = generateProductReport;
window.printReport = printReport;
window.downloadPDF = downloadPDF;
window.generateSalesReport = generateSalesReport;
window.printSaleReport = printSaleReport;