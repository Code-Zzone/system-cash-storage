//         // // إعدادات Firebase
//         // const firebaseConfig = {
//         //     apiKey: "AIzaSyCPpTAJDRfFuDkq2TGCVIU_LnmYRBXTnSc",
//         //     authDomain: "new-protfolio.firebaseapp.com",
//         //     databaseURL: "https://new-protfolio-default-rtdb.firebaseio.com",
//         //     projectId: "new-protfolio",
//         //     storageBucket: "new-protfolio.appspot.com",
//         //     messagingSenderId: "90141039664",
//         //     appId: "1:90141039664:web:44d13d2f3b943f510aa1f5"
//         // };

//         // // تهيئة Firebase
//         // firebase.initializeApp(firebaseConfig);
//         // const database = firebase.database();
//         // const salesRef = database.ref('sales'); // تأكد من استخدام المسار الصحيح لمبيعاتك

//         // // دالة لإنشاء التقرير
//         // function generateReport() {
//         //     const startDate = new Date(document.getElementById('startDate').value);
//         //     const endDate = new Date(document.getElementById('endDate').value);

//         //     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         //         alert("يرجى إدخال تاريخ بداية ونهاية صحيحين.");
//         //         return;
//         //     }

//         //     const reportBody = document.getElementById('reportBody');
//         //     reportBody.innerHTML = ""; // مسح البيانات السابقة

//         //     // عرض جدول التقرير
//         //     document.getElementById('reportTable').style.display = 'table';
//         //     document.getElementById('loader').style.display = 'block'; // عرض اللودر

//         //     salesRef.once('value', (snapshot) => {
//         //         document.getElementById('loader').style.display = 'none'; // إخفاء اللودر
//         //         let hasSales = false; // متغير للتحقق من وجود مبيعات

//         //         snapshot.forEach(saleSnapshot => {
//         //             const sale = saleSnapshot.val();
//         //             const saleTimestamp = new Date(sale.timestamp);
//         //             if (saleTimestamp >= startDate && saleTimestamp <= endDate) {
//         //                 hasSales = true; // وجدنا مبيعات
//         //                 sale.items.forEach(item => {
//         //                     const row = document.createElement('tr');
//         //                     row.innerHTML = `
//         //                         <td>${sale.saleId}</td>
//         //                         <td>${item.name}</td>
//         //                         <td>${item.price}</td>
//         //                         <td>${item.quantity}</td>
//         //                         <td>${saleTimestamp.toLocaleString()}</td>
//         //                         <td>${item.price * item.quantity}</td>
//         //                         <td>
//         //                             <button onclick="printSingleSale('${sale.saleId}')">طباعة</button>
//         //                         </td>
//         //                     `;
//         //                     reportBody.appendChild(row);
//         //                 });
//         //             }
//         //         });

//         //         // إظهار زر الطباعة إذا كانت هناك مبيعات
//         //         if (hasSales) {
//         //             document.getElementById('printReportButton').style.display = 'block';
//         //         } else {
//         //             alert("لا توجد مبيعات في هذا النطاق الزمني.");
//         //         }
//         //     });
//         // }

//         // // دالة لطباعة التقرير الكامل
//         // function printFullReport() {
//         //     window.print();
//         // }

//         // // دالة لطباعة عملية معينة
//         // function printSingleSale(saleId) {
//         //     const saleRow = [...document.querySelectorAll('#reportBody tr')].find(row => row.cells[0].innerText === saleId);
//         //     if (saleRow) {
//         //         const saleContent = saleRow.outerHTML; // الحصول على محتوى العملية
//         //         const newWindow = window.open('', '', 'width=600,height=400');
//         //         newWindow.document.write('<html><head><title>طباعة عملية</title></head><body>');
//         //         newWindow.document.write('<h1>عملية رقم: ' + saleId + '</h1>');
//         //         newWindow.document.write('<table>' + saleContent + '</table>');
//         //         newWindow.document.write('</body></html>');
//         //         newWindow.document.close();
//         //         newWindow.print();
//         //     }
//         // }


// //  new version


//         // إعدادات Firebase
//         const firebaseConfig = {
//             apiKey: "AIzaSyCPpTAJDRfFuDkq2TGCVIU_LnmYRBXTnSc",
//             authDomain: "new-protfolio.firebaseapp.com",
//             databaseURL: "https://new-protfolio-default-rtdb.firebaseio.com",
//             projectId: "new-protfolio",
//             storageBucket: "new-protfolio.appspot.com",
//             messagingSenderId: "90141039664",
//             appId: "1:90141039664:web:44d13d2f3b943f510aa1f5"
//         };

