<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?intval($_REQUEST['productId']):0;
if(count($_POST)){
	if($productId > 0){
		$sourceProductCombinationId=isset($_REQUEST['sourceProductCombinationId'])?intval($_REQUEST['sourceProductCombinationId']):0;
		$destinationProductCombinationId=isset($_REQUEST['destinationProductCombinationId'])?intval($_REQUEST['destinationProductCombinationId']):0;
		
		/*echo "productId : ".$productId."<br>";
		echo "sourceProductCombinationId : ".$sourceProductCombinationId."<br>";
		echo "destinationProductCombinationId : ".$destinationProductCombinationId."<br>";
		exit;*/
		
		$sql_updateProductStockMapping = "UPDATE `productStock` 
		SET `productStock`.`productCombinationId` = ".$destinationProductCombinationId.", 
			`productStock`.`productCombinationQR` = (
				SELECT `productCombination`.`QRText` 
				FROM `productCombination` 
				WHERE `productCombination`.`productCombinationId` = ".$destinationProductCombinationId."
			) 
		WHERE `productStock`.`productCombinationId` = ".$sourceProductCombinationId;
		//echo $sql_updateProductStockMapping; exit;
		$sql_updateProductStockMapping_res = mysqli_query($dbConn, $sql_updateProductStockMapping);
		
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		updateLiveTime($dbConn, 'PRODUCTLIVESTOCK');
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		
		echo "<script language=\"javascript\">window.location = 'orphanStocksMapping.php?productId=".$productId."'</script>";exit;
	}
}else{
	if($productId > 0){
		$productSql = "SELECT `productCode` FROM `product` WHERE `productId` = ".$productId;
		//echo $productSql; exit;
		$productSql_res = mysqli_query($dbConn, $productSql);
		$productSql_res_fetch = mysqli_fetch_array($productSql_res);
		//print_r($productSql_res_fetch);exit;
		$productCode = $productSql_res_fetch["productCode"];
		
	}else{
		echo "<script language=\"javascript\">window.location = 'product.php'</script>";exit;
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Orphan Product Stocks Mapping</title>
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
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_409">Orphan Product Stocks Mapping</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php if($productId > 0){ include('includes/productProgressTab.php'); } ?>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="stockMappingDDL">
								<div id="stockMappingSourceOption" class="stockMappingOptionSelected">
									<span id="cms_410">Select an Orphan Product Stock</span>
								</div>
								<div id="stockMappingSourceOptionItem" class="stockMappingOptions">
									<?php 
									$sql_sourceStockMappingOptions = "SELECT COUNT(ps.`stockId`) AS 'PRODUCTCOUNT',
										   ps.`productCombinationId`,
										   ps.`productCombinationQR`
									FROM `productStock` ps
									LEFT JOIN `productCombination` pc
									ON ps.`productCombinationId` = pc.`productCombinationId` 
									AND ps.`productId` = pc.`productId`
									WHERE ps.`productId` = ".$productId."
									AND ps.status = 1
									AND pc.`productCombinationId` IS NULL
									GROUP BY ps.`productCombinationId`, ps.`productCombinationQR`";
									//echo $sql_sourceStockMappingOptions; exit;
									$sql_sourceStockMappingOptions_res = mysqli_query($dbConn, $sql_sourceStockMappingOptions);
									while($sql_sourceStockMappingOptions_res_fetch = mysqli_fetch_array($sql_sourceStockMappingOptions_res)){
									?>
									<div>
										<span>[<?php echo $sql_sourceStockMappingOptions_res_fetch["productCombinationId"]; ?>]</span> 
										<span class="qrText"><?php echo $sql_sourceStockMappingOptions_res_fetch["productCombinationQR"]; ?></span> 
										<span> - (<?php echo $sql_sourceStockMappingOptions_res_fetch["PRODUCTCOUNT"]; ?>) </span>
										<i class="fa fa-hand-o-right pull-right"></i> 
									</div>
									<?php } ?>
								</div>
							</div> 
						</div>
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="stockMappingDDL">
								<div id="stockMappingDestinationOption" class="stockMappingOptionSelected">
									<span id="cms_411">Select a working Product Stock</span>
								</div>
								<div id="stockMappingDestinationOptionItem" class="stockMappingOptions">
									<?php 
									$sql_destinationStockMappingOptions = "SELECT `productCombinationId`,`QRText` FROM `productCombination` WHERE `productId` = ".$productId;
									//echo $sql_destinationStockMappingOptions; exit;
									$sql_destinationStockMappingOptions_res = mysqli_query($dbConn, $sql_destinationStockMappingOptions);
									while($sql_destinationStockMappingOptions_res_fetch = mysqli_fetch_array($sql_destinationStockMappingOptions_res)){
									?>
									<div>
										<span>[<?php echo $sql_destinationStockMappingOptions_res_fetch["productCombinationId"]; ?>]</span> 
										<span class="qrText"><?php echo $sql_destinationStockMappingOptions_res_fetch["QRText"]; ?></sapn>
									</div>
									<?php } ?>
								</div>
							</div>  
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center marTop10">
						<form id="productStockMappingForm" name="productStockMappingForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.productStockMappingFormValidation();">
							<button type="submit" class="btn btn-success" rel="cms_113">Submit</button>
							<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
							<input id="sourceProductCombinationId" name="sourceProductCombinationId" type="hidden" value='0'>
							<input id="destinationProductCombinationId" name="destinationProductCombinationId" type="hidden" value='0'>
						</form>
						<input id="productCode" name="productCode" type="hidden" value='<?php if($productId > 0){ echo $productCode; } ?>'>
						<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php if($productId > 0){ echo readProductPreCompiledData($productCode); } ?>'>
						<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
					</div>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>