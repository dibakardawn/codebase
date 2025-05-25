<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$brandId=isset($_REQUEST['brandId'])?intval($_REQUEST['brandId']):0;
$productId=isset($_REQUEST['productId'])?intval($_REQUEST['productId']):0;
if($productId > 0){
	$productSql = "SELECT `productCode` FROM `product` WHERE `productId` = ".$productId;
	//echo $productSql; exit;
	$productSql_res = mysqli_query($dbConn, $productSql);
	$productSql_res_fetch = mysqli_fetch_array($productSql_res);
	//print_r($productSql_res_fetch);exit;
	$productCode = $productSql_res_fetch["productCode"];
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Stock</title>
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
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_60">Product Stock</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php if($productId > 0){ include('includes/productProgressTab.php'); } ?>
					<?php if($productId == 0){ ?>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<h5 id="cms_61">Search Product Stocks : </h5>
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
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
							<button type="button" class="btn btn-success marRig5" onclick="productFunctionality.searchProductStocks()">
								<span class="glyphicon glyphicon-search"></span> 
								<span id="cms_59">Search</span>
							</button>
							<button type="button" class="btn btn-success" onclick="productFunctionality.openQrScannerCamera()">
									<i class="fa fa-camera"></i>
									<i class="fa fa-qrcode"></i>
								</button>
							<button type="button" class="btn btn-success" onclick="productFunctionality.focusOnScannerInput()">
								<i class="fa fa-barcode"></i>
								<i class="fa fa-qrcode"></i>
								<span id="cms_62">Scan</span>
							</button>
							<div id="barcodeScannerHolder" class="marRig5 hide">
								<img src="../assets/images/barcodeScanner.gif" alt="barcodeScanner" class="w38">
							</div>
							<input id="scannerGunData" name="scannerGunData" type="text" class="pull-right scannerDataInput w3-light-grey" value="" onfocus="productFunctionality.scannerGunDataInputFocus()" onblur="productFunctionality.scannerGunDataInputFocusOut()">
						</div>
					</div>
					<?php } ?>
					<!---------------------------------------This is for Product Stock Module----------------------------------->
					<?php if($productId == 0){ ?>
						<div id="sarchedProductStockTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
						<div id="defaultResultDeclaration" class="hide">
							<span id="cms_414">By default, the search results display only the latest 5 products.</span>
						</div>
					<?php } ?>
					<!---------------------------------------This is for Product Stock Module----------------------------------->
					<!---------------------------------------This is for Product Module----------------------------------------->
					<?php if($productId > 0){ ?>
						<?php
						$sql_orphanStock = "SELECT COUNT(DISTINCT ps.`stockId`) AS 'orphanStockCount'
						FROM `productStock` ps
						LEFT JOIN `productCombination` pc
						ON ps.`productCombinationId` = pc.`productCombinationId` 
						AND ps.`productId` = pc.`productId`
						WHERE ps.`productId` = ".$productId." 
						AND ps.status = 1
						AND pc.`productCombinationId` IS NULL";
						//echo $sql_orphanStock; exit;
						$sql_orphanStock_res = mysqli_query($dbConn, $sql_orphanStock);
						$sql_orphanStock_res_fetch = mysqli_fetch_array($sql_orphanStock_res);
						$orphanStockCount = $sql_orphanStock_res_fetch["orphanStockCount"];
						//echo $orphanStockCount;exit;
						if($orphanStockCount > 0){
						?>
							<h5 class="redText">
								<span id="cms_406">We found </span>
								<?php echo $orphanStockCount; ?> 
								<span id="cms_407">orphan stocks for this product.</span>
								<button type="button" class="btn btn-primary btn-xs" rel="cms_408" onclick="productFunctionality.goToOrphanStocksMapping()">Map stocks</button>
							</h5>
						<?php } ?>
						<div id="productPriceMatrixTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
						
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
							<input id="productCode" name="productCode" type="hidden" value='<?php if($productId > 0){ echo $productCode; } ?>'>
							<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php if($productId > 0){ echo readProductPreCompiledData($productCode); } ?>'>
						</div>
					<?php } ?>
					<!---------------------------------------This is for Product Module----------------------------------------->
				</div>
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
			</div>
			<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>