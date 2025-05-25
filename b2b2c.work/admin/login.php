<?php
	include('../config/config.php');
	$_SESSION['msg']=isset($_SESSION['msg'])?$_SESSION['msg']:'';
	if(count($_POST))
	{
		$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
		$password=isset($_REQUEST['password'])?$_REQUEST['password']:"";
		$adminqry = "select * from `adminUser` where `username`='".mysqli_real_escape_string($dbConn, $username)."' and `password`='".mysqli_real_escape_string($dbConn, $password)."'";
		//echo $adminqry; exit;
		$adminqry_res=mysqli_query($dbConn, $adminqry);
		//echo mysqli_num_rows($adminqry_res); exit;
		if(mysqli_num_rows($adminqry_res)>0)
		{
			$adminqry_res_fetch = mysqli_fetch_array($adminqry_res);
			if($adminqry_res_fetch['userRoleid'] != '' && $adminqry_res_fetch['status'] != 0)
			{
				$_SESSION['userId']=$adminqry_res_fetch['userId'];
				$_SESSION['name']=$adminqry_res_fetch['userFirstName']." ".$adminqry_res_fetch['userLastName'];
				$_SESSION['userRoleid']=$adminqry_res_fetch['userRoleid'];
				$_SESSION['userImage']=$adminqry_res_fetch['userImage'];
				$_SESSION['permissions']=$adminqry_res_fetch['permissions'];
				$_SESSION['MSG']="";
				//echo "<pre>"; print_r($_SESSION); echo "</pre>"; exit;
				echo "<script language=\"javascript\">window.location = 'index.php'</script>";
			}
			else
			{
				$_SESSION['msg']='The login details were deactivated..!!!';
			}
		}
		else
		{
			$_SESSION['msg']='The login details you provide were invalid!!!';
		}
	}
	if(isset($_SESSION['userId'])){
		echo "<script language=\"javascript\">window.location = 'index.php'</script>";
	}
	?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php echo SITETITLE; ?> Admin Login</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="shortcut icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon" />
		<link rel="icon" href="<?php echo SITEURL; ?>favicon.ico" title="Favicon" type="image/x-icon">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<!-------------------------------------------------Bootstrap & fonts.googleapis-------------------------------------------->
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<link rel="stylesheet" href="<?php echo SITEURL; ?>assets/css/adminStyle/adminStyle.css">
		<!-------------------------------------------------Admin Common CSS-------------------------------------------------------->
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
	</head>
	<body>
		<div class="container-fluid">
			<div class="row">
				<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12" ></div>
				<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12" >
					<h4 id="loginHeaderText" class="text-center redText"><?php echo $_SESSION['msg']; $_SESSION['msg'] = ''; ?></h4>
					<img id="circleLock" src="<?php echo SITEURL; ?>assets/images/logo.jpg" alt="lock" class="circleLock">
					<div id="loginMsg" class="text-center loginError"></div>
					<form id="loginform" name="loginform" class="text-center" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>">
						<div class="input-group marBot5">
							<span id="usernameSpan" class="input-group-addon">Username : </span>
							<input id="username" name="username" type="text" class="form-control" placeholder="Enter Username">
						</div>
						<div class="input-group marBot5">
							<span id="passwordSpan" class="input-group-addon">Password : </span>
							<input id="password" name="password" type="password" class="form-control"  placeholder="Enter Password">
						</div>
						<button id="loginBtn" type="submit" class="btn btn-primary marBot5">Login</button>
					</form>
				</div>
				<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12" ></div>
			</div>
		</div>
	</body>
</html>