<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "SALEORDER";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Sale Order Entry</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/saleOrder.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="saleOrderSectionHolder">
				<header class="w3-container" style="padding-top:10px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if (isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_311">Sale Order Entry</span>
						</b>
					</h5>
					
					<button type="button" class="btn btn-info pull-right marBot5 marRig5" rel="cms_318" onClick="saleOrderFunctionality.mapCoCOrder()">CoC Order</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group input-group-md marBot5 pull-right">
							<span id="cms_312" class="input-group-addon">Search Customer : </span>
							<input id="customerSearch" name="customerSearch" type="text" class="form-control" placeholder="Please enter at least 3 Characters..." autocomplete="off" value="" rel="cms_313">
							<span class="input-group-addon">
								<i id="customerGroupAddonIcon" class="fa fa-search hover"></i>
							</span>
						</div>
					</div>
					<div id="customerSearchResult" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					<div id="selectedCustomerTitle" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
						<b id="cms_317">Selected Customer : </b>
						<i id="tempCustomerDataEditBtn" class="fa fa-pencil-square-o marleft5 greenText hover hide" onclick="saleOrderFunctionality.openTempCustomerDataModal()"></i>
					</div>
					<div id="selectedCustomerSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
					<div id="customerDeliveryAddressTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					</div>
					<div id="saleOrderControlButtonHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop10 hide">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<b id="typeOfOrder" class="pull-left f16 blueText"></b>
							<div id="productScannerErr" class="pull-left f16 redText"></div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<button type="button" class="btn btn-success pull-right marBot5 marRig5" rel="cms_319" onclick="saleOrderFunctionality.openProductSearchModal()">Add Product Manually</button>
							<button id="addProductQRScannerCam" type="button" class="btn btn-success pull-right marBot5 marRig5" onClick="saleOrderFunctionality.openQrScannerCamera()">
								<i class="fa fa-camera"></i>
								<span id="cms_320">QR Scanner Camera</span>
							</button>
							<button type="button" class="btn btn-success pull-right marBot5 marRig5" onClick="saleOrderFunctionality.scannerGun()">
								<i class="fa fa-barcode"></i>
								<i class="fa fa-qrcode"></i>
								<span id="cms_321">Scanner</span>
							</button>
							<div id="barcodeScannerHolder" class="pull-right marRig5 hide">
								<img src="../assets/images/barcodeScanner.gif" alt="barcodeScanner" class="w38">
							</div>
						</div>
					</div>
					<div id="cartTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
					</div>
					<div id="totalCalcSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-right hide">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<span id="cms_331">Total Before Tax</span> : <span id="totalBeforeTax"></span>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<span id="cms_710">Packing Cost</span> : <span id="packingCost"></span>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group input-group-sm pull-right w180">
								<span id="cms_725" class="input-group-addon">Special Discount</span>
								<input id="specialDiscount" name="specialDiscount" type="number" class="form-control" value="0.00" min="0" onkeyup="saleOrderFunctionality.specialDiscountKeyup()">
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<span id="cms_332">Tax</span> : <span id="taxP"></span> %
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<span id="cms_333">Total</span> : <span id="totalPrice"></span>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-9 col-md-9 col-sm-12 col-xs-12 nopaddingOnly">
							</div>
							<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 nopaddingOnly">
								<button id="placeOrderBtn" type="button" class="btn btn-success pull-right marleft5" disabled onClick="saleOrderFunctionality.placeOrder()" rel="cms_352">Submit Order</button>
								<div class="input-group">
									<span id="deliveryDateSpan" class="input-group-addon">
										<span id="cms_353">Delivery Date</span>
									</span>
									<input id="deliveryDate" name="deliveryDate" type="date" class="form-control" autocomplete="off" value="<?php echo date('Y-m-d'); ?>">
								</div>
							</div>
						</div>
					</div>
				</div>
				<!-- Product Search Modal -->
				<div class="modal fade" id="productSearchModal" role="dialog">
					<div class="modal-dialog w96p">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_334" class="modal-title">Search Products</h4>
							</div>
							<div id="productSearchModalBody" class="modal-body minH234 maxH75P scrollY">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="searchBrandSpan" class="input-group-addon">
											<span id="cms_335">Product Keywords : </span>
										</span>
										<input id="productKeyword" name="productKeyword" type="text" class="form-control" placeholder="Type about product" autocomplete="off" value="" rel="cms_336">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="searchBrandSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="searchBrandSpan" class="input-group-addon">
												<span id="cms_337">Search Brands : </span>
											</span>
											<input id="searchBrand" name="searchBrand" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_338" autocomplete="off" value="" onkeyup="saleOrderFunctionality.brandPredictiveSearch(this.value);">
											<span id="searchBrandIconSpan" class="input-group-addon">
												<span class="fa fa-search hover"></span>
											</span>
										</div>
										<div id="searchedBrands" class="searchedItemCollection hide">
										</div>
										<div id="selectedBrandItem" class="marBot5">
											<div id="cms_339">Selected Brand : </div>
											<div id="cms_340" class="selectedBrandItem"> No Brands selected yet</div>
										</div>
										<input id="brandId" name="brandId" type="hidden" value="0">
									</div>
									<div id="searchCatSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
										<div class="input-group marBot5">
											<span id="searchCatSpan" class="input-group-addon">
												<span id="cms_341">Search Category : </span>
											</span>
											<input id="searchCat" name="searchCat" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_338" autocomplete="off" value="" onkeyup="saleOrderFunctionality.categoryPredictiveSearch(this.value);">
											<span id="searchCatIconSpan" class="input-group-addon">
												<span class="fa fa-search hover"></span>
											</span>
										</div>
										<div id="searchedCats" class="searchedItemCollection hide">
										</div>
										<div>
											<div id="cms_342">Selected Categories : </div>
											<div id="selectedCatItem">
												<div id="cms_343" class="selectedBrandItem"> No categories selected yet</div>
											</div>
										</div>
										<input id="categoryIds" name="categoryIds" type="hidden" value="">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<button id="productSearchResetBtn" type="button" class="btn btn-default pull-left marTop3" onClick="saleOrderFunctionality.searchFormReset()" rel="cms_309">Reset</button>
									<button id="productSearchSearchBtn" type="button" class="btn btn-success pull-right marTop3" onClick="saleOrderFunctionality.productSearch()" rel="cms_310">Search</button>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<hr>
								</div>
								<div id="seachedProductTable" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								</div>
								<div id="productCombinationSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<button type="button" class="btn btn-info btn-xs pull-left" onClick="saleOrderFunctionality.backToSearchedProductTable()">
											<i class="fa fa-angle-left"></i> 
											<span id="cms_347">Back</span>
										</button>
									</div>
									<div id="productCombinations" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									</div>
								</div>
								<div id="selectedProductCombinationHeader" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
									<span id="cms_348">Selected Product Combinations</span>
								</div>
								<div id="selectedProductCombinations" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 bgGrey roundedBorder hide">
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button id="addToCartBtn" type="button" class="btn btn-success" disabled="disabled" data-dismiss="modal" onClick="saleOrderFunctionality.populateCart()" rel="cms_350">Add to Cart</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Product Search Modal -->
				<!-- Edit Price Modal -->
				<div class="modal fade" id="editPriceModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_775" class="modal-title">Edit Product Price</h4>
							</div>
							<div id="editPriceModalBody" class="modal-body">
								<div class="input-group input-group-md">
									<span class="input-group-addon">Product Price</span>
									<input type="number" id="alteredProductPrice" name="alteredProductPrice" value="0" step="1" min="0" autocomplete="off" class="w160">
								</div>
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_572">Close</button>
								<button type="button" class="btn btn-success pull-right" rel="cms_776" onclick="saleOrderFunctionality.saveAlteredProductPrice()">Save</button>
								<input id="productId" name="productId" type="hidden" value='0'>
								<input id="productCombinationId" name="productCombinationId" type="hidden" value='0'>
							</div>
						</div>
					</div>
				</div>
				<!-- Edit Price Modal -->
				<!-- Edit Temp Customer Data Modal -->
				<div class="modal fade" id="editTempCustomerDataModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h7 id="cms_951" class="modal-title">Edit Temporary Customer Data</h7>
							</div>
							<div id="editTempCustomerDataModalBody" class="modal-body">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span id="cms_952" class="input-group-addon">Name : </span>
										<input type="text" id="custName" name="custName" class="form-control" autocomplete="off" value="" placeHolder="Please enter Name" rel="cms_953">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span id="cms_954" class="input-group-addon">Phone : </span>
										<input type="text" id="custPhone" name="custPhone" class="form-control" autocomplete="off" value="" placeHolder="Please enter valid Phone" rel="cms_955">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
									<div class="input-group input-group-md">
										<span id="cms_956" class="input-group-addon">Email : </span>
										<input type="text" id="custEmail" name="custEmail" class="form-control" autocomplete="off" value="" placeHolder="Please enter valid Email" rel="cms_957">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5 f10 redText">
									<i class="fa fa-info-circle"></i> 
									<span id="cms_958">This information is not related to customer registration. It will only appear on the invoice for this specific order and will not be stored as customer data.</span>
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_572">Close</button>
								<button type="button" class="btn btn-success pull-right" rel="cms_776" onclick="saleOrderFunctionality.saveTempCustomerData()">Save</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Edit Temp Customer Data Modal -->
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<input id="selectedCustomerId" name="selectedCustomerId" type="hidden" value='0'>
					<input id="selectedCustomerGrade" name="selectedCustomerGrade" type="hidden" value=''>
					<input id="selectedCustomerDeliveryAddressId" name="selectedCustomerDeliveryAddressId" type="hidden" value='0'>
					<input id="cartOrder" name="cartOrder" type="hidden" value='{}'>
					<input id="orderId" name="orderId" type="hidden" value='0'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<br>
			<input id="scannerGunData" name="scannerGunData" type="text" class="pull-right scannerDataInput w3-light-grey" value="" autocomplete="off" onfocus="saleOrderFunctionality.scannerGunDataInputFocus()" onblur="saleOrderFunctionality.scannerGunDataInputFocusOut()">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>