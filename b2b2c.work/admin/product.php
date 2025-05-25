<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
$brandId=isset($_REQUEST['brandId'])?$_REQUEST['brandId']:0;
$categoryId=isset($_REQUEST['categoryId'])?$_REQUEST['categoryId']:0;

if(count($_POST))
{
	$selectedProductIds=isset($_REQUEST['selectedProductIds'])?$_REQUEST['selectedProductIds']:"";
	$selectedProductIdArr = explode(',',$selectedProductIds);
	$retailOfferPercent=isset($_REQUEST['retailOfferPercent'])?$_REQUEST['retailOfferPercent']:null;
	$retailOfferStartDate=isset($_REQUEST['retailOfferStartDate'])?$_REQUEST['retailOfferStartDate']:null;
	$retailOfferEndDate=isset($_REQUEST['retailOfferEndDate'])?$_REQUEST['retailOfferEndDate']:null;
	$wholeSaleOfferPercent=isset($_REQUEST['wholeSaleOfferPercent'])?$_REQUEST['wholeSaleOfferPercent']:null;
	$wholeSaleOfferStartDate=isset($_REQUEST['wholeSaleOfferStartDate'])?$_REQUEST['wholeSaleOfferStartDate']:null;
	$wholeSaleOfferEndDate=isset($_REQUEST['wholeSaleOfferEndDate'])?$_REQUEST['wholeSaleOfferEndDate']:null;
	
	/*echo "selectedProductIdArr : ".print_r($selectedProductIdArr)." <br>";
	echo "retailOfferPercent : ".$retailOfferPercent." <br> ";
	echo "retailOfferStartDate : ".$retailOfferStartDate." <br> ";
	echo "retailOfferEndDate : ".$retailOfferEndDate." <br> ";
	echo "wholeSaleOfferPercent : ".$wholeSaleOfferPercent." <br> ";
	echo "wholeSaleOfferStartDate : ".$wholeSaleOfferStartDate." <br> ";
	echo "wholeSaleOfferEndDate : ".$wholeSaleOfferEndDate;
	exit;*/
	
	for($i = 0; $i < COUNT($selectedProductIdArr); $i++){
		$product_combinations_sql = "SELECT `productId`,
									`productCombinationId`,
									`QRText` 
									FROM `productCombination` 
									WHERE `productId` = ".$selectedProductIdArr[$i];
		//echo $product_combinations_sql; exit;
		$product_combinations_sql_res = mysqli_query($dbConn, $product_combinations_sql);
		while($product_combinations_sql_res_fetch = mysqli_fetch_array($product_combinations_sql_res)){
			$rOfferSubQuery = "";
			$wOfferSubQuery = "";
			if($retailOfferStartDate != null && $retailOfferEndDate != null){
				$rOfferSubQuery = "AND ((`RofferStartDate` < ".$retailOfferStartDate.") OR (`RofferEndDate` > ".$retailOfferEndDate."))";
			}
			if($wholeSaleOfferStartDate != null && $wholeSaleOfferEndDate != null){
				$wOfferSubQuery = "AND ((`WofferStartDate` < ".$wholeSaleOfferStartDate.") OR (`WofferEndDate` > ".$wholeSaleOfferEndDate."))";
			}
			$product_offer_sql = "SELECT COUNT(`offerId`) AS `CNT` 
								  FROM `productOffer` 
								  WHERE `productId` = ".$selectedProductIdArr[$i]."
								  AND `productCombinationId` = ".$product_combinations_sql_res_fetch["productCombinationId"]."
								  ".$rOfferSubQuery."
								  ".$wOfferSubQuery;
			//echo $product_offer_sql; exit;
			$product_offer_sql_res = mysqli_query($dbConn, $product_offer_sql);
			$product_offer_sql_res_fetch = mysqli_fetch_array($product_offer_sql_res);
			if(intval($product_offer_sql_res_fetch["CNT"]) > 0){
				$sql_deleteProductOffer = "DELETE FROM productOffer 
										   WHERE `productId` = ".$selectedProductIdArr[$i]."
										   AND `productCombinationId` = ".$product_combinations_sql_res_fetch["productCombinationId"]."
										   ".$rOfferSubQuery."
										   ".$wOfferSubQuery;
				//echo $sql_deleteProductOffer; exit;
				$sql_deleteProductOffer_res = mysqli_query($dbConn, $sql_deleteProductOffer);
			}
			$sql_insertProductOffer = "INSERT INTO `productOffer` (
																	`offerId`, 
																	`productId`, 
																	`productCombinationId`, 
																	`QRText`, 
																	`RofferPercentage`, 
																	`RofferStartDate`, 
																	`RofferEndDate`, 
																	`WofferPercentage`, 
																	`WofferStartDate`, 
																	`WofferEndDate`, 
																	`status`
																) VALUES (
																	NULL, 
																	'".$selectedProductIdArr[$i]."', 
																	'".$product_combinations_sql_res_fetch["productCombinationId"]."',
																	'".$product_combinations_sql_res_fetch["QRText"]."',
																	'".$retailOfferPercent."',
																	'".$retailOfferStartDate."',
																	'".$retailOfferEndDate."',
																	'".$wholeSaleOfferPercent."',
																	'".$wholeSaleOfferStartDate."',
																	'".$wholeSaleOfferEndDate."',
																	'1'
																)";
			//echo $sql_insertProductOffer; exit;
			$sql_insertProductOffer_res = mysqli_query($dbConn, $sql_insertProductOffer);
		}
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		populateProductPreCompiledData($dbConn, intval($selectedProductIdArr[$i]));
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
	}
	
}

