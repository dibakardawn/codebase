<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
//echo $productId; exit;

if(count($_POST)){
	if(intval($productId) > 0){
		$productCode=isset($_REQUEST['productCode'])?$_REQUEST['productCode']:"";
		//echo $productCode; exit;
		$productPriceMatrixData = isset($_REQUEST['productPriceMatrixData'])?$_REQUEST['productPriceMatrixData']:[];
		//echo json_encode($productPriceMatrixData, JSON_PRETTY_PRINT); exit;
		$productPriceMatrixDataDecoded = json_decode($productPriceMatrixData,true);
		
		/*-----------------------------------Delete Existing Product Combinations--------------*/
		$sql_deleteProductCombination = "DELETE FROM productCombination WHERE `productCombination`.`productId` = ".$productId;
		//echo $sql_deleteProductCombination;exit;
		$sql_deleteProductCombination_res = mysqli_query($dbConn, $sql_deleteProductCombination);
		/*-----------------------------------Delete Existing Product Combinations--------------*/

		/*-----------------------------------Insert Product Combinations-----------------------*/
		$count = 0;
		foreach ($productPriceMatrixDataDecoded as $combinations) {
			/*-----At first time add it is coming as 'combination', In second time it is coming as 'featureCombination'-----------*/
			$combinationJson = "{}";
			if(isset($combinations['combination'])){
				$combinationJson = $combinations['combination'];
			}else{
				$combinationJson = $combinations['featureCombination'];
			}
			//echo $combinationJson; exit;
			/*-----At first time add it is coming as 'combination', In second time it is coming as 'featureCombination'-----------*/
			$sql_productCombination = "INSERT INTO `productCombination` (
																			`productCombinationId`, 
																			`QRText`, 
																			`featureCombination`, 
																			`RPrice`, 
																			`WPrice`, 
																			`PPrice`, 
																			`productId`
																		) 
																VALUES (
																			NULL, 
																			'".$combinations['QRText']."',  
																			'".json_encode($combinationJson)."', 
																			'".$combinations['RPrice']."', 
																			'".$combinations['WPrice']."', 
																			'".$combinations['PPrice']."', 
																			'".$productId."'
																		)";
			//echo $sql_productCombination;exit;
			$sql_productCombination_res = mysqli_query($dbConn, $sql_productCombination);
			$inserted_productCombinationId = mysqli_insert_id($dbConn);
			//echo $inserted_productCombinationId; exit;
			$productPriceMatrixDataDecoded[$count]['productCombinationId'] = $inserted_productCombinationId;
			$count++;
		}
		//echo json_encode($productPriceMatrixDataDecoded, JSON_PRETTY_PRINT); exit;
		/*-----------------------------------Insert Product Combinations-----------------------*/
		
		/*-----------------------------------Update Product Last Modified Time-----------------*/
		$sql_product = "UPDATE `product` SET `lastModifiedDate` = NOW() WHERE `product`.`productId` = ".$productId;
		//echo $sql_product; exit;
		$sql_product_res = mysqli_query($dbConn, $sql_product);
		/*-----------------------------------Update Product Last Modified Time-----------------*/
		
		/*-----------------------------------Populate Product Combination Pre-compiled Data----*/
		updateLiveTime($dbConn, 'PRODUCT');
		updateLiveTime($dbConn, 'PRODUCTLIVESTOCK');
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Product Combination Pre-compiled Data----*/

		echo "<script language=\"javascript\">window.location = 'productOffer.php?productId=".$productId."'</script>";exit;
	}
}else{
	/*-------------------------------Populate Perticuler Feature Data--------------------------------*/
	$featureDataSql = "SELECT 
	`product`.`productCode`, 
	`product`.`productFeature`
	FROM `product` 
	WHERE `product`.`productId` = ".$productId;
	//echo $featureDataSql; exit;
	$featureDataSql_res = mysqli_query($dbConn, $featureDataSql);
	$featureDataSql_res_fetch = mysqli_fetch_array($featureDataSql_res);
	//print_r($featureDataSql_res_fetch);exit;
	$productCode = $featureDataSql_res_fetch["productCode"];
	$featureData = $featureDataSql_res_fetch["productFeature"];
	/*-------------------------------Populate Perticuler Feature Data--------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Price Matrix</title>
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
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_127">Product Price Matrix</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/productProgressTab.php'); ?>
					<form id="productPriceMatrixForm" name="productPriceMatrixForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.productPriceMatrixValidation();">
						<div id="productPriceMatrixTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
							<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
							<input id="productPriceMatrixData" name="productPriceMatrixData" type="hidden" value='[]'>
							<button type="submit" class="btn btn-success pull-left" rel="cms_87">Save</button>
							<button type="button" class="btn btn-success pull-right" onclick="productFunctionality.goToProductOffer(<?php echo $productId; ?>)" rel="cms_94">Go Next</button>
						</div>
					</form>
					<input id="featureData" name="featureData" type="hidden" value='<?php if(mysqli_num_rows($featureDataSql_res) > 0){ echo preg_replace('/\\\\/', '', $featureData); }else { echo "[]"; } ?>'>
					<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php echo readProductPreCompiledData($productCode); ?>'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
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
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>