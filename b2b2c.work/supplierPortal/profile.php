<?php
include('../config/config.php');
$section = "SUPPLIERPORTAL";
$page = "PROFILE";
if(!isset($_SESSION['supplierId'])){
	echo "<script language=\"javascript\">window.location = 'logout.php'</script>";
}
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Welcome to Supplier Portal | My Profile</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/signature_pad.min.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/supplierFunctionality/supplierFunctionality.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body>
		<?php include('includes/header.php'); ?>
		<div id="profileSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot16">
			<h4 class="text-left">
				<b>
					<i class="fa fa-address-card"></i> 
					<span id="cms_638">My Profile</span>
				</b>
			</h4>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">
				<div id="supplierBasicData" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sectionBlock2 marBot20"></div>
				<h4>
					<b>
						<i class="fa fa fa-bank"></i> 
						<span id="cms_639">Financial Data</span>
					</b>
				</h4>
				<div class="sectionBlock2 marBot20">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_640" class="input-group-addon">Bank Name: </span>
								<input id="bankName" name="bankName" type="text" class="form-control" placeholder="Please Enter Bank Name" autocomplete="off" value="" rel="cms_641">
							</div>
						</div>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_642" class="input-group-addon">Account No: </span>
								<input id="accountNo" name="accountNo" type="text" class="form-control" placeholder="Please Enter Account No" autocomplete="off" value="" rel="cms_643">
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group marBot5">
							<span id="cms_644" class="input-group-addon">Bank Address: </span>
							<input id="bankAddress" name="bankAddress" type="text" class="form-control" placeholder="Please Enter Address" autocomplete="off" value="" rel="cms_645">
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="SWIFTSpan" class="input-group-addon">SWIFT: </span>
								<input id="SWIFT" name="SWIFT" type="text" class="form-control" placeholder="Please Enter SWIFT" autocomplete="off" value="" rel="cms_646">
							</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="supplierVatSpan" class="input-group-addon">VAT: </span>
								<input id="supplierVat" name="supplierVat" type="text" class="form-control" placeholder="Please Enter VAT" autocomplete="off" value="" rel="cms_647">
							</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="GSTINSpan" class="input-group-addon">GST: </span>
								<input id="GSTIN" name="GSTIN" type="text" class="form-control" placeholder="Please Enter GST" autocomplete="off" value="" rel="cms_648">
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="IECSpan" class="input-group-addon">IEC: </span>
								<input id="IEC" name="IEC" type="text" class="form-control" placeholder="Please Enter IEC" autocomplete="off" value="" rel="cms_649">
							</div>
						</div>
						<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="PANSpan" class="input-group-addon">PAN: </span>
								<input id="PAN" name="PAN" type="text" class="form-control" placeholder="Please Enter PAN" autocomplete="off" value="" rel="cms_650">
							</div>
						</div>
						<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
							<div class="input-group marBot5">
								<span id="REXSpan" class="input-group-addon">REX: </span>
								<input id="REX" name="REX" type="text" class="form-control" placeholder="Please Enter REX" autocomplete="off" value="" rel="cms_651">
							</div>
						</div>
						<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="ARNSpan" class="input-group-addon">ARN: </span>
								<input id="ARN" name="ARN" type="text" class="form-control" placeholder="Please Enter ARN" autocomplete="off" value="" rel="cms_652">
							</div>
						</div>
					</div>
				</div>
				<h4>
					<b>
						<i class="fa fa-google-wallet"></i>
						<span id="cms_654">Your Signature</span>
					</b>
				</h4>
				<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<div class="customerSignatureBlock pull-left marRig5 marBot5">
						<?php if (file_exists("../".UPLOADFOLDER."supplierSignature/SUPPLIER-SIGN_".intval($_SESSION['supplierId']).".jpeg")) {?>
							<img src="<?php echo SITEURL.UPLOADFOLDER."supplierSignature/SUPPLIER-SIGN_".intval($_SESSION['supplierId']).".jpeg"; ?>" alt="Signature" onerror="appCommonFunctionality.onImgError(this)">
							<div>
								<i class="fa fa-trash-o pull-left redText hover f24" onClick="supplierFunctionality.deleteSupplierSignature()"></i>
							</div>
						<?php } else { ?>	
							<img src="<?php echo SITEURL."assets/images/noImages.png"; ?>" alt="Signature">
						<?php } ?>
					</div>
					<input type="hidden" name="supplierSignBase64" id="supplierSignBase64" value="">
					<button type="button" class="btn btn-success marTop5" onClick="supplierFunctionality.openSupplierSignatureModal()" rel="cms_655">Capture Your Signature</button>
				</div>
				<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-left">
					<input id="supplierId" name="supplierId" type="hidden" value="<?php echo intval($_SESSION['supplierId']); ?>">
					<button type="submit" class="btn btn-success marTop5" rel="cms_653" onclick="supplierFunctionality.saveSupplier();">Save</button>
				</div>
			</div>
		</div>
		<!-- Signature Modal -->
		<div class="modal fade" id="signatureModal" role="dialog">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<h4 class="modal-title" id="cms_655">Capture Your Signature</h4>
					</div>
					<div id="signatureCanvas" class="modal-body">Loading...</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_656">Close</button>
						<button type="button" class="btn btn-success pull-right" onclick="supplierFunctionality.processSupplierSignature()" rel="cms_653">Save</button>
					</div>
				</div>
			</div>
		</div>
		<!-- Signature Modal -->
		<br clear="all">
		<?php include('includes/footer.php'); ?>
	</body>
</html>