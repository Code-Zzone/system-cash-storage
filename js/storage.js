let contentStorage = `
    <h1>إضافة منتج جديد إلى المخزن</h1>
    <!-- الحقول المطلوبة -->
    <div class="inputs-storage">
        <label>اسم المنتج:</label>
        <input type="text" id="productName"><br><br>
        <label>سعر المنتج:</label>
        <input type="number" id="productPrice"><br><br>
        <label>كمية المنتج:</label>
        <input type="number" id="productQuantity"><br><br>
    </div>
    <!-- زر الإضافة -->
    <div class="btn-add-hidden">
        <button onclick="addProduct()">إضافة المنتج</button>
        <button id="toggleButton" onclick="toggleProducts()">عرض جميع المنتجات</button>
    </div>
    <!-- خانة البحث -->
    <input type="text" id="searchInput2" placeholder="ابحث عن المنتج بالاسم أو ID"
        oninput="filterProducts()" style="display:none;">
    <!-- لودر التحميل -->
    <p id="loader" style="display:none;z-index:100;color:#000;">تحميل...</p>
    <!-- رسالة النجاح -->
    <p id="successMessage" style="display:none;">تم إضافة المنتج إلى المخزن بنجاح</p>
    <!-- عرض جميع المنتجات -->
    <div id="productsList" style="display:none;"></div>
`;
document.getElementById('storage').innerHTML = contentStorage;

const database = firebase.database();
const productsRef = database.ref('products');

// دالة لإضافة المنتج إلى قاعدة البيانات
window.addProduct = function addProduct() {
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('loader').style.display = 'block';

    const productName = document.getElementById('productName').value;
    const productPrice = document.getElementById('productPrice').value;
    const productQuantity = document.getElementById('productQuantity').value;

    if (productName === "" || productPrice === "" || productQuantity === "") {
        alert("من فضلك أدخل جميع البيانات.");
        document.getElementById('loader').style.display = 'none';
        return;
    }

    productsRef.once('value').then((snapshot) => {
        let nextId = snapshot.numChildren(); // الحصول على عدد المنتجات الحالي

        // إذا كانت الأيدي أقل من 1، نبدأ من 000001
        if (nextId === 0) {
            nextId = 1;
        } else {
            nextId += 1; // زيادة العد
        }

        const productId = String(nextId).padStart(6, '0'); // تنسيق ID ليكون 6 أرقام

        productsRef.child(productId).set({
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            timestamp: new Date().toISOString()
        }, function(error) {
            document.getElementById('loader').style.display = 'none';

            if (error) {
                alert("حدث خطأ أثناء إضافة المنتج.");
            } else {
                document.getElementById('successMessage').style.display = 'block';
                document.getElementById('productName').value = "";
                document.getElementById('productPrice').value = "";
                document.getElementById('productQuantity').value = "";
            }
        });
    });
};