//         // تهيئة Firebase
//         firebase.initializeApp(firebaseConfig);
//         const database = firebase.database();
//         const salesRef = database.ref('sales'); // تأكد من استخدام المسار الصحيح لمبيعاتك

        
//         // دالة لإنشاء التقرير
//         function generateReport() {
//             const startDate = new Date(document.getElementById('startDate').value);
//             const endDate = new Date(document.getElementById('endDate').value);

//             if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//                 alert("يرجى إدخال تاريخ بداية ونهاية صحيحين.");
//                 return;
//             }

//             const reportBody = document.getElementById('reportBody');
//             reportBody.innerHTML = ""; // مسح البيانات السابقة

//             // عرض جدول التقرير
//             document.getElementById('reportTable').style.display = 'table';
//             document.getElementById('loader').style.display = 'block'; // عرض اللودر

//             salesRef.once('value', (snapshot) => {
//                 document.getElementById('loader').style.display = 'none'; // إخفاء اللودر
//                 let hasSales = false; // متغير للتحقق من وجود مبيعات
//                 const salesMap = {}; // كائن لتجميع بيانات المبيعات

//                 snapshot.forEach(saleSnapshot => {
//                     const sale = saleSnapshot.val();
//                     const saleTimestamp = new Date(sale.timestamp);
//                     if (saleTimestamp >= startDate && saleTimestamp <= endDate) {
//                         hasSales = true; // وجدنا مبيعات
//                         if (!salesMap[sale.saleId]) {
//                             salesMap[sale.saleId] = {
//                                 items: [],
//                                 timestamp: saleTimestamp
//                             };
//                         }
//                         sale.items.forEach(item => {
//                             salesMap[sale.saleId].items.push(item);
//                         });
//                     }
//                 });


//                 // إضافة الصفوف إلى الجدول
//                 for (const saleId in salesMap) {
//                     const { items, timestamp } = salesMap[saleId];
//                     let totalAmount = 0;
//                     items.forEach(item => {
//                         totalAmount += item.price * item.quantity;
//                     });

//                     // إنشاء صف لكل عملية
//                     const row = document.createElement('tr');
//                     row.innerHTML = `
//                         <td>${saleId}</td>
//                         <td>${items.map(item => item.name).join(', ')}</td>
//                         <td>${items.map(item => item.price).join(', ')}</td>
//                         <td>${items.map(item => item.quantity).join(', ')}</td>
//                         <td>${timestamp.toLocaleString()}</td>
//                         <td>${totalAmount}</td>
//                         <td>
//                             <button onclick="printSingleSale('${saleId}')">طباعة</button>
//                         </td>
//                     `;
//                     reportBody.appendChild(row);
//                 }

//                 // إظهار زر الطباعة إذا كانت هناك مبيعات
//                 if (hasSales) {
//                     document.getElementById('printReportButton').style.display = 'block';
//                 } else {
//                     alert("لا توجد مبيعات في هذا النطاق الزمني.");
//                 }
//             });
//         }

//         // دالة لطباعة التقرير الكامل
//         function printFullReport() {
//             window.print();
//         }

//         // دالة لطباعة عملية معينة
//         function printSingleSale(saleId) {
//             const saleRow = [...document.querySelectorAll('#reportBody tr')].find(row => row.cells[0].innerText === saleId);
//             if (saleRow) {
//                 const saleContent = saleRow.outerHTML; // الحصول على محتوى العملية
//                 const newWindow = window.open('', '', 'width=600,height=400');
//                 newWindow.document.write('<html><head><title>طباعة عملية</title></head><body>');
//                 newWindow.document.write('<h1>عملية رقم: ' + saleId + '</h1>');
//                 newWindow.document.write('<table>' + saleContent + '</table>');
//                 newWindow.document.write('</body></html>');
//                 newWindow.document.close();
//                 newWindow.print();
//             }
//         }




//  new version one

// // إعدادات Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyCPpTAJDRfFuDkq2TGCVIU_LnmYRBXTnSc",
//     authDomain: "new-protfolio.firebaseapp.com",
//     databaseURL: "https://new-protfolio-default-rtdb.firebaseio.com",
//     projectId: "new-protfolio",
//     storageBucket: "new-protfolio.appspot.com",
//     messagingSenderId: "90141039664",
//     appId: "1:90141039664:web:44d13d2f3b943f510aa1f5"
// };

// // تهيئة Firebase
// firebase.initializeApp(firebaseConfig);

// // تعريف قاعدة البيانات والمسار إلى المبيعات
// const database = firebase.database();
// const salesRef = database.ref('sales'); // تأكد من استخدام المسار الصحيح لمبيعاتك

// // دالة لإنشاء التقرير
// function generateReport() {
//     // الكود الخاص بالدالة...
// }

