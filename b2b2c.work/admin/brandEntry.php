<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "BRAND";

$brandId=isset($_REQUEST['brandId'])?(int)$_REQUEST['brandId']:0;
//echo $brandId; exit;
$parentId=isset($_REQUEST['parentId'])?(int)$_REQUEST['parentId']:0;
//echo $parentId; exit;

if(count($_POST))
{	
	$brandName=isset($_REQUEST['brandName'])?$_REQUEST['brandName']:"";
	$brandDesc=isset($_REQUEST['brandDesc'])?$_REQUEST['brandDesc']:"";
	//echo "brandName : ".$brandName." <br> brandDesc : ".$brandDesc; exit;
	
	if($brandId > 0){ //Edit
		$modifiedImage = fileUpload($brandId, "uploads/brand/", "brand", "brandImage", ALLOWEDEXTENSIONS);
		if($modifiedImage != ''){
			$sqlEdit = "UPDATE `brand` SET 
			`brandName` = '".$brandName."', 
			`brandImage` = '".$modifiedImage."',
			`brandDesc` = '".$brandDesc."',
			`parentId` = '".$parentId."'
			WHERE `brand`.`brandId` = ".$brandId;
		}else{
			$sqlEdit = "UPDATE `brand` SET 
			`brandName` = '".$brandName."', 
			`brandDesc` = '".$brandDesc."',
			`parentId` = '".$parentId."'
			WHERE `brand`.`brandId` = ".$brandId;
		}
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		updateLiveTime($dbConn, 'BRAND');
		echo "<script language=\"javascript\">window.location = 'brandDetail.php?brandId=".$brandId."'</script>";exit;
	}else if($brandId === 0){ //Add
		$sqlAdd = "INSERT INTO `brand` (`brandName`, `brandSlug`, `brandImage`, `brandDesc`, `parentId`) 
		VALUES ('".$brandName."', 'PRODCOLLSLUG', '', '".$brandDesc."', '".$parentId."')";
		//echo $sqlAdd; exit;
		$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
		$inserted_brandId = mysqli_insert_id($dbConn);
		//echo $inserted_brandId; exit;
		$brandSlug = clean($brandName);
		$justUploadedImage = fileUpload($inserted_brandId, "uploads/brand/", "brand", "brandImage", ALLOWEDEXTENSIONS);
		$sqlAdd2 = "UPDATE `brand` SET `brandImage` = '".$justUploadedImage."',`brandSlug` = '".$brandSlug."_".$inserted_brandId."' WHERE `brand`.`brandId` = ".$inserted_brandId;
		//echo $sqlAdd2; exit;
		$sqlAdd2_res = mysqli_query($dbConn, $sqlAdd2);
		updateLiveTime($dbConn, 'BRAND');
		echo "<script language=\"javascript\">window.location = 'brandDetail.php?brandId=".$inserted_brandId."'</script>";exit;
	}
}else{
	$brandName = "";
	$brandSlug = "";
	$brandImage = "";
	$brandDesc = "";
	if($brandId > 0){
		$sql = "SELECT `brandName`,`brandSlug`,`brandImage`,`brandDesc`,`parentId` FROM `brand` WHERE `brandId` = ".$brandId;
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		//echo "<pre>"; print_r($sql_res_fetch); echo "</pre>"; exit;
		$brandName = $sql_res_fetch["brandName"];
		$brandSlug = $sql_res_fetch["brandSlug"];
		$brandImage = $sql_res_fetch["brandImage"];
		$brandDesc = $sql_res_fetch["brandDesc"];
		$parentId = $sql_res_fetch["parentId"];
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Brand Entry</title>
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
		<link rel="stylesheet" href="https://cdn.quilljs.com/1.2.2/quill.snow.css">
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
		<script type="text/javascript" src="https://cdn.quilljs.com/1.2.2/quill.js"></script>
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/brand.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
      <?php include('includes/header.php'); ?>
      <?php include('includes/sidebar.php'); ?>
      <div class="w3-main">
         <div id="brandSectionHolder">
            <header class="w3-container" style="padding-top:22px">
               <h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_8">Brand Entry</span></b></h5>
            </header>
            <div class="w3-row-padding w3-margin-bottom">
               <h5><?php if($brandId > 0){ ?><span id="cms_9">Edit</span><?php }else{ ?><span id="cms_10">Add</span><?php } ?> <span id="cms_11">Brand</span></h5>
			   <form id="productbrandEntryForm" name="productbrandEntryForm" method="POST" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return brandFunctionality.validateBrandEntry();">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_12" class="input-group-addon">Name : </span>
								<input id="brandName" name="brandName" type="text" class="form-control" placeholder="Please Enter Brand Name" autocomplete="off" value="<?php if(isset($brandName)){ echo $brandName; } ?>">
							</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<select id="parentId" name="parentId" class="h34 w100p marBot5">
								<option id="cms_13" value="0">-- Select Parent Brand --</option>
								<?php 
								$sql_product_brand = "SELECT `brandId`,`brandName` FROM `brand` WHERE 1";
								$sql_product_brand_res = mysqli_query($dbConn, $sql_product_brand);
								while($sql_product_brand_res_fetch = mysqli_fetch_array($sql_product_brand_res)){
								?>
								<option value="<?php echo $sql_product_brand_res_fetch["brandId"]; ?>" <?php if(intval($parentId) == intval($sql_product_brand_res_fetch["brandId"])){ echo "SELECTED"; } ?>><?php echo $sql_product_brand_res_fetch["brandName"]; ?></option>
								<?php } ?>
							</select>
						</div>
					</div>
					
					<div id="cms_14" class="darkGreyText pull-left">Description :</div>
					<div id="brandDescErrHolder"></div>
					<br clear="all">
					<div id="brandDescHolder" class="marBot5">
						<div id="brandDescBody"></div>
						<input type="hidden" id="brandDesc" name="brandDesc" value="<?php echo $brandDesc; ?>">
					</div>
					<div class="input-group marBot5">
						<span id="cms_15" class="input-group-addon">Brand Image : </span>
						<input type="file" name="brandImage" id="brandImage" class="form-control" autocomplete="off">
						<span id="cms_16" class="input-group-addon">Image must be .jpg, .jpeg, .png</span>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<?php 
							if($brandImage != ''){
								echo "<div class='productImageBlock'><img src='".BRANDIMAGEURL.$brandImage."' alt='".$brandImage."'></div>";
							}else{
								echo "<div class='productImageBlock'><img src='../assets/images/noImages.png' alt='noImages'></div>";
							}
							?>
						</div>
						<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="brandId" name="brandId" type="hidden" value="<?php echo $brandId; ?>">
							<button type="submit" class="pull-right btn btn-success marTop5" rel="cms_17">Save</button>
						</div>
					</div>
			   </form>
            </div>
         </div>
         <br>
         <?php include('includes/footer.php'); ?>
      </div>
   </body>
</html>