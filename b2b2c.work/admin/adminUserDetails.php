<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "ADMINUSER";

$userId=isset($_REQUEST['userId'])?(int)$_REQUEST['userId']:0;
if($userId > 0){
	/*----------------------------------Populating User Roles---------------------------------------*/
	$sqlUserRole = "SELECT `userRoleid`,`userRole`,`rolePermissions` FROM `adminUserRole` WHERE 1";
	//echo $sqlUserRole; exit;
	$sqlUserRole_res = mysqli_query($dbConn, $sqlUserRole);
	$userRoleObjectArray = array();
	while($sqlUserRole_res_fetch = mysqli_fetch_array($sqlUserRole_res)){
		$userRoleObject = (object) [
								 'userRoleid' => $sqlUserRole_res_fetch["userRoleid"], 
								 'userRole' => $sqlUserRole_res_fetch["userRole"], 
								 'rolePermissions' => $sqlUserRole_res_fetch["rolePermissions"]
								];
		//echo json_encode($userRoleObject);exit;
		$userRoleObjectArray[] = $userRoleObject;
	}
	if (is_array($userRoleObjectArray) && !empty($userRoleObjectArray)) {
		$safeUserRoleSerializedData = htmlspecialchars(json_encode($userRoleObjectArray), ENT_QUOTES, 'UTF-8');
	} else {
		$safeUserRoleSerializedData = '[]';
	}
	/*----------------------------------Populating User Roles---------------------------------------*/
	
	/*----------------------------------Populating Admin Menus--------------------------------------*/
	$sqlAdminMenu = "SELECT `menuId`,
					`menuParentId`,
					`menuName`,
					`bootstrapIcon`,
					`menuIndex` 
					FROM `adminMenu` 
					WHERE `status` = 1";
	//echo $sqlAdminMenu; exit;
	$sqlAdminMenu_res = mysqli_query($dbConn, $sqlAdminMenu);
	$adminMenuObjectArray = array();
	while($sqlAdminMenu_res_fetch = mysqli_fetch_array($sqlAdminMenu_res)){
		$adminMenuObject = (object) [
								 'menuId' => $sqlAdminMenu_res_fetch["menuId"], 
								 'menuParentId' => $sqlAdminMenu_res_fetch["menuParentId"], 
								 'menuName' => $sqlAdminMenu_res_fetch["menuName"], 
								 'bootstrapIcon' => $sqlAdminMenu_res_fetch["bootstrapIcon"], 
								 'menuIndex' => $sqlAdminMenu_res_fetch["menuIndex"]
								];
		//echo json_encode($adminMenuObject);exit;
		$adminMenuObjectArray[] = $adminMenuObject;
	}
	if (is_array($adminMenuObjectArray) && !empty($adminMenuObjectArray)) {
		$safeAdminMenuSerializedData = htmlspecialchars(json_encode($adminMenuObjectArray), ENT_QUOTES, 'UTF-8');
	} else {
		$safeAdminMenuSerializedData = '[]';
	}
	/*----------------------------------Populating Admin Menus--------------------------------------*/
	
	/*----------------------------------Populating Admin User Data----------------------------------*/
	$sql = "SELECT `adminUser`.`userImage`,
				CONCAT(`adminUser`.`userFirstName`, ' ', `adminUser`.`userLastName`, ' [', `adminUserRole`.`userRole`, ']') AS `name`,
				`adminUser`.`status`,
				IF(`adminUser`.`status` = 1, 'Active', 'Inactive') AS `statusLabel`,
				`adminUser`.`userPhno`,
				`adminUser`.`userEmail`,
				`adminUser`.`username`,
				`adminUser`.`permissions`
			FROM `adminUser` 
			INNER JOIN `adminUserRole`
				ON `adminUserRole`.`userRoleid` = `adminUser`.`userRoleid`
			WHERE `adminUser`.`userId` = ".$userId;
	//echo $sql; exit;
	$sql_res = mysqli_query($dbConn, $sql);
	$sql_res_fetch = mysqli_fetch_array($sql_res);
	/*----------------------------------Populating Admin User Data----------------------------------*/
	
}else{
	echo "<script language=\"javascript\">window.location = 'adminUsers.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Admin User Details</title>
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
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/plugins/hummingbird-treeview.css" >
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
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/plugins/hummingbird-treeview.js"></script>
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
							<span id="cms_811">Admin User Details</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<div class="col-lg-8 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly wordWarp">
							<div>
								<b id="cms_786">Name</b> : <?php echo $sql_res_fetch["name"]; ?>
							</div>
							<div>
								<b id="cms_810">Status</b> : 
								<?php 
									if (intval($sql_res_fetch["status"]) == 1){
										echo "<span class='greenText'>".$sql_res_fetch["statusLabel"]."</span>"; 
									}else{
										echo "<span class='redText'>".$sql_res_fetch["statusLabel"]."</span>"; 
									}
								?>
							</div>
							<div>
								<b id="cms_798">Phone No</b> : <i class="fa fa-phone blueText marRig5"></i><?php echo $sql_res_fetch["userPhno"]; ?>
							</div>
							<div>
								<b>Email</b> : <i class="fa fa-envelope greenText marRig5"></i><?php echo $sql_res_fetch["userEmail"]; ?>
							</div>
							<div>
								<b>Username</b> : <?php echo $sql_res_fetch["username"]; ?>
							</div>
							<div class="marBot10">
								<button type="button" class="btn btn-success marTop5" onclick="adminUsersFunctionality.editUser(<?php echo $userId; ?>)" rel="cms_812">Edit Admin User</button>
								<button type="button" class="btn btn-success marTop5" onclick="adminUsersFunctionality.gotoAdminUsers()" rel="cms_813">List of Admin Users</button>
							</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<div class="productImageBlock5 pull-right">
								<img src="<?php echo SITEURL.UPLOADFOLDER."userImage/".$sql_res_fetch["userImage"] ;?>" alt="<?php echo $sql_res_fetch["userImage"]; ?>" onerror="appCommonFunctionality.onImgError(this)">
							</div>
						</div>
					</div>
					<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly sectionBlock2 marBot10 maxH500 scrollY">
						<h5 id="cms_804" class="text-center">Permissions</h5>
						<div id="treeview-container" class="hummingbird-treeview f12">
							<ul id="treeview" class="hummingbird-base">
							</ul>
						</div>
					</div>
				</div>
				<input type="hidden" id="permissions" name="permissions" value="<?php if($userId > 0){ echo $sql_res_fetch["permissions"]; }?>">
				<input type="hidden" id="adminMenuSerializedData" name="adminMenuSerializedData" value="<?php echo $safeAdminMenuSerializedData; ?>">
				<input type="hidden" id="userRoleSerializedData" name="userRoleSerializedData" value="<?php echo $safeUserRoleSerializedData; ?>">
			</div>
			<br clear="all">
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>