// // دالة لإنشاء التقرير
// function generateReport() {
//     const startDate = new Date(document.getElementById('startDate').value);
//     const endDate = new Date(document.getElementById('endDate').value);

//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         alert("يرجى إدخال تاريخ بداية ونهاية صحيحين.");
//         return;
//     }

//     const reportBody = document.getElementById('reportBody');
//     reportBody.innerHTML = ""; // مسح البيانات السابقة

//     // عرض جدول التقرير
//     document.getElementById('reportTable').style.display = 'table';
//     document.getElementById('loader').style.display = 'block'; // عرض اللودر

//     salesRef.once('value', (snapshot) => {
//         document.getElementById('loader').style.display = 'none'; // إخفاء اللودر
//         let hasSales = false; // متغير للتحقق من وجود مبيعات
//         const salesMap = {}; // كائن لتجميع بيانات المبيعات
//         let totalAmountOverall = 0; // إجمالي المبلغ لكل المبيعات
//         let totalQuantityOverall = 0; // إجمالي الكمية لكل المبيعات

//         snapshot.forEach(saleSnapshot => {
//             const sale = saleSnapshot.val();
//             const saleTimestamp = new Date(sale.timestamp);
//             if (saleTimestamp >= startDate && saleTimestamp <= endDate) {
//                 hasSales = true; // وجدنا مبيعات
//                 if (!salesMap[sale.saleId]) {
//                     salesMap[sale.saleId] = {
//                         items: [],
//                         timestamp: saleTimestamp
//                     };
//                 }
//                 sale.items.forEach(item => {
//                     salesMap[sale.saleId].items.push(item);
//                     totalAmountOverall += item.price * item.quantity;
//                     totalQuantityOverall += item.quantity;
//                 });
//             }
//         });

//         // إضافة الصفوف إلى الجدول
//         for (const saleId in salesMap) {
//             const { items, timestamp } = salesMap[saleId];
//             let totalAmount = 0;
//             items.forEach(item => {
//                 totalAmount += item.price * item.quantity;
//             });

//             // إنشاء صف لكل عملية
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${saleId}</td>
//                 <td>${items.map(item => item.name).join(', ')}</td>
//                 <td>${items.map(item => item.price).join(', ')}</td>
//                 <td>${items.map(item => item.quantity).join(', ')}</td>
//                 <td>${timestamp.toLocaleString()}</td>
//                 <td>${totalAmount}</td>
//                 <td>
//                     <button onclick="printSingleSale('${saleId}')">طباعة</button>
//                 </td>
//             `;
//             reportBody.appendChild(row);
//         }

//         // إضافة صف في نهاية التقرير لإجمالي المبلغ والكمية
//         const summaryRow = document.createElement('tr');
//         summaryRow.innerHTML = `
//             <td colspan="3">الإجمالي</td>
//             <td>${totalQuantityOverall}</td>
//             <td>من ${startDate.toLocaleDateString()} إلى ${endDate.toLocaleDateString()}</td>
//             <td>${totalAmountOverall}</td>
//             <td></td>
//         `;
//         reportBody.appendChild(summaryRow);

//         // إظهار زر الطباعة إذا كانت هناك مبيعات
//         if (hasSales) {
//             document.getElementById('printReportButton').style.display = 'block';
//         } else {
//             alert("لا توجد مبيعات في هذا النطاق الزمني.");
//         }
//     });
// }


//         // دالة لطباعة التقرير الكامل
//         function printFullReport() {
//             window.print();
//         }

//         // دالة لطباعة عملية معينة
//         function printSingleSale(saleId) {
//             const saleRow = [...document.querySelectorAll('#reportBody tr')].find(row => row.cells[0].innerText === saleId);
//             if (saleRow) {
//                 const saleContent = saleRow.outerHTML; // الحصول على محتوى العملية
//                 const newWindow = window.open('', '', 'width=600,height=400');
//                 newWindow.document.write('<html><head><title>طباعة عملية</title></head><body>');
//                 newWindow.document.write('<h1>عملية رقم: ' + saleId + '</h1>');
//                 newWindow.document.write('<table>' + saleContent + '</table>');
//                 newWindow.document.write('</body></html>');
//                 newWindow.document.close();
//                 newWindow.print();
//             }
//         }




// new version two

// // إعدادات Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyCPpTAJDRfFuDkq2TGCVIU_LnmYRBXTnSc",
//     authDomain: "new-protfolio.firebaseapp.com",
//     databaseURL: "https://new-protfolio-default-rtdb.firebaseio.com",
//     projectId: "new-protfolio",
//     storageBucket: "new-protfolio.appspot.com",
//     messagingSenderId: "90141039664",
//     appId: "1:90141039664:web:44d13d2f3b943f510aa1f5"
// };

