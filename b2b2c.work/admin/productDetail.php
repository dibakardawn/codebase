<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
//echo $productId; exit;

if(intval($productId) > 0){
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "CHANGEPRODUCTSTATUS"){
		$productStatusSql = "UPDATE `product` SET `Status` = IF(`Status` = 1, 0, 1) WHERE `productId` = ".$productId;
		//echo $productStatusSql; exit;
		$productStatusSql_res = mysqli_query($dbConn, $productStatusSql);
		/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Offers-----------------------*/
		echo "<script language=\"javascript\">window.location = 'product.php'</script>";exit;
	}
	
	$productSql = "SELECT `productCode` FROM `product` WHERE `productId` = ".$productId;
	//echo $productSql; exit;
	$productSql_res = mysqli_query($dbConn, $productSql);
	$productSql_res_fetch = mysqli_fetch_array($productSql_res);
	//print_r($productSql_res_fetch);exit;
	$productCode = $productSql_res_fetch["productCode"];
}else{
	echo "<script language=\"javascript\">window.location = 'product.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Details</title>
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
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_71">Product Details</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/productProgressTab.php'); ?>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<?php 
						$sql_prev_product = "SELECT `productId` FROM `product` WHERE `productId` < ".$productId." ORDER BY `productId` DESC LIMIT 1";
						$sql_prev_product_res = mysqli_query($dbConn, $sql_prev_product);
						if(mysqli_num_rows($sql_prev_product_res) > 0){
							$sql_prev_product_res_fetch = mysqli_fetch_array($sql_prev_product_res);
							?>
							<a href="productDetail.php?productId=<?php echo $sql_prev_product_res_fetch["productId"]; ?>"><i class="fa fa-toggle-left pull-left marTop5"></i></a>
							<?php 
						} 
						?>
						<b id="cms_75">Title :</b>
						<span id="productTitle"></span>
						<span id="productStatus"></span>
						<b id="cms_96">Brand : </b>
						<span id="productBrand"></span>
						<button type="button" class="btn btn-success btn-xs marleft10" onclick="productFunctionality.gotoBrochure(appCommonFunctionality.getUrlParameter('productId'))" rel="cms_843">Brochure</button>
						<?php 
						$sql_next_product = "SELECT `productId` FROM `product` WHERE `productId` > ".$productId." ORDER BY `productId` ASC LIMIT 1";
						$sql_next_product_res = mysqli_query($dbConn, $sql_next_product);
						if(mysqli_num_rows($sql_next_product_res) > 0){
							$sql_next_product_res_fetch = mysqli_fetch_array($sql_next_product_res);
							?>
							<a href="productDetail.php?productId=<?php echo $sql_next_product_res_fetch["productId"]; ?>"><i class="fa fa-toggle-right pull-right"></i></a>
							<?php 
						} 
						?>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<b id="cms_97">Production Link :</b> 
						<span id="productionLink"></span>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_77">Description : </b></div>
					<div id="productDescActual" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<b id="cms_65">Product Images </b> : 
							<i class="fa fa-pencil-square-o greenText hover" onclick="productFunctionality.gotoProductImage(appCommonFunctionality.getUrlParameter('productId'))"></i>
							<button type="button" class="btn btn-success btn-xs marleft10 marBot5" onclick="productFunctionality.gotoArrangeProductImages(appCommonFunctionality.getUrlParameter('productId'))" rel="cms_93">Arrange Images</button><br>
						</div>
						<div id="productImageBlockHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="productQRCodeBlock" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
						<div class="col-lg-9 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<b id="cms_98">Product Category : </b>
							</div>
							<div id="productCategoryHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<b id="cms_99">Product Combinations : </b>
					</div>
					<div id="productPriceMatrixTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"><span id="cms_100">No data</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_80">Meta Keywords : </b><span id="productMetaKeyWords"></span></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_82">Meta Description : </b><span id="productMetaDesc"></span></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_101">Created Date : </b> <span id="productCreatedDate"></span></div>
						<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_102">Last Modified Date : </b> <span id="productLastModifiedDate"></span></div>
						<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_84">Minimum Stock Volume : </b><span id="productMinStockVal"></span></div>
						<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_103">Status : </b><span id="productStatusText"></span></div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
						<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
						<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
						<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php if($productId > 0){ echo readProductPreCompiledData($productCode); } ?>'>
						<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
						<button type="button" class="btn btn-success pull-right" onClick="productFunctionality.goToProducts()" rel="cms_104">List of Products</button>
						<button type="button" class="btn btn-success pull-Left" onClick="productFunctionality.createDuplicateProduct()" rel="cms_105">Create a duplicate Product</button>
					</div>
					<!-- QR Modal -->
					<div class="modal fade" id="QRModal" role="dialog">
						<div class="modal-dialog modal-sm">
							<!-- Modal content-->
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
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>