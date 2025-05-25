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
		$hdnProductSuppliers=isset($_REQUEST['hdnProductSuppliers'])?$_REQUEST['hdnProductSuppliers']:"";
		//echo $hdnProductSuppliers; exit;
		$productSupplierUpdateSql = "UPDATE `product` SET `suppliers` = '".$hdnProductSuppliers."' WHERE `product`.`productId` = ".$productId;
		//echo $productSupplierUpdateSql; exit;
		$productSupplierUpdateSql_res = mysqli_query($dbConn, $productSupplierUpdateSql);
		
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		populateProductPreCompiledData($dbConn, $productId);
		/*-----------------------------------Populate Pre-compiled Product Offers---------------*/
		
		echo "<script language=\"javascript\">window.location = 'productStock.php?productId=".$productId."'</script>";exit;
	}
}else{
	/*------------------------------------Get Product Details-------------------------------*/
	$productSql = "SELECT `productCode` FROM `product` WHERE `productId` = ".$productId;
	//echo $productSql; exit;
	$productSql_res = mysqli_query($dbConn, $productSql);
	$productSql_res_fetch = mysqli_fetch_array($productSql_res);
	$productCode = $productSql_res_fetch["productCode"];
	/*------------------------------------Get Product Details-------------------------------*/
	
	/*------------------------------------Get List of Suppliers-----------------------------*/
	$supplierSql = "SELECT `supplierId`,`supplierName`,`supplierContactPerson`,`supplierContactNo`,`supplierEmail` FROM `supplier` WHERE 1 ORDER BY `supplierId` DESC";
	//echo $supplierSql; exit;
	$supplierSql_res = mysqli_query($dbConn, $supplierSql);
	/*------------------------------------Get List of Suppliers-----------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Suppliers</title>
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
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_69">Product Suppliers</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php include('includes/productProgressTab.php'); ?>
					<h5 id="cms_132">List of Suppliers</h5>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly scrollX">
					<?php while($supplierSql_res_fetch = mysqli_fetch_array($supplierSql_res)){ ?>
						<div class="minW720">
							<input type="checkbox" id="productSupplier_<?php echo $supplierSql_res_fetch["supplierId"]; ?>" name="productSupplier_<?php echo $supplierSql_res_fetch["supplierId"]; ?>" value="<?php echo $supplierSql_res_fetch["supplierId"]; ?>">
							<span class="marleft5"> 
								<?php echo $supplierSql_res_fetch["supplierName"]." - ".$supplierSql_res_fetch["supplierContactPerson"];  ?>
							</span>
						</div>
					<?php } ?>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<input id="productPreCompileData" name="productPreCompileData" type="hidden" value='<?php echo readProductPreCompiledData($productCode); ?>'>
						<input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
						<input id="productCode" name="productCode" type="hidden" value='<?php echo $productCode; ?>'>
					</div>
					<form id="productImageForm" name="productImageForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.validateProductSuppliers();">
						<input type="hidden" id="productId" name="productId" value="<?php echo $productId; ?>">
						<input type="hidden" id="hdnProductSuppliers" name="hdnProductSuppliers" value="">
						<button type="submit" class="btn btn-success pull-left" rel="cms_87">Save</button>
						<button type="button" class="btn btn-success pull-right" onClick="productFunctionality.goToProductStock(<?php echo $productId; ?>)" rel="cms_94">Go Next</button>
					</form>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>