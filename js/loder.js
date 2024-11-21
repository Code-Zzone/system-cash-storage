// دالة لعرض اللودر
function showLoader() {
    document.getElementById('loader').style.display = 'block';
}

// دالة لإخفاء اللودر
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}

// مثال لاستخدام اللودر أثناء تنفيذ عملية قاعدة البيانات
function someDatabaseOperation() {
    showLoader(); // عرض اللودر
    // عملية قاعدة بيانات هنا
    // مثال: قراءة بيانات من Firebase
    productsRef.once('value').then((snapshot) => {
        // معالجة البيانات
        hideLoader(); // إخفاء اللودر بعد انتهاء العملية
    }).catch((error) => {
        console.error("Error fetching data: ", error);
        hideLoader(); // إخفاء اللودر في حال حدوث خطأ
    });
}
