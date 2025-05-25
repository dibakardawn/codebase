<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?$_REQUEST['productId']:0;
//echo $productId; exit;
$combinationId=isset($_REQUEST['combinationId'])?$_REQUEST['combinationId']:0;
//echo $combinationId; exit;
if(count($_POST)){
	$productImageSerializedData=isset($_REQUEST['productImageSerializedData'])?$_REQUEST['productImageSerializedData']:"";
	$productImageSerializedData=str_replace("[","",$productImageSerializedData);
	$productImageSerializedData=str_replace("]","",$productImageSerializedData);
	$productImageSerializedData=str_replace('"', "", $productImageSerializedData);
	//echo $productImageSerializedData; exit;
	if($combinationId == 0){
		$sqlEdit = "UPDATE `product` SET `productImages` = '".$productImageSerializedData."' WHERE `product`.`productId` = ".$productId;
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		
		/*-----------------------------------Populate Pre-compiled Product Data---------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Data---------------*/
		
		echo "<script language=\"javascript\">window.location = 'productDetail.php?productId=".$productId."'</script>";exit;
	}else{
		$sqlEdit = "UPDATE `productCombination` SET `images` = '".$productImageSerializedData."' WHERE `productCombination`.`productId` = ".$productId." AND `productCombination`.`productCombinationId` = ".$combinationId;
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		
		/*-----------------------------------Populate Pre-compiled Product Data---------------*/
		updateLiveTime($dbConn, 'PRODUCT');
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Data---------------*/
		
		echo "<script language=\"javascript\">window.location = 'productImage.php?productId=".$productId."'</script>";exit;
	}
}else{
	if($productId == 0){
		echo "<script language=\"javascript\">window.location = 'productDetail.php?productId=".$productId."'</script>";exit;
	}else{
		if($combinationId == 0){
			/*-----------------------------------------------Product Only------------------------------------*/
			$sql_product = "SELECT `productImages` FROM `product` WHERE `productId` = '".$productId."' AND `product`.`Status`= 1";
			//echo $sql_product; exit;
			$sql_product_res = mysqli_query($dbConn, $sql_product);
			$sql_product_res_fetch = mysqli_fetch_array($sql_product_res);
			$productImages = $sql_product_res_fetch["productImages"];
			$productImagesArr = explode(",",$productImages);
			//echo json_encode($productImagesArr);exit;
			/*-----------------------------------------------Product Only------------------------------------*/
		}else{
			/*-----------------------------------------------Product Only------------------------------------*/
			$sql_productCombination = "SELECT `images` FROM `productCombination` WHERE `productId` = '".$productId."' AND `productCombinationId` = '".$combinationId."'";
			//echo $sql_productCombination; exit;
			$sql_product_res = mysqli_query($dbConn, $sql_productCombination);
			$sql_product_res_fetch = mysqli_fetch_array($sql_product_res);
			$productImages = $sql_product_res_fetch["images"];
			$productImagesArr = explode(",",$productImages);
			//echo json_encode($productImagesArr);exit;
			/*-----------------------------------------------Product Only------------------------------------*/
		}
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Arrange Product Images</title>
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
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css">  
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
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
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_125">Arrange Product Images</span></b></h5>
				</header>
				<div id="productImageTableHolder" class="w3-row-padding w3-margin-bottom scrollX"></div>
				<form id="productImageArrangementForm" name="productImageArrangementForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>">
					<input id="productImageSerializedData" name="productImageSerializedData" type="hidden" value='<?php if(mysqli_num_rows($sql_product_res) > 0){ echo json_encode($productImagesArr); } else { echo "[]"; } ?>'>
					<input id="productId" name="productId" type="hidden" value='<?php echo $productId; ?>'>
					<input id="combinationId" name="combinationId" type="hidden" value='<?php echo $combinationId; ?>'>
					<div class="text-center">
						<button type="submit" class="btn btn-success marBot5" rel="cms_124">Save arranged order</button>
					</div>
				</form>
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>