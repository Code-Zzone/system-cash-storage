function displaySales(snapshot) {
    const salesDisplay = document.getElementById('salesDisplay');
    salesDisplay.innerHTML = '';

    snapshot.forEach(childSnapshot => {
        const sale = childSnapshot.val();
        const saleId = childSnapshot.key;

        // تأكد من وجود products قبل محاولة استخدام map
        const productsList = sale.products && Array.isArray(sale.products)
            ? sale.products.map(product => `<li>${product.name} - ${product.quantity} × ${product.price} = ${product.quantity * product.price}</li>`).join('')
            : '<li>لا توجد منتجات لهذه العملية</li>';

        salesDisplay.innerHTML += `
            <div class="sale-item">
                <h3>عملية بيع رقم: ${saleId}</h3>
                <p><strong>التاريخ:</strong> ${new Date(sale.timestamp).toLocaleString()}</p>
                <p><strong>المبلغ الإجمالي:</strong> ${sale.totalAmount || 'غير متوفر'}</p>
                <p><strong>المنتجات:</strong></p>
                <ul>
                    ${productsList}
                </ul>
                <button onclick="editSale('${saleId}')">تعديل</button>
                <button onclick="deleteSale('${saleId}')">حذف</button>
                <button onclick="printInvoice('${saleId}')">طباعة الفاتورة</button>
            </div>
        `;
    });
}