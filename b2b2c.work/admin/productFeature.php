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
		$featureData = isset($_REQUEST['featureData'])?$_REQUEST['featureData']:[];
		//echo json_encode($featureData, JSON_PRETTY_PRINT); exit;
		$featureDataUpdateSql = "UPDATE `product` SET 
		`productFeature` = '".$featureData."',
		`lastModifiedDate` = NOW()
		WHERE `product`.`productId` = ".$productId;
		//echo $featureDataUpdateSql; exit;
		$featureDataUpdateSql_res = mysqli_query($dbConn, $featureDataUpdateSql);
		
		/*-----------------------------Deleting exiting all product combinations---------------------*/
		$deleteAllProductCombinationsSql = "DELETE FROM productCombination WHERE `productCombination`.`productId` = ".$productId;
		//echo $deleteAllProductCombinationsSql; exit;
		$deleteAllProductCombinationsSql_res = mysqli_query($dbConn, $deleteAllProductCombinationsSql);
		/*-----------------------------Deleting exiting all product combinations---------------------*/
		
		/*-----------------------------Deleting exiting all QR code Image for product combinations---*/
		deleteAllFileofFolder('../'.UPLOADFOLDER.'products/QRCode/'.$productCode.'-combinations/');
		/*-----------------------------Deleting exiting all QR code Image for product combinations---*/
		
		/*-----------------------------------Populate Pre-compiled Product Data----------------------*/
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Data----------------------*/
		
		echo "<script language=\"javascript\">window.location = 'productPriceMatrix.php?productId=".$productId."'</script>";exit;
	}
}else{
	/*-------------------------------Populate Overall Feature Data-----------------------------------*/
	$sql_features = "SELECT `featureId`,`featureTitle`,`featureType`,`featureUnit`  FROM `productFeature` WHERE 1"; //xxxx make/read it pre Compiled Data
	//echo $sql_features; exit;
	$sql_features_res = mysqli_query($dbConn, $sql_features);
	while($sql_features_res_fetch = mysqli_fetch_array($sql_features_res)){
		$productFeatureObject = (object) ['featureId' => $sql_features_res_fetch["featureId"], 
										  'featureTitle' => $sql_features_res_fetch["featureTitle"],
										  'featureType' => $sql_features_res_fetch["featureType"],
										  'featureUnit' => $sql_features_res_fetch["featureUnit"]
										 ];
		//echo json_encode($productFeatureObject);exit;
		$productFeatureObjectArray[] = $productFeatureObject;
	}
	//echo json_encode($productFeatureObjectArray);exit;
	/*-------------------------------Populate Overall Feature Data-----------------------------------*/
	
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
		<title><?php echo SITETITLE; ?> Admin | Product Feature</title>
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
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_126">Product Features</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/productProgressTab.php'); ?>
					<form id="productFeatureForm" name="productFeatureForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.productFeatureFormValidation();">
						<div id="featureInputTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX"></div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="featureData" name="featureData" type="hidden" value='<?php if (mysqli_num_rows($featureDataSql_res) > 0 && !empty($featureData) && $featureData !== "null") { echo preg_replace('/\\\\/', '', $featureData); }else { echo "[]"; } ?>'>
							<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
							<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
							<button type="submit" class="btn btn-danger pull-left" rel="cms_87">Save</button>
							<button type="button" class="btn btn-success pull-right" onclick="productFunctionality.gotoProductPriceMatrix(<?php echo $productId; ?>)" rel="cms_94">Go Next</button>
						</div>
					</form>
					<input id="productFeatureSerializedData" name="productFeatureSerializedData" type="hidden" value='<?php echo json_encode($productFeatureObjectArray); ?>'>
					<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>