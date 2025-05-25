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
		$productOfferMatrixData = isset($_REQUEST['productOfferMatrixData'])?$_REQUEST['productOfferMatrixData']:[];
		//echo json_encode($productOfferMatrixData, JSON_PRETTY_PRINT); exit;
		$productOfferMatrixDataDecoded = json_decode($productOfferMatrixData,true);
		
		/*-----------------------------------Delete Product Active Offers-----------------------*/
		$sql_deleteProductActiveOffer = "DELETE FROM `productOffer` WHERE `productOffer`.`productId` = ".$productId." AND `productOffer`.`status` = 1";
		//echo $sql_deleteProductActiveOffer;exit;
		$sql_deleteProductActiveOffer_res = mysqli_query($dbConn, $sql_deleteProductActiveOffer);
		/*-----------------------------------Delete Product Active Offers-----------------------*/
		
		/*-----------------------------------Insert Product Offers------------------------------*/
		foreach ($productOfferMatrixDataDecoded as $combinations) {
			$productCombinationId = isset($combinations['productCombinationId']) ? $combinations['productCombinationId'] : 0;
			$QRText = isset($combinations['QRText']) ? $combinations['QRText'] : null;
			$systemReference = isset($combinations['systemReference']) ? $combinations['systemReference'] : null;
			$RofferPercentage = isset($combinations['offers']['RofferPercentage']) ? $combinations['offers']['RofferPercentage'] : null;
			$RofferStartDate = isset($combinations['offers']['RofferStartDate']) ? $combinations['offers']['RofferStartDate'] : null;
			$RofferEndDate = isset($combinations['offers']['RofferEndDate']) ? $combinations['offers']['RofferEndDate'] : null;
			$WofferPercentage = isset($combinations['offers']['WofferPercentage']) ? $combinations['offers']['WofferPercentage'] : null;
			$WofferStartDate = isset($combinations['offers']['WofferStartDate']) ? $combinations['offers']['WofferStartDate'] : null;
			$WofferEndDate = isset($combinations['offers']['WofferEndDate']) ? $combinations['offers']['WofferEndDate'] : null;
			
			/*echo "ProductCombinationId : ".$productCombinationId." <br>";
			echo "QRText : ".$QRText." <br> ";
			echo "systemReference : ".$systemReference." <br> ";
			echo "RofferPercentage : ".$RofferPercentage." <br>";
			echo "RofferStartDate : ".$RofferStartDate." <br> ";
			echo "RofferEndDate : ".$RofferEndDate." <br> ";
			echo "WofferPercentage : ".$WofferPercentage." <br> ";
			echo "WofferStartDate : ".$WofferStartDate." <br> ";
			echo "WofferEndDate : ".$WofferEndDate." <br><br> ";
			exit;*/
			
			if(intval($productCombinationId) > 0 && $systemReference !== null){
				$sql_updateProductSystemReference = "UPDATE `productCombination` SET `systemReference` = '".$systemReference."' WHERE `productCombination`.`productCombinationId` = ".$productCombinationId;
				//echo $sql_updateProductSystemReference; exit;
				$sql_updateProductSystemReference_res = mysqli_query($dbConn, $sql_updateProductSystemReference);
			}
			
			if(($RofferPercentage != null && $RofferStartDate != null && $RofferEndDate != null) || 
			($WofferPercentage != null && $WofferStartDate != null && $WofferEndDate != null)){
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
																		'".$productId."', 
																		'".$productCombinationId."',
																		'".$QRText."',
																		'".$RofferPercentage."',
																		'".$RofferStartDate."',
																		'".$RofferEndDate."',
																		'".$WofferPercentage."',
																		'".$WofferStartDate."',
																		'".$WofferEndDate."',
																		'1'
																	)";
				//echo $sql_insertProductOffer; exit;
				$sql_insertProductOffer_res = mysqli_query($dbConn, $sql_insertProductOffer);
			}
		}
		/*-----------------------------------Insert Product Offers------------------------------*/
		
		/*-----------------------------------Update Product Last Modified Time-----------------*/
		$sql_product = "UPDATE `product` SET `lastModifiedDate` = NOW() WHERE `product`.`productId` = ".$productId;
		//echo $sql_product; exit;
		$sql_product_res = mysqli_query($dbConn, $sql_product);
		/*-----------------------------------Update Product Last Modified Time-----------------*/
		
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		updateLiveTime($dbConn, 'PRODUCTLIVESTOCK');
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		
		echo "<script language=\"javascript\">window.location = 'productStock.php?productId=".$productId."'</script>";exit;
	}
}else{
	$productSql = "SELECT 
	`product`.`productCode`
	FROM `product` 
	WHERE `product`.`productId` = ".$productId;
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
		<title><?php echo SITETITLE; ?> Admin | Product Offer</title>
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
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_68">Product Offer</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/productProgressTab.php'); ?>
					<div id="productPriceMatrixTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
					<form id="productPriceMatrixForm" name="productPriceMatrixForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.productOfferValidation();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
							<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
							<input id="productOfferMatrixData" name="productOfferMatrixData" type="hidden" value='<?php echo "[]"; ?>'>
							<button type="submit" class="btn btn-success pull-left" rel="cms_87">Save</button>
							<button type="button" class="btn btn-success pull-left marleft5" onclick="productFunctionality.autoGenerateSystemReferences()" rel="cms_405">Auto Generate System References</button>
							<button type="button" class="btn btn-success pull-right" rel="cms_94" onClick="productFunctionality.goToProductSuppliers(<?php echo $productId; ?>)">Go Next</button>
						</div>
					</form>
					<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php echo readProductPreCompiledData($productCode); ?>'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
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
				<!-- Offer Modal -->
				<div class="modal fade" id="OfferModal" role="dialog">
					<div class="modal-dialog modal-sm">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_128" class="modal-title">Add Product Offer %</h4>
							</div>
							<div id="OfferCodeModalBody" class="modal-body">
								<div class="input-group marBot5">
									<span id="OfferPercentSpan" class="input-group-addon">
										<span id="cms_129">Offer Percentage : </span>
									</span>
									<input id="OfferPercent" name="OfferPercent" type="number" class="form-control" placeholder="%" step="0.1" autocomplete="off" value="">
									<span id="OfferPercentIconSpan" class="input-group-addon">%</span>
								</div>
								<div class="input-group marBot5">
									<span id="startDateSpan" class="input-group-addon">
										<span id="cms_130">Start Date : </span>
									</span>
									<input id="startDate" name="startDate" type="date" min="<?php echo date("Y-m-d"); ?>" max="<?php echo date('Y', strtotime('+1 year')); ?>" class="form-control" autocomplete="off" value="">
								</div>
								<div class="input-group marBot5">
									<span id="endDateSpan" class="input-group-addon">
										<span id="cms_131">Expary Date : </span>
									</span>
									<input id="endDate" name="endDate" type="date" min="<?php echo date("Y-m-d"); ?>" max="<?php echo date('Y', strtotime('+1 year')); ?>" class="form-control" autocomplete="off" value="">
								</div>
							</div>
							<div class="modal-footer">
								<input type="hidden" id="OfferModalType" name="OfferModalType" value="">
								<input type="hidden" id="OfferModalIndex" name="OfferModalIndex" value="">
								<button type="button" class="btn btn-success" onclick="productFunctionality.saveOfferPercentage()" rel="cms_87">Save</button>
							</div>
						</div>
					</div>
				</div>
				<!-- Offer Modal -->
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>