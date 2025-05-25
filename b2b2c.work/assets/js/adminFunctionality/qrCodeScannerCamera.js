$(function () {
    // Initialize scannerQRCodes from localStorage or as an empty array
    let scannerQRCodes = JSON.parse(localStorage.getItem("scannerQRCodes")) || [];

    // Function to handle successful QR code scan
    function onScanSuccess(decodeText, decodeResult) {
        alert("Scanner Code: " + decodeText);
        scannerQRCodes.push(decodeText);
        localStorage.setItem("scannerQRCodes", JSON.stringify(scannerQRCodes));
        $("#scannedItems").html(scannerQRCodes.length);
        $('#html5-qrcode-button-camera-stop').click();
    }

    // Initialize the QR code scanner
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250, qrbox: { width: 250, height: 250 }}
    );
    htmlscanner.render(onScanSuccess);
});