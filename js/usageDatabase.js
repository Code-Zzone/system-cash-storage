
let contentUsageDatabase = `
        <h3>حجم البيانات في قاعدة البيانات</h3>
            <div id="loader">جارٍ تحميل البيانات...</div>

    <div id="dataSizeDisplay"></div>
    <div id="progressContainer">
        <div id="progressBar"></div>
        <div class="usage-label" id="usageLabel" style="color: white;">0 بايت مستخدم</div>
    </div>
    <canvas id="usageChart"></canvas>

`;
document.getElementById('usageDatabase').innerHTML = contentUsageDatabase;

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyDfdJOe80UAwfJFZUgtmHj7TVqSAiCnnAQ",
//     authDomain: "systemcasher-33c06.firebaseapp.com",
//     databaseURL: "https://systemcasher-33c06-default-rtdb.firebaseio.com",
//     projectId: "systemcasher-33c06",
//     storageBucket: "systemcasher-33c06.appspot.com",
//     messagingSenderId: "161097570896",
//     appId: "1:161097570896:web:1b587b0c4e8bac3f378f55"
// };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
let usageChart; // تعريف الرسم البياني

window.displayDataSize = async function displayDataSize() {
    document.getElementById('loader').style.display = 'block'; // عرض اللودر
    try {
        const dbRef = ref(database);
        const snapshot = await get(dbRef);
        const data = snapshot.val();
        const size = JSON.stringify(data).length;

        // عرض حجم البيانات
        document.getElementById('dataSizeDisplay').innerText = `حجم البيانات: ${size} بايت`;

        // إعداد الرسم البياني
        const maxSize = 1000000; // الحد الأقصى للحجم (1 ميجابايت)
        const percentage = (size / maxSize) * 100;
        document.getElementById('progressBar').style.width = percentage + '%';
        document.getElementById('usageLabel').innerText = `${size} بايت مستخدم`;

        // رسم بياني باستخدام Chart.js
        const ctx = document.getElementById('usageChart').getContext('2d');
        
        if (usageChart) {
            usageChart.data.datasets[0].data = [size, maxSize - size];
            usageChart.update();
        } else {
            usageChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['استخدام البيانات', 'المساحة المتبقية'],
                    datasets: [{
                        label: 'حجم البيانات',
                        data: [size, maxSize - size],
                        backgroundColor: ['#27ae60', '#e67e22'],
                        borderWidth: 2,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 16,
                                    family: 'Roboto'
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return `${tooltipItem.label}: ${tooltipItem.raw} بايت`;
                                }
                            }
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            color: '#333',
                            formatter: function(value, context) {
                                return context.chart.data.labels[context.dataIndex] + ': ' + value + ' بايت';
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        }

        // تغيير لون الشريط إذا تجاوز الحد الأقصى
        if (percentage > 100) {
            document.getElementById('progressBar').style.backgroundColor = 'red';
        }
    } catch (error) {
        console.error("حدث خطأ أثناء استرجاع حجم البيانات:", error);
        document.getElementById('dataSizeDisplay').innerText = "حدث خطأ أثناء استرجاع البيانات.";
    } finally {
        document.getElementById('loader').style.display = 'none'; // إخفاء اللودر
    }
}

// استدعاء الدالة عند تحميل الصفحة
displayDataSize();

// تحديث البيانات كل 5 ثوانٍ
setInterval(displayDataSize, 5000);