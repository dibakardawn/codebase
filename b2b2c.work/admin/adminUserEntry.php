<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "ADMINUSER";

$userId=isset($_REQUEST['userId'])?(int)$_REQUEST['userId']:0;
if(count($_POST)){
	$userFirstName=isset($_REQUEST['userFirstName'])?ucfirst($_REQUEST['userFirstName']):"";
	$userLastName=isset($_REQUEST['userLastName'])?ucfirst($_REQUEST['userLastName']):"";
	$userPhno=isset($_REQUEST['userPhno'])?$_REQUEST['userPhno']:"";
	$userEmail=isset($_REQUEST['userEmail'])?$_REQUEST['userEmail']:"";
	$userRoleid=isset($_REQUEST['userRoleDDL'])?$_REQUEST['userRoleDDL']:"";
	$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
	$password=isset($_REQUEST['password'])?$_REQUEST['password']:"";
	$permissions=isset($_REQUEST['permissions'])?$_REQUEST['permissions']:"";
	
	/*echo "userId : ".$userId."<br>";
	echo "userFirstName : ".$userFirstName."<br>";
	echo "userLastName : ".$userLastName."<br>";
	echo "userPhno : ".$userPhno."<br>";
	echo "userEmail : ".$userEmail."<br>";
	echo "userRoleid : ".$userRoleid."<br>";
	echo "username : ".$username."<br>";
	echo "password : ".$password."<br>";
	echo "permissions : ".$permissions."<br>";
	exit;*/
	
	if($userFirstName != "" && $userLastName != "" && $userRoleid != "" && $permissions != ""){
		if($userId > 0){
			
			/*--------------------------------Check & Delete User Image--------------------------------*/
			if (!empty($_FILES['userImage']['name'])) {
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
			}
			/*--------------------------------Check & Delete User Image--------------------------------*/
			
			$userImage = fileUpload($userId, "uploads/userImage/", "userImage", "userImage", ALLOWEDEXTENSIONS);
			if (!empty($userImage)) {
				$sql = "UPDATE `adminUser` SET 
				`userFirstName` = '".$userFirstName."', 
				`userLastName` = '".$userLastName."',
				`userImage` = '".$userImage."',
				`userPhno` = '".$userPhno."',
				`userRoleid` = '".$userRoleid."',
				`password` = '".$password."',
				`permissions` = '".$permissions."'
				WHERE `adminUser`.`userId` = ".$userId;
			}else{
				$sql = "UPDATE `adminUser` SET 
				`userFirstName` = '".$userFirstName."', 
				`userLastName` = '".$userLastName."',
				`userPhno` = '".$userPhno."',
				`userRoleid` = '".$userRoleid."',
				`password` = '".$password."',
				`permissions` = '".$permissions."'
				WHERE `adminUser`.`userId` = ".$userId;
			}
			//echo $sql; exit;
			$sql_res = mysqli_query($dbConn, $sql);
			echo "<script language=\"javascript\">window.location = 'adminUserDetails.php?userId=".$userId."'</script>";exit;
		}else{
			$sql = "INSERT INTO `adminUser` (
											`userId`, 
											`userFirstName`, 
											`userLastName`, 
											`userImage`, 
											`userPhno`, 
											`userEmail`, 
											`userRoleid`, 
											`username`, 
											`password`, 
											`permissions`,
											`status`
											) VALUES (
											NULL, 
											'".$userFirstName."', 
											'".$userLastName."', 
											NULL, 
											'".$userPhno."', 
											'".$userEmail."', 
											'".$userRoleid."', 
											'".$username."', 
											'".$password."', 
											'".$permissions."',
											1)";
			//echo $sql; exit;
			$sql_res = mysqli_query($dbConn, $sql);
			$inserted_userId = mysqli_insert_id($dbConn);
			//echo $inserted_userId; exit;
			
			$userImage = fileUpload($inserted_userId, "uploads/userImage/", "userImage", "userImage", ALLOWEDEXTENSIONS);
			if($userImage != NULL){
				$sqlUpdate = "UPDATE `adminUser` SET `userImage` = '".$userImage."' WHERE `adminUser`.`userId` = ".$inserted_userId;
				//echo $sqlUpdate; exit;
				$sqlUpdateFinance_res = mysqli_query($dbConn, $sqlUpdate);
			}
			echo "<script language=\"javascript\">window.location = 'adminUserDetails.php?userId=".$inserted_userId."'</script>";exit;
		}
	}
}else{
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
	$sqlAdminUserData = "SELECT `userFirstName`,
						`userLastName`,
						`userImage`,
						`userPhno`,
						`userEmail`,
						`userRoleid`,
						`username`,
						`password`,
						`permissions` 
						FROM `adminUser` 
						WHERE `userId` = ".$userId;
	//echo $sqlAdminUserData; exit;
	$sqlAdminUserData_res = mysqli_query($dbConn, $sqlAdminUserData);
	$sqlAdminUserData_res_fetch = mysqli_fetch_array($sqlAdminUserData_res);
	/*----------------------------------Populating Admin User Data----------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Admin Uesr Entry</title>
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
							<span id="cms_791">Admin User Entry</span>
						</b>
					</h5>
				</header>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					<form id="adminUserEntryForm" name="adminUserEntryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return adminUsersFunctionality.validateAdminUserEntryForm();" enctype="multipart/form-data">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						
							<div id="userInputPanel" class="col-lg-9 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot10">
							
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="userRoleDDLHolder" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
										<select id="userRoleDDL" name="userRoleDDL" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 h34 w100p" onchange="adminUsersFunctionality.onChangeUserRole()">
											<option id="cms_792" value="">-- Select User Role --</option>
										</select>
									</div>
									
									<div id="userFirstNameHolder" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">
										<div class="input-group input-group-md">
											<span class="input-group-addon" id="cms_793">User First Name</span>
											<input type="text" id="userFirstName" name="userFirstName" class="form-control" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["userFirstName"]; }?>" placeholder="Please enter user first name" rel="cms_795">
										</div>
									</div>
									
									<div id="userLastNameHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<div class="input-group input-group-md">
											<span class="input-group-addon" id="cms_794">User Last Name</span>
											<input type="text" id="userLastName" name="userLastName" class="form-control" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["userLastName"]; }?>" placeholder="Please enter user last name" rel="cms_796">
										</div>
									</div>
								</div>
								
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="userImageHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<div class="input-group">
											<span id="userImageSpan" class="input-group-addon">
												<span id="cms_797">User Image</span> : 
											</span>
											<input type="file" name="userImage" id="userImage" class="form-control" autocomplete="off" accept=".png,.jpg,.jpeg">
										</div>
									</div>
									
									<div id="userPhnoHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 marBot5">
										<div class="input-group input-group-md">
											<span class="input-group-addon" id="cms_798">Phone No</span>
											<input type="text" id="userPhno" name="userPhno" class="form-control" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["userPhno"]; }?>" placeholder="Please enter user Phone No" rel="cms_799">
										</div>
									</div>
									
									<div id="userEmailHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
										<div class="input-group">
											<span id="userEmailSpan" class="input-group-addon">Email</span>
											<input id="userEmail" name="userEmail" type="text" class="form-control" placeholder="Please Enter User Email" autocomplete="off" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["userEmail"]; }?>" onblur="adminUsersFunctionality.checkAdminUserEmailExists()" <?php if($userId > 0){ echo  "disabled"; } ?> rel="cms_800">
											<span id="userEmailExtSpan" class="input-group-addon">
												<span id="userEmailInfoIcon" class="glyphicon glyphicon-info-sign blueText f18"></span>
												<span id="userEmailOkIcon" class="glyphicon glyphicon-ok-circle greenText f18 hide"></span>
												<span id="userEmailCrossIcon" class="glyphicon glyphicon-remove-circle redText f18 hide"></span>
												<span id="userEmailRefreshIcon" class="glyphicon glyphicon-refresh greenText f18 hover" onclick="adminUsersFunctionality.generateArbiteryEmail();"></span>
											</span>
										</div>
									</div>
								</div>
								
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div id="usernameHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="input-group marBot5">
											<span id="usernameSpan" class="input-group-addon">Username</span>
											<input id="username" name="username" type="text" class="form-control" placeholder="Please Enter Username" autocomplete="off" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["username"]; }?>" onblur="adminUsersFunctionality.checkUsernameExists()" <?php if($userId > 0){ echo  "disabled"; } ?> rel="cms_801">
											<span id="emailExtSpan" class="input-group-addon">
												<span id="usernameInfoIcon" class="glyphicon glyphicon-info-sign blueText f18"></span>
												<span id="usernameOkIcon" class="glyphicon glyphicon-ok-circle greenText f18 hide"></span>
												<span id="usernameCrossIcon" class="glyphicon glyphicon-remove-circle redText f18 hide"></span>
												<span id="usernameRefreshIcon" class="glyphicon glyphicon-refresh greenText f18 hover" onclick="adminUsersFunctionality.generateArbiteryUsername();"></span>
											</span>
										</div>
									</div>
									
									<div id="passwordHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
										<div class="input-group marBot5">
											<span id="passwordSpan" class="input-group-addon">Password</span>
											<input id="password" name="password" type="password" class="form-control" placeholder="Please Enter Password" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["password"]; }?>" onkeyup="adminUsersFunctionality.checkPasswordStrength()" rel="cms_805">
											<span id="passwordExtSpan" class="input-group-addon">
												<span id="passwordRefreshIcon" class="glyphicon glyphicon-refresh greenText f18 hover" onclick="adminUsersFunctionality.generatePassword();"></span>
												<span id="passwordCopyIcon" class="fa fa-copy f18 blueText hover" onclick="adminUsersFunctionality.copyPassword();"></span>
											</span>
										</div>
									</div>
									
									<div id="passwordStrengthHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div class="strength-bar">
											<div class="bar-fill" id="strengthBar"></div>
										</div>
									</div>
								</div>
								
								<div id="submitSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
									<button id="submitBtn" type="submit" class="btn btn-success marTop5" rel="cms_803">Submit</button>
									<button type="button" class="btn btn-success marTop5" onclick="adminUsersFunctionality.gotoAdminUsers()" rel="cms_813">List of Admin Users</button>
									<input type="hidden" id="permissions" name="permissions" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["permissions"]; }?>">
									<input type="hidden" id="userRoleid" name="userRoleid" value="<?php if($userId > 0){ echo $sqlAdminUserData_res_fetch["userRoleid"]; }?>">
									<input type="hidden" id="userId" name="userId" value="<?php echo $userId; ?>">
								</div>
								
							</div>
							
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot20 scrollY maxH500">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 sectionBlock2 nopaddingOnly">
									<h5 id="cms_804" class="text-center">Permissions</h5>
									<div id="treeview-container" class="hummingbird-treeview f12">
										<ul id="treeview" class="hummingbird-base">
										</ul>
									</div>
								</div>
							</div>
							
						</div>
					</form>
				</div>
				<input type="hidden" id="adminMenuSerializedData" name="adminMenuSerializedData" value="<?php echo $safeAdminMenuSerializedData; ?>">
				<input type="hidden" id="userRoleSerializedData" name="userRoleSerializedData" value="<?php echo $safeUserRoleSerializedData; ?>">
				<input type="hidden" id="loginUserRoleid" name="loginUserRoleid" value="<?php if((int)$_SESSION['userRoleid'] > 0){ echo $_SESSION['userRoleid']; }?>">
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>