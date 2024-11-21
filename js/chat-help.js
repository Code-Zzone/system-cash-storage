


    //   new new
    // إعداد Firebase باستخدام بيانات قاعدة البيانات الخاصة بك
const firebaseConfig = {
    apiKey: "AIzaSyAdpdxJNfgRnu35IX4IXqIT3VpM4XOzooE",
    authDomain: "my-protfolio-88941.firebaseapp.com",
    databaseURL: "https://my-protfolio-88941-default-rtdb.firebaseio.com",
    projectId: "my-protfolio-88941",
    storageBucket: "my-protfolio-88941.appspot.com",
    messagingSenderId: "216282065194",
    appId: "1:216282065194:web:9f81b5b3b3f6c3e78ed653"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const messagesRef = database.ref('messages');
const storageRef = firebase.storage().ref();

// عنصر رسالة التأكيد
let confirmationElement;
let autoReplySent = false; // متغير لتتبع ما إذا تم إرسال الرد التلقائي

window.onload = function() {
    confirmationElement = document.getElementById('confirmationMessage');
    loadMessages(); // تحميل الرسائل عند فتح الصفحة
};

// إرسال رسالة نصية
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;

    if (message.trim() === "") {
        return; // عدم إرسال رسائل فارغة
    }

    // إرسال رسالة المستخدم
    messagesRef.push().set({
        message: message,
        sender: 'المستخدم', // المرسل هو المستخدم
        timestamp: Date.now(),
        type: 'text'
    });

    // إرسال رد تلقائي فقط إذا لم يتم إرساله مسبقًا
    if (!autoReplySent) {
        sendAutoReply();
        autoReplySent = true; // تحديث المتغير بعد إرسال الرد
    }

    messageInput.value = ""; // مسح حقل الإدخال بعد الإرسال
}

// إرسال رد تلقائي للمستخدم
function sendAutoReply() {
    messagesRef.push().set({
        message: "شكرا على تواصلك معنا، سوف يتم التواصل معك في أقرب وقت ممكن لدي مسؤول الدعم الخاص بنظامك.",
        sender: 'الدعم الفني', // المرسل هو الدعم الفني
        timestamp: Date.now(),
        type: 'text'
    });
}

// إرسال صورة
function sendImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        return; // عدم إرسال ملفات فارغة
    }

    const filePath = 'images/' + file.name;
    const uploadTask = storageRef.child(filePath).put(file);

    uploadTask.on('state_changed', 
        (snapshot) => {
            // يمكن إضافة مؤشر لتحميل الصورة إذا رغبت
        }, 
        (error) => {
            console.error("خطأ في رفع الصورة:", error);
        }, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                messagesRef.push().set({
                    message: downloadURL,
                    sender: 'المستخدم', 
                    timestamp: Date.now(),
                    type: 'image'
                });

                // إرسال رد تلقائي فقط إذا لم يتم إرساله مسبقًا
                if (!autoReplySent) {
                    sendAutoReply();
                    autoReplySent = true; // تحديث المتغير بعد إرسال الرد
                }
            });
        }
    );

    fileInput.value = ""; // مسح حقل الإدخال بعد الإرسال
}

// تحميل الرسائل وعرضها
function loadMessages() {
    messagesRef.on('value', (snapshot) => {
        const messagesContainer = document.getElementById('messagesContainer');
        messagesContainer.innerHTML = ""; // مسح الرسائل الحالية قبل التحديث

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const messageItem = document.createElement('div');
            messageItem.classList.add('message-item');

            if (data.type === 'image') {
                const img = document.createElement('img');
                img.src = data.message;
                img.style.width = '100px'; // حجم الصورة
                const downloadLink = document.createElement('a');
                downloadLink.href = data.message; // رابط الصورة
                downloadLink.download = data.message.split('/').pop(); // اسم الملف
                downloadLink.innerText = 'تحميل الصورة';
                downloadLink.style.marginLeft = '10px';

                messageItem.innerText = `${data.sender}: `;
                messageItem.appendChild(img);
                messageItem.appendChild(downloadLink); // إضافة رابط التحميل
            } else {
                messageItem.innerText = `${data.sender}: ${data.message}`;
            }

            messagesContainer.appendChild(messageItem);
        });
    });
}

// بدء محادثة جديدة
function startNewConversation() {
    confirmationElement.innerHTML = `
        <p>هل أنت متأكد من بدء محادثة جديدة؟</p>
        <button onclick="confirmStartNewConversation()">نعم</button>
        <button onclick="cancelStartNewConversation()">لا</button>
    `;
}

// تأكيد بدء المحادثة الجديدة
function confirmStartNewConversation() {
    messagesRef.set({}); // مسح جميع الرسائل الحالية
    autoReplySent = false; // إعادة تعيين متغير الرد التلقائي
    loadMessages(); // تحميل الرسائل بعد المسح
    confirmationElement.innerHTML = ""; // مسح رسالة التأكيد
}

// إلغاء بدء المحادثة الجديدة
function cancelStartNewConversation() {
    confirmationElement.innerHTML = ""; // مسح رسالة التأكيد
}
