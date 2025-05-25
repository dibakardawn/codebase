<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "CATEGORY";

$categoryId=isset($_REQUEST['categoryId'])?(int)$_REQUEST['categoryId']:0;
//echo $categoryId; exit;
$parentId=isset($_REQUEST['parentId'])?(int)$_REQUEST['parentId']:0;
//echo $parentId; exit;
if(count($_POST)){	
	$category=isset($_REQUEST['category'])?$_REQUEST['category']:"";
	//echo "category : ".$category; exit;
	if($categoryId > 0){ //Edit
		$modifiedImage = fileUpload($categoryId, "uploads/productCategory/", "productCategory", "categoryImage", ALLOWEDEXTENSIONS);
        $sqlEdit = "UPDATE `category` SET 
                    `category` = '$category', 
                    `parentId` = '$parentId'" . 
                    ($modifiedImage ? ", `categoryImage` = '$modifiedImage'" : "") . 
                    " WHERE `category`.`categoryId` = $categoryId";
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		updateLiveTime($dbConn, 'CATEGORY');
		echo "<script language=\"javascript\">window.location = 'categories.php'</script>";exit;
	}else if($categoryId === 0){ //Add
		$sqlAdd = "INSERT INTO `category` (`category`, `categorySlug`, `categoryImage`, `parentId`) 
                   VALUES ('$category', 'CATSLUG', '', '$parentId')";
		//echo $sqlAdd; exit;
		$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
		$inserted_categoryId = mysqli_insert_id($dbConn);
		//echo $inserted_categoryId; exit;
		$categorySlug = clean($category);
		$justUploadedImage = fileUpload($inserted_categoryId, "uploads/productCategory/", "category", "categoryImage", ALLOWEDEXTENSIONS);
		$sqlAdd2 = "UPDATE `category` SET `categoryImage` = '".$justUploadedImage."',`categorySlug` = '".$categorySlug."_".$inserted_categoryId."' WHERE `category`.`categoryId` = ".$inserted_categoryId;
		//echo $sqlAdd2; exit;
		$sqlAdd2_res = mysqli_query($dbConn, $sqlAdd2);
		updateLiveTime($dbConn, 'CATEGORY');
		echo "<script language=\"javascript\">window.location = 'categories.php'</script>";exit;
	}
}else{
	$category = "";
	$categorySlug = "";
	$categoryImage = "";
	if($categoryId > 0){
		$sql = "SELECT `category`, `categorySlug`, `categoryImage`, `parentId` 
                FROM `category` 
                WHERE `categoryId` = $categoryId";
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		//echo "<pre>"; print_r($sql_res_fetch); echo "</pre>"; exit;
		$category = $sql_res_fetch["category"];
		$categorySlug = $sql_res_fetch["categorySlug"];
		$categoryImage = $sql_res_fetch["categoryImage"];
		$parentId = $sql_res_fetch["parentId"];
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Category Entry</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/category.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
      <?php include('includes/header.php'); ?>
      <?php include('includes/sidebar.php'); ?>
      <div class="w3-main">
         <div id="categorySectionHolder">
            <header class="w3-container" style="padding-top:22px">
               <h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_28">Product Category Entry</span></b></h5>
            </header>
            <div class="w3-row-padding w3-margin-bottom">
               <h5><?php if($categoryId > 0){ ?><span id="cms_29">Edit</span><?php }else{ ?><span id="cms_30">Add</span><?php } ?> <span id="cms_31">Product Category</span></h5>
			   <form id="categoryEntryForm" name="categoryEntryForm" method="POST" enctype="multipart/form-data" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return categoryFunctionality.validateProductCategoryEntry();">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="cms_32" class="input-group-addon">Name : </span>
								<input id="category" name="category" type="text" class="form-control" placeholder="Please Enter Product Category Name" autocomplete="off" value="<?php if(isset($category)){ echo $category; } ?>">
							</div>
						</div>
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<select id="parentId" name="parentId" class="h34 w100p marBot5">
								<option id="cms_33" value="0">-- Select Parent Category --</option>
								<?php 
								$sql_product_cat = "SELECT `categoryId`,`category` FROM `category` WHERE 1";
								$sql_product_cat_res = mysqli_query($dbConn, $sql_product_cat);
								while($sql_product_cat_res_fetch = mysqli_fetch_array($sql_product_cat_res)){
								?>
								<option value="<?php echo $sql_product_cat_res_fetch["categoryId"]; ?>" <?php if(intval($parentId) == intval($sql_product_cat_res_fetch["categoryId"])){ echo "SELECTED"; } ?>><?php echo $sql_product_cat_res_fetch["category"]; ?></option>
								<?php } ?>
							</select>
						</div>
					</div>
					<div class="input-group marBot5">
						<span id="cms_34" class="input-group-addon">Product Category Image : </span>
						<input type="file" name="categoryImage" id="categoryImage" class="form-control" autocomplete="off">
						<span id="cms_35" class="input-group-addon">Image must be .jpg, .jpeg, .png</span>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<?php 
							if($categoryImage != ''){
								echo "<div class='productImageBlock'><img src='".SITEURL.UPLOADFOLDER."productCategory/".$categoryImage."' alt='".$categoryImage."'></div>";
							}else{
								echo "<div class='productImageBlock'><img src='../assets/images/noImages.png' alt='noImages'></div>";
							}
							?>
						</div>
						<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<input id="categoryId" name="categoryId" type="hidden" value="<?php echo $categoryId; ?>">
							<button type="submit" class="pull-right btn btn-success marTop5" rel="cms_36">Save</button>
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