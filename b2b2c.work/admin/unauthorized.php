<?php
include('../config/config.php');
//include('auth.php');

$section = "ADMIN";
$page = "COMMON";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Unauthorized Access</title>
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
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<div class="container marTop30">
			<div class="panel panel-danger">
				<div class="panel-heading">
					<h3 class="panel-title text-center" id="cms_853">Access Denied</h3>
				</div>
				<div class="panel-body text-center">
					<div><span class="glyphicon glyphicon-ban-circle f38 redText"></span></div>
					<h2 id="cms_854">Unauthorized Access</h2>
					<p class="lead" id="cms_855">You don't have permission to access this page or resource.</p>
					<p id="cms_856">If you believe this is an error, please contact your system administrator.</p>
					<button type="button" class="btn btn-success" rel="cms_857" onclick="window.location.replace('index.php');">Return to Home</button>
				</div>
			</div>
		</div>
	</body>
</html>