let contentBarCode = `
  <h1>إنشاء باركود</h1>
                    <div class="creat-bar-code">
                        <label for="startId">ID البداية:</label>
                        <input type="number" id="startId" value="1" min="1"><br>
                        <label for="endId">ID النهاية:</label>
                        <input type="number" id="endId" value="10" min="1"><br>
                        <button onclick="generateBarcodes()">إنشاء باركود</button>
                    </div>
                    <div id="barcodesContainer"></div>
                    <button onclick="downloadAsImage()">تحميل كصورة</button>
                    <button onclick="downloadAsPDF()">تحميل كملف PDF</button>
                    <button onclick="printBarcodes()">طباعة باركود</button>
`;
document.getElementById('barCode').innerHTML = contentBarCode;

let productCounter = 1;
function generateProductId() {
    return String(productCounter++).padStart(6, '0'); // صيغة ID من 6 أرقام
}

window.generateBarcodes = function generateBarcodes() {
    const startId = parseInt(document.getElementById('startId').value);
    const endId = parseInt(document.getElementById('endId').value);
    const container = document.getElementById('barcodesContainer');
    container.innerHTML = "";

    for (let i = startId; i <= endId; i++) {
        const barcodeId = generateProductId();
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, barcodeId, { format: "CODE128" });
        container.appendChild(canvas);
    }
}

window.downloadAsImage = async function downloadAsImage() {
    const container = document.getElementById('barcodesContainer');
    const canvas = await html2canvas(container);
    const link = document.createElement('a');
    link.download = 'barcodes.png'; // اسم الصورة عند التحميل
    link.href = canvas.toDataURL(); // تحويل الصورة إلى بيانات URL
    link.click(); // محاكاة نقر المستخدم على الرابط لتحميل الصورة
}

window.downloadAsPDF = async function downloadAsPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const container = document.getElementById('barcodesContainer');

    html2canvas(container).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save('barcodes.pdf');
    });
}

window.printBarcodes = async function printBarcodes() {
    const container = document.getElementById('barcodesContainer');
    const canvas = await html2canvas(container, { useCORS: true }); // استخدام CORS لتحسين عملية الطباعة
    const imgData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>طباعة باركود</title></head><body>');
    printWindow.document.write('<img src="' + imgData + '" style="width: 100%; height: auto;"/>'); 
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}