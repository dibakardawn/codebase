<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "PRODUCT";

$magazineId=isset($_REQUEST['magazineId'])?$_REQUEST['magazineId']:0;
if(count($_POST)){	
	if($magazineId > 0){
		$customerList=isset($_REQUEST['customerList'])?$_REQUEST['customerList']:[];
		//print_r($customerList); exit;
		$customerList = implode(",",$customerList);
		//echo $customerList; exit;
		
		$customerEmails = "SELECT GROUP_CONCAT(`email`) AS 'customerEmails' FROM `customer` WHERE `customerId` IN  (".$customerList.")";
		//echo $customerEmails; exit;
		$customerEmails_res = mysqli_query($dbConn, $customerEmails);
		$customerEmails_res_fetch = mysqli_fetch_array($customerEmails_res);
		$customerEmailIds = $customerEmails_res_fetch["customerEmails"];
		$additionalEmailRecipient=isset($_REQUEST['additionalEmailRecipient'])?$_REQUEST['additionalEmailRecipient']:"";
		if(strlen($additionalEmailRecipient) > 0){
			$customerEmailIds = $customerEmailIds.",".$additionalEmailRecipient;
		}
		
		$sqlEdit = "UPDATE `productMagazine` SET 
		`customerIds` = '".$customerList."',
		`externalEmailIds` = '".$customerEmailIds."',
		`status` = 1
		WHERE `productMagazine`.`magazineId` = ".$magazineId;
		//echo $sqlEdit; exit;
		$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
		
		/*-------------------------------Sent mail to Client------------------------------*/
		$selectedLang=isset($_REQUEST['selectedLang'])?$_REQUEST['selectedLang']:'en';
		$customerEmailIdArr = explode(',',$customerEmailIds);
		if(count($customerEmailIdArr) > 0){
			for($i = 0; $i < count($customerEmailIdArr); $i++){
				$toEmail = $customerEmailIdArr[$i];
				//echo $toEmail; exit;
				if($toEmail == ""){
					echo "<script language=\"javascript\">window.location = 'productMagazine.php'</script>";exit;
				}
				$fromEmail = SYSTEMEMAIL;
				$subject = SITETITLE." has released a recent version of product Magazine, Please have a look";
				$magCode = "MAG_" . sprintf("%04d", $magazineId);
				$template = file_get_contents('../assets/templates/mailTemplates/product_magazines_to_customers.'.$selectedLang.'.html');
				$replacements = [
					'{{SITEURL}}'      => SITEURL,
					'{{SITENAME}}'     => SITENAME,
					'{{MAGCODE}}'      => $magCode,
					'{{year}}'         => date('Y'),
					'{{company_name}}' => SITENAME
				];
				foreach ($replacements as $key => $value) {
					$template = str_replace($key, $value, $template);
				}
				$message = $template;
				//echo $message; exit;
				insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, $magCode);
			}
		}
		/*-------------------------------Sent mail to Client------------------------------*/
	}
	echo "<script language=\"javascript\">window.location = 'productMagazine.php'</script>";exit;
}
?>
<!DOCTYPE html>
<html>
	<head>
		<title>B2B2C GmbH Admin | Share Product Magazine to Customers</title>
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
		<link rel="stylesheet" type="text/css" href="<?php echo SITEURL; ?>assets/css/plugins/hummingbird-treeview.css" >
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/productMagazine.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
      <?php include('includes/header.php'); ?>
      <?php include('includes/sidebar.php'); ?>
      <div class="w3-main">
         <div id="productMagazineSectionHolder">
            <header class="w3-container" style="padding-top:22px">
				<h5>
					<b>
						<i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> 
						<span id="cms_178">Share Product Magazine to Customers</span>
					</b>
				</h5>
            </header>
            <div class="w3-row-padding w3-margin-bottom">
				<form id="customerForm" name="customerForm" method="POST" action="<?php echo $_SERVER['PHP_SELF']?>" onSubmit="return productMagazineFunctionality.validateProductMagazineCustomer();">
				
					<div id="customerSelectionSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
						<h5><b id="cms_179">Select customers whome you want to share magazine to : </b></h5>
						<div>
							<input class="form-check-input" type="checkbox" id="selectAll" name="selectAll" value="0">
							<label class="form-check-label" id="cms_180">Select All Customer togather</label>
						</div>
						<?php 
						$sql_customer = "SELECT `customerId`,`companyName`,`buyerName`,`contactPerson` FROM `customer` WHERE `status` = 1 ORDER BY `customerId` DESC";
						//echo $sql_customer; exit;
						$sql_customer_res = mysqli_query($dbConn, $sql_customer);
						while($sql_customer_res_fetch = mysqli_fetch_array($sql_customer_res)){
						?>
							<div>
								<input class="form-check-input" type="checkbox" id="customer_<?php echo $sql_customer_res_fetch["customerId"]; ?>" name="customerList[]" value="<?php echo $sql_customer_res_fetch["customerId"]; ?>">
								<label class="form-check-label"><?php echo $sql_customer_res_fetch["companyName"]." - ".$sql_customer_res_fetch["buyerName"]." - ".$sql_customer_res_fetch["contactPerson"]; ?></label>
							</div>
						<?php } ?>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="input-group marBot5 pull-right">
							<span id="cms_181" class="input-group-addon">Additional Email Recipients : </span>
							<input id="additionalEmailRecipient" name="additionalEmailRecipient" type="text" class="form-control" placeholder="Please Enter Additional Email Recipients" rel="cms_182" autocomplete="off" value="">
						</div>
						<div id="cms_183">* You can add additional emails with comma separate. Like abc@gmail, xyz@gmail.com</div>
					</div>
						
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop5 text-center">
						<input id="magazineId" name="magazineId" type="hidden" value="<?php echo $magazineId; ?>">
						<input id="selectedLang" name="selectedLang" type="hidden" value="en">
						<button type="submit" class="btn btn-success" rel="cms_178">Share Product Magazine to Customers</button>
					</div>
				</form>
            </div>
         </div>
         <br>
         <?php include('includes/footer.php'); ?>
      </div>
   </body>
</html>