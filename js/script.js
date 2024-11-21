 // إعدادات Firebase
 const firebaseConfig = {
    apiKey: "AIzaSyDfdJOe80UAwfJFZUgtmHj7TVqSAiCnnAQ",
  authDomain: "systemcasher-33c06.firebaseapp.com",
databaseURL: "https://systemcasher-33c06-default-rtdb.firebaseio.com",
  projectId: "systemcasher-33c06",
  storageBucket: "systemcasher-33c06.appspot.com",
  messagingSenderId: "161097570896",
  appId: "1:161097570896:web:1b587b0c4e8bac3f378f55"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const productsRef = database.ref('products');
const salesRef = database.ref('sales');



    // functions
     function closeNav() {
        document.querySelector('.small-ul').style.display = 'none';
    }
    function closeSideBar() {
        document.querySelector('.list-side-bar').style.display = 'block';
        document.querySelector('.side-bar').style.display = 'none';
    }
    function showSideBar() {
        document.querySelector('.side-bar').style.display = 'block';
        document.querySelector('.list-side-bar').style.display = 'none';
        document.querySelector('.close-side-bar').style.display = 'block';
    }

    function fullReport() {
    document.getElementById('fullReport').style.display = 'block';
    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('timeReport').style.display = 'none';
    document.getElementById('storage').style.display = 'none';
    document.getElementById('sales').style.display = 'none';
    document.getElementById('barCode').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    // document.getElementById('searchId').focus(); // تعيين التركيز على حقل الإدخال
    document.getElementById('deleteData').style.display = 'none';
    document.getElementById('btnFullReport').style.background = 'var(--btnColor)';
    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnSales').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';

}

function deleteAll() {

    document.getElementById('deleteData').style.display = 'block';
    document.getElementById('fullReport').style.display = 'none';

    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('timeReport').style.display = 'none';
    document.getElementById('storage').style.display = 'none';
    document.getElementById('sales').style.display = 'none';
    document.getElementById('barCode').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    // document.getElementById('searchId').focus(); // تعيين التركيز على حقل الإدخال
    document.getElementById('btnDeleteAll').style.background = 'var(--btnColor)';

    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnSales').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';

}

function showShowSales() {
    document.getElementById('ShowSales').style.display = 'block';
    document.getElementById('timeReport').style.display = 'none';

    document.getElementById('storage').style.display = 'none';
    document.getElementById('sales').style.display = 'none';
    document.getElementById('barCode').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    // document.getElementById('searchId').focus(); // تعيين التركيز على حقل الإدخال
    document.getElementById('fullReport').style.display = 'none';
    document.getElementById('deleteData').style.display = 'none';
    document.getElementById('btnShowSales').style.background = 'var(--btnColor)';

    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnSales').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';



}
function timeReport() {
    document.getElementById('timeReport').style.display = 'block';
    document.getElementById('storage').style.display = 'none';
    document.getElementById('sales').style.display = 'none';

    document.getElementById('barCode').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('fullReport').style.display = 'none';
    document.getElementById('deleteData').style.display = 'none';
    // document.getElementById('searchId').focus(); // تعيين التركيز على حقل الإدخال
    document.getElementById('btnReportTime').style.background = 'var(--btnColor)';


    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnSales').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';


}

function storage() {
    document.getElementById('storage').style.display = 'block';
    document.getElementById('sales').style.display = 'none';
    document.getElementById('barCode').style.display = 'none';

    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    // document.getElementById('searchId').focus(); // تعيين التركيز على حقل الإدخال
    document.getElementById('timeReport').style.display = 'none';
    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('fullReport').style.display = 'none';
    document.getElementById('deleteData').style.display = 'none';
    document.getElementById('btnStorage').style.background = 'var(--btnColor)';

    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnSales').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';

    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';


}
function sales() {
    document.getElementById('sales').style.display = 'block';
    // document.getElementById('searchId').focus(); // تعيين التركيز على حقل الإدخال
    document.getElementById('barCode').style.display = 'none';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    document.getElementById('storage').style.display = 'none';
    document.getElementById('timeReport').style.display = 'none';
    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('fullReport').style.display = 'none';
    document.getElementById('deleteData').style.display = 'none';


    document.getElementById('btnSales').style.background = 'var(--btnColor)';


    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';


}
function barCode() {
    document.getElementById('barCode').style.display = 'block';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('ownerForm').style.display = 'none';
    document.getElementById('sales').style.display = 'none';

    document.getElementById('storage').style.display = 'none';
    document.getElementById('timeReport').style.display = 'none';
    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('fullReport').style.display = 'none';
    document.getElementById('deleteData').style.display = 'none';

    document.getElementById('btnBarcode').style.background = 'var(--btnColor)';

    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';



}

function addAdmin() {
    document.getElementById('ownerForm').style.display = 'block';
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('barCode').style.display = 'none';
    document.getElementById('sales').style.display = 'none';
    document.getElementById('timeReport').style.display = 'none';

    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('storage').style.display = 'none';
    document.getElementById('deleteData').style.display = 'none';
    document.getElementById('fullReport').style.display = 'none';
    document.getElementById('btnAddAdmin').style.background = 'var(--btnColor)';

    document.getElementById('btnBarcode').style.background = 'var(--subColor)';

    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnChangePassName').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';



}
function changePassName() {
    document.getElementById('changePasswordForm').style.display = 'block';
    document.getElementById('ownerForm').style.display = 'none';
    document.getElementById('barCode').style.display = 'none';
    document.getElementById('sales').style.display = 'none';
    document.getElementById('storage').style.display = 'none';
    document.getElementById('timeReport').style.display = 'none';
    document.getElementById('ShowSales').style.display = 'none';
    document.getElementById('fullReport').style.display = 'none';

    document.getElementById('deleteData').style.display = 'none';

    document.getElementById('btnChangePassName').style.background = 'var(--btnColor)';

    document.getElementById('btnAddAdmin').style.background = 'var(--subColor)';
    document.getElementById('btnBarcode').style.background = 'var(--subColor)';
    document.getElementById('btnReportTime').style.background = 'var(--subColor)';
    document.getElementById('btnShowSales').style.background = 'var(--subColor)';
    document.getElementById('btnFullReport').style.background = 'var(--subColor)';
    document.getElementById('btnStorage').style.background = 'var(--subColor)';
    document.getElementById('btnDeleteAll').style.background = 'var(--subColor)';

}