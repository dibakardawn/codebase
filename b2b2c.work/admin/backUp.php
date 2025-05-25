<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "SETTINGS";

/*--------------------------------------------Deleting BackUp Zip File-----------------------------------*/
$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
if($ACTION == "DELETE"){
	$backUpName=isset($_REQUEST['backUpName'])?$_REQUEST['backUpName']:"";
	if($backUpName != ""){
		deleteFile($backUpName, "backup/");
	}
	echo "<script language=\"javascript\">window.location = 'backUp.php'</script>";exit;
}
/*--------------------------------------------Deleting BackUp Zip File-----------------------------------*/

$zipFiles = glob("../backup/*.zip");
if (!is_array($zipFiles)) {
    $zipFiles = [];
}
$sanitizedZipFiles = array_filter(array_map(function($file) {
    $base = basename($file);
    return preg_match('/^[a-zA-Z0-9_\-\.]+\.zip$/', $base) ? $base : null;
}, $zipFiles));

$zipFileJsonValue = htmlspecialchars(json_encode(['zipFiles' => $sanitizedZipFiles]), ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Backup Functionality</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/settings.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="backUpSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_875">Backup Functionality</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20">
						<div class="col-lg-4 col-md-4 col-sm-8 col-xs-8 nopaddingOnly">
							<div class="input-group input-group-md">
								<span class="input-group-addon" id="cms_876">BackUp Name</span>
								<input type="text" id="backUpName" name="backUpName" class="form-control" value="">
							</div>
						</div>
						<div class="col-lg-8 col-md-8 col-sm-4 col-xs-4">
							<button id="submitBtn" type="button" class="btn btn-success pull-left" rel="cms_877" onclick="settingsFunctionality.createBackup()">Create Backup</button>
						</div>
					</div>
					<h5>
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_878">List of BackUp Files</span>
						</b>
					</h5>
					<div id="backUpTableHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly"></div>
					<input type="hidden" id="zipFileSerializedData" name="zipFileSerializedData" value="<?php echo $zipFileJsonValue; ?>">
				</div>
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>