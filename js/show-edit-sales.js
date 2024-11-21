const modifiedSalesRef = database.ref('modifiedSales');
        const deletedSalesRef = database.ref('deletedSales');

        // الحصول على عنصر اللودر
        const loader = document.getElementById('loader');

        window.showLoader = function showLoader() {
            loader.style.display = 'block';
        }

        window.hideLoader = function hideLoader() {
            loader.style.display = 'none';
        }

        // دالة لحساب المجموع
        window.calculateTotal = function calculateTotal(items) {
            return items.reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        // دالة لعرض العمليات المعدلة
        window.displayModifiedSales = function displayModifiedSales(snapshot) {
            const container = document.getElementById('modifiedSalesContainer');
            container.innerHTML = ''; // مسح المحتوى السابق

            snapshot.forEach(childSnapshot => {
                const saleId = childSnapshot.key;
                const saleData = childSnapshot.val();

                const originalData = saleData.originalData;
                const updatedData = saleData.updatedData;

                const saleElement = document.createElement('div');
                saleElement.classList.add('sale-item');

                // حساب الإجمالي
                const originalTotal = calculateTotal(originalData.items);
                const updatedTotal = updatedData ? calculateTotal(updatedData.items) : 0;

                saleElement.innerHTML = `
                    <h2>عملية بيع ${saleId}</h2>
                    <h3>البيانات الأصلية:</h3>
                    <p>التاريخ: ${new Date(originalData.timestamp).toLocaleString()}</p>
                    <ul>
                        ${originalData.items.map(item => `
                            <li>
                                <strong>${item.name}</strong> - السعر: ${item.price} - الكمية: ${item.quantity}
                            </li>
                        `).join('')}
                    </ul>
                    <p><strong>الإجمالي قبل التعديل: ${originalTotal} ريال</strong></p>
                    
                    <h3>بعد التعديل:</h3>
                    ${updatedData ? `
                        <p>التاريخ: ${new Date(updatedData.timestamp).toLocaleString()}</p>
                        <ul>
                            ${updatedData.items.map(item => `
                                <li>
                                    <strong>${item.name}</strong> - السعر: ${item.price} - الكمية: ${item.quantity}
                                </li>
                            `).join('')}
                        </ul>
                        <p><strong>الإجمالي بعد التعديل: ${updatedTotal} ريال</strong></p>
                    ` : `<p>لا توجد بيانات بعد التعديل.</p>`}
                    <hr />
                `;
                container.appendChild(saleElement);
            });
        }

        // دالة لعرض العمليات المحذوفة
        window.displayDeletedSales = function displayDeletedSales(snapshot) {
            const container = document.getElementById('deletedSalesList');
            container.innerHTML = ''; // مسح المحتوى السابق

            snapshot.forEach(childSnapshot => {
                const saleId = childSnapshot.key;
                const saleData = childSnapshot.val();

                const saleElement = document.createElement('div');
                saleElement.classList.add('sale-item');

                // حساب الإجمالي
                const totalAmount = calculateTotal(saleData.items);

                saleElement.innerHTML = `
                    <h3>عملية محذوفة ${saleId}</h3>
                    <p>وقت الإتمام: ${new Date(saleData.completedAt).toLocaleString()}</p>
                    <p>وقت الحذف: ${new Date(saleData.deletedAt).toLocaleString()}</p>
                    <ul>
                        ${saleData.items.map(item => `
                            <li>
                                <strong>${item.name}</strong> - السعر: ${item.price} - الكمية: ${item.quantity}
                            </li>
                        `).join('')}
                    </ul>
                    <p><strong>الإجمالي: ${totalAmount} ريال</strong></p>
                    <hr />
                `;
                container.appendChild(saleElement);
            });
        }

        // استدعاء الدالة لعرض العمليات المعدلة عند تحميل الصفحة
        modifiedSalesRef.on('value', (snapshot) => {
            displayModifiedSales(snapshot);
        });

        // حدث زر عرض العمليات المحذوفة
        document.getElementById('showDeletedSalesBtn').addEventListener('click', () => {
            showLoader(); // إظهار اللودر
            const deletedSalesContainer = document.getElementById('deletedSalesContainer');
            const modifiedSalesContainer = document.getElementById('modifiedSalesContainer');

            if (deletedSalesContainer.style.display === 'none') {
                deletedSalesRef.on('value', (snapshot) => {
                    displayDeletedSales(snapshot);
                    hideLoader(); // إخفاء اللودر بعد عرض البيانات
                });
                deletedSalesContainer.style.display = 'block';
                modifiedSalesContainer.style.display = 'none'; // إخفاء العمليات المعدلة
            } else {
                deletedSalesContainer.style.display = 'none';
                modifiedSalesContainer.style.display = 'block'; // إظهار العمليات المعدلة
                hideLoader(); // إخفاء اللودر عند الانتقال بين القوائم
            }
        });

        // دالة البحث عن العمليات
        function searchSales(input, snapshot, type) {
            const query = input.toLowerCase();
            const results = [];

            snapshot.forEach(childSnapshot => {
                const saleId = childSnapshot.key;
                const saleData = childSnapshot.val();
                const items = type === 'modified' ? saleData.originalData.items : saleData.items;

                const itemNames = items.map(item => item.name.toLowerCase());
                if (saleId.toLowerCase().includes(query) || itemNames.some(name => name.includes(query))) {
                    results.push(childSnapshot);
                }
            });

            return results;
        }

        // حدث زر البحث
        document.getElementById('searchBtn').addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput3').value;
            const currentSalesContainer = document.getElementById('deletedSalesContainer').style.display === 'block' ? deletedSalesRef : modifiedSalesRef;

            showLoader(); // إظهار اللودر
            currentSalesContainer.once('value', (snapshot) => {
                const results = searchSales(searchInput, snapshot, currentSalesContainer === deletedSalesRef ? 'deleted' : 'modified');
                if (currentSalesContainer === deletedSalesRef) {
                    displayDeletedSales(results);
                } else {
                    displayModifiedSales(results);
                }
                hideLoader(); // إخفاء اللودر بعد البحث
            });
        });

        // حدث زر حذف العمليات المعدلة
        document.getElementById('deleteModifiedSalesBtn').addEventListener('click', () => {
            if (confirm('هل أنت متأكد أنك تريد حذف جميع العمليات المعدلة؟')) {
                showLoader(); // إظهار اللودر
                modifiedSalesRef.remove().then(() => {
                    alert('تم حذف جميع العمليات المعدلة بنجاح.');
                    hideLoader(); // إخفاء اللودر
                }).catch(error => {
                    alert('حدث خطأ أثناء حذف العمليات المعدلة: ' + error.message);
                    hideLoader(); // إخفاء اللودر
                });
            }
        });

        // حدث زر حذف العمليات المحذوفة
        document.getElementById('deleteDeletedSalesBtn').addEventListener('click', () => {
            if (confirm('هل أنت متأكد أنك تريد حذف جميع العمليات المحذوفة؟')) {
                showLoader(); // إظهار اللودر
                deletedSalesRef.remove().then(() => {
                    alert('تم حذف جميع العمليات المحذوفة بنجاح.');
                    hideLoader(); // إخفاء اللودر
                }).catch(error => {
                    alert('حدث خطأ أثناء حذف العمليات المحذوفة: ' + error.message);
                    hideLoader(); // إخفاء اللودر
                });
            }
        });