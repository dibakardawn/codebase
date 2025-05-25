<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";

$section = "ADMIN";
$page = "CCTV";

$cctvId=isset($_REQUEST['cctvId'])?(int)$_REQUEST['cctvId']:0;
if(count($_POST)){
	$url=isset($_REQUEST['url'])?$_REQUEST['url']:"";
	$port=isset($_REQUEST['port'])?$_REQUEST['port']:"";
	$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
	$password=isset($_REQUEST['password'])?$_REQUEST['password']:"";
	
	/*echo "url : ".$url."<br>";
	echo "port : ".$port."<br>";
	echo "username : ".$username."<br>";
	echo "password : ".$password."<br>";
	exit;*/
	
	if($cctvId > 0){
		if($url != "" && $port != "" && $username != "" && $password != ""){
			$sql = "UPDATE `cctv` SET 
				`url` = '".$url."', 
				`port` = '".$port."',
				`username` = '".$username."',
				`password` = '".$password."'
				WHERE `cctv`.`cctvId` = ".$cctvId;
			//echo $sql; exit;
			$sql_res = mysqli_query($dbConn, $sql);
		}
	}else{
		if($url != "" && $port != "" && $username != "" && $password != ""){
			$sql="INSERT INTO `cctv` (`cctvId`, `url`, `port`, `username`, `password`) VALUES (NULL, '".$url."', '".$port."', '".$username."', '".$password."')";
			//echo $sql; exit;
			$sql_res = mysqli_query($dbConn, $sql);
		}
	}
	echo "<script language=\"javascript\">window.location = 'cctvs.php'</script>";exit;
}else{
	$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";
	if($ACTION == "DELETE"){
		if($cctvId > 0){
			/*--------------------------------Delete CCTV ---------------------------------------------*/
			$sqlDeleteCCTV = "DELETE FROM `cctv` WHERE `cctv`.`cctvId` = ".$cctvId;
			//echo $sqlDeleteCCTV; exit;
			$sqlDeleteCCTV_res = mysqli_query($dbConn, $sqlDeleteCCTV);
			/*--------------------------------Delete CCTV ---------------------------------------------*/
		}
		echo "<script language=\"javascript\">window.location = 'cctvs.php'</script>";exit;
	}
	
	/*----------------------------------------CCTV data-----------------------------------------------*/
	$sqlCCTVData = "SELECT `cctvId`,`url`,`port`,`username`,`password` FROM `cctv` WHERE 1";
	//echo $sqlCCTVData; exit;
	$sqlCCTVData_res = mysqli_query($dbConn, $sqlCCTVData);
	$CCTVObjectArray = array();
	while($sqlCCTVData_res_fetch = mysqli_fetch_array($sqlCCTVData_res)){
		$CCTVObject = (object) [
								 'cctvId' => $sqlCCTVData_res_fetch["cctvId"], 
								 'url' => $sqlCCTVData_res_fetch["url"], 
								 'port' => $sqlCCTVData_res_fetch["port"],
								 'username' => $sqlCCTVData_res_fetch["username"],
								 'password' => $sqlCCTVData_res_fetch["password"]
								];
		//echo json_encode($CCTVObject);exit;
		$CCTVObjectArray[] = $CCTVObject;
	}
	if (is_array($CCTVObjectArray) && !empty($CCTVObjectArray)) {
		$safeCCTVSerializedData = htmlspecialchars(json_encode($CCTVObjectArray), ENT_QUOTES, 'UTF-8');
	} else {
		$safeCCTVSerializedData = '[]';
	}
	/*----------------------------------------CCTV data-----------------------------------------------*/
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | CCTV</title>
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
		<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
		<!-------------------------------------------------jQuery.min, bootstrap & HTML5------------------------------------------->
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<script type='text/javascript' src="<?php echo SITEURL; ?>assets/js/platform/applicationCommon.js"></script>
		<!-------------------------------------------------Application Common JS--------------------------------------------------->
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/cctv.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
	<body class="w3-light-grey">
		<?php include('includes/header.php'); ?>
		<?php include('includes/sidebar.php'); ?>
		<div class="w3-main">
			<div id="cameraSectionHolder">
				<header class="w3-container" style="padding-top:22px">
					<h5 class="pull-left">
						<b>
							<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
							<span id="cms_814">CCTV Cameras</span>
						</b>
					</h5>
					<select id="cctvDDL" name="cctvDDL" class="h34 w180 pull-right" onchange="cctvFunctionality.onChangeCCTV()">
						<option value="9">-- 9 CCTVs (3x3x3) --</option>
						<option value="12">-- 12 CCTVs (4x4x4) --</option>
						<option value="16">-- 16 CCTVs (4x4x4x4) --</option>
					</select>
				</header>
				<div id="cctvHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot20">
				</div>
				<!-- CCTV Configure Modal -->
				<div class="modal fade" id="CCTVModal" role="dialog">
					<div class="modal-dialog modal-md">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal">&times;</button>
								<h4 id="cms_822" class="modal-title">Configure CCTV</h4>
							</div>
							<form id="cctvEntryForm" name="cctvEntryForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return cctvFunctionality.validateCCTVEntryForm();">
								<div id="CCTVModalBody" class="modal-body centerSection">
									<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
										<div id="urlHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
											<div class="input-group input-group-md">
												<span class="input-group-addon">URL</span>
												<input type="text" id="url" name="url" class="form-control" value="" placeholder="Please enter CCTV Url" rel="cms_815">
											</div>
										</div>
										<div id="portHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
											<div class="input-group input-group-md">
												<span class="input-group-addon">Port</span>
												<input type="text" id="port" name="port" class="form-control" value="" placeholder="Please enter CCTV Port" rel="cms_816">
											</div>
										</div>
										<div id="usernameHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
											<div class="input-group input-group-md">
												<span class="input-group-addon">Username</span>
												<input type="text" id="username" name="username" class="form-control" value="" placeholder="Please enter CCTV Username" rel="cms_817">
											</div>
										</div>
										<div id="passwordHolder" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
											<div class="input-group input-group-md">
												<span class="input-group-addon">Password</span>
												<input type="password" id="password" name="password" class="form-control" value="" placeholder="Please enter CCTV Password" rel="cms_818">
											</div>
										</div>
									</div>
								</div>
								<div class="modal-footer">
									<input type="hidden" id="cctvId" name="cctvId" value="">
									<button type="button" class="btn btn-default pull-left" data-dismiss="modal" rel="cms_819">Close</button>
									<button type="button" class="btn btn-danger pull-left" rel="cms_820" onclick="cctvFunctionality.deleteCCTVConfiguration()">Delete</button>
									<button type="submit" class="btn btn-success pull-right" rel="cms_821">Save</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<!-- CCTV Configure Modal -->
				<input type="hidden" id="safeCCTVSerializedData" name="safeCCTVSerializedData" value="<?php echo $safeCCTVSerializedData; ?>">
			</div>
			<br>
			<?php include('includes/footer.php'); ?>
		</div>
	</body>
</html>