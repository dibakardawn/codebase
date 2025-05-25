<?php
include('../config/config.php');
$section = "SUPPLIERPORTAL";
$page = "LOGOUT";

unset($_SESSION['supplierId']);
unset($_SESSION['supplierName']);
unset($_SESSION['supplierContactPerson']);
unset($_SESSION['supplierContactNo']);
unset($_SESSION['supplierEmail']);
unset($_SESSION['msg']);
session_destroy();
//header('location:login.php');
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php echo SITENAME; ?> Supplier Portal Logout</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" type="image/x-icon" href="<?php echo SITEURL; ?>favicon.ico">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/supplierStyle/supplierStyle.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/supplierFunctionality/supplierFunctionality.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body>
		<div class="container-fluid">
			<div class="row">
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"><img src="<?php echo "../assets/images/logo.jpg"; ?>" alt="logo" style="width: 200px; margin-bottom: 20px;"></div>
					<h1 class="text-center" id="cms_628">Logged out sucessfully</h1>
					<button id="loginBtn" type="button" class="btn btn-success marTop5" onClick="supplierFunctionality.gotoLogin()" rel="cms_629">Login Again</button>
				</div>
			</div>
			<input id="CMSDATA" name="CMSDATA" type="hidden" value='<?php if($section != "" && $page != ""){ echo readPreCompiledCmsData($section, $page); }?>'>
		</div>
	</body>
</html>