if($ACTION == "DELETE" && intval($_SESSION['userRoleid']) == 1){
	$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
	if(intval($productId) > 0){
		/*-----------------------------Deletion  from product images----------------------------*/
		$product_img_sql = "SELECT `productImages` FROM `product` WHERE `productId` = ".$productId;
		$product_img_sql_res = mysqli_query($dbConn, $product_img_sql);
		$product_img_sql_res_fetch = mysqli_fetch_array($product_img_sql_res);
		$productImageArr = explode(",",$product_img_sql_res_fetch["productImages"]);
		for($i = 0; $i < count($productImageArr); $i++){
			if($productImageArr[$i] != "" && $productImageArr[$i] != "noImages.png"){
				deleteFile($productImageArr[$i], "uploads/products/");
				deleteFile($productImageArr[$i], "uploads/products/64x64/");
			}
		}
		/*-----------------------------Deletion  from product images----------------------------*/
		
		/*-----------------------------Deletion from product Category---------------------------*/
		$sqlProductCatDel = "DELETE FROM `productCategory` WHERE `productCategory`.`productId` = ".$productId;
		//echo $sqlProductCatDel; exit;
		$sqlProductCatDel_res = mysqli_query($dbConn, $sqlProductCatDel);
		/*-----------------------------Deletion from product Category---------------------------*/
		
		/*-----------------------------Deletion from product Combinations-----------------------*/
		$sqlProductCombinationDel = "DELETE FROM `productCombination` WHERE `productCombination`.`productId` = ".$productId;
		//echo $sqlProductCombinationDel; exit;
		$sqlProductCombinationDel_res = mysqli_query($dbConn, $sqlProductCombinationDel);
		/*-----------------------------Deletion from product Combinations-----------------------*/
		
		/*-----------------------------Deletion from product Offers-----------------------------*/
		$sqlProductOfferDel = "DELETE FROM `productOffer` WHERE `productOffer`.`productId` = ".$productId;
		//echo $sqlProductOfferDel; exit;
		$sqlProductOfferDel_res = mysqli_query($dbConn, $sqlProductOfferDel);
		/*-----------------------------Deletion from product Offers-----------------------------*/
		
		/*-----------------------------Deletion from product Stock------------------------------*/
		$sqlProductStockDel = "DELETE FROM `productStock` WHERE `productStock`.`productId` = ".$productId;
		//echo $sqlProductStockDel; exit;
		$sqlProductStockDel_res = mysqli_query($dbConn, $sqlProductStockDel);
		/*-----------------------------Deletion from product Stock------------------------------*/
		
		/*-----------------------------Deletion  from product master----------------------------*/
		$sqlProductDelete = "DELETE FROM `product` WHERE `product`.`productId` = ".$productId;
		//echo $sqlProductDelete; exit;
		$sqlProductDelete_res = mysqli_query($dbConn, $sqlProductDelete);
		/*-----------------------------Deletion  from product master----------------------------*/
		
		/*-----------------------------Deletion perticuler product precompile data--------------*/
		deleteFile($productCode.".json", "api/preCompiledData/products/");
		/*-----------------------------Deletion perticuler product precompile data--------------*/
		
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
	}
	echo "<script language=\"javascript\">window.location = 'product.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Products</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/product.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="productSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<button id="enableProductSelectionBtn" type="button" class="btn btn-default btn-sm pull-left marRig5 marTop10" onClick="productFunctionality.enableProductSelection()"><i class="fa fa-check-square-o greenText"></i></button>
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_37">Products</span></b></h5>
					
					<button type="button" id="brochureBtn" class="btn btn-warning disabled pull-right marBot5" rel="cms_843" onClick="productFunctionality.generateBulkProductBrochure()">Brochure</button>
					<button type="button" id="bulkOfferBtn" class="btn btn-info disabled pull-right marRig5 marBot5" rel="cms_164" data-toggle="modal" data-target="#bulkOfferModal">Bulk Offer</button>
					<button type="button" class="btn btn-success pull-right marBot5 marRig5" rel="cms_38" onClick="productFunctionality.addProduct()">Add Product</button>
					<button type="button" class="btn btn-info pull-right marBot5 marRig5" rel="cms_39" data-toggle="modal" data-target="#productSearchModal">Search Products</button>
				</header>
				<div id="productTableHolder" class="w3-row-padding w3-margin-bottom scrollX"></div>
				<!-- QR Modal -->
				<div class="modal fade" id="QRModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="QRModalHeader" class="modal-title"> </h4>
							</div>
							<div id="QRCodeModalBody" class="modal-body centerSection">
							</div>
							<!--<div class="modal-footer">
								<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
							</div>-->
						</div>
					</div>
				</div>
				<!-- QR Modal -->
				<!-- Product Search Modal -->
				<div class="modal fade" id="productSearchModal" role="dialog">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_40" class="modal-title">Search Products</h4>
							</div>
							<div id="productSearchModalBody" class="modal-body minH234">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="searchBrandSpan" class="input-group-addon">
											<span id="cms_41">Product Keywords : </span>
										</span>
										<input id="productKeyword" name="productKeyword" type="text" class="form-control" placeholder="Type about product" autocomplete="off" value="" rel="cms_42" onkeypress="productFunctionality.productSearchCombinationQR(event)">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="searchBrandSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="searchBrandSpan" class="input-group-addon">
												<span id="cms_43">Search Brands : </span>
											</span>
											<input id="searchBrand" name="searchBrand" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_44" autocomplete="off" value="" onkeyup="productFunctionality.brandPredictiveSearch(this.value);">
											<span id="searchBrandIconSpan" class="input-group-addon">
												<span class="fa fa-search hover"></span>
											</span>
										</div>
										<div id="searchedBrands" class="searchedItemCollection hide">
										</div>
										<div id="selectedBrandItem" class="marBot5">
											<div id="cms_45">Selected Brand : </div>
											<div id="cms_46" class="selectedBrandItem"> No Brands selected yet</div>
										</div>
										<input id="brandId" name="brandId" type="hidden" value="<?php if($brandId != ""){ echo $brandId; }else{ echo "0"; }?>">
									</div>
									<div id="searchCatSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
										<div class="input-group marBot5">
											<span id="searchCatSpan" class="input-group-addon">
												<span id="cms_47">Search Category : </span>
											</span>
											<input id="searchCat" name="searchCat" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_44" autocomplete="off" value="" onkeyup="productFunctionality.categoryPredictiveSearch(this.value);">
											<span id="searchCatIconSpan" class="input-group-addon">
												<span class="fa fa-search hover"></span>
											</span>
										</div>
										<div id="searchedCats" class="searchedItemCollection hide">
										</div>
										<div>
											<div id="cms_48">Selected Categories : </div>
											<div id="selectedCatItem">
												<div id="cms_49" class="selectedBrandItem"> No categories selected yet</div>
											</div>
										</div>
										<input id="categoryIds" name="categoryIds" type="hidden" value="">
									</div>
								</div>
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div id="cms_50">Stock Volumn : </div>
										<div class="btn-group" role="group" aria-label="Basic example">
											<button id="stockVolIndicatorBtn_3" type="button" class="btn btn-success btn-secondary" onClick="productFunctionality.setStockVolIndicator(3)" rel="cms_51">Ample</button>
											<button id="stockVolIndicatorBtn_2" type="button" class="btn btn-warning btn-secondary" onClick="productFunctionality.setStockVolIndicator(2)" rel="cms_52">Sufficient</button>
											<button id="stockVolIndicatorBtn_1" type="button" class="btn btn-danger btn-secondary" onClick="productFunctionality.setStockVolIndicator(1)" rel="cms_53">Inadequate</button>
											<button id="stockVolIndicatorBtn_0" type="button" class="btn btn-light btn-secondary" onClick="productFunctionality.setStockVolIndicator(0)"><i class="fa fa-check"></i> <span id="cms_54">None</span></button>
										</div>
									</div>
									<div id="havingOfferSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
										<div id="cms_55">Having Offer : </div>
										<div class="btn-group" role="group" aria-label="Having Offer">
											<button id="havingOfferBtn_2" type="button" class="btn btn-success btn-secondary" onClick="productFunctionality.setHavingOffer(2)" rel="cms_56">Yes</button>
											<button id="havingOfferBtn_1" type="button" class="btn btn-danger btn-secondary" onClick="productFunctionality.setHavingOffer(1)" rel="57">No</button>
											<button id="havingOfferBtn_0" type="button" class="btn btn-light btn-secondary" onClick="productFunctionality.setHavingOffer(0)"><i class="fa fa-check"></i> <span id="cms_54">None</span></button>
										</div>
									</div>
								</div>
								<br clear="all">
							</div>
							<div class="modal-footer">
								<button id="productSearchResetBtn" type="button" class="btn btn-default pull-left" onClick="productFunctionality.searchFormReset()" rel="cms_58">Reset</button>
								<button id="productSearchSearchBtn" type="button" class="btn btn-success pull-right" onClick="productFunctionality.productSearch()" rel="cms_59">Search</button>
								<button type="button" class="btn btn-success pull-right" onclick="productFunctionality.getQRforSearch()">
									<i class="fa fa-barcode"></i>
									<i class="fa fa-qrcode"></i>
									<span id="cms_497">Scanner</span>
								</button>
								<div id="barcodeScannerHolder" class="pull-right marRig5 hide">
									<img src="../assets/images/barcodeScanner.gif" alt="barcodeScanner" class="w38">
								</div>
								<button type="button" class="btn btn-success pull-right" onclick="productFunctionality.openQrScannerCamera()">
									<i class="fa fa-camera"></i>
									<i class="fa fa-qrcode"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Product Search Modal -->
				<!-- Product Bulk Offer Modal -->
				<div class="modal fade" id="bulkOfferModal" role="dialog">
					<div class="modal-dialog modal-lg">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_166" class="modal-title">Generate Bulk Offers</h4>
							</div>
							<form id="bulkOfferModalForm" name="bulkOfferModalForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>">
								<div id="bulkOfferModalBody" class="modal-body minH234">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div id="retailOfferSection" class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly">
											<div class="input-group marBot5">
												<span id="retailOfferPercentSpan" class="input-group-addon">
													<span id="cms_167">Retail Offer Percentage : </span>
												</span>
												<input id="retailOfferPercent" name="retailOfferPercent" type="number" class="form-control" placeholder="%" step="0.1" autocomplete="off" value="0.0">
												<span id="OfferPercentIconSpan" class="input-group-addon">%</span>
											</div>
											<div class="input-group marBot5">
												<span id="startDateSpan" class="input-group-addon">
													<span id="cms_130">Start Date : </span>
												</span>
												<input id="retailOfferStartDate" name="retailOfferStartDate" type="date" min="2024-12-07" max="2025" class="form-control" autocomplete="off" value="">
											</div>
											<div class="input-group marBot5">
												<span id="endDateSpan" class="input-group-addon">
													<span id="cms_131">Expary Date : </span>
												</span>
												<input id="retailOfferEndDate" name="retailOfferEndDate" type="date" min="2024-12-07" max="2025" class="form-control" autocomplete="off" value="">
											</div>
										</div>
										<div id="wholeSaleOfferSection" class="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopaddingOnly">
											<div class="input-group marBot5">
												<span id="wholeSaleOfferPercentSpan" class="input-group-addon">
													<span id="cms_168">Wholesale Offer Percentage : </span>
												</span>
												<input id="wholeSaleOfferPercent" name="wholeSaleOfferPercent" type="number" class="form-control" placeholder="%" step="0.1" autocomplete="off" value="0.0">
												<span id="OfferPercentIconSpan" class="input-group-addon">%</span>
											</div>
											<div class="input-group marBot5">
												<span id="startDateSpan" class="input-group-addon">
													<span id="cms_130">Start Date : </span>
												</span>
												<input id="wholeSaleOfferStartDate" name="wholeSaleOfferStartDate" type="date" min="2024-12-07" max="2025" class="form-control" autocomplete="off" value="">
											</div>
											<div class="input-group marBot5">
												<span id="endDateSpan" class="input-group-addon">
													<span id="cms_131">Expary Date : </span>
												</span>
												<input id="wholeSaleOfferEndDate" name="wholeSaleOfferEndDate" type="date" min="2024-12-07" max="2025" class="form-control" autocomplete="off" value="">
											</div>
										</div>
									</div>
									<br clear="all">
								</div>
								<div class="modal-footer">
									<input id="selectedProductIds" name="selectedProductIds" type="hidden" value=''>
									<button id="productSearchResetBtn" type="button" class="btn btn-default pull-left" onClick="productFunctionality.bulkOfferModalFormReset()" rel="cms_58">Reset</button>
									<button id="productSearchSearchBtn" type="button" class="btn btn-success pull-right" onClick="productFunctionality.bulkOfferModalFormSubmit()" rel="cms_113">Submit</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<!-- Product Bulk Offer Modal -->
			</div>
			<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>