<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SUPPLIER";

$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
//echo $supplierId; exit;
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Supplier Details</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon" />
		<link rel="icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminW3.css">
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminStyle.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/plugins/signature_pad.min.js'></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/supplier.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="supplierSectionHolder">
				<div class="w3-row-padding w3-margin-bottom marTop22">
					<h5>
						<b><i class="fa fa-users"></i></b>
						<b id="cms_453">Supplier Data</b>
					</h5>
					<div id="supplierBasicData" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sectionBlock2 marBot20"></div>
					<h5>
						<b><i class="fa fa-bank"></i></b>
						<b id="cms_467">Financial Data</b>
					</h5>
					<div id="supplierFinancialData" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sectionBlock2 marBot20"></div>
					<h5>
						<b><i class="fa fa-google-wallet"></i></b>
						<b id="cms_487">Supplier Signature</b>
					</h5>
					<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="customerSignatureBlock pull-left marRig5 marBot5">
							<?php if (file_exists("../".UPLOADFOLDER."supplierSignature/SUPPLIER-SIGN_".$supplierId.".jpeg")) {?>
								<img src="<?php echo SITEURL.UPLOADFOLDER."supplierSignature/SUPPLIER-SIGN_".$supplierId.".jpeg"; ?>" alt="Signature" onerror="appCommonFunctionality.onImgError(this)">
								<div>
									<i class="fa fa-trash-o pull-left redText hover f24" onClick="supplierFunctionality.deleteSupplierSignature()"></i>
								</div>
							<?php } else { ?>	
								<img src="<?php echo SITEURL."assets/images/noImages.png"; ?>" alt="Signature">
							<?php } ?>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
						<button type="button" class="btn btn-success pull-left marRig5 marBot3" onClick="supplierFunctionality.editSupplier()"rel="cms_488">Edit Supplier Data</button>
						<button type="button" class="btn btn-success pull-left marRig5 marBot3" onClick="supplierFunctionality.openSupplierSignatureModal()" rel="cms_489">Capture Supplier Signature</button>
						<button type="button" class="btn btn-success pull-left marRig5 marBot3" onClick="supplierFunctionality.gotoSupplier()" rel="cms_490">List of Suppliers</button>
						
						<button type="button" class="btn btn-info pull-right marRig5 marBot3" onClick="supplierFunctionality.createPurchaseOrder()" rel="cms_873">Create Purchase Order</button>
						<button type="button" class="btn btn-info pull-right marRig5 marBot3" onClick="supplierFunctionality.searchPurchaseOrder()" rel="cms_874">Search Purchase Order</button>
						<input type="hidden" name="supplierSignBase64" id="supplierSignBase64" value="">
					</div>
				</div>
			</div>
			<!-- Signature Modal -->
			<div class="modal fade" id="signatureModal" role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">&times;</button>
							<h4 class="modal-title" id="cms_489">Capture Supplier Signature</h4>
						</div>
						<div id="signatureCanvas" class="modal-body">Loading...</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_491">Close</button>
							<button type="button" class="btn btn-default pull-right w3-green" onclick="supplierFunctionality.processSupplierSignature()" rel="cms_481">Save</button>
						</div>
					</div>
				</div>
			</div>
			<!-- Signature Modal -->
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>