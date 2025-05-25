<?php
//echo "<pre>"; print_r($_SESSION); echo "</pre>"; exit;
$permissionPages = array();
$pagename = "";
if(!isset($_SESSION['userId']) && !isset($_SESSION['permissions'])){
	echo "<script language=\"javascript\">window.location = 'logout.php'</script>";
}else{
	$allPages = array();
	$sql_adminMenu = "SELECT `menuId`,`menuName`,`menuParentId`,`bootstrapIcon`,`frontPage` FROM `adminMenu` WHERE `status` = 1 ORDER BY `menuIndex` ASC";
	$sql_adminMenu_res = mysqli_query($dbConn, $sql_adminMenu);
	if(mysqli_num_rows($sql_adminMenu_res)>0)
	{
		while($sql_adminMenu_res_fetch = mysqli_fetch_array($sql_adminMenu_res)){
			$indivPage = array(
								$sql_adminMenu_res_fetch["menuId"], 
								$sql_adminMenu_res_fetch["frontPage"], 
								$sql_adminMenu_res_fetch["menuName"], 
								$sql_adminMenu_res_fetch["bootstrapIcon"], 
								$sql_adminMenu_res_fetch["menuParentId"]
							);
			array_push($allPages, $indivPage);
		}
	}
	array_push($allPages, ["index.php", "", "", -1, ""]);
	//echo "<pre>"; print_r($allPages); echo "</pre>"; exit;
	
	$sql_adminPermission = "SELECT `frontPage` FROM `adminMenu` WHERE `menuId` IN (".$_SESSION['permissions'].") ORDER BY `menuIndex` ASC";
	//echo $sql_adminPermission; exit;
	$sql_adminPermission_res = mysqli_query($dbConn, $sql_adminPermission);
	if(mysqli_num_rows($sql_adminPermission_res)>0)
	{
		while($sql_adminPermission_res_fetch = mysqli_fetch_array($sql_adminPermission_res)){
			array_push($permissionPages, $sql_adminPermission_res_fetch["frontPage"]);
		}
	}
	array_push($permissionPages, "index.php");
	//echo "<pre>"; print_r($permissionPages); echo "</pre>"; exit;
	
	$pagename = basename($_SERVER['PHP_SELF']);
	//echo $pagename; exit;
	if (in_array($pagename, $permissionPages)){
		//echo $pagename; exit;
		/*if($pagename == "post.php" || $pagename == "postWrite.php"){
			$postId=isset($_REQUEST['postId'])?$_REQUEST['postId']:"0";
			if($postId > 0 && $_SESSION['userType'] != 1){
				$auth_sql = "SELECT `COUNT(*) AS `cnt` FROM `post` WHERE `post`.`authorId` = ".intval($_SESSION['userId'])." AND `post`.`postId` = ".$postId;
				$auth_sql_res = mysqli_query($dbConn, $auth_sql);
				$auth_sql_res_fetch = mysqli_fetch_array($auth_sql_res);
				if(intval($auth_sql_res_fetch["cnt"]) == 0){
					echo "<script language=\"javascript\">window.location = 'unauthorized.php'</script>";
				}
			}
		}*/
	}else{
		echo "<script language=\"javascript\">window.location = 'unauthorized.php'</script>";
	}
}
?>