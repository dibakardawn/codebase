<?php
include('../config/config.php');
include('auth.php');
//echo "Loading...";

$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
//echo $productId; exit;
$productIds=isset($_REQUEST['productIds'])?$_REQUEST['productIds']:"";
//echo $productIds; exit;

if(intval($productId) > 0){
	$productSql = "SELECT `productCode` FROM `product` WHERE `productId` = ".$productId;
	//echo $productSql; exit;
	$productSql_res = mysqli_query($dbConn, $productSql);
	$productSql_res_fetch = mysqli_fetch_array($productSql_res);
	//print_r($productSql_res_fetch);exit;
	$productCode = $productSql_res_fetch["productCode"];
}else if($productIds != ""){
	$sql = "SELECT 
			`product`.`productCode`,
			`product`.`productTitle`,
			`product`.`productDesc`,
			`product`.`productImages`,
			`productCombination`.`QRText`,
			`productCombination`.`systemReference`
			FROM `product` 
			INNER JOIN `productCombination`
			ON `productCombination`.`productId` = `product`.`productId`
			WHERE 
			`product`.`productId` IN (".$productIds.") 
			AND `product`.`Status` = 1";
	$sql_res = mysqli_query($dbConn, $sql);
	$productObjectArray = array();
	while($sql_res_fetch = mysqli_fetch_array($sql_res)){
		$productObject = (object) ['productCode' => $sql_res_fetch["productCode"], 
								   'productTitle' => $sql_res_fetch["productTitle"],
								   'productDesc' => $sql_res_fetch["productDesc"],
								   'productImages' => $sql_res_fetch["productImages"],
								   'QRText' => $sql_res_fetch["QRText"],
								   'systemReference' => $sql_res_fetch["systemReference"]
								   ];
		//echo json_encode($productObject);exit;
		$productObjectArray[] = $productObject;
	}
	//echo json_encode($productObjectArray);exit;
}else{
	echo "<script language=\"javascript\">window.location = 'product.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Brochure - <?php if(intval($productId) > 0){ echo $productCode; } ?></title>
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
	<body>
		<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="position: fixed; top: -100%; left: -100%; visibility: hidden;">
		  <defs>
			<!-- Gradient for footer -->
			<radialGradient id="footer-gradient-svg" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
			  <stop offset="33%" stop-color="rgb(255,208,144)"/>
			  <stop offset="100%" stop-color="rgb(180,138,65)"/>
			</radialGradient>
			<pattern id="footer-pattern" patternUnits="userSpaceOnUse" width="200" height="200">
			  <rect width="200" height="200" fill="url(#footer-gradient-svg)"/>
			</pattern>
			<!-- Solid color for left/right -->
			<pattern id="solid-offwhite" patternUnits="userSpaceOnUse" width="10" height="10">
			  <rect width="10" height="10" fill="#fff8f0" />
			</pattern>
		  </defs>
		</svg>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center nopaddingOnly marTop3 f10 no-print">
			<button type="button" class="btn btn-success btn-xs" onclick="window.print();">
				<span id="cms_133">Print</span> 
				<span class="glyphicon glyphicon-print"></span>
			</button>
		</div>
		<div id="productBrochureHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
			<?php if(intval($productId) > 0){ ?>
			<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
			<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
			<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php if($productId > 0){ echo readProductPreCompiledData($productCode); } ?>'>
			<?php }else if($productIds != ""){?>
			<input id="bulkProductBrochureData" name="bulkProductBrochureData" type="hidden" value='<?php if($productIds != ""){ echo json_encode($productObjectArray); } ?>'>
			<?php } ?>
			<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			<input id="CMSDATA" name="CMSDATA" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
		</div>
	</body>
</html>