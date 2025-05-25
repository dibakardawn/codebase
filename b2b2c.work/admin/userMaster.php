<?php
	include('../config/config.php');
	include('auth.php');
	echo "Loading...";
	
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		$userId=isset($_REQUEST['userId'])?$_REQUEST['userId']:"";
		if(intval($userId) > 0){
			$sql_select = "SELECT `userImage` FROM `userMaster` WHERE `userMaster`.`userId` = ".intval($userId);
			//echo $sql_select; exit;
			$sql_select_res = mysqli_query($dbConn, $sql_select);
			$sql_select_res_fetch = mysqli_fetch_array($sql_select_res);
			$userImage = $sql_select_res_fetch["userImage"];
			deleteUserImage($userImage);
			$sql_delete = "DELETE FROM `userMaster` WHERE `userMaster`.`userId` = ".intval($userId);
			//echo $sql_delete; exit;
			$sql_delete_res = mysqli_query($dbConn, $sql_delete);
		}
		echo "<script language=\"javascript\">window.location = 'userMaster.php'</script>";exit;
	}
	?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Users</title>
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
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/user.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<header class="w3-container" style="padding-top:22px">
				<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> Users</b></h5>
			</header>
			<div class="w3-container">
				<h5>List Of Users</h5>
				<button type="submit" class="w3-button w3-dark-grey" onclick="userFunctionality.addUser()">Add User</button>
				<br /><br />
				<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
					<tr>
						<td><strong>Image</strong></td>
						<td><strong>Name</strong></td>
						<td><strong>Username</strong></td>
						<td><strong>Email</strong></td>
						<td><strong>Type</strong></td>
						<td><strong>Action</strong></td>
					</tr>
					<?php 
						$sql_users = "select * from `userMaster`";
						$sql_users_res = mysqli_query($dbConn, $sql_users);
						while($sql_users_res_fetch = mysqli_fetch_array($sql_users_res)){
						?>
					<tr>
						<td>
							<?php 
								$userImage = "";
								if($sql_users_res_fetch["userImage"] != null && $sql_users_res_fetch["userImage"] != ""){
									$userImage = "../".UPLOADFOLDER."userImage/".$sql_users_res_fetch["userImage"];
								}else{
									$userImage = "../assets/images/avatar1.png";
								}
								?>
							<img src="<?php echo $userImage; ?>" alt="<?php echo $userImage; ?>" class="w3-circle" style="width:30px;">
						</td>
						<td><?php echo $sql_users_res_fetch["FirstName"]." ".$sql_users_res_fetch["LastName"]; ?></td>
						<td><?php echo $sql_users_res_fetch["username"]; ?></td>
						<td><a href="mailto:<?php echo $sql_users_res_fetch["email"]; ?>" target="_top"><?php echo $sql_users_res_fetch["email"]; ?></a></td>
						<td><?php if(intval($sql_users_res_fetch["userType"]) == 1){ echo "ADMIN"; }else if(intval($sql_users_res_fetch["userType"]) == 2){ echo "AUTHOR"; }?></td>
						<td>
							<i class="fa fa-pencil-square-o greenText marRig5" onclick="userFunctionality.editUser(<?php echo $sql_users_res_fetch["userId"]; ?>)"></i>
							<i class="fa fa-trash-o redText marRig5" onclick="userFunctionality.deleteUser(<?php echo $sql_users_res_fetch["userId"]; ?>)"></i>
						</td>
					</tr>
					<?php } ?>
				</table>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>