// دالة لتحميل المنتجات وعرضها مع التحديث اللحظي
window.loadProducts = function loadProducts() {
    const productsListDiv = document.getElementById('productsList');
    productsListDiv.innerHTML = "";
    document.getElementById('loader').style.display = 'block';

    productsRef.on('value', (snapshot) => {
        document.getElementById('loader').style.display = 'none';
        productsListDiv.innerHTML = ""; // مسح القائمة القديمة قبل إعادة تحميل المنتجات

        snapshot.forEach(childSnapshot => {
            const product = childSnapshot.val();
            const productId = childSnapshot.key;

            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <h3>${product.name} (ID: ${productId})</h3>
                <p>السعر: ${product.price}</p>
                <p>الكمية: ${product.quantity}</p>
                <p>تاريخ الإضافة: ${new Date(product.timestamp).toLocaleString()}</p>
                <button onclick="editProduct('${productId}')">تعديل</button>
                <button onclick="deleteProduct('${productId}')">حذف</button>
            `;
            productsListDiv.appendChild(productItem);
        });
    });
};

// دالة لتصفية المنتجات بناءً على إدخال البحث
window.filterProducts = function filterProducts() {
    const searchValue = document.getElementById('searchInput2').value.toLowerCase();
    const productsListDiv = document.getElementById('productsList');
    const productItems = productsListDiv.getElementsByClassName('product-item');

    Array.from(productItems).forEach(item => {
        const productName = item.getElementsByTagName('h3')[0].innerText.toLowerCase();
        const productId = item.getElementsByTagName('h3')[0].innerText.split('(ID: ')[1].split(')')[0]; // استخراج ID

        if (productName.includes(searchValue) || productId.includes(searchValue)) {
            item.style.display = ""; // عرض المنتج
        } else {
            item.style.display = "none"; // إخفاء المنتج
        }
    });
};

// دالة لتعديل المنتج
window.editProduct = function editProduct(productId) {
    const productRef = productsRef.child(productId);

    productRef.once('value').then((snapshot) => {
        if (snapshot.exists()) {
            const productData = snapshot.val();

            // تعبئة الحقول
            document.getElementById('productName').value = productData.name;
            document.getElementById('productPrice').value = productData.price;
            document.getElementById('productQuantity').value = productData.quantity;

            // تغيير زر الإضافة إلى تحديث
            const addButton = document.querySelector('button[onclick="addProduct()"]');
            addButton.onclick = function() {
                updateProduct(productId);
            };

            // تركيز الفوكس على الحقل الأول
            document.getElementById('productName').focus();  // تركيز على حقل اسم المنتج
        } else {
            alert("المنتج غير موجود.");
        }
    });
};

// دالة لتحديث المنتج
window.updateProduct = function updateProduct(productId) {
    // جلب القيم المدخلة من الحقول
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const quantity = parseFloat(document.getElementById('productQuantity').value); // تحويل الكمية إلى رقم

    // التحقق من إدخال جميع البيانات والتأكد من أن الكمية رقم صحيح
    if (name === "" || price === "" || isNaN(quantity)) {
        alert("يرجى إدخال جميع البيانات.");
        return;
    }

    // تحديث بيانات المنتج في Firebase
    productsRef.child(productId).update({
        name: name,
        price: price,
        quantity: quantity,  // التعامل مع الكمية كرقم
        timestamp: new Date().toISOString() // حفظ التاريخ والوقت الحالي
    }, function(error) {
        if (error) {
            alert("حدث خطأ أثناء تحديث المنتج.");
        } else {
            alert("تم تحديث المنتج بنجاح.");
            document.getElementById('productName').value = "";
            document.getElementById('productPrice').value = "";
            document.getElementById('productQuantity').value = "";

            const addButton = document.querySelector('button[onclick="addProduct()"]');
            addButton.onclick = addProduct;

            loadProducts();
        }
    });
};

// دالة لحذف المنتج
window.deleteProduct = function deleteProduct(productId) {
    if (confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟")) {
        productsRef.child(productId).remove()
            .then(() => {
                alert("تم حذف المنتج بنجاح.");
                loadProducts();
            })
            .catch((error) => {
                alert("حدث خطأ أثناء حذف المنتج.");
            });
    }
};

// دالة لتبديل عرض جميع المنتجات
window.toggleProducts = function toggleProducts() {
    const productsListDiv = document.getElementById('productsList');
    const searchInput = document.getElementById('searchInput2');

    if (productsListDiv.style.display === "none") {
        loadProducts();
        productsListDiv.style.display = "block";
        searchInput.style.display = "block";
        document.getElementById('toggleButton').innerText = "إخفاء المنتجات";
    } else {
        productsListDiv.style.display = "none";
        searchInput.style.display = "none";
        document.getElementById('toggleButton').innerText = "عرض جميع المنتجات";
    }
};

// الاستماع إلى إضافة منتجات جديدة
productsRef.on('child_added', (snapshot) => {
    const product = snapshot.val();
    const productId = snapshot.key;

    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.innerHTML = `
        <h3>${product.name} (ID: ${productId})</h3>
        <p>السعر: ${product.price}</p>
        <p>الكمية: ${product.quantity}</p>
        <p>تاريخ الإضافة: ${new Date(product.timestamp).toLocaleString()}</p>
        <button onclick="editProduct('${productId}')">تعديل</button>
        <button onclick="deleteProduct('${productId}')">حذف</button>
    `;
    document.getElementById('productsList').appendChild(productItem);
});

// الاستماع إلى تعديل المنتجات
productsRef.on('child_changed', (snapshot) => {
    const product = snapshot.val();
    const productId = snapshot.key;

    const productItems = document.getElementsByClassName('product-item');
    for (let item of productItems) {
        const idText = item.querySelector('h3').innerText;
        const id = idText.split('(ID: ')[1].split(')')[0]; // استخراج ID
        if (id === productId) {
            item.innerHTML = `
                <h3>${product.name} (ID: ${productId})</h3>
                <p>السعر: ${product.price}</p>
                <p>الكمية: ${product.quantity}</p>
                <p>تاريخ الإضافة: ${new Date(product.timestamp).toLocaleString()}</p>
                <button onclick="editProduct('${productId}')">تعديل</button>
                <button onclick="deleteProduct('${productId}')">حذف</button>
            `;
            break;
        }
    }
});

// الاستماع إلى حذف المنتجات
productsRef.on('child_removed', (snapshot) => {
    const productId = snapshot.key;

    const productItems = document.getElementsByClassName('product-item');
    for (let item of productItems) {
        const idText = item.querySelector('h3').innerText;
        const id = idText.split('(ID: ')[1].split(')')[0]; // استخراج ID
        if (id === productId) {
            item.remove();
            break;
        }
    }
});
