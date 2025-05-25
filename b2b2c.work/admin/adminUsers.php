<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "ADMINUSER";

$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
if($ACTION == "DELETE"){
	$userId=isset($_REQUEST['userId'])?(int)$_REQUEST['userId']:0;
	if($userId > 0){
		/*--------------------------------Check & Delete User Image--------------------------------*/
		$sqlDelete = "SELECT `userImage` FROM `adminUser` WHERE `userId` = ".$userId;
		//echo $sqlDelete; exit;
		$sqlDelete_res = mysqli_query($dbConn, $sqlDelete);
		if ($sqlDelete_res && mysqli_num_rows($sqlDelete_res) > 0) {
			$sqlDelete_res_fetch = mysqli_fetch_array($sqlDelete_res);
			$userImage = $sqlDelete_res_fetch["userImage"];
			//echo $userImage; exit;
			if (!empty($userImage)) {
				deleteFile($userImage, UPLOADFOLDER."userImage/");
			}
		}
		/*--------------------------------Check & Delete User Image--------------------------------*/
		
		/*--------------------------------Delete User ---------------------------------------------*/
		$sqlDeleteUser = "DELETE FROM adminUser WHERE `adminUser`.`userId` = ".$userId;
		//echo $sqlDeleteUser; exit;
		$sqlDeleteUser_res = mysqli_query($dbConn, $sqlDeleteUser);
		/*--------------------------------Delete User ---------------------------------------------*/
	}
	echo "<script language=\"javascript\">window.location = 'adminUsers.php'</script>";exit;
}

?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Admin Users</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/adminUsers.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="adminUserSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_785">Admin Users</span>
						</b>
					</h5>
					<button type="button" class="btn btn-success pull-right marBot5" onclick="adminUsersFunctionality.addUser()" rel="cms_790">Add Admin User</button>
				</header>
				<div class="w3-row-padding w3-margin-bottom scrollX">
					<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW842">
						<tr>
							<td width="40%"><strong id="cms_786">Name</strong></td>
							<td width="35%"><strong id="cms_787">Contact</strong></td>
							<td width="15%"><strong id="cms_788">Username</strong></td>
							<td width="10%"><strong id="cms_789">Action</strong></td>
						</tr>
						<?php
						$sql = "SELECT 
									`adminUser`.`userId`,
									`adminUser`.`userImage`,
									CONCAT(`adminUser`.`userFirstName`, ' ', `adminUser`.`userLastName`, ' [', `adminUserRole`.`userRole`, ']') AS `name`,
									`adminUser`.`status`,
									IF(`adminUser`.`status` = 1, 'Active', 'Inactive') AS `statusLabel`,
									`adminUser`.`userPhno`,
									`adminUser`.`userEmail`,
									`adminUser`.`username`
								FROM `adminUser` 
								INNER JOIN `adminUserRole`
									ON `adminUserRole`.`userRoleid` = `adminUser`.`userRoleid`
								WHERE 1 
								ORDER BY `adminUser`.`userId` ASC";
						//echo $sql; exit;
						$sql_res = mysqli_query($dbConn, $sql);
						while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						?>
							<tr>
								<td>
									<div>
										<span class="pull-left">
											<img src="<?php echo SITEURL.UPLOADFOLDER."userImage/".$sql_res_fetch["userImage"]; ?>" class="productImage" alt="<?php echo $sql_res_fetch["userImage"]; ?>" onerror="appCommonFunctionality.onImgError(this)">
										</span>
										<span class="pull-left marleft5">
											<span class="blueText hover" onclick="adminUsersFunctionality.goToUserDetail(<?php echo $sql_res_fetch["userId"]; ?>)"><?php echo $sql_res_fetch["name"]; ?></span><br>
											<?php if(intval($sql_res_fetch["status"]) == 1){ ?>
												<span class="greenText f12"><?php echo $sql_res_fetch["statusLabel"]; ?></span>
											<?php } else { ?>
												<span class="redText f12"><?php echo $sql_res_fetch["statusLabel"]; ?></span>
											<?php } ?>
										</span>
									</div>
								</td>
								<td class="f12">
									<div>
										<i class="fa fa-phone blueText"></i>
										<span><?php echo $sql_res_fetch["userPhno"]; ?></span>
									</div>
									<div>
										<i class="fa fa-envelope greenText"></i> 
										<span class="blueText hover"><?php echo $sql_res_fetch["userEmail"]; ?></span>
									</div>
								</td>
								<td class="f20">
									<span class="blueText hover" onclick="adminUsersFunctionality.goToUserDetail(<?php echo $sql_res_fetch["userId"]; ?>)"><?php echo $sql_res_fetch["username"]; ?></span>
								</td>
								<td>
									<div class="spaceBetweenSection">
										<i class="fa fa-tv marleft5 blueText hover" onclick="adminUsersFunctionality.goToUserDetail(<?php echo $sql_res_fetch["userId"]; ?>)"></i>
										<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="adminUsersFunctionality.editUser(<?php echo $sql_res_fetch["userId"]; ?>)"></i>
										<!--<i class="fa fa-trash-o marleft5 redText hover" onclick="adminUsersFunctionality.deleteUser(<?php //echo $sql_res_fetch["userId"]; ?>)"></i>-->
									</div>
								</td>
							</tr>
						<?php
						} 
						?>
					</table>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>