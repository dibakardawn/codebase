<?php
include('../library/qrCodeLib/full/qrlib.php');
$qr=isset($_REQUEST['qr'])?$_REQUEST['qr']:"";
QRcode::png($qr);
?>