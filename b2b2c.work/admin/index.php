<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "COMMON";
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Dashboard</title>
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
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/index.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="indexSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5><b><i class="fa fa-dashboard"></i> <span id="cms_5">Dashboard</span></b></h5>
				</header>
				<div class="w3-row-padding w3-margin-bottom">
					<?php 
						//echo "<pre>"; print_r($allPages); echo "</pre>"; exit;
						//echo "<pre>"; print_r($permissionPages); echo "</pre>"; exit;
						for($i = 0; $i < COUNT($permissionPages); $i++){ 
							$menuData = "";
							for($j = 0; $j < COUNT($allPages); $j++){
								if($permissionPages[$i] == $allPages[$j][1]){
									$menuData = $allPages[$j];
								}
							}
							//echo "<pre>"; print_r($menuData); echo "</pre>"; //exit;
							if(@$menuData[4] == 0){
							?>
							<div class="w3-quarter">
								<div class="w3-container <?php //echo @$menuData[5]; ?> w3-padding-16">
									<div class="w3-left">
										<a href="<?php echo $permissionPages[$i]; ?>"><i class="fa <?php echo @$menuData[3]; ?> w3-xxxlarge"></i></a>
									</div>
									<div class="w3-right"></div>
									<div class="w3-clear"></div>
									<h4><a href="<?php echo $permissionPages[$i]; ?>"><?php echo @$menuData[2]; ?></a></h4>
								</div>
							</div>
							<?php
							}
						}
						$i = 0;
						$j = 0;
						?>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>