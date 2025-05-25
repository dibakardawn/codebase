<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "PURCHASEORDER";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Purchase Order Entry</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/purchaseOrder.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="purchaseOrderSectionHolder">
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if (isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_517">Purchase Order Entry</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group input-group-md marBot5 pull-right">
							<span id="cms_518" class="input-group-addon">Search Supplier : </span>
							<input id="supplierSearch" name="supplierSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_519">
							<span class="input-group-addon">
								<i id="supplierGroupAddonIcon" class="fa fa-search hover"></i>
							</span>
						</div>
					</div>
					<div id="supplierSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					<div id="selectedSupplierTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
						<b id="cms_520">Selected Supplier : </b>
					</div>
					<div id="selectedSupplierSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
					<div id="purchaseOrderControlButtonHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop10 hide">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<div id="productScannerErr" class="pull-left f16 redText"></div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<button type="button" class="btn btn-success pull-right marBot5 marRig5" rel="cms_521" onclick="purchaseOrderFunctionality.openProductSearchModal()">Add Product Manually</button>
							<button id="addProductQRScannerCam" type="button" class="btn btn-success pull-right marBot5 marRig5" onClick="purchaseOrderFunctionality.openQrScannerCamera()">
								<i class="fa fa-camera"></i>
								<span id="cms_522">QR Scanner Camera</span>
							</button>
							<button type="button" class="btn btn-success pull-right marBot5 marRig5" onClick="purchaseOrderFunctionality.scannerGun()">
								<i class="fa fa-barcode"></i>
								<i class="fa fa-qrcode"></i>
								<span id="cms_523">Scanner</span>
							</button>
							<div id="barcodeScannerHolder" class="pull-right marRig5 hide">
								<img src="../assets/images/barcodeScanner.gif" alt="barcodeScanner" class="w38"><br>
								<input id="scannerGunData" name="scannerGunData" type="text" class="pull-right scannerDataInput w3-light-grey" value="" autocomplete="off" onfocus="purchaseOrderFunctionality.scannerGunDataInputFocus()" onblur="purchaseOrderFunctionality.scannerGunDataInputFocusOut()">
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 nopaddingOnly">
							<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							</div>
							<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right hide">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_524">Total Before Tax</span> : <span id="totalBeforeTax"></span>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_525">Tax</span> : <span id="taxP"></span> %
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<span id="cms_526">Total</span> : <span id="totalPrice"></span>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 nopaddingOnly">
									</div>
									<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group">
											<span id="deliveryDateSpan" class="input-group-addon">
												<span id="cms_528">Expected Delivery Date</span>
											</span>
											<input id="deliveryDate" name="deliveryDate" type="date" class="form-control" autocomplete="off" value="<?php echo date('Y-m-d'); ?>" onchange="purchaseOrderFunctionality.onchangeDeliveryDate()">
										</div>
									</div>
								</div>
							</div>
						</div>
						<div id="clauseSection" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 noRightPaddingOnly hide">
							<div>
								<b id="cms_555">Clauses : </b>
								<i class="fa fa-plus marleft5 greenText hover" onclick="purchaseOrderFunctionality.openClauseModal()"></i>
							</div>
							<div id="clauseHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="tncSection" class="col-lg-8 col-md-8 col-sm-12 col-xs-12 nopaddingOnly hide">
							<h5>
								<b id="cms_556">Terms & Conditions : </b>
								<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="purchaseOrderFunctionality.editTnc()"></i>
							</h5>
							<div>
								<div id="tncHTML" class="f12"></div>
								<div id="tncTextAreaSection" class="text-center hide">
									<textarea id="tncTextArea" name="tncTextArea" class="tncText"></textarea>
									<button type="button" class="btn btn-success btn-xs marTop5" onclick="purchaseOrderFunctionality.updateTncHTML()" rel="cms_557">Update T&C</button>
								</div>
							</div>
						</div>
						<div id="signSection" class="col-lg-4 col-md-4 col-sm-12 col-xs-12 noRightPaddingOnly hide">
							<h5>
								<b id="cms_560">Signature : </b>
							</h5>
							<img src="<?php echo SITEURL; ?>assets/images/sign.png" alt="signature" class="productImageBlock5 w100p">
						</div>
					</div>
					<div id="placeOrderBtnSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center marTop5 hide">
						<button id="placePurchaseOrderBtn" type="button" class="btn btn-success marleft5 marTop5" disabled onClick="purchaseOrderFunctionality.placePurchaseOrder()" rel="cms_527">Submit Purchase Order</button>
					</div>
				</div>
				<!-- Product Search Modal -->
				<div class="modal fade" id="productSearchModal" role="dialog">
					<div class="modal-dialog w96p">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_529" class="modal-title">Search Products</h4>
							</div>
							<div id="productSearchModalBody" class="modal-body minH234 maxH75P scrollY">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="searchBrandSpan" class="input-group-addon">
											<span id="cms_530">Product Keywords : </span>
										</span>
										<input id="productKeyword" name="productKeyword" type="text" class="form-control" placeholder="Type about product" autocomplete="off" value="" rel="cms_532">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="searchBrandSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="searchBrandSpan" class="input-group-addon">
												<span id="cms_531">Search Brands : </span>
											</span>
											<input id="searchBrand" name="searchBrand" type="text" class="form-control" placeholder="Search atleast 3 Characters..." rel="cms_519" autocomplete="off" value="" onkeyup="purchaseOrderFunctionality.brandPredictiveSearch(this.value);">
											<span id="searchBrandIconSpan" class="input-group-addon">
												<span class="fa fa-search hover"></span>
											</span>
										</div>
										<div id="searchedBrands" class="searchedItemCollection hide">
										</div>
										<div id="selectedBrandItem" class="marBot5">
											<div id="cms_533">Selected Brand : </div>
											<div id="cms_534" class="selectedBrandItem"> No Brands selected yet</div>
										</div>
										<input id="brandId" name="brandId" type="hidden" value="0">
									</div>
									<div id="searchCatSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
										<div class="input-group marBot5">
											<span id="searchCatSpan" class="input-group-addon">
												<span id="cms_535">Search Category : </span>
											</span>
											<input id="searchCat" name="searchCat" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_519" autocomplete="off" value="" onkeyup="purchaseOrderFunctionality.categoryPredictiveSearch(this.value);">
											<span id="searchCatIconSpan" class="input-group-addon">
												<span class="fa fa-search hover"></span>
											</span>
										</div>
										<div id="searchedCats" class="searchedItemCollection hide">
										</div>
										<div>
											<div id="cms_536">Selected Categories : </div>
											<div id="selectedCatItem">
												<div id="cms_537" class="selectedBrandItem"> No categories selected yet</div>
											</div>
										</div>
										<input id="categoryIds" name="categoryIds" type="hidden" value="">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<button id="productSearchResetBtn" type="button" class="btn btn-default pull-left marTop3" onClick="purchaseOrderFunctionality.searchFormReset()" rel="cms_538">Reset</button>
									<button id="productSearchSearchBtn" type="button" class="btn btn-success pull-right marTop3" onClick="purchaseOrderFunctionality.productSearch()" rel="cms_539">Search</button>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<hr>
								</div>
								<div id="seachedProductTable" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								</div>
								<div id="productCombinationSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<button type="button" class="btn btn-info btn-xs pull-left" onClick="purchaseOrderFunctionality.backToSearchedProductTable()">
											<i class="fa fa-angle-left"></i> 
											<span id="cms_540">Back</span>
										</button>
									</div>
									<div id="productCombinations" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									</div>
								</div>
								<div id="selectedProductCombinationHeader" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
									<span id="cms_541">Selected Product Combinations</span>
								</div>
								<div id="selectedProductCombinations" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgGrey roundedBorder hide">
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button id="addToCartBtn" type="button" class="btn btn-success" disabled="disabled" data-dismiss="modal" onClick="purchaseOrderFunctionality.populateCart()" rel="cms_542">Add to Cart</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Product Search Modal -->
				<!-- Purchase Order Clause Modal -->
				<div class="modal fade" id="purchaseOrderClauseModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 class="modal-title" id="cms_558">Add Clause</h4>
							</div>
							<div class="modal-body">
								<textarea id="clauseTextArea" name="clauseTextArea" rows="4" class="w100p f12"></textarea>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-success" data-dismiss="modal" rel="cms_559" onClick="purchaseOrderFunctionality.addClause()">Save</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Purchase Order Clause Modal -->
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="selectedSupplierId" name="selectedSupplierId" type="hidden" value='0'>
					<input id="purchaseOrderId" name="purchaseOrderId" type="hidden" value='0'>
				</div>
			</div>
			<br>
			<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			<input id="tncData" name="tncData" type="hidden" value='<?php echo readPreCompliedData("TNC"); ?>'>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>