// // تهيئة Firebase
// firebase.initializeApp(firebaseConfig);
// const database = firebase.database();
// const salesRef = database.ref('sales'); // تأكد من استخدام المسار الصحيح لمبيعاتك

// // دالة لإنشاء التقرير
// function generateReport() {
//     const startDate = new Date(document.getElementById('startDate').value);
//     const endDate = new Date(document.getElementById('endDate').value);

//     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         alert("يرجى إدخال تاريخ بداية ونهاية صحيحين.");
//         return;
//     }

//     const reportBody = document.getElementById('reportBody');
//     reportBody.innerHTML = ""; // مسح البيانات السابقة

//     // عرض جدول التقرير
//     document.getElementById('reportTable').style.display = 'table';
//     document.getElementById('loader').style.display = 'block'; // عرض اللودر

//     // مراقبة التحديثات بشكل مستمر
//     salesRef.on('value', (snapshot) => {
//         document.getElementById('loader').style.display = 'none'; // إخفاء اللودر
//         let hasSales = false; // متغير للتحقق من وجود مبيعات
//         const salesMap = {}; // كائن لتجميع بيانات المبيعات
//         let totalAmountOverall = 0; // إجمالي المبلغ لكل المبيعات
//         let totalQuantityOverall = 0; // إجمالي الكمية لكل المبيعات

//         snapshot.forEach(saleSnapshot => {
//             const sale = saleSnapshot.val();
//             const saleTimestamp = new Date(sale.timestamp);
//             if (saleTimestamp >= startDate && saleTimestamp <= endDate) {
//                 hasSales = true; // وجدنا مبيعات
//                 if (!salesMap[sale.saleId]) {
//                     salesMap[sale.saleId] = {
//                         items: [],
//                         timestamp: saleTimestamp
//                     };
//                 }
//                 sale.items.forEach(item => {
//                     salesMap[sale.saleId].items.push(item);
//                     totalAmountOverall += item.price * item.quantity;
//                     totalQuantityOverall += item.quantity;
//                 });
//             }
//         });

//         // مسح البيانات القديمة قبل إعادة الرسم
//         reportBody.innerHTML = "";

//         // إضافة الصفوف إلى الجدول
//         for (const saleId in salesMap) {
//             const { items, timestamp } = salesMap[saleId];
//             let totalAmount = 0;
//             items.forEach(item => {
//                 totalAmount += item.price * item.quantity;
//             });

//             // إنشاء صف لكل عملية
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${saleId}</td>
//                 <td>${items.map(item => item.name).join(', ')}</td>
//                 <td>${items.map(item => item.price).join(', ')}</td>
//                 <td>${items.map(item => item.quantity).join(', ')}</td>
//                 <td>${timestamp.toLocaleString()}</td>
//                 <td>${totalAmount}</td>
//                 <td>
//                     <button onclick="printSingleSale('${saleId}')">طباعة</button>
//                 </td>
//             `;
//             reportBody.appendChild(row);
//         }

//         // إضافة صف في نهاية التقرير لإجمالي المبلغ والكمية
//         const summaryRow = document.createElement('tr');
//         summaryRow.innerHTML = `
//             <td colspan="3">الإجمالي</td>
//             <td>${totalQuantityOverall}</td>
//             <td>من ${startDate.toLocaleDateString()} إلى ${endDate.toLocaleDateString()}</td>
//             <td>${totalAmountOverall}</td>
//             <td></td>
//         `;
//         reportBody.appendChild(summaryRow);

//         // إظهار زر الطباعة إذا كانت هناك مبيعات
//         if (hasSales) {
//             document.getElementById('printReportButton').style.display = 'block';
//         } else {
//             alert("لا توجد مبيعات في هذا النطاق الزمني.");
//         }
//     });
// }

// // دالة لطباعة التقرير الكامل
// function printFullReport() {
//     window.print();
// }

// // دالة لطباعة عملية معينة
// function printSingleSale(saleId) {
//     const saleRow = [...document.querySelectorAll('#reportBody tr')].find(row => row.cells[0].innerText === saleId);
//     if (saleRow) {
//         const saleContent = saleRow.outerHTML; // الحصول على محتوى العملية
//         const newWindow = window.open('', '', 'width=600,height=400');
//         newWindow.document.write('<html><head><title>طباعة عملية</title></head><body>');
//         newWindow.document.write('<h1>عملية رقم: ' + saleId + '</h1>');
//         newWindow.document.write('<table>' + saleContent + '</table>');
//         newWindow.document.write('</body></html>');
//         newWindow.document.close();
//         newWindow.print();
//     }
// }
