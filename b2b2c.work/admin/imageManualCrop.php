<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

if(count($_POST)){
	$folder=isset($_REQUEST['folder'])?$_REQUEST['folder']:"";
	$imageFile = isset($_REQUEST['imageFile'])?$_REQUEST['imageFile']:"";
	$id=isset($_REQUEST['id'])?(int)$_REQUEST['id']:0;
	$xCord = isset($_REQUEST['xCord'])?$_REQUEST['xCord']:0;
	$yCord = isset($_REQUEST['yCord'])?$_REQUEST['yCord']:0;
	$croppedwidth = isset($_REQUEST['croppedwidth'])?$_REQUEST['croppedwidth']:0;
	$croppedHeight = isset($_REQUEST['croppedHeight'])?$_REQUEST['croppedHeight']:0;
	
	/*echo "<br>";
	echo "folder : ".$folder."<br>";
	echo "imageFile : ".$imageFile."<br>";
	echo "id : ".$id."<br>";
	echo "xCord : ".$xCord."<br>";
	echo "yCord : ".$yCord."<br>";
	echo "croppedwidth : ".$croppedwidth."<br>";
	echo "croppedHeight : ".$croppedHeight."<br>";
	exit;*/
	
	if($folder != "" && $imageFile != "" && $id > 0){
		$imgPath = $_SERVER['DOCUMENT_ROOT'].'/'.UPLOADFOLDER.$folder.'/'.$imageFile;
		$fileExt = getExt($imageFile);
		//echo $fileExt; exit;
		if($fileExt == 'png'){
			$im = imagecreatefrompng($imgPath);
			$size = min(imagesx($im), imagesy($im));
			$im2 = imagecrop($im, ['x' => $xCord, 'y' => $yCord, 'width' => $croppedwidth, 'height' => $croppedHeight]);
			if ($im2 !== FALSE) {
				imagepng($im2, $imgPath);
				imagedestroy($im2);
			}
			imagedestroy($im);
		}else if($fileExt == 'jpg'){
			$img = imagecreatefromjpeg($imgPath);
			$area = ["x" => $xCord, "y" => $yCord,"width" => $croppedwidth, "height" => $croppedHeight];
			$crop = imagecrop($img, $area);
			imagejpeg($crop, $imgPath, 50);
			imagedestroy($img);
			imagedestroy($crop);
		}else if($fileExt == 'jpeg'){
			$img = imagecreatefromjpeg($imgPath);
			$area = ["x" => $xCord, "y" => $yCord,"width" => $croppedwidth, "height" => $croppedHeight];
			$crop = imagecrop($img, $area);
			imagejpeg($crop, $imgPath, 50);
			imagedestroy($img);
			imagedestroy($crop);
		}
		
		if($folder == "products"){
			echo "<script language=\"javascript\">window.location = 'productDetail.php?productId=".$id."'</script>";exit;
		}else if($folder == "productBrand"){
			echo "<script language=\"javascript\">window.location = 'productBrandDetail.php?brandId=".$id."'</script>";exit;
		}else if($folder == "productScroller"){
			
		}else if($folder == "userImage"){
			echo "<script language=\"javascript\">window.location = 'userDetail.php?userId=".$id."'</script>";exit;
		}
	}else{
		echo "<script language=\"javascript\">window.location = 'index.php'</script>";exit;
	}
}else{
	$id=0;
	$folder=isset($_REQUEST['folder'])?$_REQUEST['folder']:"";
	$imageFile=isset($_REQUEST['imageFile'])?$_REQUEST['imageFile']:"";
	if($folder != "" || $imageFile != ""){
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
		<title><?php echo SITETITLE; ?> Admin | Image Manual Crop</title>
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
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/plugins/rcrop.min.css" type="text/css" />
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/rcrop.min.js"></script>
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
			<div id="productImageManualCropSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_924">Image Manual Crop</span>
						</b>
					</h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php if($id > 0){ include('includes/imageProcessingProgressBar.php'); } ?>
					<?php if($id > 0){ ?>
						<div class="col-lg-8 col-md-8 col-sm-12 col-xs-12 nopaddingOnly">
							<img id="cropbox" src="<?php echo SITEURL."uploads/".$folder."/".$imageFile; ?>" class="w100p productImageBlock5"/>
						</div>
						<div class="col-lg-4 col-md-8 col-sm-12 col-xs-12 marTop5">
							<div class="input-group marBot5">
								<span id="xSpan" class="input-group-addon">x : </span>
								<input id="x" name="x" type="number" step="1" class="form-control" autocomplete="off" value="" onchange="settingsFunctionality.reCrop();">
							</div>
							<div class="input-group marBot5">
								<span id="ySpan" class="input-group-addon">y : </span>
								<input id="y" name="y" type="number" step="1" class="form-control" autocomplete="off" value="" onchange="settingsFunctionality.reCrop();">
							</div>
							<div class="input-group marBot5">
								<span id="widthSpan" class="input-group-addon"><span id="cms_906">Width</span>: </span>
								<input id="width" name="width" type="number" step="1" class="form-control" autocomplete="off" value="" onchange="settingsFunctionality.reCrop();">
							</div>
							<div class="input-group marBot5">
								<span id="heightSpan" class="input-group-addon"><span id="cms_907">Height</span>: </span>
								<input id="height" name="height" type="number" step="1" class="form-control" autocomplete="off" value="" onchange="settingsFunctionality.reCrop();">
							</div>
							<button type="button" id="saveCroppedImg" class="btn btn-success pull-Left" onclick="settingsFunctionality.saveCroppedImage();" rel="cms_925">Save Cropped Image</button>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<form id="imageManualCropForm" name="imageManualCropForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>">
								<input id="folder" name="folder" type="hidden" value="<?php echo $folder; ?>">
								<input id="imageFile" name="imageFile" type="hidden" value="<?php echo $imageFile; ?>">
								<input id="id" name="id" type="hidden" value="<?php echo $id; ?>">
								<input id="xCord" name="xCord" type="hidden" value="">
								<input id="yCord" name="yCord" type="hidden" value="">
								<input id="croppedwidth" name="croppedwidth" type="hidden" value="">
								<input id="croppedHeight" name="croppedHeight" type="hidden" value="">
							</form>
						</div>
					<?php }else{ ?>
						<div id="cms_935" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 redText">
							You need to select an image to crop. Please go to Product, Brand, Category Module then select an image crop option.
						</div>
					<?php } ?>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>