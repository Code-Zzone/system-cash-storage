let deleteAllDataHTML = `
    <div class="btns">
        <button onclick="deleteAllData()">مسح كل البيانات</button>
    </div>
`;

document.getElementById('deleteData').innerHTML = deleteAllDataHTML;

// دالة حذف جميع العمليات 
window.deleteAllData = function deleteAllData() {
    const password = prompt('أدخل كلمة المرور لمسح جميع البيانات:');
    if (password === '000') {
        if (confirm('هل أنت متأكد أنك تريد مسح كل البيانات؟')) {
            Promise.all([
                productsRef.remove(),
                salesRef.remove()
            ]).then(() => {
                alert('تم مسح جميع البيانات بنجاح.');
            }).catch(error => {
                alert('حدث خطأ: ' + error.message);
            });
        }
    } else {
        alert('كلمة المرور غير صحيحة.');
    }
}

// هنا مثال على كيفية البحث عن عنصر باستخدام `querySelector` بشكل صحيح
function findProductById(productId) {
    const products = document.querySelectorAll('.product-item h3'); // ابحث عن كل عناصر h3 داخل المنتج
    products.forEach((product) => {
        if (product.textContent.includes(`ID: ${productId}`)) {
            // هنا يمكنك تنفيذ الكود المطلوب عند العثور على العنصر
            console.log('تم العثور على المنتج:', product.textContent);
        }
    });
}
