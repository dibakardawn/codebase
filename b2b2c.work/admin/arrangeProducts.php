<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$brandId=isset($_REQUEST['brandId'])?(int)$_REQUEST['brandId']:0;
$categoryId=isset($_REQUEST['categoryId'])?(int)$_REQUEST['categoryId']:0;
if($brandId == 0 && $categoryId == 0){
	echo "<script language=\"javascript\">window.location = 'product.php'</script>";exit;
}else{
	$sql_product = "";
	if($brandId > 0 && $categoryId == 0){
		$sql_product = "SELECT `product`.`productId`,
							`product`.`productCode`,
							`product`.`productTitle`,
							`product`.`brandId`,
							`product`.`arrangementOrder`							
							FROM `product` 
							WHERE `product`.`brandId` = ".$brandId."
							AND `product`.`Status`= 1
							ORDER BY `product`.`arrangementOrder`";
	}else if($brandId == 0 && $categoryId > 0){
		$sql_product = "SELECT `product`.`productId`,
							`product`.`productCode`,
							`product`.`productTitle`,
							`product`.`brandId`,
							`product`.`arrangementOrder`							
							FROM `product`
                            INNER JOIN `productCategory`
                            ON `productCategory`.`productId` = `product`.`productId`
                            WHERE `product`.`Status`= 1
                            AND `productCategory`.`categoryId` = ".$categoryId."
                            ORDER BY `product`.`arrangementOrder`";
	}

	/*-----------------------------------------------Product------------------------------------*/
	//echo $sql_product; exit;
	$sql_product_res = mysqli_query($dbConn, $sql_product);
	while($sql_product_res_fetch = mysqli_fetch_array($sql_product_res)){
		$productObject = (object) ['productId' => $sql_product_res_fetch["productId"], 
									'productCode' => $sql_product_res_fetch["productCode"],
									'productTitle' => $sql_product_res_fetch["productTitle"],
									'brandId' => $sql_product_res_fetch["brandId"],
									'arrangementOrder' => $sql_product_res_fetch["arrangementOrder"]
									];
		//echo json_encode($productObject);exit;
		$productObjectArray[] = $productObject;
	}
	//echo json_encode($productObjectArray);exit;
	/*-----------------------------------------------Product------------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Arrange Products</title>
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
					<h5 class="pull-left"><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_122">Arrange Products</span></b></h5>
					<select id="productBrandFilter" class="filterDDL pull-right">
						<option id="cms_123" value="0">-- Select Product Brand --</option>
						<?php
						$sql_product_brand = "SELECT `brandId`,`brandName` FROM `brand` WHERE 1";
						$sql_product_brand_res = mysqli_query($dbConn, $sql_product_brand);
						while($sql_product_brand_res_fetch = mysqli_fetch_array($sql_product_brand_res)){
						?>
						<option value="<?php echo $sql_product_brand_res_fetch["brandId"]; ?>" <?php if(intval($brandId) == intval($sql_product_brand_res_fetch["brandId"])){ echo "SELECTED"; } ?>><?php echo $sql_product_brand_res_fetch["brandName"]; ?></option>
						<?php } ?>
					</select>
					<button type="button" class="pull-right w3-button w3-green marBot5 marRig10" onClick="productFunctionality.saveArrangedOrder()" rel="cms_124">Save arranged order</button>
				</header>
				<div id="productTableHolder" class="w3-row-padding w3-margin-bottom scrollX"></div>
				<input id="productSerializedData" name="productSerializedData" type="hidden" value='<?php if(mysqli_num_rows($sql_product_res) > 0){ echo json_encode($productObjectArray); } else { echo "[]"; } ?>'>
				<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
				<div class="text-center">
					<button type="button" class="w3-button w3-green marBot5" onClick="productFunctionality.saveArrangedOrder()" rel="cms_124">Save arranged order</button>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>