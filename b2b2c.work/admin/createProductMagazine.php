<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$magazineId=isset($_REQUEST['magazineId'])?(int)$_REQUEST['magazineId']:0;
//echo $magazineId; exit;
if(count($_POST)){	
	$magazine=isset($_REQUEST['magazine'])?$_REQUEST['magazine']:"";
	$products=isset($_REQUEST['products'])?$_REQUEST['products']:"";
	//echo "magazine : ".$magazine." <br> products : ".$products; exit;
	if($magazineId > 0){
		$sqlUpdate = "UPDATE `productMagazine` 
					SET `magazine` = '".$magazine."', 
					`products` = '".$products."'
					WHERE `productMagazine`.`magazineId` = ".$magazineId;
		//echo $sqlUpdate; exit;
		$sqlUpdate_res = mysqli_query($dbConn, $sqlUpdate);
		echo "<script language=\"javascript\">window.location = 'shareProductMagazine.php?magazineId=".$magazineId."'</script>";exit;
	}else{
		$sqlAdd = "INSERT INTO `productMagazine` (`magazine`, `products`, `customerIds`, `externalEmailIds`, `createdDate`, `status`) 
		VALUES ('".$magazine."', '".$products."', '', '', NOW(), 1)";
		//echo $sqlAdd; exit;
		$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
		$inserted_magazineId = mysqli_insert_id($dbConn);
		//echo $inserted_productId; exit;
		echo "<script language=\"javascript\">window.location = 'shareProductMagazine.php?magazineId=".$inserted_magazineId."'</script>";exit;
	}
}else{
	$magazine = "";
	$products = "{}";
	if($magazineId > 0){
		$sql = "SELECT 
		`magazine`,
		`products`
		FROM `productMagazine` 
		WHERE `productMagazine`.`magazineId` = ".$magazineId;
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		//echo "<pre>"; print_r($sql_res_fetch); echo "</pre>"; exit;
		$magazine = $sql_res_fetch["magazine"];
		$products = $sql_res_fetch["products"];
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | <?php if($magazineId > 0){ ?>Edit<?php }else{ ?>Add<?php } ?> Product Magazine</title>
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
		<link rel="stylesheet" type="text/css" href="<?php echo SITEURL; ?>assets/css/plugins/hummingbird-treeview.css" >
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
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/hummingbird-treeview.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/productMagazine.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="productMagazineSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_174">Create Product Magazine</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="productMagazineForm" name="productMagazineForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productMagazineFunctionality.validateProductMagazineEntry();">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5 pull-right">
									<span id="cms_75" class="input-group-addon">Title : </span>
									<input id="magazine" name="magazine" type="text" class="form-control" placeholder="Please Enter Magazine Title" autocomplete="off" value="<?php if(isset($magazine)){ echo $magazine; } ?>" rel="cms_175">
								</div>
							</div>
							<h5 id="cms_176">Select Products for Magazine</h5>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 scrollX nopaddingOnly">
								<div id="treeview_container" class="hummingbird-treeview">
									<ul id="treeview" class="hummingbird-base padLeft16"></ul>
								</div>
								<div id="productsErr" class="redText"></div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center nopaddingOnly">
								<input id="magazineId" name="magazineId" type="hidden" value="<?php if(isset($magazineId)){ echo $magazineId; }else{ echo "0"; } ?>">
								<input id="products" name="products" type="hidden" value="<?php if(isset($products)){ echo str_replace('"', "'", $products); }else{ echo "{}"; } ?>">
								<button type="submit" class="btn btn-success marTop5" rel="cms_177">Save & Share with customers</button>
							</div>
						</div>
					</form>
				</div>
				<br clear="all">
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>