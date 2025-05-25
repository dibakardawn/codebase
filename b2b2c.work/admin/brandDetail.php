<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "BRAND";

$brandId=isset($_REQUEST['brandId'])?(int)$_REQUEST['brandId']:0;
//echo $brandId; exit;
if(intval($brandId) > 0){
	$sql1 = "SELECT 
	`brandChild`.`brandName`,
	`brandChild`.`brandSlug`,
	`brandChild`.`brandImage`,
	`brandChild`.`brandDesc`,
	`brandChild`.`parentId`,
	`brandParent`.`brandName` AS `parentBrand`
	FROM `brand` AS `brandChild`
	LEFT JOIN `brand` AS `brandParent`
	ON `brandParent`.`brandId` = `brandChild`.`parentId` 
	WHERE `brandChild`.`brandId` = ".$brandId;
	//echo $sql1; exit;
	$sql1_res = mysqli_query($dbConn, $sql1);
	$sql1_res_fetch = mysqli_fetch_array($sql1_res);
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Brand Details</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/brand.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="productSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_18">Brand Details</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_12">Name :</b><?php echo $sql1_res_fetch["brandName"]; ?></div>
					<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_19">Parent Brand :</b><?php if(is_null($sql1_res_fetch["parentBrand"])){ echo "Parent Itself"; } else { echo "<a href='".SITEURL."admin/brandDetail.php?brandId=".$sql1_res_fetch["parentId"]."'>".$sql1_res_fetch["parentBrand"]."</a>"; }?></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"><b id="cms_14">Description : </b><span id="brandDescActual"></span></div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<b id="cms_15">Brand Image : </b><br>
						<div class="productImageBlock pull-left">
							<?php if($sql1_res_fetch["brandImage"] != ""){ ?>
								<img src="<?php echo BRANDIMAGEURL.$sql1_res_fetch["brandImage"]; ?>" alt="<?php echo $sql1_res_fetch["brandImage"]; ?>">
							<?php }else{ ?>
								<img src="<?php echo SITEURL."assets/images/noImages.png"; ?>" alt="No Image">
							<?php } ?>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<b id="cms_20">Production Link : </b>
						<a href="<?php echo SITEURL."products/".$sql1_res_fetch["brandSlug"]; ?>" target="_blank" class="blueText">
						<?php echo SITEURL."products/".$sql1_res_fetch["brandSlug"]; ?>
						</a>
					</div>
					<input type="hidden" id="brandDesc" name="brandDesc" value="<?php echo $sql1_res_fetch["brandDesc"]; ?>">
					<button type="button" class="pull-left btn btn-success" onClick="brandFunctionality.arrangeProducts(<?php echo $brandId; ?>)" rel="cms_21">Arrange Products</button>
					<button type="button" class="pull-right btn btn-success" onClick="brandFunctionality.goToBrands()" rel="cms_22">List of Brands</button>
					<button type="button" class="pull-right btn btn-success marRig5" onClick="brandFunctionality.editBrand(<?php echo $brandId; ?>)" rel="cms_23">Edit</button>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>