<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

@ini_set('upload_max_size', '64M');
@ini_set('post_max_size', '64M');
@ini_set('max_execution_time', '300');

if(count($_POST)){
	$folder=isset($_REQUEST['folder'])?$_REQUEST['folder']:"";
	$imageFile = isset($_REQUEST['imageFile'])?$_REQUEST['imageFile']:"";
	$imgBase64Data = isset($_REQUEST['imgBase64Data'])?$_REQUEST['imgBase64Data']:"";
	$id=isset($_REQUEST['id'])?(int)$_REQUEST['id']:0;
	
	echo "<br>";
	echo "folder : ".$folder."<br>";
	echo "imageFile : ".$imageFile."<br>";
	echo "imgBase64Data : ".$imgBase64Data."<br>";
	echo "id : ".$id."<br>";exit;
	
	if($folder != "" || $id > 0 || $croppedImagePath != "" || $imageFile != ""){
		//xxxx getting 413 error
		/*-----------------------------------Delete Existing File----------------------------------*/
		//deleteFile($imageFile, "uploads/".$folder."/");
		/*-----------------------------------Delete Existing File----------------------------------*/
		
		/*-----------------------------------Create cropped image file with same name--------------*/
		//$newImgPath = $_SERVER['DOCUMENT_ROOT'].'/'.UPLOADFOLDER.$folder.'/'.$imageFile;
		//echo $newImgPath; exit;
		//file_put_contents($newImgPath, file_get_contents($croppedImagePath));
		/*-----------------------------------Create cropped image file with same name--------------*/
		
		/*if($folder == "products"){
			echo "<script language=\"javascript\">window.location = 'productDetail.php?productId=".$id."'</script>";exit;
		}else if($folder == "productBrand"){
			echo "<script language=\"javascript\">window.location = 'productBrandDetail.php?brandId=".$id."'</script>";exit;
		}else if($folder == "productScroller"){
			
		}else if($folder == "userImage"){
			echo "<script language=\"javascript\">window.location = 'userDetail.php?userId=".$id."'</script>";exit;
		}*/
	}else{
		echo "<script language=\"javascript\">window.location = 'index.php'</script>";exit;
	}
}else{
	$id=0;
	$folder=isset($_REQUEST['folder'])?$_REQUEST['folder']:"";
	$imageFile=isset($_REQUEST['imageFile'])?$_REQUEST['imageFile']:"";
	if($folder != "" || $imageFile != ""){
		$id=0;
		if($folder == "products"){
			$id=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
		}else if($folder == "productBrand"){
			$id=isset($_REQUEST['brandId'])?(int)$_REQUEST['brandId']:0;
		}else if($folder == "productScroller"){
			
		}else if($folder == "userImage"){
			$id=isset($_REQUEST['userId'])?(int)$_REQUEST['userId']:0;
		}
	}
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Image Filters</title>
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
		<!--<script type='text/javascript' src="https://cdnjs.cloudflare.com/ajax/libs/camanjs/4.0.0/caman.full.min.js"></script>-->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/caman.full.js"></script>
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/settings.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="productImageFiltersSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_926">Image Filters</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php if($id > 0){ include('includes/imageProcessingProgressBar.php'); } ?>
					<?php if($id > 0){ ?>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<img id="inputImg" src="<?php echo SITEURL."uploads/".$folder."/".$imageFile; ?>" class="w98p productImageBlock5" data-caman=""/>
						</div>
						<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Brightness:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="brightness" type="range" min="-100" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="brightness_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Contrast:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="contrast" type="range" min="-100" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="contrast_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Saturation:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="saturation" type="range" min="-100" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="saturation_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Vibrance:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="vibrance" type="range" min="-100" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="vibrance_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Exposure:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="exposure" type="range" min="-100" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="exposure_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Hue:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="hue" type="range" min="0" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="hue_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Sepia:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="sepia" type="range" min="0" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="sepia_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Gamma:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="gamma" type="range" min="0" max="10" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="gamma_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Noise:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="noise" type="range" min="0" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="noise_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 nopaddingOnly text-left">Clip:</div>
								<div class="col-lg-9 col-md-9 col-sm-9 col-xs-9 nopaddingOnly marTop5">
									<input id="clip" type="range" min="0" max="100" value="0" onchange="settingsFunctionality.changeFilter(this.id, this.value);">
								</div>
								<div id="clip_value" class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly text-center">0</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="vintage" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Vintage</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="lomo" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Lomo</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="clarity" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Clarity</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="sinCity" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">SinCity</span>
								</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="sunrise" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Sunrise</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="crossProcess" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Cross Process</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="orangePeel" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Orange Peel</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="love" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Love</span>
								</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="grungy" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Grungy</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="jarques" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Jarques</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="pinhole" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Pinhole</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="oldBoot" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Old Boot</span>
								</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="glowingSun" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Glowing Sun</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="hazyDays" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Hazy Days</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="herMajesty" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Her Majesty</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="nostalgia" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Nostalgia</span>
								</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="hemingway" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Heming way</span>
								</div>
								
								<div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 nopaddingOnly">
									<input type="radio" id="concentrate" name="imageFilter" value="0" onclick="settingsFunctionality.changeFilter(this.id, this.value);">
									<span class="radioText">Concentrate</span>
								</div>
							</div>
							
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5">
								<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 nopaddingOnly">
									<button id="revert" type="button" class="btn btn-success btn-xs" onclick="settingsFunctionality.changeFilter(this.id, 0);" rel="cms_927">Revert Effect</button>
								</div>
								
								<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 nopaddingOnly">
									<button id="resetBtn" type="button" class="btn btn-success btn-xs" onclick="window.location.reload();" rel="cms_928">Reset All Effects</button>
								</div>
								
								<div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 nopaddingOnly">
									<button id="saveBtn" type="button" class="btn btn-success btn-xs" onclick="settingsFunctionality.saveChanges();" rel="cms_929">Save Changes</button>
								</div>
							</div>
							
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marTop5 nopaddingOnly">
							<form id="imageFilterForm" name="imageFilterForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>">
								<input id="folder" name="folder" type="hidden" value="<?php echo $folder; ?>">
								<input id="imageFile" name="imageFile" type="hidden" value="<?php echo $imageFile; ?>">
								<input id="id" name="id" type="hidden" value="<?php echo $id; ?>">
								<input id="imgBase64Data" name="imgBase64Data" type="hidden" value="">
							</form>
						</div>
					<?php }else{ ?>
						<div id="cms_936" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 redText">
							You need to select an image to filter. Please go to Product, Brand, Category Module then select an image filter option.
						</div>
					<?php } ?>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>