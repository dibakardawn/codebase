<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
//echo $productId; exit;
if(count($_POST))
{	
	$productTitle=isset($_REQUEST['productTitle'])?$_REQUEST['productTitle']:"";
	$productDesc=isset($_REQUEST['productDesc'])?$_REQUEST['productDesc']:"";
	$metaKeyWords=isset($_REQUEST['metaKeyWords'])?$_REQUEST['metaKeyWords']:"";
	$metaDesc=isset($_REQUEST['metaDesc'])?$_REQUEST['metaDesc']:"";
	$brandId=isset($_REQUEST['brandId'])?$_REQUEST['brandId']:0;
	$categoryIds=isset($_REQUEST['categoryIds'])?$_REQUEST['categoryIds']:"";
	$categoryIdArr = explode(",",$categoryIds);
	$minStockVol=isset($_REQUEST['minStockVol'])?$_REQUEST['minStockVol']:0;
	
	/*echo "productTitle : ".$productTitle." <br>";
	echo "productDesc : ".$productDesc." <br> ";
	echo "metaKeyWords : ".$metaKeyWords." <br> ";
	echo "metaDesc : ".$metaDesc." <br> "
	echo "brandId : ".$brandId; 
	echo "categoryIds : ".$categoryIds; 
	echo "categoryId Array : ".print_r($categoryIdArr); 
	echo "minStockVol : ".$minStockVol." <br> "
	exit;*/
	
	if($productId > 0){ //Edit
		$sqlEdit = "UPDATE `product` SET 
		`productTitle` = '".$productTitle."', 
		`productDesc` = '".$productDesc."',
		`metaKeyWords` = '".$metaKeyWords."',
		`metaDesc` = '".$metaDesc."',
		`brandId` = '".$brandId."',
		`minStockVol` = '".$minStockVol."',
		`lastModifiedDate` = NOW()
		WHERE `product`.`productId` = ".$productId;
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		
		/*-----------------------------------Product Category Entry---------------------------*/
		$sqlCatDel = "DELETE FROM `productCategory` WHERE `productCategory`.`productId` = ".$productId;
		//echo $sqlCatDel; exit;
		$sqlCatDel_res = mysqli_query($dbConn, $sqlCatDel);
		if(count($categoryIdArr) > 0){
			for($i = 0; $i < count($categoryIdArr); $i++){
				$sqlCat = "INSERT INTO `productCategory` (`productCategoryId`, `categoryId`, `productId`) VALUES (NULL, '".$categoryIdArr[$i]."', '".$productId."')";
				//echo $sqlCat; exit;
				$sqlCat_res = mysqli_query($dbConn, $sqlCat);
			}
		}
		/*-----------------------------------Product Category Entry---------------------------*/
		/*-----------------------------------Populate Product Combination Pre-compiled Data---*/
		updateLiveTime($dbConn, 'PRODUCT');
		populateProductPreCompiledData($dbConn, $productId);
		updateLiveTime($dbConn, 'BRAND');
		updateLiveTime($dbConn, 'CATEGORY');
		/*-----------------------------------Populate Product Combination Pre-compiled Data---*/
		echo "<script language=\"javascript\">window.location = 'productImage.php?productId=".$productId."'</script>";exit;
	}else if($productId === 0){ //Add
		$sqlAdd = "INSERT INTO `product` (
											`productCode`, 
											`productTitle`, 
											`productDesc`, 
											`productImages`, 
											`productSlug`, 
											`metaKeyWords`, 
											`metaDesc`,  
											`brandId`, 
											`createdDate`, 
											`lastModifiedDate`, 
											`minStockVol`,
											`Status`
										) 
										VALUES (
											'PRODCODE', 
											'".$productTitle."', 
											'".$productDesc."', 
											'noImages.png', 
											'PRODSLUG', 
											'".$metaKeyWords."', 
											'".$metaDesc."', 
											'".$brandId."', 
											NOW(), 
											NOW(), 
											'".$minStockVol."',
											'1'
										)";
		//echo $sqlAdd; exit;
		$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
		$inserted_productId = mysqli_insert_id($dbConn);
		//echo $inserted_productId; exit;
		
		/*-----------------------------------Product Slug Creation----------------------------*/
		$productSlug = clean($productTitle);
		$generatedProductCode = "P".sprintf("%04d", $inserted_productId);
		$sqlAdd2 = "UPDATE `product` SET `productCode` = '".$generatedProductCode."', `productSlug` = '".$productSlug."_".$inserted_productId."' WHERE `product`.`productId` = ".$inserted_productId;
		//echo $sqlAdd2; exit;
		$sqlAdd2_res = mysqli_query($dbConn, $sqlAdd2);
		/*-----------------------------------Product Slug Creation----------------------------*/
		
		/*-----------------------------------Product Category Entry---------------------------*/
		if(count($categoryIdArr) > 0){
			for($i = 0; $i < count($categoryIdArr); $i++){
				$sqlCat = "INSERT INTO `productCategory` (`productCategoryId`, `categoryId`, `productId`) VALUES (NULL, '".$categoryIdArr[$i]."', '".$inserted_productId."')";
				//echo $sqlCat; exit;
				$sqlCat_res = mysqli_query($dbConn, $sqlCat);
			}
		}
		/*-----------------------------------Product Category Entry---------------------------*/
		
		/*-----------------------------------Populate Product Combination Pre-compiled Data---*/
		updateLiveTime($dbConn, 'PRODUCT');
		populateProductPreCompiledData($dbConn, $inserted_productId);
		updateLiveTime($dbConn, 'BRAND');
		updateLiveTime($dbConn, 'CATEGORY');
		/*-----------------------------------Populate Product Combination Pre-compiled Data---*/
		
		echo "<script language=\"javascript\">window.location = 'productImage.php?productId=".$inserted_productId."'</script>";exit;
	}
}else{
	$duplicateProductId=isset($_REQUEST['duplicateProductId'])?(int)$_REQUEST['duplicateProductId']:0;
	//echo $duplicateProductId; exit;
	$p = 0;
	$productCode = "";
	$productTitle = "";
	$productDesc = "";
	$metaKeyWords = "";
	$metaDesc = "";
	$minStockVol = 0;
	$brandId = 0;
	$categoryIds = "";
	if($productId > 0){
		$p = $productId;
	}else if($duplicateProductId > 0){
		$p = $duplicateProductId;
	}
	
	if($p > 0){
		$sql = "SELECT 
		`productCode`,
		`productTitle`,
		`productDesc`,
		`metaKeyWords`,
		`metaDesc`, 
		`minStockVol`,
		`brandId` 
		FROM `product` 
		WHERE `productId` = ".$p;
		//echo $sql; exit;
		$sql_res = mysqli_query($dbConn, $sql);
		$sql_res_fetch = mysqli_fetch_array($sql_res);
		//echo "<pre>"; print_r($sql_res_fetch); echo "</pre>"; exit;
		$productCode = $sql_res_fetch["productCode"];
		$productTitle = $sql_res_fetch["productTitle"];
		$productDesc = $sql_res_fetch["productDesc"];
		$metaKeyWords = $sql_res_fetch["metaKeyWords"];
		$metaDesc = $sql_res_fetch["metaDesc"];
		$minStockVol = $sql_res_fetch["minStockVol"];
		$brandId = $sql_res_fetch["brandId"];

		$sqlCat = "SELECT `categoryId` FROM `productCategory` WHERE `productId` = ".$p;
		//echo $sqlCat; exit;
		$sqlCat_res = mysqli_query($dbConn, $sqlCat);
		while($sqlCat_res_fetch = mysqli_fetch_array($sqlCat_res)){
			$categoryIds = $categoryIds.$sqlCat_res_fetch["categoryId"].",";
		}
		$categoryIds = rtrim($categoryIds, ",");
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Product Entry</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/product.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
      <?php include('includes/header.php'); ?>
      <?php include('includes/sidebar.php'); ?>
      <div class="w3-main">
         <div id="productSectionHolder">
            <header class="w3-container" style="padding-top:22px">
               <h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_63">Product Entry</span></b></h5>
            </header>
            <div class="w3-row-padding w3-margin-bottom">
				<?php include('includes/productProgressTab.php'); ?>
               <h5><?php if($productId > 0){ ?><span id="cms_73">Edit</span><?php }else{ ?><span id="cms_72">Add</span><?php } ?> <span id="cms_74">Initial Product Data</span></h5>
			   <form id="productEntryForm" name="productEntryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productFunctionality.validateProductEntry();">
			   
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="productTitleSpan" class="input-group-addon">
									<span id="cms_75">Title : </span>
								</span>
								<input id="productTitle" name="productTitle" type="text" class="form-control" placeholder="Please Enter Product Title" rel="cms_76" autocomplete="off" value="<?php if(isset($productTitle)){ echo $productTitle; } ?>">
							</div>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="searchBrandSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="searchBrandSpan" class="input-group-addon">
									<span id="cms_43">Search Brands : </span>
								</span>
								<input id="searchBrand" name="searchBrand" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_44" autocomplete="off" value="" onkeyup="productFunctionality.brandPredictiveSearch(this.value);">
								<span id="searchBrandIconSpan" class="input-group-addon">
									<span class="fa fa-search hover"></span>
								</span>
							</div>
							<div id="searchedBrands" class="searchedItemCollection hide">
							</div>
							<div id="selectedBrandItem" class="marBot5">
								<div id="cms_45">Selected Brand : </div>
								<div id="cms_46" class="selectedBrandItem"> No Brands selected yet</div>
							</div>
							<input id="brandId" name="brandId" type="hidden" value="<?php if($brandId != ""){ echo $brandId; }else{ echo "0"; }?>">
						</div>
						<div id="searchCatSection" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="searchCatSpan" class="input-group-addon">
									<span id="cms_47">Search Category : </span>
								</span>
								<input id="searchCat" name="searchCat" type="text" class="form-control" placeholder="Search atleast 3 Characters" rel="cms_44" autocomplete="off" value="" onkeyup="productFunctionality.categoryPredictiveSearch(this.value);">
								<span id="searchCatIconSpan" class="input-group-addon">
									<span class="fa fa-search hover"></span>
								</span>
							</div>
							<div id="searchedCats" class="searchedItemCollection hide">
							</div>
							<div>
								<div id="cms_48">Selected Categories : </div>
								<div id="selectedCatItem">
									<div id="cms_49" class="selectedBrandItem"> No categories selected yet</div>
								</div>
							</div>
							<input id="categoryIds" name="categoryIds" type="hidden" value="<?php echo $categoryIds; ?>">
						</div>
					</div>
					
					<div id="productDescSpan">
						<span id="cms_77">Description :</span>
					</div>

					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="descHelper" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						</div>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div id="productDescHolder" class="marBot5">
								<div id="productDescBody"></div>
								<input type="hidden" id="productDesc" name="productDesc" value="<?php echo $productDesc; ?>">
							</div>
							<br clear="all">
							<div id="productDescErrHolder"></div>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group marBot5">
							<span id="metaKeyWordsSpan" class="input-group-addon">
								<span id="cms_80">Meta Keywords : </span>
							</span>
							<input id="metaKeyWords" name="metaKeyWords" type="text" class="form-control" placeholder="Please Enter Product Meta Keywords" rel="cms_81" autocomplete="off" value="<?php if(isset($metaKeyWords)){ echo $metaKeyWords; } ?>">
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group marBot5">
							<span id="metaDescSpan" class="input-group-addon">
								<span id="cms_82">Meta Description : </span>
							</span>
							<input id="metaDesc" name="metaDesc" type="text" class="form-control" placeholder="Please Enter Product Meta Description" rel="cms_83" autocomplete="off" value="<?php if(isset($metaDesc)){ echo $metaDesc; } ?>">
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group marBot5">
							<span id="minStockVolSpan" class="input-group-addon">
								<span id="cms_84">Minimum Stock Volume : </span>
							</span>
							<input id="minStockVol" name="minStockVol" type="number" class="form-control" placeholder="Please Enter Product Minimum Stock Volume" rel="cms_85" autocomplete="off" value="<?php if(isset($minStockVol)){ echo $minStockVol; } ?>">
							<span id="minStockVolDescSpan" class="input-group-addon">
								<span id="cms_86">* This Minimum Stock Volume, which sholud be present in the inventry always</span>
							</span>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
						<input id="productCode" name="productCode" type="hidden" value="<?php echo $productCode; ?>">
						<input id="productId" name="productId" type="hidden" value="<?php echo $productId; ?>">
						<input id="productTitleHdn" name="productTitleHdn" type="hidden" value="<?php if(isset($productTitle)){ echo $productTitle; } ?>">
						<button type="submit" class="btn btn-success marTop5"><span id="cms_87">Save</span></button>
					</div>
			   </form>
			   <input id="productDescriptionHelperData" name="productDescriptionHelperData" type="hidden" value='<?php echo readPreCompliedData("PRODUCTDESCTIONHELPER"); ?>'>
			   <input id="projectInformationData" name="projectInformationData" type="hidden" value='<?php echo readPreCompliedData("PROJECTINFORMATION"); ?>'>
            </div>
         </div>
         <br>
         <?php include('includes/footer.php'); ?>
      </div>
   </body>
</html>