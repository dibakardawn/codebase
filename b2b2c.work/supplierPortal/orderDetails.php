<?php
include('../config/config.php');
$section = "SUPPLIERPORTAL";
$page = "ORDERDETAIL";
$orderId=isset($_REQUEST['orderId'])?$_REQUEST['orderId']:0;
if(!isset($_SESSION['supplierId'])){
	echo "<script language=\"javascript\">window.location = 'logout.php'</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Welcome to Supplier Portal | Order Details</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/x-icon" href="<?php echo SITEURL; ?>favicon.ico">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Font Awesome----------------------------------------------------------->
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0" as="font" type="font/woff2" crossorigin="anonymous">
		<!-------------------------------------------------Font Awesome----------------------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/supplierStyle/supplierStyle.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/supplierFunctionality/supplierFunctionality.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body>
		<?php include('includes/header.php'); ?>
		<div id="orderDetailSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot16">
			<h4 class="text-left">
				<b>
					<i class="fa fa-truck"></i> 
					<span id="cms_609">Order Details</span>
				</b>
			</h4>
			<?php include('includes/orderDetailPackingTab.php'); ?>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10 borderBot">
				<div id="orderSection1" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly marBot10"></div>
				<div id="orderSection2" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly marBot10"></div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
				<div id="orderSection3" class="col-lg-8 col-md-8 col-sm-12 col-xs-12 noLeftPaddingOnly">
					<h4 id="cms_627">Order Table</h4>
					<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
					<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="paymentModeSection" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<div id="cms_616">Payment Information</div>
							<div id="purchaseOrderPaymentInfo"></div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<span id="cms_617">Total Before Tax</span> : <span id="totalBeforeTax"></span>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<span id="cms_707">Packing Cost</span> : <span id="packingCost"></span>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<span id="cms_618">Tax</span> : <span id="taxP"></span> %
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<span id="cms_619">Total</span> : <span id="totalPrice"></span>
							</div>
							<div id="debitNote" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<h4 id="cms_620">Terms & Conditions :</h4>
						<div id="tncHTML" class="clauseItem"></div>
					</div>
				</div>
				<div id="orderSection4" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopaddingOnly">
					<div id="clauseSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<h4 id="cms_621">Clauses :</h4>
						<div id="clauseHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					</div>
					<div id="signSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
							<h4 id="cms_622">Customer Signature : </h4>
							<img src="<?php echo SITEURL; ?>assets/images/sign.png" alt="signature" class="w100p">
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 nopaddingOnly">
							<h4 id="cms_623">Your Signature : </h4>
							<?php $signatureFile = isset($_SESSION['supplierId']) ? 'SUPPLIER-SIGN_'.$_SESSION['supplierId'].'.jpeg' : 'default-signature.jpeg'; ?>
							<img src="<?php echo SITEURL; ?>uploads/supplierSignature/<?php echo $signatureFile; ?>" alt="signature" class="w100p" onerror="appCommonFunctionality.onImgError(this)">
						</div>
					</div>
				</div>
			</div>
			<!-- Edit Price Modal -->
			<div class="modal fade" id="editPPriceModal" role="dialog">
				<div class="modal-dialog modal-sm">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 id="cms_xxxx" class="modal-title">Edit Product Price</h4>
						</div>
						<div id="editPriceModalBody" class="modal-body">
							<div class="input-group input-group-md">
								<span class="input-group-addon">Product Price</span>
								<input type="number" id="alteredProductPrice" name="alteredProductPrice" value="0" step="1" min="0" class="form-control" autocomplete="off">
							</div>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_xxxx">Close</button>
							<button type="button" class="btn btn-success pull-right" rel="cms_xxxx" onclick="supplierFunctionality.saveAlteredProductPrice()">Save</button>
							<input id="productId" name="productId" type="hidden" value='0'>
							<input id="productCombinationId" name="productCombinationId" type="hidden" value='0'>
						</div>
					</div>
				</div>
			</div>
			<!-- Edit Price Modal -->
		</div>
		<br clear="all">
		<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
		<?php include('includes/footer.php'); ?>
	</body>
</html>