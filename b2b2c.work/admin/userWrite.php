<?php
	include('../config/config.php');
	include('auth.php');
	echo "Loading...";
	$msg = "";
	
	if(count($_POST))
	{
		$hdnAction=isset($_REQUEST['hdnAction'])?$_REQUEST['hdnAction']:"";
		if($hdnAction == "REGISTER"){
			$userId=isset($_REQUEST['userId'])?$_REQUEST['userId']:0;
			$FirstName=isset($_REQUEST['FirstName'])?$_REQUEST['FirstName']:"";
			$LastName=isset($_REQUEST['LastName'])?$_REQUEST['LastName']:"";
			$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
			$password=isset($_REQUEST['password'])?$_REQUEST['password']:"";
			$email=isset($_REQUEST['email'])?$_REQUEST['email']:"";
			$userDesc=isset($_REQUEST['userDesc'])?$_REQUEST['userDesc']:"";
			$userType=isset($_REQUEST['userType'])?$_REQUEST['userType']:"";
			
			/*echo "userId : ".$userId."<br>";
			echo "FirstName : ".$FirstName."<br>";
			echo "LastName : ".$LastName."<br>";
			echo "username : ".$username."<br>";
			echo "password : ".$password."<br>";
			echo "email : ".$email."<br>";
			echo "userDesc : ".$userDesc."<br>";
			echo "userType : ".$userType."<br>";
			exit;*/
			
			$userImage = userImageUpload($userId);
			$sql_edit = "UPDATE `userMaster` 
							SET `FirstName` = '".trim(addslashes($FirstName))."',
							`LastName` = '".trim(addslashes($LastName))."',
							`password` = '".$password."',
							`email` = '".$email."',
							`userImage` = '".$userImage."',
							`userDesc` = '".trim(addslashes($userDesc))."',
							`userType` = '".$userType."'
							WHERE `userMaster`.`userId` = ".intval($userId);
			//echo $sql_edit;exit;
			$sql_edit_res = mysqli_query($dbConn, $sql_edit);
			echo "<script language=\"javascript\">window.location = 'userMaster.php'</script>";exit;
		}else if($hdnAction == "CHECKUSERNAMEAVILABLITY"){
			$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
			if($username != ""){
				$sql_ck_av = "SELECT COUNT(*) AS `CNT` FROM `userMaster` where `username` = '".$username."'";
				$sql_ck_av_res = mysqli_query($dbConn, $sql_ck_av);
				$sql_ck_av_res_fetch = mysqli_fetch_array($sql_ck_av_res);
				if(intval($sql_ck_av_res_fetch["CNT"]) == 0){
					$sql_reg_init = "INSERT INTO `userMaster` (`userId`, `FirstName`, `LastName`, `username`, `password`, `email`, `userImage`, `userDesc`, `userType`, `createdDate`) VALUES
		(NULL, ' ', ' ', '".$username."', ' ', ' ', '', ' ', 2, NOW())";
					$sql_reg_init_res = mysqli_query($dbConn, $sql_reg_init);
					$inserted_userId = mysqli_insert_id($dbConn);
					$_SESSION['MSG'] = "Username Avilable...";
					echo "<script language=\"javascript\">window.location = 'userWrite.php?userId=".$inserted_userId."'</script>";exit;
				}else{
					$_SESSION['MSG'] = "Username Not Avilable...";
					echo "<script language=\"javascript\">window.location = 'userWrite.php'</script>";exit;
				}
			}
		}
	}else{
		$userId=isset($_REQUEST['userId'])?$_REQUEST['userId']:0;
		$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
		if($ACTION == "DELETEUSERIMAGE"){
			if($userId > 0){
				$sql_delete_qry = "SELECT `userImage` FROM `userMaster` where `userId` = ".$userId;
				//echo $sql_delete_qry; exit;
				$sql_delete_qry_res = mysqli_query($dbConn, $sql_delete_qry);
				$sql_delete_qry_res_fetch = mysqli_fetch_array($sql_delete_qry_res);
				deleteUserImage($sql_delete_qry_res_fetch["userImage"]);
				$sql_delete_qry1 = "UPDATE `userMaster` SET `userImage` = '' where `userId` = ".$userId;
				//echo $sql_delete_qry1; exit;
				$sql_delete_qry1_res = mysqli_query($dbConn, $sql_delete_qry1);
				echo "<script language=\"javascript\">window.location = 'userWrite.php?userId=".$userId."'</script>";exit;
			}
		}
	
		if($userId > 0){
			$sqlData_qry = "SELECT * FROM `userMaster` where `userId` = ".$userId;
			//echo $sqlData_qry; exit;
			$sqlData_qry_res = mysqli_query($dbConn, $sqlData_qry);
			$sqlData_qry_res_fetch = mysqli_fetch_array($sqlData_qry_res);
			//print_r($sqlData_qry_res_fetch);exit;
		}
	}
	?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Write User</title>
		<meta charset="UTF-8">
		<link rel="shortcut icon" href="<?php echo SITEURL; ?>assets/images/favicon.png" title="Favicon"/>
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
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/user.js'></script>
		<!-------------------------------------------------Application Specific JS & CSS------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<header class="w3-container" style="padding-top:22px">
				<h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> User</b></h5>
			</header>
			<div id="postSectionHolder" class="w3-container">
				<button type="button" class="w3-button w3-dark-grey" onclick="userFunctionality.gotoUserPage()">List Of User</button>
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<h5><?php if($userId > 0){ ?>Edit<?php }else{ ?>Add<?php } ?> User</h5>
					<form id="postForm" name="postForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return userFunctionality.validate();" enctype="multipart/form-data">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="col-lg-9 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="input-group marBot5">
									<span id="UsernameSpan" class="input-group-addon">Username : </span>
									<input id="username" name="username" type="text" class="form-control" placeholder="Please Enter Username" autocomplete="off" value="<?php if(isset($sqlData_qry_res_fetch["username"])){ echo $sqlData_qry_res_fetch["username"]; } ?>" <?php if($userId > 0){ ?> disabled <?php } ?>>
								</div>
							</div>
							<?php if($userId == 0){ ?>
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
								<button type="submit" class="w3-button w3-dark-grey" onclick="userFunctionality.checkUserAvilability()">Check Avilability</button>
							</div>
							<?php 
								}
								if($_SESSION['MSG'] != ""){ 
								?>
							<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
								<h5 class="greenText"><?php echo $_SESSION['MSG']; $_SESSION['MSG'] = ""; ?></h5>
							</div>
							<?php } ?>
						</div>
						<?php if($userId > 0){ ?>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="firstnameSpan" class="input-group-addon">FirstName : </span>
								<input id="FirstName" name="FirstName" type="text" class="form-control" placeholder="Please Enter FirstName" autocomplete="off" value="<?php if(isset($sqlData_qry_res_fetch["FirstName"])){ echo $sqlData_qry_res_fetch["FirstName"]; } ?>">
							</div>
							<div class="input-group marBot5">
								<span id="lastnameSpan" class="input-group-addon">LastName : </span>
								<input id="LastName" name="LastName" type="text" class="form-control" placeholder="Please Enter LastName" autocomplete="off" value="<?php if(isset($sqlData_qry_res_fetch["LastName"])){ echo $sqlData_qry_res_fetch["LastName"]; } ?>">
							</div>
							<div class="input-group marBot5">
								<span id="emailSpan" class="input-group-addon">Email : </span>
								<input id="email" name="email" type="text" class="form-control" placeholder="Please Enter Email" autocomplete="off" value="<?php if(isset($sqlData_qry_res_fetch["email"])){ echo $sqlData_qry_res_fetch["email"]; } ?>">
							</div>
							<div class="input-group marBot5">
								<span id="passwordSpan" class="input-group-addon">Password : </span>
								<input id="password" name="password" type="password" class="form-control" placeholder="Please Enter Password" autocomplete="off" value="<?php if(isset($sqlData_qry_res_fetch["password"])){ echo $sqlData_qry_res_fetch["password"]; } ?>">
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<div class="col-lg-9 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
									<div class="input-group marBot5">
										<span id="userImageSpan" class="input-group-addon">User Image : </span>
										<input type="file" name="userImage" id="userImage" class="form-control" autocomplete="off">
										<span id="userImageExtSpan" class="input-group-addon">Image must be .jpg, .jpeg, .png</span>
									</div>
								</div>
								<div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
									<?php if(isset($sqlData_qry_res_fetch["userImage"]) && $sqlData_qry_res_fetch["userImage"] != ""){ ?>
									<img src="<?php echo "../".UPLOADFOLDER."userImage/".$sqlData_qry_res_fetch["userImage"]; ?>" class="postImage">
									<input type="hidden" name="userImageHdn" id="userImageHdn" value="<?php echo $sqlData_qry_res_fetch["userImage"]; ?>">
									<i class="fa fa-trash-o redText" onclick="userFunctionality.deleteUserMainImage(<?php echo $userId; ?>)"></i>
									<?php } ?>
								</div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
								<h5 class="pull-left">Author Bio : </h5>
								<br clear="all">
								<textarea id="userDesc" name="userDesc" rows="4" cols="124"><?php echo $sqlData_qry_res_fetch["userDesc"]; ?></textarea>
							</div>
							<div class="input-group marBot5">
								<span id="userTypeSpan" class="input-group-addon">User Type : </span>
								<select id="userType" name="userType" class="okolkataDDl">
									<option value="2" <?php if(intval($sqlData_qry_res_fetch["userType"]) == 2){?> selected <?php } ?>>AUTHOR</option>
									<option value="1" <?php if(intval($sqlData_qry_res_fetch["userType"]) == 1){?> selected <?php } ?>>ADMIN</option>
								</select>
							</div>
							<br clear="all">
							<br clear="all">
							<input id="userId" name="userId" type="hidden" value="<?php echo $userId; ?>">
							<button type="submit" class="w3-button w3-dark-grey" onclick="userFunctionality.setActionOnSubmit()">Submit</button>
						</div>
						<?php } ?>
						<input type="hidden" id="hdnAction" name="hdnAction" value="<?php if($userId > 0){ echo  "REGISTER"; } ?>">
					</form>
				</div>
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>