<?php
include('../config/config.php');
$ACTION=isset($_REQUEST['ACTION'])?$_REQUEST['ACTION']:"";

switch($ACTION) {
	
	/*=================================Public API Section Starts=================================================================*/
		
		/*-----------------------------FRONTEND APIs---------------------------------------------------*/
		//#Frontend
		case "CONTACT":{
			$name=isset($_REQUEST['name'])?$_REQUEST['name']:"";
			$email=isset($_REQUEST['email'])?$_REQUEST['email']:"";
			$comments=isset($_REQUEST['comments'])?$_REQUEST['comments']:"";
			if($name != "" && $email != "" && $comments != ""){
				$toEmail = ADMINEMAIL;
				$fromEmail = SYSTEMEMAIL;
				//xxxx mail
				$subject = "Someone wants to contact you";
				$message = "";
				$message = $message.'<html>';
					$message = $message.'<body>';
						//$message = $message.BAARONMAILTEMPLATEHEADER;
						$message = $message.'<div style="width:100%; float:left;">';
							$message = $message.'<h1 style="color:#E5A340;">Someone wants to contact you, Please review his/her comments</h1>';
							$message = $message.'<p style="font-size:18px;">Name : '.$name.',</p>';
							$message = $message.'<p style="font-size:18px;">Email : '.$email.',</p>';
							$message = $message.'<p style="font-size:18px;">Comments : '.$comments.',</p>';
						$message = $message.'</div>';
					$message = $message.'</body>';
				$message = $message.'</html>';
				//echo $message; exit;
						
				// To send HTML mail, the Content-type header must be set
				$headers  = 'MIME-Version: 1.0' . "\r\n";
				$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
				 
				// Create email headers
				$headers .= 'From: '.$fromEmail."\r\n".'Reply-To: '.$fromEmail."\r\n" .'X-Mailer: PHP/' . phpversion();
				
				if($toEmail != ""){
					//echo "toEmail ::".$toEmail."; fromEmail ::".$fromEmail."; subject ::".$subject."; body :".$message."; headers:".$headers;
					if(mail($toEmail, $subject, $message, $headers))
					{
						echo '{"successCode" : 1}';
					}
					else
					{
						echo '{"successCode" : 0}';
					}
				}
			}
			break;
		}
		/*-----------------------------FRONTEND APIs---------------------------------------------------*/
		
		/*-----------------------------MAIL APIs-------------------------------------------------------*/
		//#Frontend #Admin
		case "GETNOTSENTMAILS":{
			$result = "1";
			$sqlMail = "SELECT `mailId`,`toEmail`,`fromEmail`,`subject`,`body` FROM `mail` WHERE `sent` = 0";
			//echo $sqlMail; exit;
			$sqlMail_res = mysqli_query($dbConn, $sqlMail);
			while($sqlMail_res_fetch = mysqli_fetch_array($sqlMail_res)){
				$body = urldecode(base64_decode($sqlMail_res_fetch["body"]));
				$postdata = json_encode(
				array(
						'personalizations' => [
							[
								'to' => [
									['email' => $sqlMail_res_fetch["toEmail"]]
								]
							]
						],
						'from' => [
							'email' => $sqlMail_res_fetch["fromEmail"],
						],
						'subject' => $sqlMail_res_fetch["subject"],
						'content' => [ [
							'type' => 'text/html',
							'value' => $body
						] ]
					)
				);
				$opts = array('http' =>
					array(
						'method'  => 'POST',
						'header'  => 'Content-type: application/json'."\r\n"
									.'Authorization: Bearer '.SENDGRID_KEY."\r\n",
						'content' => $postdata
					)
				);
				$context  = stream_context_create($opts);
				$result =  file_get_contents('https://api.sendgrid.com/v3/mail/send', false, $context);
				
				$sqlMailUpdate = "UPDATE `mail` SET `sent` = '1', `deliveryTimeStamp` = NOW() WHERE `mail`.`mailId` = ".$sqlMail_res_fetch["mailId"];
				//echo $sqlMailUpdate; exit;
				$sqlMailUpdate_res = mysqli_query($dbConn, $sqlMailUpdate);
			}
			$str = '{"responseCode" : 1, "msg" : 1}';
			echo $str;
			break;
		}
		/*-----------------------------MAIL APIs-------------------------------------------------------*/

		/*-----------------------------CUSTOMER APIs---------------------------------------------------*/
		//#Frontend #Admin
		case "CHECKCUSTOMEREMAILEXISTS":{
			$email=isset($_REQUEST['email'])?$_REQUEST['email']:"";
			if($email != ""){
				//echo preg_match(EMAILREGEX, $email);exit;
				if (preg_match(EMAILREGEX, $email)) {
					$sql = "SELECT COUNT(`customerId`) as 'count' FROM `customer` WHERE `email` = '".$email."'";
					//echo $sql; exit;
					$qry_res = mysqli_query($dbConn, $sql);
					$qry_res_fetch = mysqli_fetch_array($qry_res);
					if(intval($qry_res_fetch["count"]) > 0){
						echo '{"responseCode" : 0, "msg" : "Email exists"}';
					}else{
						echo '{"responseCode" : 1, "msg" : "Email not exists"}';
					}
				} else { 
					echo '{"responseCode" : 0, "msg" : "Invalid Email"}';
				}   
			}else{
				echo '{"responseCode" : 0, "msg" : "Blank Email"}';
			}
			break;
		}
		
		//#Frontend #Admin
		case "SAVECUSTOMER":{
			$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
			$companyName=isset($_REQUEST['companyName'])?$_REQUEST['companyName']:"";
			$companyType=isset($_REQUEST['companyType'])?intval($_REQUEST['companyType']):0;
			$customerGrade=isset($_REQUEST['customerGrade'])?$_REQUEST['customerGrade']:"";
			$status=isset($_REQUEST['status'])?intval($_REQUEST['status']):0;
			$buyerName=isset($_REQUEST['buyerName'])?$_REQUEST['buyerName']:"";
			$contactPerson=isset($_REQUEST['contactPerson'])?$_REQUEST['contactPerson']:"";
			$address=isset($_REQUEST['address'])?$_REQUEST['address']:"";
			$postCode=isset($_REQUEST['postCode'])?$_REQUEST['postCode']:"";
			$country=isset($_REQUEST['country'])?$_REQUEST['country']:"";
			$town=isset($_REQUEST['town'])?$_REQUEST['town']:"";
			$phone=isset($_REQUEST['phone'])?$_REQUEST['phone']:"";
			$fax=isset($_REQUEST['fax'])?$_REQUEST['fax']:"";
			$email=isset($_REQUEST['email'])?$_REQUEST['email']:"";
			$mobile=isset($_REQUEST['mobile'])?$_REQUEST['mobile']:"";
			$website=isset($_REQUEST['website'])?$_REQUEST['website']:"";
			$existingId=isset($_REQUEST['existingId'])?$_REQUEST['existingId']:"";
			$bankDetails=isset($_REQUEST['bankDetails'])?$_REQUEST['bankDetails']:"{}";
			$additionalInformation=isset($_REQUEST['additionalInformation'])?$_REQUEST['additionalInformation']:"{}";
			$selectedLang=isset($_REQUEST['selectedLang'])?$_REQUEST['selectedLang']:'en';
			
			/*echo "companyName : ".$companyName." <br> ";
			echo "companyType : ".$companyType." <br> ";
			echo "customerGrade : ".$customerGrade." <br> ";
			echo "status : ".$status." <br> ";
			echo "buyerName : ".$buyerName." <br> ";
			echo "contactPerson : ".$contactPerson." <br> ";
			echo "address : ".$address." <br> ";
			echo "postCode : ".$postCode." <br> ";
			echo "country : ".$country." <br> ";
			echo "town : ".$town." <br> ";
			echo "phone : ".$phone." <br> ";
			echo "fax : ".$fax." <br> ";
			echo "email : ".$email." <br> ";
			echo "mobile : ".$mobile." <br> ";
			echo "website : ".$website." <br> ";
			echo "existingId : ".$existingId." <br> ";
			echo "bankDetails : ".$bankDetails." <br> ";
			echo "additionalInformation : ".$additionalInformation." <br> ";
			echo "selectedLang : ".$selectedLang." <br> ";
			exit;*/
			
			if($customerId > 0){ //Edit
				$sqlEdit = "UPDATE `customer` SET 
				`existingId` = '".$existingId."', 
				`companyName` = '".$companyName."', 
				`companyType` = '".$companyType."',
				`buyerName` = '".$buyerName."',
				`contactPerson` = '".$contactPerson."',
				`customerGrade` = '".$customerGrade."',
				`address` = '".$address."',
				`postCode` = '".$postCode."',
				`country` = '".$country."',
				`town` = '".$town."',
				`phone` = '".$phone."',
				`fax` = '".$fax."',
				`mobile` = '".$mobile."',
				`website` = '".$website."',
				`bankDetails` = '".$bankDetails."',
				`additionalInformation` = '".$additionalInformation."',
				`status` = '".$status."'
				WHERE `customer`.`customerId` = ".$customerId;
				//echo $sqlEdit; exit;
				$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
				echo '{"customerId" : '.$customerId.', "msg" : "Customer Data Saved successfully."}';
			}else if($customerId === 0){ //Add
				$sqlAdd = "INSERT INTO `customer` (
				`existingId`, 
				`companyName`, 
				`companyType`, 
				`buyerName`, 
				`contactPerson`, 
				`customerGrade`,
				`address`, 
				`postCode`, 
				`country`,
				`town`,
				`phone`, 
				`fax`, 
				`email`, 
				`mobile`, 
				`website`, 
				`bankDetails`, 
				`additionalInformation`, 
				`registrationDate`,
				`status`) 
				VALUES (
				'".$existingId."', 
				'".$companyName."', 
				'".$companyType."', 
				'".$buyerName."', 
				'".$contactPerson."',
				'".$customerGrade."',
				'".$address."', 
				'".$postCode."', 
				'".$country."',
				'".$town."',
				'".$phone."', 
				'".$fax."', 
				'".$email."', 
				'".$mobile."', 
				'".$website."',  
				'".$bankDetails."', 
				'".$additionalInformation."',
				NOW(),	
				'".$status."')";
				//echo $sqlAdd; exit;
				$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
				$inserted_customerId = mysqli_insert_id($dbConn);
				//echo $inserted_customerId; exit;
				
				/*------------------------------------------Mail to customer from Admin---------------------*/
				$toEmail = $email;
				$fromEmail = SYSTEMEMAIL;
				$subject = "Registration successful in ".SITENAME;
				$message = ""; 
				$template = file_get_contents('../assets/templates/mailTemplates/customer_registration_success.'.$selectedLang.'.html');
				$replacements = [
					'{{SITEURL}}'      => SITEURL,
					'{{SITENAME}}'     => SITENAME,
					'{{buyerName}}'    => $buyerName,
					'{{year}}'         => date('Y')
				];
				foreach ($replacements as $key => $value) {
					$template = str_replace($key, $value, $template);
				}
				$message = $template;
				insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "CUSTOMER-REGISTRATION-".$inserted_customerId);
				/*------------------------------------------Mail to customer from Admin---------------------*/
				
				/*------------------------------------------Mail to Admin from Sysem--------------------------*/
				$toEmail = ADMINEMAIL;
				$fromEmail = SYSTEMEMAIL;
				$subject = "Customer Registration and approve done by admin associate";
				$message = "";
				$template = file_get_contents('../assets/templates/mailTemplates/customer_registration_notify.' . $selectedLang . '.html');
				$replacements = [
					'{{SITENAME}}'     => SITENAME,
					'{{SITEURL}}'      => SITEURL,
					'{{companyName}}'  => $companyName,
					'{{buyerName}}'    => $buyerName,
					'{{contactPerson}}'=> $contactPerson,
					'{{phone}}'        => $phone,
					'{{email}}'        => $email,
					'{{year}}'         => date('Y')
				];
				foreach ($replacements as $key => $value) {
					$template = str_replace($key, $value, $template);
				}
				$message = $template;
				//echo $message; exit; 
				insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "CUSTOMER-REGISTRATION-".$inserted_customerId);
				/*------------------------------------------Mail to Admin from Sysem--------------------------*/
				echo '{"customerId" : '.$inserted_customerId.', "msg" : "New Customer has generated successfully."}';
			}
			break;
		}
		
		//#Frontend
		case "GENERATEOTP":{
			$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
			//echo "username : ".$username; exit;
			if($username != ""){
				$sql1 = "SELECT count(*) as 'CNT', `status` FROM `customer` WHERE `email` = '".$username."'";
				//echo $sql1; exit;
				$sql1_res = mysqli_query($dbConn, $sql1);
				$sql1_res_fetch = mysqli_fetch_array($sql1_res);
				if(intval($sql1_res_fetch["CNT"]) > 0){
					if(intval($sql1_res_fetch["status"]) == 0){
						echo '{"responseCode" : 0, "msg" : "Your resgistration is not approved yet."}';
					}else if(intval($sql1_res_fetch["status"]) == 1){
						$otp = rand(100000,999999); //6 Digit OTP
						$sql2 = "UPDATE `customer` SET `otp` = '".$otp."' WHERE `customer`.`email` = '".$username."'";
						$sql2_res = mysqli_query($dbConn, $sql2);
						/*------------------------------------------Mail OTP to Registerer from Admin---------------------*/
						$toEmail = $username;
						$fromEmail = SYSTEMEMAIL;
						$subject = "Use this Login OTP in Baaron GmbH Login - ".date("Y-m-d H:m:s",time());
						$message = "";
						$message = $message.'<html>';
							$message = $message.'<body>';
								//$message = $message.BAARONMAILTEMPLATEHEADER;
								$message = $message.'<p style="font-size:12px;">Hi Registerer,</p>';
								$message = $message.'<p style="font-size:18px;">Welcome to Baaron GmbH system</p>';
								$message = $message.'<p style="font-size:12px;">Use this Login OTP in Baaron GmbH Login</p>';
								$message = $message.'<p style="font-size:24px;">OTP : '.$otp.'</p>';
								$message = $message.'<p style="font-size:18px;"></p>';
								$message = $message.'<p style="font-size:18px;"></p>';
								$message = $message.'<p style="font-size:12px;">Thanks,</p>';
								$message = $message.'<p style="font-size:12px;">Baaron GmbH Team</p>';
							$message = $message.'</body>';
						$message = $message.'</html>';
						//echo $message;exit;
						insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "OTP");
						/*------------------------------------------Mail OTP to Registerer from Admin---------------------*/
						echo '{"responseCode" : 1, "msg" : "OTP sent"}';
					}
				}else{
					echo '{"responseCode" : 0, "msg" : "Email does not exists"}';
				}
			}else {
				echo '{"responseCode" : 0, "msg" : "Blank Email"}';
			}
			break;
		}
		
		//#Frontend
		case "VALIDATEOTP":{
			$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
			$otp=isset($_REQUEST['otp'])?$_REQUEST['otp']:"";
			//echo "username : ".$username." | otp : ".$otp; exit;
			if($username != "" && $otp != ""){
				$sql1 = "SELECT count(*) as 'CNT',
						`customerId`,`companyName`,
						`buyerName`,
						`contactPerson`,
						`customerGrade`
						FROM `customer` 
						WHERE `email` = '".$username."' 
						AND `otp` = '".$otp."'";
				//echo $sql1; exit;
				$sql1_res = mysqli_query($dbConn, $sql1);
				$sql1_res_fetch = mysqli_fetch_array($sql1_res);
				if(intval($sql1_res_fetch["CNT"]) > 0){
					$sql2 = "UPDATE `customer` SET `lastLoginDate` = now() WHERE `customer`.`customerId` = ".$sql1_res_fetch['customerId'];
					//echo $sql2; exit;
					$sql2_res = mysqli_query($dbConn, $sql2);
				
					$_SESSION['customerId']=$sql1_res_fetch['customerId'];
					$_SESSION['companyName']=$sql1_res_fetch['companyName'];
					$_SESSION['buyerName']=$sql1_res_fetch['buyerName'];
					$_SESSION['contactPerson']=$sql1_res_fetch['contactPerson'];
					$_SESSION['customerGrade']=$sql1_res_fetch['customerGrade'];
					
					echo '{"responseCode" : 1, "msg" : "Login Successful"}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Wrong OTP"}';
				}
			}else {
				echo '{"responseCode" : 0, "msg" : "Blank data"}';
			}
			break;
		}
		
		//#Frontend
		case "CUSTOMERLOGOUT":{
			unset($_SESSION['customerId']);
			unset($_SESSION['companyName']);
			unset($_SESSION['buyerName']);
			unset($_SESSION['contactPerson']);
			session_destroy();
			echo '{"responseCode" : 1, "msg" : "Logout Successful"}';
			break;
		}
		/*-----------------------------CUSTOMER APIs---------------------------------------------------*/
		
		/*-----------------------------SUPPLIER APIs--------------------------------------------------*/
		//#SupplierPortal #Admin
		case "CHECKSUPPLIEREMAILEXISTS":{
			$supplierEmail=isset($_REQUEST['supplierEmail'])?$_REQUEST['supplierEmail']:"";
			if($supplierEmail != ""){
				//echo preg_match(EMAILREGEX, $supplierEmail);exit;
				if (preg_match(EMAILREGEX, $supplierEmail)) {
					$sql = "SELECT COUNT(`supplierId`) as 'count', `supplierName` FROM `supplier` WHERE `supplierEmail` = '".$supplierEmail."'";
					//echo $sql; exit;
					$qry_res = mysqli_query($dbConn, $sql);
					$qry_res_fetch = mysqli_fetch_array($qry_res);
					if(intval($qry_res_fetch["count"]) > 0){
						/*-------------------Functionality dedicated to supplier portal----------------------------*/
						if(checkReferer() && str_contains($_SERVER['HTTP_REFERER'], 'supplierPortal')){
							$otp = generateOtp();
							$sql_updateOTP = "UPDATE `supplier` SET `supplierPassword` = '".$otp."' WHERE `supplier`.`supplierEmail` = '".$supplierEmail."'";
							//echo $sql_updateOTP; exit;
							$qry_res = mysqli_query($dbConn, $sql_updateOTP);
							
							/*------------------------------OTP mail to Supplier ----------------------------------*/
							$selectedLang=isset($_REQUEST['selectedLang'])?$_REQUEST['selectedLang']:'en';
							$toEmail = $supplierEmail;
							$fromEmail = SYSTEMEMAIL;
							$subject = "Please use this OTP to login in supplier portal - ".date('Y-m-d H:i:s');
							$template = file_get_contents('../assets/templates/mailTemplates/otp_to_supplier.' . $selectedLang . '.html');
							$replacements = [
								'{{SITENAME}}'     => SITENAME,
								'{{SUPPLIERNAME}}' => $qry_res_fetch["supplierName"],
								'{{OTP}}'          => $otp,
								'{{SUPPORTEMAIL}}' => ADMINEMAIL,
								'{{year}}'         => date('Y')
							];
							foreach ($replacements as $key => $value) {
								$template = str_replace($key, $value, $template);
							}
							$message = $template;
							insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "OTP");
							/*------------------------------OTP mail to Supplier ----------------------------------*/
						}
						/*-------------------Functionality dedicated to supplier portal----------------------------*/
						echo '{"responseCode" : 2, "msg" : "Email exists"}';
					}else{
						echo '{"responseCode" : 1, "msg" : "Email not exists"}';
					}
				} else { 
					echo '{"responseCode" : 0, "msg" : "Invalid Email"}';
				}   
			}else{
				echo '{"responseCode" : 0, "msg" : "Blank Email"}';
			}
			break;
		}
		
		//#SupplierPortal #Admin
		case "VALIDATESUPPLIEROTP":{
			$supplierEmail = $_REQUEST['supplierEmail'] ?? "";
			$otp = $_REQUEST['otp'] ?? "";
			if (empty($supplierEmail) || empty($otp)) {
				echo json_encode(['responseCode' => 0, 'msg' => 'Email or OTP is blank']);
				break;
			}
			if (!preg_match(EMAILREGEX, $supplierEmail) || strlen($otp) != 6) {
				echo json_encode(['responseCode' => 0, 'msg' => 'Invalid Email']);
				break;
			}
			$supplierEmailEscaped = mysqli_real_escape_string($dbConn, $supplierEmail);
			$otpEscaped = mysqli_real_escape_string($dbConn, $otp);
			$sql = "SELECT * FROM `supplier` WHERE `supplierEmail` = '$supplierEmailEscaped' AND `supplierPassword` = '$otpEscaped'";
			$sqlRes = mysqli_query($dbConn, $sql);
			if (mysqli_num_rows($sqlRes) > 0) {
				$supplier = mysqli_fetch_array($sqlRes);
				if ($supplier['supplierId'] && $supplier['status'] == 1) {
					$_SESSION['supplierId'] = $supplier['supplierId'];
					$_SESSION['supplierName'] = $supplier['supplierName'];
					$_SESSION['supplierContactPerson'] = $supplier['supplierContactPerson'];
					$_SESSION['supplierContactNo'] = $supplier['supplierContactNo'];
					$_SESSION['supplierEmail'] = $supplier['supplierEmail'];
					$_SESSION['msg'] = "";
					echo json_encode(['responseCode' => 1, 'msg' => 'Login successful']);
					exit;
				} else {
					$_SESSION['msg'] = 'The login details were deactivated.';
				}
			} else {
				echo json_encode(['responseCode' => 0, 'msg' => 'Wrong OTP !!!']);
			}
			break;
		}
		/*-----------------------------SUPPLIER APIs--------------------------------------------------*/
		
		/*-----------------------------SALE ORDER APIs------------------------------------------------*/
		//#Frontend
		case "SALEORDERDETAILSBYGUID":{
			$orderGUID=isset($_REQUEST['orderGUID'])?$_REQUEST['orderGUID']:"";
			if(strlen($orderGUID) > 0){
				/*----------------------------------Populate Payment information------------------------------*/
				$saleOrderPaymentInformations = array();
				$sql_saleOrderPaymentInformation = "SELECT 
													`finance`.`financeId`,
													`finance`.`financeCode`,
													`finance`.`financeDate`,
													`finance`.`credit`,
													`finance`.`description`,
													`finance`.`paymentMode`,
													`finance`.`paymentDetails` 
													FROM `finance` 
													INNER JOIN `orderSale`
													ON `finance`.`financeTitle` = `orderSale`.`orderCode`
													WHERE `orderSale`.`GUID` = '".$orderGUID."'";
				//echo $sql_saleOrderPaymentInformation; exit;
				$sql_saleOrderPaymentInformation_res = mysqli_query($dbConn, $sql_saleOrderPaymentInformation);
				while($sql_saleOrderPaymentInformation_res_fetch = mysqli_fetch_array($sql_saleOrderPaymentInformation_res)){
					$saleOrderPaymentInformationObject = (object) ['financeId' => (int)$sql_saleOrderPaymentInformation_res_fetch["financeId"],
																   'financeCode' => $sql_saleOrderPaymentInformation_res_fetch["financeCode"],
																   'financeDate' => $sql_saleOrderPaymentInformation_res_fetch["financeDate"],
																   'amount' => $sql_saleOrderPaymentInformation_res_fetch["credit"],
																   'description' => $sql_saleOrderPaymentInformation_res_fetch["description"],
																   'paymentMode' => $sql_saleOrderPaymentInformation_res_fetch["paymentMode"],
																   ];
					//echo json_encode($saleOrderPaymentInformationObject);exit;
					$saleOrderPaymentInformations[] = $saleOrderPaymentInformationObject;
				}
				//echo json_encode($saleOrderPaymentInformations);exit;
				/*----------------------------------Populate Payment information------------------------------*/
				
				$sql = "SELECT `orderSale`.`orderCode`,
				`orderSale`.`GUID`,
				`orderSale`.`parentOrderId`,
				`orderSale`.`orderObj`,
				`orderSale`.`packingObj`,
				`orderSale`.`totalPrice`,
				`orderSale`.`additionalData`,
				CASE 
					WHEN TIME(`orderSale`.`orderDate`) = '00:00:00' THEN DATE_FORMAT(`orderSale`.`orderDate`, '%Y-%m-%d')
					ELSE `orderSale`.`orderDate`
				END AS `orderDate`,
				CASE 
					WHEN TIME(`orderSale`.`deliveryDate`) = '00:00:00' THEN DATE_FORMAT(`orderSale`.`deliveryDate`, '%Y-%m-%d')
					ELSE `orderSale`.`deliveryDate`
				END AS `deliveryDate`,
				`orderSale`.`createdBy`,
				`orderSale`.`status`,
				`customer`.`customerId`,
				`customer`.`companyName`,
				`customer`.`companyType`,
				`customer`.`buyerName`,
				`customer`.`contactPerson`,
				`customer`.`customerGrade`,
				`customer`.`address`,
				`customer`.`town`,
				`customer`.`postCode`,
				`customer`.`country`,
				`customer`.`phone`,
				`customer`.`fax`,
				`customerDeliveryAddress`.`deliveryAddressId`,
				`customerDeliveryAddress`.`companyName` AS 'deliveryCompanyName',
				`customerDeliveryAddress`.`contactPerson` AS 'deliveryContactPerson',
				`customerDeliveryAddress`.`phone` AS 'deliveryPhone',
				`customerDeliveryAddress`.`email`,
				`customerDeliveryAddress`.`address` AS 'deliveryAddress',
				`customerDeliveryAddress`.`postCode` AS 'deliveryPostCode',
				`customerDeliveryAddress`.`country` AS 'deliveryCountry',
				`customerDeliveryAddress`.`town` AS 'deliveryTown'
				FROM `orderSale` 
				INNER JOIN `customer`
				ON `customer`.`customerId` = `orderSale`.`customerId`
				LEFT JOIN `customerDeliveryAddress`
				ON `customerDeliveryAddress`.`deliveryAddressId` = `orderSale`.`deliveryAddressId`
				WHERE `orderSale`.`GUID` = '".$orderGUID."'";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$noOfRecords = mysqli_num_rows($sql_res);
				//echo $noOfRecords; exit;
				if($noOfRecords > 0){
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$orderObject = (object) [
												 'orderCode' => $sql_res_fetch["orderCode"], 
												 'GUID' => $sql_res_fetch["GUID"], 
												 'parentOrderId' => (int)$sql_res_fetch["parentOrderId"], 
												 'orderObj' => $sql_res_fetch["orderObj"], 
												 'packingObj' => $sql_res_fetch["packingObj"], 
												 'totalPrice' => $sql_res_fetch["totalPrice"], 
												 'additionalData' => $sql_res_fetch["additionalData"], 
												 'paymentInformation' => $saleOrderPaymentInformations, 
												 'orderDate' => $sql_res_fetch["orderDate"], 
												 'deliveryDate' => $sql_res_fetch["deliveryDate"], 
												 'createdBy' => $sql_res_fetch["createdBy"], 
												 'status' => (int)$sql_res_fetch["status"], 
												 'customerId' => $sql_res_fetch["customerId"], 
												 'companyName' => $sql_res_fetch["companyName"], 
												 'companyType' => $sql_res_fetch["companyType"], 
												 'buyerName' => $sql_res_fetch["buyerName"], 
												 'contactPerson' => $sql_res_fetch["contactPerson"], 
												 'customerGrade' => $sql_res_fetch["customerGrade"], 
												 'address' => $sql_res_fetch["address"], 
												 'town' => $sql_res_fetch["town"], 
												 'postCode' => $sql_res_fetch["postCode"], 
												 'country' => $sql_res_fetch["country"], 
												 'phone' => $sql_res_fetch["phone"], 
												 'fax' => $sql_res_fetch["fax"], 
												 'deliveryAddressId' => $sql_res_fetch["deliveryAddressId"], 
												 'deliveryCompanyName' => $sql_res_fetch["deliveryCompanyName"], 
												 'deliveryContactPerson' => $sql_res_fetch["deliveryContactPerson"], 
												 'deliveryPhone' => $sql_res_fetch["deliveryPhone"], 
												 'email' => $sql_res_fetch["email"], 
												 'deliveryAddress' => $sql_res_fetch["deliveryAddress"], 
												 'deliveryPostCode' => $sql_res_fetch["deliveryPostCode"], 
												 'deliveryCountry' => $sql_res_fetch["deliveryCountry"], 
												 'deliveryTown' => $sql_res_fetch["deliveryTown"]
												];
						//echo json_encode($orderObject);exit;
						$orderObjectArray[] = $orderObject;
					}
					echo '{"responseCode" : 1, "msg" : '.json_encode($orderObjectArray).'}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Order unauthorized or URL tampered"}';
					//xxxx grab IP and block
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "Order id is blank"}';
			}
			break;
		}
		/*-----------------------------SALE ORDER APIs------------------------------------------------*/

		/*-----------------------------PURCHASE ORDER APIs--------------------------------------------*/
		//#Frontend
		case "PURCHASEORDERDETAILSBYGUID":{
			$orderGUID=isset($_REQUEST['orderGUID'])?$_REQUEST['orderGUID']:"";
			if(strlen($orderGUID) > 0){
				/*----------------------------------Populate Payment information------------------------------*/
				$purchaseOrderPaymentInformations = array();
				$sql_purchaseOrderPaymentInformation = "SELECT 
														`finance`.`financeId`,
														`finance`.`financeCode`,
														`finance`.`financeDate`,
														`finance`.`debit`,
														`finance`.`description`,
														`finance`.`paymentMode`,
														`finance`.`paymentDetails` 
														FROM `finance` 
														INNER JOIN `orderPurchase`
														ON `finance`.`financeTitle` = `orderPurchase`.`purchaseOrderCode`
														WHERE `orderPurchase`.`GUID` = '".$orderGUID."'";
				//echo $sql_purchaseOrderPaymentInformation; exit;
				$sql_purchaseOrderPaymentInformation_res = mysqli_query($dbConn, $sql_purchaseOrderPaymentInformation);
				while($sql_purchaseOrderPaymentInformation_res_fetch = mysqli_fetch_array($sql_purchaseOrderPaymentInformation_res)){
					$purchaseOrderPaymentInformationObject = (object) ['financeId' => (int)$sql_purchaseOrderPaymentInformation_res_fetch["financeId"],
																		'financeCode' => $sql_purchaseOrderPaymentInformation_res_fetch["financeCode"],
																		'financeDate' => $sql_purchaseOrderPaymentInformation_res_fetch["financeDate"],
																		'amount' => $sql_purchaseOrderPaymentInformation_res_fetch["debit"],
																		'description' => $sql_purchaseOrderPaymentInformation_res_fetch["description"],
																		'paymentMode' => $sql_purchaseOrderPaymentInformation_res_fetch["paymentMode"],
																   ];
					//echo json_encode($purchaseOrderPaymentInformationObject);exit;
					$purchaseOrderPaymentInformations[] = $purchaseOrderPaymentInformationObject;
				}
				//echo json_encode($purchaseOrderPaymentInformations);exit;
				/*----------------------------------Populate Payment information------------------------------*/
				
				$sql = "SELECT `orderPurchase`.`purchaseOrderCode` AS 'orderCode',
						`orderPurchase`.`GUID`,
						`orderPurchase`.`parentPurchaseOrderId` AS 'parentOrderId',
						`orderPurchase`.`purchaseOrderObj` AS 'orderObj',
						`orderPurchase`.`purchasePackingObj` AS 'packingObj',
						`orderPurchase`.`totalPrice`,
						`orderPurchase`.`additionalData`,
						CASE 
							WHEN TIME(`orderPurchase`.`purchaseOrderCreateDate`) = '00:00:00' THEN DATE_FORMAT(`orderPurchase`.`purchaseOrderCreateDate`, '%Y-%m-%d')
							ELSE `orderPurchase`.`purchaseOrderCreateDate`
						END AS `orderDate`,
						CASE 
							WHEN TIME(`orderPurchase`.`purchaseOrderDeliveryDate`) = '00:00:00' THEN DATE_FORMAT(`orderPurchase`.`purchaseOrderDeliveryDate`, '%Y-%m-%d')
							ELSE `orderPurchase`.`purchaseOrderDeliveryDate`
						END AS `deliveryDate`,
						`orderPurchase`.`createdBy`,
						`orderPurchase`.`status`,
						`supplier`.`supplierId`,
						`supplier`.`supplierName`,
						`supplier`.`supplierContactPerson`,
						`supplier`.`supplierAddress`,
						`supplier`.`supplierTown`,
						`supplier`.`supplierPostCode`,
						`supplier`.`supplierCountry`,
						`supplier`.`supplierContactNo`,
						`supplier`.`supplierEmail`
						FROM `orderPurchase` 
						INNER JOIN `supplier`
						ON `supplier`.`supplierId` = `orderPurchase`.`supplierId`
						WHERE `orderPurchase`.`GUID` = '".$orderGUID."'";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$noOfRecords = mysqli_num_rows($sql_res);
				//echo $noOfRecords; exit;
				if($noOfRecords > 0){
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$purchaseOrderObject = (object) [
												 'orderCode' => $sql_res_fetch["orderCode"], 
												 'GUID' => $sql_res_fetch["GUID"], 
												 'parentOrderId' => (int)$sql_res_fetch["parentOrderId"], 
												 'orderObj' => $sql_res_fetch["orderObj"], 
												 'packingObj' => $sql_res_fetch["packingObj"], 
												 'totalPrice' => $sql_res_fetch["totalPrice"], 
												 'paymentInformation' => $purchaseOrderPaymentInformations, 
												 'additionalData' => $sql_res_fetch["additionalData"], 
												 'orderDate' => $sql_res_fetch["orderDate"], 
												 'deliveryDate' => $sql_res_fetch["deliveryDate"], 
												 'createdBy' => $sql_res_fetch["createdBy"], 
												 'status' => (int)$sql_res_fetch["status"], 
												 'supplierId' => $sql_res_fetch["supplierId"], 
												 'supplierName' => $sql_res_fetch["supplierName"], 
												 'supplierContactPerson' => $sql_res_fetch["supplierContactPerson"], 
												 'supplierAddress' => $sql_res_fetch["supplierAddress"], 
												 'supplierTown' => $sql_res_fetch["supplierTown"], 
												 'supplierPostCode' => $sql_res_fetch["supplierPostCode"], 
												 'supplierCountry' => $sql_res_fetch["supplierCountry"], 
												 'supplierContactNo' => $sql_res_fetch["supplierContactNo"], 
												 'supplierEmail' => $sql_res_fetch["supplierEmail"] 
												];
						//echo json_encode($purchaseOrderObject);exit;
						$purchaseOrderObjectArray[] = $purchaseOrderObject;
					}
					echo '{"responseCode" : 1, "msg" : '.json_encode($purchaseOrderObjectArray).'}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Purchase Order unauthorized or URL tampered"}';
					//xxxx grab IP and block
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "Purchase Order id is blank"}';
			}
			break;
		}
		/*-----------------------------PURCHASE ORDER APIs--------------------------------------------*/
		
		/*-----------------------------PRECOMPILED DATA APIs-------------------------------------------*/
		//#Frontend #Admin
		case "PRECOMPILEDDATA":{
			$type=isset($_REQUEST['type'])?$_REQUEST['type']:"";
			if($type != ""){
				echo populatePreCompiledData($dbConn, $type);
			}
			break;
		}
		/*-----------------------------PRECOMPILED DATA APIs-------------------------------------------*/
		
	/*=================================Public API Section Ends==================================================================*/
		
	/*=================================Sessioned API Section Starts=============================================================*/
		
		/*-----------------------------PRODUCT APIs---------------------------------------------------*/
		//Sessioned #Admin
		case "SAVEPRODUCTARRANGEMENTORDER":{
			if(isset($_SESSION['userId'])){
				$productArrangedOrder=isset($_REQUEST['productArrangedOrder'])?json_decode($_REQUEST['productArrangedOrder']):"{}";
				//var_dump($productArrangedOrder); exit;
				if(COUNT($productArrangedOrder) > 0){
					for($i = 0; $i < COUNT($productArrangedOrder); $i++){
						//echo "productId : ".$productArrangedOrder[$i]->productId.", index : ".$productArrangedOrder[$i]->index."<br />";
						$productOrderUpdateSQL = "UPDATE `product` SET `product`.`arrangementOrder` = '".$productArrangedOrder[$i]->index."' WHERE `product`.`productId` = ".$productArrangedOrder[$i]->productId;
						//echo $productOrderUpdateSQL; exit;
						$productOrderUpdateSQL_res = mysqli_query($dbConn, $productOrderUpdateSQL);
					}
					echo '{"responseCode" : 1, "msg" : "Product arrangement orders saved successfully."}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Product arrangement orders not saved."}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in", "redirect" : "login"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "SAVESTOCK":{
			if(isset($_SESSION['userId'])){
				$productId=isset($_REQUEST['productId'])?(int)$_REQUEST['productId']:0;
				$productCombinationId=isset($_REQUEST['productCombinationId'])?(int)$_REQUEST['productCombinationId']:0;
				$productCombinationQR=isset($_REQUEST['productCombinationQR'])?$_REQUEST['productCombinationQR']:"";
				$systemReferenceArray=isset($_REQUEST['systemReferenceArray'])?explode(",", $_REQUEST['systemReferenceArray']):[];
				$systemReferenceType=isset($_REQUEST['systemReferenceType'])?(int)$_REQUEST['systemReferenceType']:0;
				$itemPosition=isset($_REQUEST['itemPosition'])?(int)$_REQUEST['itemPosition']:0;
				$entryReference=isset($_REQUEST['entryReference'])?$_REQUEST['entryReference']:"";
				
				/*echo "productId : ".$productId." <br>";
				echo "productCombinationId : ".$productCombinationId." <br> ";
				echo "productCombinationQR : ".$productCombinationQR." <br> ";
				echo "systemReferenceArray : ".print_r($systemReferenceArray)." <br> "; 
				echo "systemReferenceType : ".$systemReferenceType." <br> "; 
				echo "itemPosition : ".$itemPosition." <br> "; 
				echo "entryReference : ".$entryReference." <br> ";exit;*/
				
				for($i = 0; $i < count($systemReferenceArray); $i++){
					$sqlAdd = "INSERT INTO `productStock` (
															`stockId`, 
															`productId`, 
															`productCombinationId`, 
															`productCombinationQR`, 
															`systemReference`, 
															`systemReferenceType`, 
															`itemPosition`, 
															`entryDate`, 
															`dispatchDate`, 
															`entryReference`, 
															`dispatchReference`, 
															`status`) 
												VALUES 	  (
															NULL, 
															'".$productId."', 
															'".$productCombinationId."', 
															'".$productCombinationQR."', 
															'".$systemReferenceArray[$i]."', 
															'".$systemReferenceType."', 
															'".$itemPosition."', 
															NOW(), 
															NULL, 
															'".$entryReference."', 
															NULL, 
															'1'
														  )";
					//echo $sqlAdd; exit;
					$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
				}
				/*-----------------------------------Populate Pre-compiled Data-------------------------*/
				updateLiveTime($dbConn, 'PRODUCT');
				populateProductPreCompiledData($dbConn, $productId);
				/*-----------------------------------Populate Pre-compiled Data-------------------------*/
				
				echo '{"responseCode" : 1, "msg" : {"productId" : '.$productId.', "productCombinationId" : '.$productCombinationId.'}}';
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in", "redirect" : "login"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "DISPACHSTOCK":{
			if(isset($_SESSION['userId'])){
				$productId=isset($_REQUEST['productIdHdn'])?intval($_REQUEST['productIdHdn']):0;
				$productCombinationId=isset($_REQUEST['productCombinationIdHdn'])?intval($_REQUEST['productCombinationIdHdn']):0;
				$dispatchReference=isset($_REQUEST['dispatchReference'])?$_REQUEST['dispatchReference']:"";
				$selectedStockIds=isset($_REQUEST['selectedStockIds'])?$_REQUEST['selectedStockIds']:"";
				if(strlen($selectedStockIds) > 0){
					$selectedStockIds = explode(",",$selectedStockIds);
				}else{
					$selectedStockIds = [];
				}
				$count=isset($_REQUEST['count'])?intval($_REQUEST['count']):0;
				
				/*echo "productId : ".$productId."<br />";
				echo "productCombinationId : ".$productCombinationId."<br />";
				echo "dispatchReference : ".$dispatchReference."<br />";
				echo "selectedStockIds : ".print_r($selectedStockIds)."<br />";
				echo "count : ".$count."<br />";
				exit;*/
				
				if(count($selectedStockIds) > 0){
					for($i = 0; $i < count($selectedStockIds); $i++){
						$stockIdDeleteSql = "UPDATE `productStock` SET 
											`productStock`.`dispatchDate` = NOW(), 
											`productStock`.`dispatchReference` = '".$dispatchReference."',
											`productStock`.`status` = '0' 
											WHERE `productStock`.`stockId` = ".$selectedStockIds[$i];
						//echo $stockIdDeleteSql; exit;
						$stockIdDeleteSql_res = mysqli_query($dbConn, $stockIdDeleteSql);
					}
				}else if($count > 0){	
					$stockIdDeleteSql = "UPDATE `productStock`
										SET 
											`dispatchDate` = NOW(),
											`dispatchReference` = '".$dispatchReference."',
											`status` = '0'
										WHERE `stockId` IN (
											SELECT `stockId`
											FROM (
												SELECT `stockId`
												FROM `productStock`
												WHERE `productId` = ".$productId." 
												AND `productCombinationId` = ".$productCombinationId."
												AND `status` = '1'
												ORDER BY `entryDate` ASC
												LIMIT ".$count."
											) AS subquery
										)";					
					//echo $stockIdDeleteSql; exit;
					$stockIdDeleteSql_res = mysqli_query($dbConn, $stockIdDeleteSql);
				}
				/*-----------------------------------Populate Pre-compiled Data-------------------------*/
				updateLiveTime($dbConn, 'PRODUCT');
				populateProductPreCompiledData($dbConn, $productId);
				/*-----------------------------------Populate Pre-compiled Data-------------------------*/
	
				echo '{"responseCode" : 1, "msg" : {"productId" : '.$productId.', "productCombinationId" : '.$productCombinationId.'}}';
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in", "redirect" : "login"}';
			}
			break;
		}
		/*-----------------------------PRODUCT APIs---------------------------------------------------*/
		
		/*-----------------------------CUSTOMER APIs--------------------------------------------------*/
		//Sessioned #Admin
		case "GETCUSTOMERS":{
			if(isset($_SESSION['userId'])){
				$keyword=isset($_REQUEST['keyword'])?$_REQUEST['keyword']:'';
				$companyTypeId=isset($_REQUEST['companyTypeId'])?(int)$_REQUEST['companyTypeId']:0;
				$customerGrade=isset($_REQUEST['customerGrade'])?$_REQUEST['customerGrade']:'';
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				$status=isset($_REQUEST['status'])?(int)$_REQUEST['status']:0;
				/*echo "keyword : ".$keyword."<br />".
				"companyTypeId : ".$companyTypeId."<br />".
				"customerGrade : ".$customerGrade."<br />".
				"status : ".$status."<br />";exit;*/
				
				$subQry = '';
				if($keyword != ""){
					$subQry = $subQry." AND `customer`.`companyName` LIKE '%".$keyword."%' OR `customer`.`buyerName` LIKE '%".$keyword."%' OR `customer`.`contactPerson` LIKE '%".$keyword."%'";
				}
				if($companyTypeId > 0){
					$subQry = $subQry.' AND `customer`.`companyType` = '.$companyTypeId;
				}
				if($customerGrade != ""){
					$subQry = $subQry." AND `customer`.`customerGrade` = '".$customerGrade."'";
				}
				if($customerId > 0){
					$subQry = $subQry." AND `customer`.`customerId` = '".$customerId."'";
				}
				$subQry = $subQry.' AND `customer`.`status` = '.$status;
				//echo $subQry; exit;
				
				$sql = "SELECT 
				`customer`.`customerId`,
				`customer`.`companyName`,
				`customer`.`companyType`,
				`customer`.`customerGrade`,
				`companyType`.`companyType` as 'compType',
				`customer`.`buyerName`,
				`customer`.`contactPerson`,
				`customer`.`phone`,
				`customer`.`email` 
				FROM 
				`customer` 
				INNER JOIN `companyType`
				ON `companyType`.`companyTypeId` = `customer`.`companyType`
				WHERE `customer`.`customerId` > 0 ".$subQry."
				ORDER BY `customer`.`registrationDate` DESC";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$customerObjectArray = array();
				while($sql_res_fetch = mysqli_fetch_array($sql_res)){
					$customerObject = (object) ['customerId' => (int)$sql_res_fetch["customerId"], 
												'companyName' => $sql_res_fetch["companyName"],
												'companyType' => $sql_res_fetch["companyType"],
												'customerGrade' => $sql_res_fetch["customerGrade"],
												'compType' => $sql_res_fetch["compType"],
												'buyerName' => $sql_res_fetch["buyerName"],
												'contactPerson' => $sql_res_fetch["contactPerson"],
												'phone' => $sql_res_fetch["phone"],
												'email' => $sql_res_fetch["email"]
												];
					//echo json_encode($customerObject);exit;
					$customerObjectArray[] = $customerObject;
				}
				echo json_encode($customerObjectArray);
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "GETCUSTOMER":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				if(intval($customerId) > 0){
					$sql = "SELECT 
					`customer`.`customerId`,
					`customer`.`existingId`,
					`customer`.`companyName`,
					`customer`.`companyType`,
					`companyType`.`companyType` as 'compType',
					`customer`.`customerGrade`,
					`customer`.`buyerName`,
					`customer`.`contactPerson`,
					`customer`.`address`,
					`customer`.`postCode`,
					`customer`.`country`,
					`customer`.`town`,
					`customer`.`phone`,
					`customer`.`fax`,
					`customer`.`email`,
					`customer`.`mobile`,
					`customer`.`website`,
					`customer`.`bankDetails`,
					`customer`.`additionalInformation`,
					`customer`.`registrationDate`,
					`customer`.`lastLoginDate`,
					`customer`.`status`
					FROM 
					`customer` 
					INNER JOIN `companyType`
					ON `companyType`.`companyTypeId` = `customer`.`companyType`
					WHERE `customer`.`customerId` = ".$customerId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					$customerObjectArray = array();
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$bankDetails = isset($sql_res_fetch["bankDetails"]) && !is_null($sql_res_fetch["bankDetails"]) ? json_decode($sql_res_fetch["bankDetails"]) : null;
						$additionalInformation = isset($sql_res_fetch["additionalInformation"]) && !is_null($sql_res_fetch["additionalInformation"]) ? json_decode($sql_res_fetch["additionalInformation"]) : null;
						$customerObject = (object) ['customerId' => (int)$sql_res_fetch["customerId"], 
													'existingId' => (int)$sql_res_fetch["existingId"], 
													'companyName' => $sql_res_fetch["companyName"],
													'companyType' => (int)$sql_res_fetch["companyType"],
													'compType' => $sql_res_fetch["compType"],
													'customerGrade' => $sql_res_fetch["customerGrade"],
													'buyerName' => $sql_res_fetch["buyerName"],
													'contactPerson' => $sql_res_fetch["contactPerson"],
													'address' => $sql_res_fetch["address"],
													'postCode' => $sql_res_fetch["postCode"],
													'country' => $sql_res_fetch["country"],
													'town' => $sql_res_fetch["town"],
													'phone' => $sql_res_fetch["phone"],
													'fax' => $sql_res_fetch["fax"],
													'email' => $sql_res_fetch["email"],
													'mobile' => $sql_res_fetch["mobile"],
													'website' => $sql_res_fetch["website"],
													'bankDetails' => $bankDetails,
													'additionalInformation' => $additionalInformation,
													'registrationDate' => $sql_res_fetch["registrationDate"],
													'lastLoginDate' => $sql_res_fetch["lastLoginDate"],
													'status' => $sql_res_fetch["status"]
												   ];
						//echo json_encode($customerObject);exit;
						$customerObjectArray[] = $customerObject;
					}
					echo json_encode($customerObjectArray);
				}else{
					echo '{"responseCode" : 0, "msg" : "Customer Id is not provided"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "DELETECUSTOMER":{
			if(isset($_SESSION['userId'])){
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				if(intval($customerId) > 0){
					/*-----------------------------Deletion from Order Sale-------------------*/
					$sqlDelete1 = "DELETE FROM `orderSale` WHERE `orderSale`.`customerId` = ".$customerId;
					//echo $sqlDelete1; exit;
					$sqlDelete1_res = mysqli_query($dbConn, $sqlDelete1);
					/*-----------------------------Deletion from Order Sale-------------------*/
					
					/*-----------------------------Delete customer signature file-------------*/
					deleteFile("CUST-SIGN_".$customerId.".jpeg", "uploads/customerSignature/");
					/*-----------------------------Delete customer signature file-------------*/
					
					/*-----------------------------Deletion from customer delivery address----*/
					$sqlDelete2 = "DELETE FROM `customerDeliveryAddress` WHERE `customerDeliveryAddress`.`customerId` = ".$customerId;
					//echo $sqlDelete2; exit;
					$sqlDelete2_res = mysqli_query($dbConn, $sqlDelete2);
					/*-----------------------------Deletion from customer delivery address----*/
					
					/*-----------------------------Deletion from customer master--------------*/
					$sqlDelete3 = "DELETE FROM `customer` WHERE `customer`.`customerId` = ".$customerId;
					//echo $sqlDelete3; exit;
					$sqlDelete3_res = mysqli_query($dbConn, $sqlDelete3);
					/*-----------------------------Deletion from customer master--------------*/
					
					echo '{"responseCode" : 1, "msg" : "Customer deleted successfully"}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Customer Id is not provided"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "ADDDELIVERYADDRESS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$companyName=isset($_REQUEST['companyName'])?preg_replace(ALFANUMERICREGEX, '', $_REQUEST['companyName']):"";
				$contactPerson=isset($_REQUEST['contactPerson'])?preg_replace(ALFANUMERICREGEX, '', $_REQUEST['contactPerson']):"";
				$phone=isset($_REQUEST['phone'])?preg_replace(NUMERICREGEX, '', $_REQUEST['phone']):"";
				$email=isset($_REQUEST['email'])?$_REQUEST['email']:"";
				$address=isset($_REQUEST['address'])?preg_replace(ALFANUMERICREGEX, '', $_REQUEST['address']):"";
				$postCode=isset($_REQUEST['postCode'])?preg_replace(ALFANUMERICREGEX, '', $_REQUEST['postCode']):"";
				$town=isset($_REQUEST['town'])?$_REQUEST['town']:"";
				$country=isset($_REQUEST['country'])?$_REQUEST['country']:"";
				if(isset($_SESSION['customerId'])){
					$customerId=(int)$_SESSION['customerId'];
				}else{
					$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				}
				
				/*echo "companyName : ".$companyName." <br />";
				echo "contactPerson : ".$contactPerson." <br />";
				echo "phone : ".$phone." <br />";
				echo "email : ".$email." <br />";
				echo "address : ".$address." <br />";
				echo "postCode : ".$postCode." <br />";
				echo "town : ".$town." <br />";
				echo "country : ".$country." <br />";
				echo "customerId : ".$customerId." <br />";exit;*/
				
				if($companyName != "" && 
			   $contactPerson != "" && 
			   $phone != "" && 
			   $email != "" && 
			   preg_match(EMAILREGEX, $email) && 
			   $address != "" && 
			   $postCode != "" && 
			   $town != "" && 
			   $country != ""){
				   $sqlDeliveryAddress = "INSERT INTO `customerDeliveryAddress` (
									`deliveryAddressId`, 
									`companyName`, 
									`contactPerson`, 
									`phone`, 
									`email`, 
									`address`, 
									`postCode`, 
									`country`, 
									`town`, 
									`customerId`) 
									VALUES (
									NULL, 
									'".$companyName."', 
									'".$contactPerson."', 
									'".$phone."', 
									'".$email."', 
									'".$address."', 
									'".$postCode."', 
									'".$country."', 
									'".$town."', 
									'".$customerId."')";
					//echo $sqlDeliveryAddress; exit;
					$sqlDeliveryAddress_res = mysqli_query($dbConn, $sqlDeliveryAddress);
					echo '{"responseCode" : 1, "msg" : "Delivery address added successfully."}';
			   }else{
				   echo '{"responseCode" : 0, "msg" : "Somthing went wrong !."}';
			   }
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "GETDELIVERYADDRESSES":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				if(intval($customerId) > 0){
					$sqlGetDeliveryAddress = "SELECT `deliveryAddressId`,
												`companyName`,
												`contactPerson`,
												`phone`,
												`email`,
												`address`,
												`postCode`,
												`country`,
												`town` 
												FROM `customerDeliveryAddress` 
												WHERE `customerId` = ".$customerId;
					//echo $sqlGetDeliveryAddress; exit;
					$sqlGetDeliveryAddress_res = mysqli_query($dbConn, $sqlGetDeliveryAddress);
					$customerDeliveryAddressObjectArray = array();
					while($sqlGetDeliveryAddress_res_fetch = mysqli_fetch_array($sqlGetDeliveryAddress_res)){
						$customerDeliveryAddressObject = (object) ['deliveryAddressId' => (int)$sqlGetDeliveryAddress_res_fetch["deliveryAddressId"], 
																   'companyName' => $sqlGetDeliveryAddress_res_fetch["companyName"], 
																   'contactPerson' => $sqlGetDeliveryAddress_res_fetch["contactPerson"],
																   'phone' => $sqlGetDeliveryAddress_res_fetch["phone"],
																   'email' => $sqlGetDeliveryAddress_res_fetch["email"],
																   'address' => $sqlGetDeliveryAddress_res_fetch["address"],
																   'postCode' => $sqlGetDeliveryAddress_res_fetch["postCode"],
																   'country' => $sqlGetDeliveryAddress_res_fetch["country"],
																   'town' => $sqlGetDeliveryAddress_res_fetch["town"]
																];
						//echo json_encode($customerDeliveryAddressObject);exit;
						$customerDeliveryAddressObjectArray[] = $customerDeliveryAddressObject;
					}
					echo json_encode($customerDeliveryAddressObjectArray);
				}else{
				   echo '{"responseCode" : 0, "msg" : "Somthing went wrong !."}';
			   }
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "DELETEDELIVERYADDRESS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$deliveryAddressId=isset($_REQUEST['deliveryAddressId'])?$_REQUEST['deliveryAddressId']:0;
				if($deliveryAddressId > 0){
					$sql_delete_deliveryAddress = "DELETE FROM `customerDeliveryAddress` WHERE `customerDeliveryAddress`.`deliveryAddressId` = ".$deliveryAddressId;
					//echo $sql_delete_deliveryAddress; exit;
					$sql_delete_deliveryAddress_res = mysqli_query($dbConn, $sql_delete_deliveryAddress);
					echo '{"responseCode" : 1, "msg" : "Delivery address deleted successfully."}';
				}else{
				   echo '{"responseCode" : 0, "msg" : "Somthing went wrong !."}';
			   }
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "CUSTOMERSIGNATURE":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				if(isset($_SESSION['customerId'])){
					$customerId=(int)$_SESSION['customerId'];
				}else{
					$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				}
				$customerSignData=isset($_REQUEST['customerSignData'])?$_REQUEST['customerSignData']:"";
				//echo $customerSignData; exit;
				base64ToJpeg($customerSignData, 'customerSignature', 'CUST-SIGN_'.$customerId);
				echo '{"responseCode" : 1, "msg" : "Customer signature captured successfully."}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "DELETECUSTOMERSIGNATURE":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				if(isset($_SESSION['customerId'])){
					$customerId=(int)$_SESSION['customerId'];
				}else{
					$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				}
				deleteFile("CUST-SIGN_".$customerId.".jpeg", UPLOADFOLDER."customerSignature/");
				echo '{"responseCode" : 1, "msg" : "Customer signature deleted successfully."}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "CUSTOMERBALANCESHEET":{
			if(isset($_SESSION['userId'])){
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				$toDate=isset($_REQUEST['toDate'])?$_REQUEST['toDate']:"";
				$fromDate=isset($_REQUEST['fromDate'])?$_REQUEST['fromDate']:"";
				if($customerId > 0){
					$sql = "SELECT 
								`finance`.`financeDate` AS `transactionDate`,
								CASE 
									WHEN `finance`.`financeType` = 0 THEN 'Debit'
									WHEN `finance`.`financeType` = 1 THEN 'Credit'
									ELSE NULL
								END AS `narrationType`,
								CONCAT(IFNULL(`finance`.`financeCode`, ''), ' [', IFNULL(`finance`.`financeTitle`, ''), '] - ', IFNULL(`finance`.`description`, '')) AS `narration`,
								`finance`.`debit` AS `Debit`,
								`finance`.`credit` AS `Credit`
							FROM `finance`
							INNER JOIN `orderSale` ON `finance`.`financeTitle` = `orderSale`.`orderCode`
							WHERE `finance`.`financeCategoryId` = " .financeCategoryORDS . " AND `orderSale`.`customerId` = " . (int)$customerId;

					// Apply date filters to finance part
					if (!empty($fromDate)) {
						$sql .= " AND `finance`.`financeDate` >= '" .$fromDate. "'";
					}
					if (!empty($toDate)) {
						$sql .= " AND `finance`.`financeDate` <= '" .$toDate. "'";
					}

					$sql .= "

							UNION 

							SELECT 
								`orderSale`.`orderDate` AS `transactionDate`,
								'Debit' AS `narrationType`,
								CONCAT('[', `orderSale`.`orderCode`, '] - ', 'Sale Order Placed') AS `narration`,
								`orderSale`.`totalPrice` AS `Debit`,
								0.00 AS `Credit`
							FROM `orderSale` 
							WHERE `orderSale`.`customerId` = " .$customerId;

					// Apply date filters to orderSale part
					if (!empty($fromDate)) {
						$sql .= " AND `orderSale`.`orderDate` >= '" .$fromDate. "'";
					}
					if (!empty($toDate)) {
						$sql .= " AND `orderSale`.`orderDate` <= '" .$toDate. "'";
					}

					$sql .= " ORDER BY `transactionDate` DESC";
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					$financeObjectArray = array();
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$financeObject = (object) [
												   'transactionDate' => $sql_res_fetch["transactionDate"], 
												   'narrationType' => $sql_res_fetch["narrationType"],
												   'narration' => $sql_res_fetch["narration"],
												   'Debit' => (float)$sql_res_fetch["Debit"],
												   'Credit' => (float)$sql_res_fetch["Credit"]
												  ];
						$financeObjectArray[] = $financeObject;
					}
					echo json_encode($financeObjectArray);
				}else{
					echo '{"responseCode" : 0, "msg" : "Customer Id is not supplied"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in."}';
			}
			break;
		}
		/*-----------------------------CUSTOMER APIs--------------------------------------------------*/
		
		/*-----------------------------SALESDAIRY APIs------------------------------------------------*/
		//#Sessioned #Admin
		case "INSERTSALESDAIRYEVENT":{
			if(isset($_SESSION['userId'])){
				$eventTitle=isset($_REQUEST['eventTitle'])?preg_replace(ALFANUMERICREGEX, '', $_REQUEST['eventTitle']):"";
				$eventMinutes=isset($_REQUEST['eventMinutes'])?$_REQUEST['eventMinutes']:""; //xxxx need to filter
				//$eventMinutes=isset($_REQUEST['eventMinutes'])?preg_replace(ENCODEDATOBREGEX, '', $_REQUEST['eventMinutes']):"";
				$startDateTime=isset($_REQUEST['startDateTime'])?preg_replace(DATETIMEREGEX, '', $_REQUEST['startDateTime']):"";
				$endDateTime=isset($_REQUEST['endDateTime'])?preg_replace(DATETIMEREGEX, '', $_REQUEST['endDateTime']):"";
				$parentId=isset($_REQUEST['parentId'])?(int)preg_replace(NUMERICREGEX, '', $_REQUEST['parentId']):0;
				
				/*echo "eventTitle : ".$eventTitle."<br />".
				"eventMinutes : ".$eventMinutes."<br />".
				"startDateTime : ".$startDateTime."<br />".
				"endDateTime : ".$endDateTime."<br />".
				"parentId : ".$parentId."<br />"; exit;*/
				
				if((strlen($eventTitle) > 0) && (strlen($startDateTime) > 0) && (strlen($endDateTime) > 0)){
					$sqlSalesDairy = "INSERT INTO `salesDairy` (
												`eventCode`, 
												`eventTitle`, 
												`eventMinutes`, 
												`startDateTime`, 
												`endDateTime`, 
												`parentId`
												) VALUES (
												'SLD_0000',
												'".$eventTitle."', 
												'".$eventMinutes."', 
												'".$startDateTime."', 
												'".$endDateTime."', 
												".$parentId."
												)";
					//echo $sqlSalesDairy; exit;
					$sqlSalesDairy_res = mysqli_query($dbConn, $sqlSalesDairy);
					$inserted_salesDairyId = mysqli_insert_id($dbConn);
					//echo $inserted_salesDairyId; exit;
					
					/*-----------------------------------Sales Dairy Event Code Creation----------------------------*/
					$generatedEventCode = "SLD_".sprintf("%04d", $inserted_salesDairyId);
					$sqlSalesDairy_update = "UPDATE `salesDairy` SET `eventCode` = '".$generatedEventCode."' WHERE `salesDairy`.`salesDairyId` = ".$inserted_salesDairyId;
					//echo $sqlSalesDairy_update; exit;
					$sqlSalesDairy_update_res = mysqli_query($dbConn, $sqlSalesDairy_update);
					/*-----------------------------------Sales Dairy Event Code Creation----------------------------*/
					
					$sql = "SELECT 
							`eventCode`,
							`eventTitle`,
							`eventMinutes`,
							`startDateTime`,
							`endDateTime`,
							`parentId`
							FROM `salesDairy` 
							WHERE `salesDairyId` = ".$inserted_salesDairyId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$salesDairyEventObject = (object) ['salesDairyId' => (int)$inserted_salesDairyId, 
															'eventCode' => $sql_res_fetch["eventCode"],
															'eventTitle' => $sql_res_fetch["eventTitle"],
															'eventMinutes' => $sql_res_fetch["eventMinutes"],
															'startDateTime' => $sql_res_fetch["startDateTime"],
															'endDateTime' => $sql_res_fetch["endDateTime"],
															'parentId' => (int)$sql_res_fetch["parentId"]];
						//echo json_encode($salesDairyEventObject);exit;
						$salesDairyEventObjectArray[] = $salesDairyEventObject;
					}
					echo json_encode($salesDairyEventObjectArray);
			   }else{
				   echo '{"responseCode" : 0, "msg" : "Case Validation failed."}';
			   }
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//#Sessioned #Admin
		case "GETSALESDAIRYEVENTS":{
			if(isset($_SESSION['userId'])){
				$salesDairyEventObjectArray = array();
				$sql = "SELECT 
						`salesDairyId`,
						`eventCode`,
						`eventTitle`,
						`eventMinutes`,
						`startDateTime`,
						`endDateTime`,
						`parentId`
						FROM `salesDairy` 
						WHERE `startDateTime` BETWEEN DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH) 
						AND DATE_ADD(CURRENT_DATE, INTERVAL 12 MONTH)";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				while($sql_res_fetch = mysqli_fetch_array($sql_res)){
					$salesDairyEventObject = (object) ['salesDairyId' => (int)$sql_res_fetch["salesDairyId"], 
														'eventCode' => $sql_res_fetch["eventCode"],
														'eventTitle' => $sql_res_fetch["eventTitle"],
														'eventMinutes' => $sql_res_fetch["eventMinutes"],
														'startDateTime' => $sql_res_fetch["startDateTime"],
														'endDateTime' => $sql_res_fetch["endDateTime"],
														'parentId' => (int)$sql_res_fetch["parentId"]];
					//echo json_encode($salesDairyEventObject);exit;
					$salesDairyEventObjectArray[] = $salesDairyEventObject;
				}
				echo json_encode($salesDairyEventObjectArray);
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//#Sessioned #Admin
		case "GETSALESEVENT":{
			if(isset($_SESSION['userId'])){
				$salesDairyId=isset($_REQUEST['salesDairyId'])?(int)preg_replace(NUMERICREGEX, '', $_REQUEST['salesDairyId']):0;
				if($salesDairyId > 0){
					$sql = "SELECT 
							`eventCode`,
							`eventTitle`,
							`eventMinutes`,
							`startDateTime`,
							`endDateTime`,
							`parentId`
							FROM `salesDairy` 
							WHERE `salesDairyId` = ".$salesDairyId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$salesDairyEventObject = (object) ['salesDairyId' => (int)$salesDairyId, 
															'eventCode' => $sql_res_fetch["eventCode"],
															'eventTitle' => $sql_res_fetch["eventTitle"],
															'eventMinutes' => $sql_res_fetch["eventMinutes"],
															'startDateTime' => $sql_res_fetch["startDateTime"],
															'endDateTime' => $sql_res_fetch["endDateTime"],
															'parentId' => (int)$sql_res_fetch["parentId"]];
						//echo json_encode($salesDairyEventObject);exit;
						$salesDairyEventObjectArray[] = $salesDairyEventObject;
					}
					echo json_encode($salesDairyEventObjectArray);
				}else{
					echo '{"responseCode" : 0, "msg" : "Sales Dairy Id is Missing"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}
		
		//#Sessioned #Admin
		case "DELETESALESEVENT":{
			if(isset($_SESSION['userId'])){
				$salesDairyId=isset($_REQUEST['salesDairyId'])?(int)preg_replace(NUMERICREGEX, '', $_REQUEST['salesDairyId']):0;
				if($salesDairyId > 0){
					$sql = "DELETE FROM salesDairy WHERE `salesDairy`.`salesDairyId` = ".$salesDairyId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					echo '{"responseCode" : 1, "msg" : "Sales Event Deleted Succssfully"}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Sales Dairy Id is Missing"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "You are not logged in"}';
			}
			break;
		}	
		/*-----------------------------SALESDAIRY APIs------------------------------------------------*/
		
		/*-----------------------------SALE ORDER APIs------------------------------------------------*/
		//Sessioned #Admin #Frontend
		case "PLACEORDER":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$orderId=isset($_REQUEST['orderId'])?intval($_REQUEST['orderId']):0;
				$parentOrderId=isset($_REQUEST['parentOrderId'])?intval($_REQUEST['parentOrderId']):0;
				if(isset($_SESSION['userId'])){
					$customerId=isset($_REQUEST['customerId'])?intval($_REQUEST['customerId']):0;
					$createdBy=$_SESSION['userId'];
				}else if(isset($_SESSION['customerId'])){
					$customerId=intval($_SESSION['customerId']);
					$createdBy="CUSTOMER";
				}
				$deliveryAddressId=isset($_REQUEST['deliveryAddressId'])?intval($_REQUEST['deliveryAddressId']):0;
				$orderObj=isset($_REQUEST['orderObj'])?$_REQUEST['orderObj']:"";
				$packingObj=isset($_REQUEST['packingObj'])?$_REQUEST['packingObj']:"";
				$totalPrice=isset($_REQUEST['totalPrice'])?$_REQUEST['totalPrice']:"";
				$additionalData=isset($_REQUEST['additionalData'])?$_REQUEST['additionalData']:"";
				$deliveryDate=isset($_REQUEST['deliveryDate'])?$_REQUEST['deliveryDate']:"";
				
				/*echo "orderId : ".$orderId."<br>"; 
				echo "parentOrderId : ".$parentOrderId."<br>"; 
				echo "customerId : ".$customerId."<br>"; 
				echo "deliveryAddressId : ".$deliveryAddressId."<br>";
				echo "orderObj : ".$orderObj."<br>";
				echo "packingObj : ".$packingObj."<br>";
				echo "totalPrice : ".$totalPrice."<br>";
				echo "additionalData : ".$additionalData."<br>";
				echo "deliveryDate : ".$deliveryDate."<br>";
				exit;*/
				
				if($customerId > 0 && $deliveryAddressId > 0 && strlen($orderObj) > 0){
					if($orderId == 0){ //Insert order
						$sql1 = "INSERT INTO `orderSale` (
																`orderId`, 
																`orderCode`, 
																`GUID`,
																`parentOrderId`,
																`customerId`, 
																`deliveryAddressId`,
																`orderObj`,
																`packingObj`,
																`totalPrice`, 
																`additionalData`, 
																`orderDate`, 
																`deliveryDate`, 
																`createdBy`, 
																`status`
															) VALUES (
																NULL, 
																'ORDS_0000', 
																'".bin2hex(openssl_random_pseudo_bytes(16))."',
																'".$parentOrderId."',
																'".$customerId."',
																'".$deliveryAddressId."', 
																'".$orderObj."', 
																'".$packingObj."', 
																'".$totalPrice."', 
																'".$additionalData."', 
																NOW(), 
																'".$deliveryDate."', 
																'".$createdBy."', 
																1
															)";
						//echo $sql1; exit;
						$sql1_res = mysqli_query($dbConn, $sql1);
						$inserted_orderId = mysqli_insert_id($dbConn);
						//echo $inserted_orderId; exit;
						
						$order_code = "ORDS_".sprintf("%04d", $inserted_orderId);
						$sql2 = "UPDATE `orderSale` SET `orderCode` = '".$order_code."' WHERE `orderSale`.`orderId` = ".$inserted_orderId;
						//echo $sql2; exit;
						$sql2_res = mysqli_query($dbConn, $sql2);
						echo '{"responseCode" : '.$inserted_orderId.', "msg" : "Order Placed successfully"}';
					}else{ //Update order
						$sql1 = "UPDATE `orderSale` SET 
								`customerId` = '".$customerId."',
								`deliveryAddressId` = '".$deliveryAddressId."',
								`orderObj` = '".$orderObj."',
								`packingObj` = '".$packingObj."',
								`totalPrice` = '".$totalPrice."',";
						
						// Only add additionalData if it's not empty
						if(!empty($additionalData)) {
							$sql1 .= "`additionalData` = '".$additionalData."',";
						}
						// Complete the query
						$sql1 .= "`deliveryDate` = '".$deliveryDate."' WHERE `orderSale`.`orderId` = ".$orderId;
						//echo $sql1; exit;
						$sql1_res = mysqli_query($dbConn, $sql1);
						echo '{"responseCode" : '.$orderId.', "msg" : "Order Updated successfully"}';
					}
				}
				
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "ORDERS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$innerQry = " 1";
				if(isset($_SESSION['userId'])){
					$innerQry =" `orderSale`.`status` NOT IN(11,12)";
				}else if(isset($_SESSION['customerId'])){
					$innerQry =" `orderSale`.`customerId` = ".$_SESSION['customerId'];
				}
				
				$orderId=isset($_REQUEST['orderId'])?(int)$_REQUEST['orderId']:0;
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				$status=isset($_REQUEST['status'])?(int)$_REQUEST['status']:0;
				$startDate=isset($_REQUEST['startDate'])?$_REQUEST['startDate']:"";
				$endDate=isset($_REQUEST['endDate'])?$_REQUEST['endDate']:"";
				
				// Add search parameters to the query if they are present
				$searchConditions = [];
				if ($orderId > 0) {
					$searchConditions[] = "`orderSale`.`orderId` = $orderId";
				}
				if ($customerId > 0) {
					$searchConditions[] = "`orderSale`.`customerId` = $customerId";
				}
				if ($status > 0) {
					$searchConditions[] = "`orderSale`.`status` = $status";
				}
				if (!empty($startDate) && !empty($endDate)) {
					// Convert startDate and endDate to the format 'YYYY-MM-DD'
					$formattedStartDate = date('Y-m-d', strtotime($startDate));
					$formattedEndDate = date('Y-m-d', strtotime($endDate));
					$searchConditions[] = "(`orderSale`.`orderDate` BETWEEN '$formattedStartDate 00:00:00' AND '$formattedEndDate 23:59:59' OR `orderSale`.`deliveryDate` BETWEEN '$formattedStartDate 00:00:00' AND '$formattedEndDate 23:59:59')";
				}

				// Combine the inner query and search conditions
				if (!empty($searchConditions)) {
					$innerQry .= " AND " . implode(" AND ", $searchConditions);
				}
				
				$sql = "SELECT 
					`orderSale`.`orderId`,
					`orderSale`.`orderCode`,
					`orderSale`.`GUID`,
					`orderSale`.`parentOrderId`,
					`orderSale`.`customerId`,
					`orderSale`.`totalPrice`,
					COALESCE( 
						(SELECT SUM(`finance`.`credit`) FROM `finance` WHERE `finance`.`financeTitle` = `orderSale`.`orderCode`),
						0.00
					) AS 'paidAmount',
					CASE 
						WHEN TIME(`orderSale`.`orderDate`) = '00:00:00' THEN DATE_FORMAT(`orderSale`.`orderDate`, '%Y-%m-%d')
						ELSE `orderSale`.`orderDate`
					END AS `orderDate`,
					CASE 
						WHEN TIME(`orderSale`.`deliveryDate`) = '00:00:00' THEN DATE_FORMAT(`orderSale`.`deliveryDate`, '%Y-%m-%d')
						ELSE `orderSale`.`deliveryDate`
					END AS `deliveryDate`,
					`orderSale`.`status`,
					`customer`.`companyName`,
					`customer`.`companyType`,
					`customer`.`customerGrade`,
					`customer`.`buyerName`
				FROM `orderSale` 
				INNER JOIN `customer` ON `customer`.`customerId` = `orderSale`.`customerId`
				WHERE $innerQry 
				ORDER BY `orderDate` DESC";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$noOfRecords = mysqli_num_rows($sql_res);
				if($noOfRecords > 0){
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$orderObject = (object) ['orderId' => (int)$sql_res_fetch["orderId"],
												 'orderCode' => $sql_res_fetch["orderCode"], 
												 'GUID' => $sql_res_fetch["GUID"], 
												 'parentOrderId' => (int)$sql_res_fetch["parentOrderId"], 
												 'customerId' => (int)$sql_res_fetch["customerId"], 
												 'totalPrice' => round((float)$sql_res_fetch["totalPrice"], 2), 
												 'paidAmount' => round((float)$sql_res_fetch["paidAmount"], 2),
												 'orderDate' => $sql_res_fetch["orderDate"], 
												 'deliveryDate' => $sql_res_fetch["deliveryDate"], 
												 'status' => (int)$sql_res_fetch["status"], 
												 'companyName' => $sql_res_fetch["companyName"], 
												 'companyType' => $sql_res_fetch["companyType"],
												 'customerGrade' => $sql_res_fetch["customerGrade"], 
												 'buyerName' => $sql_res_fetch["buyerName"]
												];
						//echo json_encode($orderObject);exit;
						$orderObjectArray[] = $orderObject;
					}
					echo '{"responseCode" : 1, "msg" : '.json_encode($orderObjectArray).'}';
				}else{
					echo '{"responseCode" : 0, "msg" : ""}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #Frontend
		case "ORDERDETAILS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$orderId=isset($_REQUEST['orderId'])?$_REQUEST['orderId']:0;
				if($orderId > 0){
					/*----------------------------------Populate Payment information------------------------------*/
					$saleOrderPaymentInformations = array();
					$sql_saleOrderPaymentInformation = "SELECT 
														`finance`.`financeId`,
														`finance`.`financeCode`,
														`finance`.`financeDate`,
														`finance`.`credit`,
														`finance`.`description`,
														`finance`.`paymentMode`,
														`finance`.`paymentDetails` 
														FROM `finance` 
														INNER JOIN `orderSale`
														ON `finance`.`financeTitle` = `orderSale`.`orderCode`
														WHERE `orderSale`.`orderId` = ".$orderId;
					//echo $sql_saleOrderPaymentInformation; exit;
					$sql_saleOrderPaymentInformation_res = mysqli_query($dbConn, $sql_saleOrderPaymentInformation);
					while($sql_saleOrderPaymentInformation_res_fetch = mysqli_fetch_array($sql_saleOrderPaymentInformation_res)){
						$saleOrderPaymentInformationObject = (object) ['financeId' => (int)$sql_saleOrderPaymentInformation_res_fetch["financeId"],
																	   'financeCode' => $sql_saleOrderPaymentInformation_res_fetch["financeCode"],
																	   'financeDate' => $sql_saleOrderPaymentInformation_res_fetch["financeDate"],
																	   'amount' => $sql_saleOrderPaymentInformation_res_fetch["credit"],
																	   'description' => $sql_saleOrderPaymentInformation_res_fetch["description"],
																	   'paymentMode' => $sql_saleOrderPaymentInformation_res_fetch["paymentMode"],
																	   ];
						//echo json_encode($saleOrderPaymentInformationObject);exit;
						$saleOrderPaymentInformations[] = $saleOrderPaymentInformationObject;
					}
					//echo json_encode($saleOrderPaymentInformations);exit;
					/*----------------------------------Populate Payment information------------------------------*/
					
					$sql = "SELECT `orderSale`.`orderCode`,
					`orderSale`.`GUID`,
					`orderSale`.`parentOrderId`,
					`orderSale`.`orderObj`,
					`orderSale`.`packingObj`,
					`orderSale`.`totalPrice`,
					`orderSale`.`additionalData`,
					CASE 
						WHEN TIME(`orderSale`.`orderDate`) = '00:00:00' THEN DATE_FORMAT(`orderSale`.`orderDate`, '%Y-%m-%d')
						ELSE `orderSale`.`orderDate`
					END AS `orderDate`,
					CASE 
						WHEN TIME(`orderSale`.`deliveryDate`) = '00:00:00' THEN DATE_FORMAT(`orderSale`.`deliveryDate`, '%Y-%m-%d')
						ELSE `orderSale`.`deliveryDate`
					END AS `deliveryDate`,
					`orderSale`.`createdBy`,
					`orderSale`.`status`,
					`customer`.`customerId`,
					`customer`.`companyName`,
					`customer`.`companyType`,
					`customer`.`buyerName`,
					`customer`.`contactPerson`,
					`customer`.`customerGrade`,
					`customer`.`address`,
					`customer`.`town`,
					`customer`.`postCode`,
					`customer`.`country`,
					`customer`.`phone`,
					`customer`.`fax`,
					`customer`.`email`,
					`customerDeliveryAddress`.`deliveryAddressId`,
					`customerDeliveryAddress`.`companyName` AS 'deliveryCompanyName',
					`customerDeliveryAddress`.`contactPerson` AS 'deliveryContactPerson',
					`customerDeliveryAddress`.`phone` AS 'deliveryPhone',
					`customerDeliveryAddress`.`email` AS 'deliveryEmail',
					`customerDeliveryAddress`.`address` AS 'deliveryAddress',
					`customerDeliveryAddress`.`postCode` AS 'deliveryPostCode',
					`customerDeliveryAddress`.`country` AS 'deliveryCountry',
					`customerDeliveryAddress`.`town` AS 'deliveryTown'
					FROM `orderSale` 
					INNER JOIN `customer`
					ON `customer`.`customerId` = `orderSale`.`customerId`
					LEFT JOIN `customerDeliveryAddress`
					ON `customerDeliveryAddress`.`deliveryAddressId` = `orderSale`.`deliveryAddressId`
					WHERE `orderSale`.`orderId` = ".$orderId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					$noOfRecords = mysqli_num_rows($sql_res);
					//echo $noOfRecords; exit;
					if($noOfRecords > 0){
						while($sql_res_fetch = mysqli_fetch_array($sql_res)){
							$orderObject = (object) ['orderCode' => $sql_res_fetch["orderCode"], 
													 'GUID' => $sql_res_fetch["GUID"], 
													 'parentOrderId' => (int)$sql_res_fetch["parentOrderId"], 
													 'orderObj' => $sql_res_fetch["orderObj"], 
													 'packingObj' => $sql_res_fetch["packingObj"], 
													 'totalPrice' => $sql_res_fetch["totalPrice"], 
													 'additionalData' => $sql_res_fetch["additionalData"], 
													 'paymentInformation' => $saleOrderPaymentInformations, 
													 'orderDate' => $sql_res_fetch["orderDate"], 
													 'deliveryDate' => $sql_res_fetch["deliveryDate"], 
													 'createdBy' => $sql_res_fetch["createdBy"], 
													 'status' => (int)$sql_res_fetch["status"], 
													 'customerId' => $sql_res_fetch["customerId"], 
													 'companyName' => $sql_res_fetch["companyName"], 
													 'companyType' => $sql_res_fetch["companyType"], 
													 'buyerName' => $sql_res_fetch["buyerName"], 
													 'contactPerson' => $sql_res_fetch["contactPerson"], 
													 'customerGrade' => $sql_res_fetch["customerGrade"], 
													 'address' => $sql_res_fetch["address"], 
													 'town' => $sql_res_fetch["town"], 
													 'postCode' => $sql_res_fetch["postCode"], 
													 'country' => $sql_res_fetch["country"], 
													 'phone' => $sql_res_fetch["phone"], 
													 'fax' => $sql_res_fetch["fax"], 
													 'email' => $sql_res_fetch["email"], 
													 'deliveryAddressId' => $sql_res_fetch["deliveryAddressId"], 
													 'deliveryCompanyName' => $sql_res_fetch["deliveryCompanyName"], 
													 'deliveryContactPerson' => $sql_res_fetch["deliveryContactPerson"], 
													 'deliveryPhone' => $sql_res_fetch["deliveryPhone"], 
													 'deliveryEmail' => $sql_res_fetch["deliveryEmail"], 
													 'deliveryAddress' => $sql_res_fetch["deliveryAddress"], 
													 'deliveryPostCode' => $sql_res_fetch["deliveryPostCode"], 
													 'deliveryCountry' => $sql_res_fetch["deliveryCountry"], 
													 'deliveryTown' => $sql_res_fetch["deliveryTown"]
													];
							//echo json_encode($orderObject);exit;
							$orderObjectArray[] = $orderObject;
						}
						echo '{"responseCode" : 1, "msg" : '.json_encode($orderObjectArray).'}';
					}else{
						echo '{"responseCode" : 0, "msg" : "Order unauthorized"}';
					}
				}else{
					echo '{"responseCode" : 0, "msg" : "Order id is blank"}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in", "redirect" : "login"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "DELETEORDER":{
			if(isset($_SESSION['userId'])){
				$userRoleid = intval($_SESSION['userRoleid']);
				if($userRoleid === 1){
					$orderId=isset($_REQUEST['orderId'])?intval($_REQUEST['orderId']):0;
					if($orderId > 0){
						$sql_delete1 = "DELETE `finance` 
										FROM `finance` 
										INNER JOIN `orderSale` 
										ON `orderSale`.`orderCode` = `finance`.`financeTitle` 
										WHERE `orderSale`.`orderId` = ".$orderId;
						//echo $sql_delete1; exit;
						$sql_delete1_res = mysqli_query($dbConn, $sql_delete1);
						
						$sql_delete2 = "DELETE FROM `orderSale` WHERE `orderSale`.`orderId` = ".$orderId;
						//echo $sql_delete2; exit;
						$sql_delete2_res = mysqli_query($dbConn, $sql_delete2);
						
						echo '{"responseCode" : 1, "msg" : "Order deleted successfully"}';
					}else{
						echo '{"responseCode" : 0, "msg" : "Order id missing"}';
					}
				}else{
					echo '{"responseCode" : 0, "msg" : "You are not authorized to delete this order"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "CHANGEORDERSTATUS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['customerId'])){
				$orderId=isset($_REQUEST['orderId'])?(int)$_REQUEST['orderId']:0;
				if($orderId > 0){
					$orderStatusId=isset($_REQUEST['orderStatusId'])?(int)$_REQUEST['orderStatusId']:0;
					if(isset($_SESSION['userId'])){
						$sql = "UPDATE `orderSale` SET `status` = ".$orderStatusId." WHERE `orderSale`.`orderId` = ".$orderId;
					}else if(isset($_SESSION['customerId'])){
						$sql = "UPDATE `orderSale` SET `status` = ".$orderStatusId." WHERE `orderSale`.`orderId` = ".$orderId." AND `orderSale`.`customerId` = ".$_SESSION['customerId'];
					}
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					
					/*------------------------------------------Get Information about order---------------------*/
					$selectedLang = $_REQUEST['selectedLang'] ?? 'en';
					$saleOrderStatus = getOrderSaleStatus($dbConn, $orderStatusId);
					$orderSql = "SELECT 
								`orderSale`.`orderCode`,
								`orderSale`.`GUID`,
								`orderSale`.`totalPrice`,
								`orderSale`.`orderDate`,
								`orderSale`.`deliveryDate`,
								`customer`.`email`
								FROM `orderSale` 
								INNER JOIN `customer`
								ON `orderSale`.`customerId` = `customer`.`customerId`
								WHERE `orderSale`.`orderId` = ?";

					$stmt = mysqli_prepare($dbConn, $orderSql);
					mysqli_stmt_bind_param($stmt, "i", $orderId);
					mysqli_stmt_execute($stmt);
					$result = mysqli_stmt_get_result($stmt);
					$orderData = mysqli_fetch_assoc($result);
					mysqli_stmt_close($stmt);
					if (!$orderData) {
						die("Order not found");
					}
					/*------------------------------------------Get Information about order---------------------*/

					/*------------------------------------------Common Email Configuration---------------------*/
					$replacements = [
						'{{SITEURL}}'           => SITEURL,
						'{{SITENAME}}'          => SITENAME,
						'{{ORDER_CODE}}'        => $orderData["orderCode"],
						'{{ORDER_STATUS}}'      => $saleOrderStatus,
						'{{TOTAL_PRICE}}'       => $orderData["totalPrice"],
						'{{ORDER_DATE}}'        => $orderData["orderDate"],
						'{{EXPECTED_DELIVERY}}' => $orderData["deliveryDate"],
						'{{GUID}}'              => $orderData["GUID"],
						'{{year}}'              => date('Y')
					];
					$subject = "Latest Update for Your Order {$orderData["orderCode"]} – {$saleOrderStatus}";
					function processTemplate($templatePath, $replacements) {
						$template = file_get_contents($templatePath);
						foreach ($replacements as $key => $value) {
							$template = str_replace($key, $value, $template);
						}
						return $template;
					}
					/*------------------------------------------Common Email Configuration---------------------*/
					
					/*------------------------------------------Mail to customer from Admin--------------------*/
					$customerTemplate = "../assets/templates/mailTemplates/sale_order_status_update_to_customer.{$selectedLang}.html";
					$message = processTemplate($customerTemplate, $replacements);
					insertMail($dbConn, $orderData["email"], SYSTEMEMAIL, $subject, $message, $orderData["orderCode"]);
					/*------------------------------------------Mail to customer from Admin--------------------*/
					
					/*------------------------------------------Mail to Admin from System----------------------*/
					$adminTemplate = "../assets/templates/mailTemplates/sale_order_status_update_to_admin.{$selectedLang}.html";
					$message = processTemplate($adminTemplate, $replacements);
					insertMail($dbConn, ADMINEMAIL, SYSTEMEMAIL, $subject, $message, $orderData["orderCode"]);
					/*------------------------------------------Mail to Admin from System----------------------*/
					
					echo '{"responseCode" : 1, "msg" : "Order updated successfully"}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Order id is blank"}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		/*-----------------------------SALE ORDER APIs------------------------------------------------*/
		
		/*-----------------------------SUPPLIER APIs--------------------------------------------------*/
		//Sessioned #Admin
		case "GETSUPPLIERS":{
			if(isset($_SESSION['userId'])){
				$subQry = '';
				/*---------------------Search Supplier by keyword-------------------------------------*/
				$keyword=isset($_REQUEST['keyword'])?$_REQUEST['keyword']:'';
				if($keyword != ""){
					$subQry = $subQry." AND (`supplier`.`supplierName` LIKE '%".$keyword."%' OR 
										`supplier`.`supplierContactPerson` LIKE '%".$keyword."%' OR
										`supplier`.`supplierAddress` LIKE '%".$keyword."%')";
				}
				/*---------------------Search Supplier by keyword-------------------------------------*/
				
				/*---------------------Search Supplier by supplierId----------------------------------*/
				$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				if($supplierId > 0){
					$subQry = $subQry." AND (`supplier`.`supplierId` = ".$supplierId.")";
				}
				/*---------------------Search Supplier by supplierId----------------------------------*/
				
				$sql = "SELECT `supplier`.`supplierId`,
				`supplier`.`supplierName`,
				`supplier`.`supplierContactPerson`,
				`supplier`.`supplierAddress`,
				`supplier`.`supplierTown`,
				`supplier`.`supplierPostCode`,
				`supplier`.`supplierCountry`,
				`supplier`.`supplierContactNo`,
				`supplier`.`supplierEmail` 
				FROM `supplier` 
				WHERE `supplier`.`status` = 1
				".$subQry;
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$supplierObjectArray = array();
				while($sql_res_fetch = mysqli_fetch_array($sql_res)){
					$supplierObject = (object) ['supplierId' => (int)$sql_res_fetch["supplierId"], 
												'supplierName' => $sql_res_fetch["supplierName"],
												'supplierContactPerson' => $sql_res_fetch["supplierContactPerson"],
												'supplierAddress' => $sql_res_fetch["supplierAddress"],
												'supplierTown' => $sql_res_fetch["supplierTown"],
												'supplierPostCode' => $sql_res_fetch["supplierPostCode"],
												'supplierCountry' => (int)$sql_res_fetch["supplierCountry"],
												'supplierContactNo' => $sql_res_fetch["supplierContactNo"],
												'supplierEmail' => $sql_res_fetch["supplierEmail"]
												];
					//echo json_encode($supplierObject);exit;
					$supplierObjectArray[] = $supplierObject;
				}
				echo json_encode($supplierObjectArray);
			}else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #SupplierPortal #Admin
		case "SAVESUPPLIER":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				$supplierId=0;
				if(isset($_SESSION['userId'])){
					$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				}else if(isset($_SESSION['supplierId'])){
					$supplierId=intval($_SESSION['supplierId']);
				}
				$supplierName=isset($_REQUEST['supplierName'])?$_REQUEST['supplierName']:"";
				$supplierContactPerson=isset($_REQUEST['supplierContactPerson'])?$_REQUEST['supplierContactPerson']:"";
				$supplierAddress=isset($_REQUEST['supplierAddress'])?$_REQUEST['supplierAddress']:"";
				$supplierTown=isset($_REQUEST['supplierTown'])?$_REQUEST['supplierTown']:"";
				$supplierPostCode=isset($_REQUEST['supplierPostCode'])?$_REQUEST['supplierPostCode']:"";
				$supplierCountry=isset($_REQUEST['supplierCountry'])?$_REQUEST['supplierCountry']:"";
				$supplierContactNo=isset($_REQUEST['supplierContactNo'])?$_REQUEST['supplierContactNo']:"";
				$supplierEmail=isset($_REQUEST['supplierEmail'])?$_REQUEST['supplierEmail']:"";
				$supplierFax=isset($_REQUEST['supplierFax'])?$_REQUEST['supplierFax']:"";
				$additionalData=isset($_REQUEST['additionalData'])?$_REQUEST['additionalData']:"";
				$status=isset($_REQUEST['status'])?(int)$_REQUEST['status']:0;
				$selectedLang=isset($_REQUEST['selectedLang'])?$_REQUEST['selectedLang']:'en';
				
				/*echo "supplierId : ".$supplierId." <br> ";
				echo "supplierName : ".$supplierName." <br> ";
				echo "supplierContactPerson : ".$supplierContactPerson." <br> ";
				echo "supplierAddress : ".$supplierAddress." <br> ";
				echo "supplierTown : ".$supplierTown." <br> ";
				echo "supplierPostCode : ".$supplierPostCode." <br> ";
				echo "supplierCountry : ".$supplierCountry." <br> ";
				echo "supplierContactNo : ".$supplierContactNo." <br> ";
				echo "supplierEmail : ".$supplierEmail." <br> ";
				echo "supplierFax : ".$supplierFax." <br> ";
				echo "additionalData : ".$additionalData." <br> ";
				echo "status : ".$status; 
				echo "selectedLang : ".$selectedLang; exit;*/
				
				if($supplierId > 0){
					$sqlEdit = "UPDATE `supplier` SET 
					`supplierName` = '".$supplierName."', 
					`supplierContactPerson` = '".$supplierContactPerson."',
					`supplierAddress` = '".$supplierAddress."',
					`supplierTown` = '".$supplierTown."',
					`supplierPostCode` = '".$supplierPostCode."',
					`supplierCountry` = '".$supplierCountry."',
					`supplierContactNo` = '".$supplierContactNo."',
					`supplierFax` = '".$supplierFax."',
					`additionalData` = '".$additionalData."',
					`status` = ".$status."
					WHERE `supplier`.`supplierId` = ".$supplierId;
					//echo $sqlEdit; exit;
					$sqlEdit_res = mysqli_query($dbConn, $sqlEdit);
				}else{
					$sqlAdd = "INSERT INTO `supplier` (
													`supplierId`, 
													`supplierName`, 
													`supplierContactPerson`, 
													`supplierAddress`, 
													`supplierTown`, 
													`supplierPostCode`, 
													`supplierCountry`, 
													`supplierContactNo`, 
													`supplierEmail`, 
													`supplierFax`,
													`additionalData`,
													`status`
												)VALUES (
													NULL, 
													'".$supplierName."', 
													'".$supplierContactPerson."', 
													'".$supplierAddress."', 
													'".$supplierTown."', 
													'".$supplierPostCode."', 
													'".$supplierCountry."', 
													'".$supplierContactNo."', 
													'".$supplierEmail."', 
													'".$supplierFax."',
													'".$additionalData."',
													".$status."
												)";
					//echo $sqlAdd; exit;
					$sqlAdd_res = mysqli_query($dbConn, $sqlAdd);
					$inserted_supplierId = mysqli_insert_id($dbConn);
					//echo $inserted_supplierId; exit;
					$supplierId = $inserted_supplierId;
					
					/*------------------------------------Inserting mail for new supplier registration-----------------------------*/
					$toEmail = $supplierEmail;
					$fromEmail = SYSTEMEMAIL;
					$subject = "You’re Almost There! Welcome to ".SITENAME;
					$template = file_get_contents('../assets/templates/mailTemplates/supplier_registration_confirmation.' . $selectedLang . '.html');
					$replacements = [
						'{{SITEURL}}'      => SITEURL,
						'{{SITENAME}}'     => SITENAME,
						'{{SUPPLIERNAME}}' => $supplierName, 
						'{{SUPPORTEMAIL}}' => ADMINEMAIL,
						'{{year}}'         => date('Y')
					];
					foreach ($replacements as $key => $value) {
						$template = str_replace($key, $value, $template);
					}
					$message = $template;
					insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "SUPPLIER-REGISTRATION-".$supplierId);
					/*------------------------------------Inserting mail for new supplier registration-----------------------------*/
					
					/*--------------------------Inserting mail for admin for new supplier registration-----------------------------*/
					$toEmail = $supplierEmail;
					$fromEmail = SYSTEMEMAIL;
					$subject = "New Supplier Registration - [".$supplierName."]";
					$template = file_get_contents('../assets/templates/mailTemplates/supplier_registration_confirmation_to_admin.' . $selectedLang . '.html');
					$replacements = [
						'{{SITEURL}}'            => SITEURL,
						'{{SITENAME}}'           => SITENAME,
						'{{supplierName}}'       => $supplierName,
						'{{supplierContactPerson}}' => $supplierContactPerson,
						'{{supplierAddress}}'    => $supplierAddress,
						'{{supplierTown}}'       => $supplierTown,
						'{{supplierPostCode}}'   => $supplierPostCode,
						'{{supplierCountry}}'    => $supplierCountry,
						'{{supplierContactNo}}'  => $supplierContactNo,
						'{{supplierEmail}}'      => $supplierEmail,
						'{{year}}'               => date('Y')
					];
					foreach ($replacements as $key => $value) {
						$template = str_replace($key, $value, $template);
					}
					$message = $template;
					insertMail($dbConn, $toEmail, $fromEmail, $subject, $message, "SUPPLIER-REGISTRATION-".$supplierId);
					/*--------------------------Inserting mail for admin for new supplier registration-----------------------------*/
				}
				echo '{"supplierId" : '.$supplierId.', "msg" : "New Supplier saved successfully."}';
			}else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #SupplierPortal #Admin
		case "GETSUPPLIERDATA":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				if($supplierId > 0){
					$sql = "SELECT 
					`supplierName`,
					`supplierContactPerson`,
					`supplierAddress`,
					`supplierTown`,
					`supplierPostCode`, 
					`supplierCountry`, 
					`supplierContactNo`,
					`supplierEmail`,
					`supplierFax`,
					`additionalData`,
					`status`
					FROM `supplier` 
					WHERE `supplierId` = ".$supplierId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					$noOfRecords = mysqli_num_rows($sql_res);
					if($noOfRecords > 0){
						while($sql_res_fetch = mysqli_fetch_array($sql_res)){
							$supplierObject = (object) ['supplierId' => (int)$supplierId,
														'supplierName' => $sql_res_fetch["supplierName"], 
														'supplierContactPerson' => $sql_res_fetch["supplierContactPerson"], 
														'supplierAddress' => $sql_res_fetch["supplierAddress"], 
														'supplierTown' => $sql_res_fetch["supplierTown"], 
														'supplierPostCode' => $sql_res_fetch["supplierPostCode"], 
														'supplierCountry' => (int)$sql_res_fetch["supplierCountry"], 
														'supplierContactNo' => $sql_res_fetch["supplierContactNo"], 
														'supplierEmail' => $sql_res_fetch["supplierEmail"], 
														'supplierFax' => $sql_res_fetch["supplierFax"], 
														'additionalData' => $sql_res_fetch["additionalData"],
														'status' => (int)$sql_res_fetch["status"]
														];
							//echo json_encode($supplierObject);exit;
							$supplierObjectArray[] = $supplierObject;
						}
						echo '{"responseCode" : 1, "msg" : '.json_encode($supplierObjectArray).'}';
					}else{
						echo '{"responseCode" : 0, "msg" : "No Supplier Records Present"}';
					}
				}else{
					echo '{"responseCode" : 0, "msg" : "Supplier Id not supplied"}';
				}
			}else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #SupplierPortal #Admin
		case "SUPPLIERSIGNATURE":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				if(isset($_SESSION['supplierId'])){
					$supplierId=(int)$_SESSION['supplierId'];
				}else{
					$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				}
				$supplierSignData=isset($_REQUEST['supplierSignData'])?$_REQUEST['supplierSignData']:"";
				
				/*echo "supplierId : ".$supplierId."<br>";
				echo "supplierSignData : ".$supplierSignData; exit;*/
				
				base64ToJpeg($supplierSignData, 'supplierSignature', 'SUPPLIER-SIGN_'.$supplierId);
				echo '{"responseCode" : 1, "msg" : "Supplier signature captured successfully."}';
			}else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #SupplierPortal #Admin
		case "DELETESUPPLIERSIGNATURE":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				if(isset($_SESSION['supplierId'])){
					$supplierId=(int)$_SESSION['supplierId'];
				}else{
					$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				}
				deleteFile("SUPPLIER-SIGN_".$supplierId.".jpeg", UPLOADFOLDER."supplierSignature/");
				echo '{"responseCode" : 1, "msg" : "Supplier signature deleted successfully."}';
			}else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		/*-----------------------------SUPPLIER APIs--------------------------------------------------*/
		
		/*-----------------------------PURCHASE ORDER APIs--------------------------------------------*/
		//Sessioned #Admin #SupplierPortal
		case "PLACEPURCHASEORDER":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				$purchaseOrderId=isset($_REQUEST['purchaseOrderId'])?intval($_REQUEST['purchaseOrderId']):0;
				$parentPurchaseOrderId=isset($_REQUEST['parentPurchaseOrderId'])?intval($_REQUEST['parentPurchaseOrderId']):0;
				if(isset($_SESSION['userId'])){
					$supplierId=isset($_REQUEST['supplierId'])?intval($_REQUEST['supplierId']):0;
					$createdBy=$_SESSION['userId'];
				}else if(isset($_SESSION['supplierId'])){
					$supplierId=intval($_SESSION['supplierId']);
				}
				$purchaseOrderObj=isset($_REQUEST['purchaseOrderObj'])?$_REQUEST['purchaseOrderObj']:"";
				$communicationObj=isset($_REQUEST['communicationObj'])?$_REQUEST['communicationObj']:"";
				$purchasePackingObj=isset($_REQUEST['purchasePackingObj'])?$_REQUEST['purchasePackingObj']:"";
				$totalPrice=isset($_REQUEST['totalPrice'])?$_REQUEST['totalPrice']:"";
				$additionalData=isset($_REQUEST['additionalData'])?$_REQUEST['additionalData']:"";
				$purchaseOrderDeliveryDate=isset($_REQUEST['purchaseOrderDeliveryDate'])?$_REQUEST['purchaseOrderDeliveryDate']:"";
				
				/*echo "purchaseOrderId : ".$purchaseOrderId."<br>"; 
				echo "parentPurchaseOrderId : ".$parentPurchaseOrderId."<br>"; 
				echo "supplierId : ".$supplierId."<br>"; 
				echo "purchaseOrderObj : ".$purchaseOrderObj."<br>";
				echo "communicationObj : ".$communicationObj."<br>";
				echo "purchasePackingObj : ".$purchasePackingObj."<br>";
				echo "totalPrice : ".$totalPrice."<br>";
				echo "additionalData : ".$additionalData."<br>";
				echo "purchaseOrderDeliveryDate : ".$purchaseOrderDeliveryDate."<br>";
				exit;*/
				
				if($supplierId > 0 && strlen($purchaseOrderObj) > 0){
					if($purchaseOrderId == 0){ //Insert Purchase order
						$sql1 = "INSERT INTO `orderPurchase` (
															`purchaseOrderId`, 
															`purchaseOrderCode`, 
															`GUID`,
															`parentPurchaseOrderId`,
															`supplierId`, 
															`purchaseOrderObj`,
															`communicationObj`,
															`purchasePackingObj`,
															`totalPrice`, 
															`additionalData`, 
															`purchaseOrderCreateDate`, 
															`purchaseOrderDeliveryDate`, 
															`createdBy`, 
															`status`
														) VALUES (
															NULL, 
															'ORDS_0000', 
															'".bin2hex(openssl_random_pseudo_bytes(16))."',
															'".$parentPurchaseOrderId."',
															'".$supplierId."', 
															'".$purchaseOrderObj."', 
															'".$communicationObj."', 
															'".$purchasePackingObj."', 
															'".$totalPrice."', 
															'".$additionalData."', 
															NOW(), 
															'".$purchaseOrderDeliveryDate."', 
															'".$createdBy."', 
															1
														)";
						//echo $sql1; exit;
						$sql1_res = mysqli_query($dbConn, $sql1);
						$inserted_purchaseOrderId = mysqli_insert_id($dbConn);
						//echo $inserted_purchaseOrderId; exit;
						
						$purchaseOrder_code = "ORDP_".sprintf("%04d", $inserted_purchaseOrderId);
						$sql2 = "UPDATE `orderPurchase` SET `purchaseOrderCode` = '".$purchaseOrder_code."' WHERE `orderPurchase`.`purchaseOrderId` = ".$inserted_purchaseOrderId;
						//echo $sql2; exit;
						$sql2_res = mysqli_query($dbConn, $sql2);
						
						echo '{"responseCode" : '.$inserted_purchaseOrderId.', "msg" : "Purchase Order Placed successfully"}';
					}else{ //Update order
						$sql1 = "UPDATE `orderPurchase` SET 
						`orderPurchase`.`supplierId` = '".$supplierId."',
						`orderPurchase`.`purchaseOrderObj` = '".$purchaseOrderObj."',
						`orderPurchase`.`communicationObj` = '".$communicationObj."',
						`orderPurchase`.`purchasePackingObj` = '".$purchasePackingObj."',
						`orderPurchase`.`totalPrice` = '".$totalPrice."',
						`orderPurchase`.`additionalData` = '".$additionalData."',
						`orderPurchase`.`purchaseOrderDeliveryDate` = '".$purchaseOrderDeliveryDate."'
						WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId;
						//echo $sql1; exit;
						$sql1_res = mysqli_query($dbConn, $sql1);
						
						echo '{"responseCode" : '.$purchaseOrderId.', "msg" : "Purchase Order Updated successfully"}';
					}
				}
				
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #SupplierPortal
		case "PURCHASEORDERS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				$innerQry = " 1";
				if(isset($_SESSION['userId'])){
					$innerQry =" `orderPurchase`.`status` NOT IN(11,12)";
				}else if(isset($_SESSION['supplierId'])){
					$innerQry =" `orderPurchase`.`supplierId` = ".$_SESSION['supplierId'];
				}
				
				$purchaseOrderId=isset($_REQUEST['purchaseOrderId'])?(int)$_REQUEST['purchaseOrderId']:0;
				$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				$status=isset($_REQUEST['status'])?(int)$_REQUEST['status']:0;
				$startDate=isset($_REQUEST['startDate'])?$_REQUEST['startDate']:"";
				$endDate=isset($_REQUEST['endDate'])?$_REQUEST['endDate']:"";
				
				// Add search parameters to the query if they are present
				$searchConditions = [];
				if ($purchaseOrderId > 0) {
					$searchConditions[] = "`orderPurchase`.`purchaseOrderId` = $purchaseOrderId";
				}
				if ($supplierId > 0) {
					$searchConditions[] = "`orderPurchase`.`supplierId` = $supplierId";
				}
				if ($status > 0) {
					$searchConditions[] = "`orderPurchase`.`status` = $status";
				}
				if (!empty($startDate) && !empty($endDate)) {
					// Convert startDate and endDate to the format 'YYYY-MM-DD'
					$formattedStartDate = date('Y-m-d', strtotime($startDate));
					$formattedEndDate = date('Y-m-d', strtotime($endDate));
					$searchConditions[] = "(`orderPurchase`.`purchaseOrderCreateDate` BETWEEN '$formattedStartDate 00:00:00' AND '$formattedEndDate 23:59:59' OR `orderPurchase`.`purchaseOrderDeliveryDate` BETWEEN '$formattedStartDate 00:00:00' AND '$formattedEndDate 23:59:59')";
				}

				// Combine the inner query and search conditions
				if (!empty($searchConditions)) {
					$innerQry .= " AND " . implode(" AND ", $searchConditions);
				}
				
				$sql = "SELECT 
					`orderPurchase`.`purchaseOrderId`,
					`orderPurchase`.`purchaseOrderCode`,
					`orderPurchase`.`GUID`,
					`orderPurchase`.`parentpurchaseOrderId`,
					`orderPurchase`.`supplierId`,
					`orderPurchase`.`totalPrice`,
					COALESCE( 
						(SELECT SUM(`finance`.`debit`) FROM `finance` WHERE `finance`.`financeTitle` = `orderPurchase`.`purchaseOrderCode`),
						0.00
					) AS 'paidAmount',
					CASE 
						WHEN TIME(`orderPurchase`.`purchaseOrderCreateDate`) = '00:00:00' THEN DATE_FORMAT(`orderPurchase`.`purchaseOrderCreateDate`, '%Y-%m-%d')
						ELSE `orderPurchase`.`purchaseOrderCreateDate`
					END AS `purchaseOrderCreateDate`,
					CASE 
						WHEN TIME(`orderPurchase`.`purchaseOrderDeliveryDate`) = '00:00:00' THEN DATE_FORMAT(`orderPurchase`.`purchaseOrderDeliveryDate`, '%Y-%m-%d')
						ELSE `orderPurchase`.`purchaseOrderDeliveryDate`
					END AS `purchaseOrderDeliveryDate`,
					`orderPurchase`.`status`,
					`supplier`.`supplierName`,
					`supplier`.`supplierContactPerson`,
					`supplier`.`supplierContactNo`,
					`supplier`.`supplierEmail`
				FROM `orderPurchase` 
				INNER JOIN `supplier` ON `supplier`.`supplierId` = `orderPurchase`.`supplierId`
				WHERE $innerQry 
				ORDER BY `purchaseOrderCreateDate` DESC";
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$noOfRecords = mysqli_num_rows($sql_res);
				if($noOfRecords > 0){
					while($sql_res_fetch = mysqli_fetch_array($sql_res)){
						$orderObject = (object) ['purchaseOrderId' => (int)$sql_res_fetch["purchaseOrderId"],
												 'purchaseOrderCode' => $sql_res_fetch["purchaseOrderCode"], 
												 'GUID' => $sql_res_fetch["GUID"], 
												 'parentpurchaseOrderId' => (int)$sql_res_fetch["parentpurchaseOrderId"], 
												 'supplierId' => (int)$sql_res_fetch["supplierId"], 
												 'totalPrice' => $sql_res_fetch["totalPrice"], 
												 'paidAmount' => $sql_res_fetch["paidAmount"], 
												 'purchaseOrderCreateDate' => $sql_res_fetch["purchaseOrderCreateDate"], 
												 'purchaseOrderDeliveryDate' => $sql_res_fetch["purchaseOrderDeliveryDate"], 
												 'status' => (int)$sql_res_fetch["status"], 
												 'supplierName' => $sql_res_fetch["supplierName"], 
												 'supplierContactPerson' => $sql_res_fetch["supplierContactPerson"],
												 'supplierContactNo' => $sql_res_fetch["supplierContactNo"], 
												 'supplierEmail' => $sql_res_fetch["supplierEmail"]
												];
						//echo json_encode($orderObject);exit;
						$orderObjectArray[] = $orderObject;
					}
					echo '{"responseCode" : 1, "msg" : '.json_encode($orderObjectArray).'}';
				}else{
					echo '{"responseCode" : 0, "msg" : ""}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #SupplierPortal
		case "PURCHASEORDERDETAILS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				$purchaseOrderId=isset($_REQUEST['purchaseOrderId'])?$_REQUEST['purchaseOrderId']:0;
				if($purchaseOrderId > 0){
					/*----------------------------------Populate Payment information------------------------------*/
					$purchaseOrderPaymentInformations = array();
					$sql_purchaseOrderPaymentInformation = "SELECT 
															`finance`.`financeId`,
															`finance`.`financeCode`,
															`finance`.`financeDate`,
															`finance`.`debit`,
															`finance`.`description`,
															`finance`.`paymentMode`,
															`finance`.`paymentDetails` 
															FROM `finance` 
															INNER JOIN `orderPurchase`
															ON `finance`.`financeTitle` = `orderPurchase`.`purchaseOrderCode`
															WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId;
					//echo $sql_purchaseOrderPaymentInformation; exit;
					$sql_purchaseOrderPaymentInformation_res = mysqli_query($dbConn, $sql_purchaseOrderPaymentInformation);
					while($sql_purchaseOrderPaymentInformation_res_fetch = mysqli_fetch_array($sql_purchaseOrderPaymentInformation_res)){
						$purchaseOrderPaymentInformationObject = (object) ['financeId' => (int)$sql_purchaseOrderPaymentInformation_res_fetch["financeId"],
																			'financeCode' => $sql_purchaseOrderPaymentInformation_res_fetch["financeCode"],
																			'financeDate' => $sql_purchaseOrderPaymentInformation_res_fetch["financeDate"],
																			'amount' => $sql_purchaseOrderPaymentInformation_res_fetch["debit"],
																			'description' => $sql_purchaseOrderPaymentInformation_res_fetch["description"],
																			'paymentMode' => $sql_purchaseOrderPaymentInformation_res_fetch["paymentMode"],
																			];
						//echo json_encode($purchaseOrderPaymentInformationObject);exit;
						$purchaseOrderPaymentInformations[] = $purchaseOrderPaymentInformationObject;
					}
					//echo json_encode($purchaseOrderPaymentInformations);exit;
					/*----------------------------------Populate Payment information------------------------------*/
					
					$sql = "SELECT `orderPurchase`.`purchaseOrderCode`,
					`orderPurchase`.`GUID`,
					`orderPurchase`.`parentPurchaseOrderId`,
					`orderPurchase`.`purchaseOrderObj`,
					`orderPurchase`.`communicationObj`,
					`orderPurchase`.`purchasePackingObj`,
					`orderPurchase`.`totalPrice`,
					`orderPurchase`.`additionalData`,
					CASE 
						WHEN TIME(`orderPurchase`.`purchaseOrderCreateDate`) = '00:00:00' THEN DATE_FORMAT(`orderPurchase`.`purchaseOrderCreateDate`, '%Y-%m-%d')
						ELSE `orderPurchase`.`purchaseOrderCreateDate`
					END AS `purchaseOrderCreateDate`,
					CASE 
						WHEN TIME(`orderPurchase`.`purchaseOrderDeliveryDate`) = '00:00:00' THEN DATE_FORMAT(`orderPurchase`.`purchaseOrderDeliveryDate`, '%Y-%m-%d')
						ELSE `orderPurchase`.`purchaseOrderDeliveryDate`
					END AS `purchaseOrderDeliveryDate`,
					`orderPurchase`.`createdBy`,
					`orderPurchase`.`status`,
					`supplier`.`supplierId`,
					`supplier`.`supplierName`,
					`supplier`.`supplierContactPerson`,
					`supplier`.`supplierAddress`,
					`supplier`.`supplierTown`,
					`supplier`.`supplierPostCode`,
					`supplier`.`supplierCountry`,
					`supplier`.`supplierContactNo`,
					`supplier`.`supplierEmail`,
					`supplier`.`supplierPassword`,
					`supplier`.`supplierFax`
					FROM `orderPurchase` 
					INNER JOIN `supplier`
					ON `supplier`.`supplierId` = `orderPurchase`.`supplierId`
					WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId;
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					$noOfRecords = mysqli_num_rows($sql_res);
					//echo $noOfRecords; exit;
					if($noOfRecords > 0){
						while($sql_res_fetch = mysqli_fetch_array($sql_res)){
							$purchaseOrderObject = (object) ['purchaseOrderCode' => $sql_res_fetch["purchaseOrderCode"], 
													 'GUID' => $sql_res_fetch["GUID"], 
													 'parentPurchaseOrderId' => (int)$sql_res_fetch["parentPurchaseOrderId"], 
													 'purchaseOrderObj' => $sql_res_fetch["purchaseOrderObj"], 
													 'communicationObj' => $sql_res_fetch["communicationObj"], 
													 'purchasePackingObj' => $sql_res_fetch["purchasePackingObj"], 
													 'totalPrice' => $sql_res_fetch["totalPrice"], 
													 'paymentInformation' => $purchaseOrderPaymentInformations, 
													 'additionalData' => $sql_res_fetch["additionalData"], 
													 'purchaseOrderCreateDate' => $sql_res_fetch["purchaseOrderCreateDate"], 
													 'purchaseOrderDeliveryDate' => $sql_res_fetch["purchaseOrderDeliveryDate"], 
													 'createdBy' => $sql_res_fetch["createdBy"], 
													 'status' => (int)$sql_res_fetch["status"], 
													 'supplierId' => $sql_res_fetch["supplierId"], 
													 'supplierName' => $sql_res_fetch["supplierName"], 
													 'supplierContactPerson' => $sql_res_fetch["supplierContactPerson"], 
													 'supplierAddress' => $sql_res_fetch["supplierAddress"], 
													 'supplierTown' => $sql_res_fetch["supplierTown"], 
													 'supplierPostCode' => $sql_res_fetch["supplierPostCode"], 
													 'supplierCountry' => $sql_res_fetch["supplierCountry"], 
													 'supplierContactNo' => $sql_res_fetch["supplierContactNo"], 
													 'supplierEmail' => $sql_res_fetch["supplierEmail"], 
													 'supplierFax' => $sql_res_fetch["supplierFax"]
													];
							//echo json_encode($purchaseOrderObject);exit;
							$purchaseOrderObjectArray[] = $purchaseOrderObject;
						}
						echo '{"responseCode" : 1, "msg" : '.json_encode($purchaseOrderObjectArray).'}';
					}else{
						echo '{"responseCode" : 0, "msg" : "Order unauthorized"}';
					}
				}else{
					echo '{"responseCode" : 0, "msg" : "Order id is blank"}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in", "redirect" : "login"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "DELETEPURCHASEORDER":{
			if(isset($_SESSION['userId'])){
				$userRoleid = intval($_SESSION['userRoleid']);
				if($userRoleid === 1){
					$purchaseOrderId=isset($_REQUEST['purchaseOrderId'])?intval($_REQUEST['purchaseOrderId']):0;
					if($purchaseOrderId > 0){
						$sql_delete1 = "DELETE `finance` 
										FROM `finance` 
										INNER JOIN `orderPurchase` 
										ON `orderPurchase`.`purchaseOrderCode` = `finance`.`financeTitle` 
										WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId;
						//echo $sql_delete1; exit;
						$sql_delete1_res = mysqli_query($dbConn, $sql_delete1);
						
						$sql_delete2 = "DELETE FROM `orderPurchase` WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId;
						//echo $sql_delete2; exit;
						$sql_delete2_res = mysqli_query($dbConn, $sql_delete2);
						echo '{"responseCode" : 1, "msg" : "Purchase Order deleted successfully"}';
					}else{
						echo '{"responseCode" : 0, "msg" : "Purchase Order id missing"}';
					}
				}else{
					echo '{"responseCode" : 0, "msg" : "You are not authorized to delete this order"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin #SupplierPortal
		case "CHANGEPURCHASEORDERSTATUS":{
			if(isset($_SESSION['userId']) || isset($_SESSION['supplierId'])){
				$purchaseOrderId=isset($_REQUEST['purchaseOrderId'])?(int)$_REQUEST['purchaseOrderId']:0;
				if($purchaseOrderId > 0){
					$purchaseOrderStatusId=isset($_REQUEST['purchaseOrderStatusId'])?(int)$_REQUEST['purchaseOrderStatusId']:0;
					if(isset($_SESSION['userId'])){
						$sql = "UPDATE `orderPurchase` SET 
								`status` = ".$purchaseOrderStatusId."
								WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId;
					}else if(isset($_SESSION['supplierId'])){
						$packingStatusId = getOrderPurchaseStatusId($dbConn, 'PACKING');
						$shippedStatusId = getOrderPurchaseStatusId($dbConn, 'SHIPPED');
						if ($purchaseOrderStatusId >= $packingStatusId && $purchaseOrderStatusId <= $shippedStatusId) {
							$sql = "UPDATE `orderPurchase` SET 
									`status` = ".$purchaseOrderStatusId." 
									WHERE `orderPurchase`.`purchaseOrderId` = ".$purchaseOrderId." 
									AND `orderPurchase`.`supplierId` = ".$_SESSION['supplierId'];
						}
					}
					//echo $sql; exit;
					if ($sql != "") {
						$sql_res = mysqli_query($dbConn, $sql);
					}
					
					/*------------------------------------------Get information from supplier-------------------*/
					$selectedLang = $_REQUEST['selectedLang'] ?? 'en';
					$purchaseOrderSql = "SELECT 
										`orderPurchase`.`purchaseOrderCode`,
										`orderPurchase`.`totalPrice`,
										`orderPurchase`.`purchaseOrderCreateDate`,
										`orderPurchase`.`purchaseOrderDeliveryDate`,
										`supplier`.`supplierEmail`,
										`orderPurchaseStatus`.`purchaseOrderStatus`
										FROM `orderPurchase` 
										INNER JOIN `orderPurchaseStatus` 
										ON `orderPurchase`.`status` = `orderPurchaseStatus`.`purchaseOrderStatusId`
										INNER JOIN `supplier`
										ON `supplier`.`supplierId` = `orderPurchase`.`supplierId`
										WHERE `orderPurchase`.`purchaseOrderId` = ?";
					$stmt = mysqli_prepare($dbConn, $purchaseOrderSql);
					mysqli_stmt_bind_param($stmt, "i", $purchaseOrderId);
					mysqli_stmt_execute($stmt);
					$result = mysqli_stmt_get_result($stmt);
					$purchaseOrderData = mysqli_fetch_assoc($result);
					mysqli_stmt_close($stmt);

					if (!$purchaseOrderData) {
						die("Order not found");
					}
					/*------------------------------------------Get information from supplier-------------------*/
					
					/*------------------------------------------Common replacement data for both emails---------*/
					$replacements = [
						'{{SITEURL}}' => SITEURL,
						'{{SITENAME}}' => SITENAME,
						'{{purchaseOrderCode}}' => $purchaseOrderData["purchaseOrderCode"],
						'{{purchaseOrderStatus}}' => $purchaseOrderData["purchaseOrderStatus"],
						'{{totalPrice}}' => $purchaseOrderData["totalPrice"],
						'{{purchaseOrderCreateDate}}' => $purchaseOrderData["purchaseOrderCreateDate"],
						'{{purchaseOrderDeliveryDate}}' => $purchaseOrderData["purchaseOrderDeliveryDate"],
						'{{year}}' => date('Y')
					];

					// Common subject for both emails
					$subject = "Latest Update for Purchase Order: ".$purchaseOrderData["purchaseOrderCode"]." – Status: ".$purchaseOrderData["purchaseOrderStatus"];
					/*------------------------------------------Common replacement data for both emails---------*/
					
					/*------------------------------------------Send Emails-----------------------------------*/
					$emailConfigs = [
						[
							'recipient' => $purchaseOrderData["supplierEmail"],
							'template' => 'purchase_order_status_update_to_supplier'
						],
						[
							'recipient' => ADMINEMAIL,
							'template' => 'purchase_order_status_update_to_admin'
						]
					];

					foreach ($emailConfigs as $config) {
						$templatePath = '../api/preCompiledData/mailTemplates/'.$config['template'].'.'.$selectedLang.'.html';
						
						if (file_exists($templatePath)) {
							$template = file_get_contents($templatePath);
							$message = str_replace(array_keys($replacements), array_values($replacements), $template);
							insertMail($dbConn, $config['recipient'], SYSTEMEMAIL, $subject, $message, $purchaseOrderData["purchaseOrderCode"]);
						} else {
							error_log("Template file not found: ".$templatePath);
						}
					}
					/*------------------------------------------Send Emails-----------------------------------*/
					
					echo '{"responseCode" : 1, "msg" : "Purchase Order updated successfully"}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Purchase Order id is blank"}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		/*-----------------------------PURCHASE ORDER APIs--------------------------------------------*/
		
		/*-----------------------------FINANCE APIs---------------------------------------------------*/
		//Sessioned #Admin
		case "FINANCESTATEMENT":{
			if(isset($_SESSION['userId'])){
				$firstDay = new DateTime('first day of -3 months');
				$firstDay->setTime(0, 0, 0);
				$fromDate = isset($_REQUEST['fromDate']) && !empty($_REQUEST['fromDate'])
					? (new DateTime($_REQUEST['fromDate']))->setTime(0, 0, 0)->format('Y-m-d H:i:s')
					: $firstDay->format('Y-m-d H:i:s');
				$toDate = isset($_REQUEST['toDate']) && !empty($_REQUEST['toDate'])
					? (new DateTime($_REQUEST['toDate']))->setTime(23, 59, 59)->format('Y-m-d H:i:s')
					: (new DateTime())->setTime(23, 59, 59)->format('Y-m-d H:i:s');
				$trxType=isset($_REQUEST['trxType'])?$_REQUEST['trxType']:"";
				$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
				$supplierId=isset($_REQUEST['supplierId'])?(int)$_REQUEST['supplierId']:0;
				$financeCategoryId=isset($_REQUEST['financeCategoryId'])?(int)$_REQUEST['financeCategoryId']:0;
				$finKeyword=isset($_REQUEST['finKeyword'])?$_REQUEST['finKeyword']:"";
				
				/*echo "fromDate : ".$fromDate."<br/>";
				echo "toDate : ".$toDate."<br/>";
				echo "trxType : ".$trxType."<br/>";
				echo "customerId : ".$customerId."<br/>";
				echo "supplierId : ".$supplierId."<br/>";
				echo "financeCategoryId : ".$financeCategoryId."<br/>";
				echo "finKeyword : ".$finKeyword."<br/>";exit;*/
				
				$financeFilter = "1";

				if ($customerId > 0) {
					$sql = "SELECT 
							`finance`.`financeDate` AS `transactionDate`,
							CASE 
								WHEN `finance`.`financeType` = 0 THEN 'Debit'
								WHEN `finance`.`financeType` = 1 THEN 'Credit'
								ELSE NULL
							END AS `narrationType`,
							`finance`.`financeCode` AS `narrationCode`,
							`finance`.`financeTitle` AS `narration`,
							`finance`.`debit` AS `Debit`,
							`finance`.`credit` AS `Credit`
							FROM `finance`
							INNER JOIN `orderSale` ON `finance`.`financeTitle` = `orderSale`.`orderCode`
							WHERE `finance`.`financeCategoryId` = 4 AND `orderSale`.`customerId` = $customerId";
					
					if (!empty($fromDate)) {
						$sql .= " AND `finance`.`financeDate` >= '$fromDate'";
					}
					
					if (!empty($toDate)) {
						$sql .= " AND `finance`.`financeDate` <= '$toDate'";
					}
					
					$sql .= " ORDER BY `transactionDate` DESC";
				}else if ($supplierId > 0) {
					$sql = "SELECT 
							`finance`.`financeDate` AS `transactionDate`,
							CASE 
								WHEN `finance`.`financeType` = 0 THEN 'Debit'
								WHEN `finance`.`financeType` = 1 THEN 'Credit'
								ELSE NULL
							END AS `narrationType`,
							`finance`.`financeCode` AS `narrationCode`,
							`finance`.`financeTitle` AS `narration`,
							`finance`.`debit` AS `Debit`,
							`finance`.`credit` AS `Credit`
							FROM `finance`
							INNER JOIN `orderPurchase` ON `finance`.`financeTitle` = `orderPurchase`.`purchaseOrderCode`
							WHERE `finance`.`financeCategoryId` = 11 AND `orderPurchase`.`supplierId` = $supplierId";
					
					if (!empty($fromDate)) {
						$sql .= " AND `finance`.`financeDate` >= '$fromDate'";
					}
					if (!empty($toDate)) {
						$sql .= " AND `finance`.`financeDate` <= '$toDate'";
					}
					
					$sql .= " ORDER BY `transactionDate` DESC";
				}else {
					// Handle finKeyword filtering
					if (!empty($finKeyword)) {
						$financeFilter = "`finance`.`financeTitle` LIKE '%$finKeyword%'";
					}

					// Handle transaction type filtering (DEBIT/CREDIT/ALL)
					if ($trxType === "DEBIT") {
						$financeFilter = "`finance`.`financeType` = 0";
						if (!empty($finKeyword)) {
							$financeFilter .= " AND `finance`.`financeTitle` LIKE '%$finKeyword%'";
						}
					} elseif ($trxType === "CREDIT") {
						$financeFilter = "`finance`.`financeType` = 1";
						if (!empty($finKeyword)) {
							$financeFilter .= " AND `finance`.`financeTitle` LIKE '%$finKeyword%'";
						}
					}

					if (!empty($fromDate) && !empty($toDate)) {
						$financeFilter = "`finance`.`financeDate` BETWEEN '$fromDate' AND '$toDate'";
						if (!empty($finKeyword)) {
							$financeFilter .= " AND `finance`.`financeTitle` LIKE '%$finKeyword%'";
						}
					}

					if ($financeCategoryId > 0) {
						$financeFilter = "`finance`.`financeCategoryId` = $financeCategoryId";
						if (!empty($finKeyword)) {
							$financeFilter .= " AND `finance`.`financeTitle` LIKE '%$finKeyword%'";
						}
					}

					$sql = "SELECT 
							`finance`.`financeDate` AS `transactionDate`,
							CASE 
								WHEN `finance`.`financeType` = 0 THEN 'Debit'
								WHEN `finance`.`financeType` = 1 THEN 'Credit'
								ELSE NULL
							END AS `narrationType`,
							`finance`.`financeCode` AS `narrationCode`,
							`finance`.`financeTitle` AS `narration`,
							`finance`.`debit` AS `Debit`,
							`finance`.`credit` AS `Credit`
							FROM `finance`
							LEFT JOIN `expenseType` ON `finance`.`financeType` = 0 AND `expenseType`.`expenseTypeId` = `finance`.`financeCategoryId`
							LEFT JOIN `earningType` ON `finance`.`financeType` = 1 AND `earningType`.`earningTypeId` = `finance`.`financeCategoryId`
							WHERE $financeFilter
							ORDER BY `transactionDate` DESC";
				}
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$financeObjectArray = array();
				while($sql_res_fetch = mysqli_fetch_array($sql_res)){
					$financeObject = (object) [
											   'transactionDate' => $sql_res_fetch["transactionDate"], 
											   'narrationType' => $sql_res_fetch["narrationType"],
											   'narrationCode' => $sql_res_fetch["narrationCode"],
											   'narration' => $sql_res_fetch["narration"],
											   'Debit' => (float)$sql_res_fetch["Debit"],
											   'Credit' => (float)$sql_res_fetch["Credit"]
											  ];
					$financeObjectArray[] = $financeObject;
				}
				echo json_encode($financeObjectArray);
				
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "FINANCEENTRY":{
			if(isset($_SESSION['userId'])){
				$financeType=isset($_REQUEST['financeTypeDDL'])?(int)$_REQUEST['financeTypeDDL']:0;
				$financeDate=isset($_REQUEST['financeDate'])?$_REQUEST['financeDate']:date('Y-m-d\TH:i');
				if($financeType == 0){
					$financeCategoryId=isset($_REQUEST['expenseTypeDDL'])?(int)$_REQUEST['expenseTypeDDL']:0;
					$financeTitle=isset($_REQUEST['expenseTitle'])?$_REQUEST['expenseTitle']:"";
					$debit=isset($_REQUEST['totalexpense'])?(float)$_REQUEST['totalexpense']:0.00;
					$credit = 0.00;
					$description=isset($_REQUEST['expenseDescription'])?$_REQUEST['expenseDescription']:"";
				}else if($financeType == 1){
					$financeCategoryId=isset($_REQUEST['earningTypeDDL'])?(int)$_REQUEST['earningTypeDDL']:0;
					$financeTitle=isset($_REQUEST['earningTitle'])?$_REQUEST['earningTitle']:"";
					$debit = 0.00;
					$credit=isset($_REQUEST['totalEarning'])?(float)$_REQUEST['totalEarning']:0.00;
					$description=isset($_REQUEST['earningDescription'])?$_REQUEST['earningDescription']:"";
				}
				$paymentMode=isset($_REQUEST['paymentMode'])?$_REQUEST['paymentMode']:"CASH";
				$paymentDetails=isset($_REQUEST['paymentDetails'])?$_REQUEST['paymentDetails']:"";
				
				/*echo "financeType : ".$financeType."<br>";
				echo "financeDate : ".$financeDate."<br>";
				echo "financeCategoryId : ".$financeCategoryId."<br>";
				echo "financeTitle : ".$financeTitle."<br>";
				echo "debit : ".$debit."<br>";
				echo "credit : ".$credit."<br>";
				echo "description : ".$description."<br>";
				echo "paymentMode : ".$paymentMode."<br>";
				echo "paymentDetails : ".$paymentDetails."<br>";
				exit;*/
				
				if($financeTitle != ""){
					$sql = "INSERT INTO `finance` (
													`financeId`, 
													`financeCode`, 
													`financeType`, 
													`financeCategoryId`, 
													`financeTitle`, 
													`financeDate`, 
													`debit`, 
													`credit`, 
													`description`, 
													`supportingDocument`,
													`paymentMode`,
													`paymentDetails`
												) VALUES (
													NULL, 
													'FIN_0000', 
													'".$financeType."', 
													'".$financeCategoryId."', 
													'".$financeTitle."', 
													'".$financeDate."', 
													'".$debit."', 
													'".$credit."', 
													'".$description."', 
													NULL,
													'".$paymentMode."',
													'".$paymentDetails."')";
					//echo $sql; exit;
					$sql_res = mysqli_query($dbConn, $sql);
					
					$inserted_financeId = mysqli_insert_id($dbConn);
					//echo $inserted_financeId; exit;
					$supportingDocument ="";
					if($financeType == 0){
						$supportingDocument = multiplefileUpload($inserted_financeId, "uploads/financeSuppotingDocument/", "expenseDocument", "expenseDocument", ALLOWEDSALESSUPPORTINGDOCEXTENSIONS);
					}else if($financeType == 1){
						$supportingDocument = multiplefileUpload($inserted_financeId, "uploads/financeSuppotingDocument/", "earningDocument", "earningDocument", ALLOWEDSALESSUPPORTINGDOCEXTENSIONS);
					}
					$generatedFinanceCode = "FIN_".sprintf("%04d", $inserted_financeId);
					$sqlUpdateFinance = "UPDATE `finance` SET `financeCode` = '".$generatedFinanceCode."', `supportingDocument` = '".$supportingDocument."' WHERE `finance`.`financeId` = ".$inserted_financeId;
					//echo $sqlUpdateFinance; exit;
					$sqlUpdateFinance_res = mysqli_query($dbConn, $sqlUpdateFinance);
					
					echo '{"responseCode" : 1, "msg" : {"financeId" : '.$inserted_financeId.'}}';
				}else{
					echo '{"responseCode" : 0, "msg" : "Finance Title is Missing"}';
				}
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		/*-----------------------------FINANCE APIs---------------------------------------------------*/
		
		/*-----------------------------ADMIN USER APIs------------------------------------------------*/
		//Sessioned #Admin
		case "CHECKADMINUSEREMAILEXISTS":{
			if(isset($_SESSION['userId'])){
				$email=isset($_REQUEST['email'])?$_REQUEST['email']:"";
				if($email != ""){
					//echo preg_match(EMAILREGEX, $email);exit;
					if (preg_match(EMAILREGEX, $email)) {
						$sql = "SELECT COUNT(`userId`) AS 'COUNT' FROM `adminUser` WHERE `userEmail` = '".$email."'";
						//echo $sql; exit;
						$qry_res = mysqli_query($dbConn, $sql);
						$qry_res_fetch = mysqli_fetch_array($qry_res);
						if(intval($qry_res_fetch["COUNT"]) > 0){
							echo '{"responseCode" : 0, "msg" : "Email exists"}';
						}else{
							echo '{"responseCode" : 1, "msg" : "Email not exists"}';
						}
					} else { 
						echo '{"responseCode" : 0, "msg" : "Invalid Email"}';
					}   
				}else{
					echo '{"responseCode" : 0, "msg" : "Blank Email"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "CHECKADMINUSERUSERNAMEEXISTS":{
			if(isset($_SESSION['userId'])){
				$username=isset($_REQUEST['username'])?$_REQUEST['username']:"";
				if($username != ""){
					$sql = "SELECT COUNT(`userId`) AS 'COUNT' FROM `adminUser` WHERE `username` = '".$username."'";
					//echo $sql; exit;
					$qry_res = mysqli_query($dbConn, $sql);
					$qry_res_fetch = mysqli_fetch_array($qry_res);
					if(intval($qry_res_fetch["COUNT"]) > 0){
						echo '{"responseCode" : 0, "msg" : "Username exists"}';
					}else{
						echo '{"responseCode" : 1, "msg" : "Username not exists"}';
					}   
				}else{
					echo '{"responseCode" : 0, "msg" : "Blank Username"}';
				}
			}else{
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "GENERATERANDOMUSERNAME":{
			if(isset($_SESSION['userId'])){
				$sql = "SELECT CONCAT('user', IFNULL(MAX(CAST(SUBSTRING(username, 5) AS UNSIGNED)) + 1, 1)) AS suggested_username FROM `adminUser` WHERE username REGEXP '^user[0-9]+$'";
				//echo $sql; exit;
				$qry_res = mysqli_query($dbConn, $sql);
				$qry_res_fetch = mysqli_fetch_array($qry_res);
				echo '{"responseCode" : 1, "msg" : "'.$qry_res_fetch["suggested_username"].'"}';
			}else{
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		/*-----------------------------ADMIN USER APIs------------------------------------------------*/
		
		/*-----------------------------SETTINGS APIs--------------------------------------------------*/
		//Sessioned #Admin
		case "CALENDERDATA":{
			if(isset($_SESSION['userId'])){
				$calenderDataOption = isset($_REQUEST['calenderDataOption']) ? $_REQUEST['calenderDataOption'] : "";
				/*echo "calenderDataOption : ".$calenderDataOption;exit;*/
				if (is_string($calenderDataOption)) {
					$calenderDataOption = explode(',', $calenderDataOption);
				}
				$sqlParts = [];

				$sqlPO = "SELECT 
						`purchaseOrderId` AS `id`,
						`purchaseOrderCode` AS `title`,
						DATE(`purchaseOrderCreateDate`) AS `start`, 
						DATE(`purchaseOrderCreateDate`) AS `end` 
						FROM `orderPurchase` 
						WHERE `status` <= ".getOrderSaleStatusId($dbConn, "CANCELLED1")."
						AND DATE(`purchaseOrderCreateDate`) = DATE(`purchaseOrderDeliveryDate`)
						
						UNION ALL
						
						SELECT 
						`purchaseOrderId` AS `id`,
						`purchaseOrderCode` AS `title`,
						DATE(`purchaseOrderCreateDate`) AS `start`, 
						DATE(`purchaseOrderCreateDate`) AS `end` 
						FROM `orderPurchase` 
						WHERE `status` <= ".getOrderSaleStatusId($dbConn, "CANCELLED1")."
						AND DATE(`purchaseOrderCreateDate`) != DATE(`purchaseOrderDeliveryDate`)
						
						UNION ALL
						
						SELECT 
						`purchaseOrderId` AS `id`,
						`purchaseOrderCode` AS `title`,
						DATE(`purchaseOrderDeliveryDate`) AS `start`, 
						DATE(`purchaseOrderDeliveryDate`) AS `end` 
						FROM `orderPurchase` 
						WHERE `status` <= ".getOrderSaleStatusId($dbConn, "CANCELLED1")."
						AND DATE(`purchaseOrderCreateDate`) != DATE(`purchaseOrderDeliveryDate`)
						";
				//echo $sqlPO; exit;
						
				$sqlSO = "SELECT 
						`orderId` AS `id`,
						`orderCode` AS `title`, 
						DATE(`orderDate`) AS `start`, 
						DATE(`orderDate`) AS `end` 
						FROM `orderSale` 
						WHERE `status` <=".getOrderPurchaseStatusId($dbConn, "CANCELLED1")."
						AND DATE(`orderDate`) = DATE(`deliveryDate`)
						
						UNION ALL
						
						SELECT 
						`orderId` AS `id`,
						`orderCode` AS `title`, 
						DATE(`orderDate`) AS `start`, 
						DATE(`orderDate`) AS `end` 
						FROM `orderSale` 
						WHERE `status` <=".getOrderPurchaseStatusId($dbConn, "CANCELLED1")."
						AND DATE(`orderDate`) != DATE(`deliveryDate`)
						
						UNION ALL
						
						SELECT 
						`orderId` AS `id`,
						`orderCode` AS `title`, 
						DATE(`deliveryDate`) AS `start`, 
						DATE(`deliveryDate`) AS `end` 
						FROM `orderSale` 
						WHERE `status` <=".getOrderPurchaseStatusId($dbConn, "CANCELLED1")."
						AND DATE(`orderDate`) != DATE(`deliveryDate`)
						";
				//echo $sqlSO; exit;
				
				$sqlSD = "SELECT 
						`salesDairyId` AS `id`,
						`eventCode` AS `title`, 
						DATE(`startDateTime`) AS `start`,
						DATE(`startDateTime`) AS `end`
						FROM 
						`salesDairy` 
						WHERE 
						DATE(`startDateTime`) = DATE(`endDateTime`)

						UNION ALL

						SELECT 
						`salesDairyId` AS `id`,
						`eventCode` AS `title`, 
						DATE(`startDateTime`) AS `start`,
						DATE(`startDateTime`) AS `end`
						FROM 
						`salesDairy` 
						WHERE 
						DATE(`startDateTime`) != DATE(`endDateTime`)

						UNION ALL

						SELECT 
						`salesDairyId` AS `id`,
						`eventCode` AS `title`,
						DATE(`endDateTime`) AS `start`,
						DATE(`endDateTime`) AS `end`
						FROM 
						`salesDairy` 
						WHERE 
						DATE(`startDateTime`) != DATE(`endDateTime`)";
				//echo $sqlSO; exit;
				
				if (in_array('PO', $calenderDataOption)) {
					$sqlParts[] = $sqlPO;
				}
				if (in_array('SO', $calenderDataOption)) {
					$sqlParts[] = $sqlSO;
				}
				if (in_array('SD', $calenderDataOption)) {
					$sqlParts[] = $sqlSD;
				}
				$sql = implode(' UNION ALL ', $sqlParts);
				if (empty($sql)) {
					$sql = $sqlSO; //default
				}
				//echo $sql; exit;
				$sql_res = mysqli_query($dbConn, $sql);
				$calenderObjectArray = array();
				$count = 1;
				while($sql_res_fetch = mysqli_fetch_array($sql_res)){
					$calenderObject = (object) [
											   'id' => $count, 
											   'title' => $sql_res_fetch["title"],
											   'start' => $sql_res_fetch["start"],
											   'deliveryDate' => $sql_res_fetch["end"],
											   'allDay' => true
											  ];
					//echo json_encode($calenderObject);exit;
					$calenderObjectArray[] = $calenderObject;
					$count++;
				}
				echo json_encode($calenderObjectArray);
				
			} else {
				echo '{"responseCode" : 0, "msg" : "Not Logged in"}';
			}
			break;
		}
		
		//Sessioned #Admin
		case "CREATEBACKUP": {
			if (!isset($_SESSION['userId'])) {
				echo json_encode(['responseCode' => 0, 'msg' => "Not logged in"]);
				break;
			}

			$folderName = trim($_REQUEST['backUpName'] ?? '');
			if (empty($folderName)) {
				echo json_encode(['responseCode' => 0, 'msg' => "Backup name is blank"]);
				break;
			}

			$backupDir = "../backup/temp/$folderName";
			$responses = []; // Collect responses here

			/*--------------------------------DB Backup----------------------------------*/
			$dbBackupDir = "$backupDir/db";
			if (file_exists($backupDir)) {
				echo json_encode(['responseCode' => 0, 'msg' => "Folder already exists"]);
				break;
			}

			if (!mkdir($dbBackupDir, 0755, true)) {
				echo json_encode(['responseCode' => 0, 'msg' => "Failed to create backup folder"]);
				break;
			}

			$tablesResult = getAllTables($dbConn);
			if (!$tablesResult['success']) {
				echo json_encode(['responseCode' => 0, 'msg' => "Failed to get tables"]);
				break;
			}

			$successCount = 0;
			$errorCount = 0;
			$errorLog = "";
			foreach ($tablesResult['tables'] as $table) {
				$result = generateTableCSV($table, $dbConn, $dbBackupDir);
				if ($result['success']) {
					$successCount++;
				} else {
					$errorCount++;
					$errorLog .= "Table $table failed: " . $result['message'] . PHP_EOL;
				}
			}

			if ($errorCount > 0) {
				file_put_contents("$dbBackupDir/error.txt", $errorLog);
			}

			$responses[] = [
				'responseCode' => ($errorCount == 0) ? 1 : ($successCount > 0 ? 1 : 0),
				'msg' => "Backup completed with $successCount successes and $errorCount errors",
				'backupPath' => $dbBackupDir
			];
			/*--------------------------------DB Backup----------------------------------*/

			/*--------------------------------PreCompile Data Backup---------------------*/
			$sourceDir = "./preCompiledData";
			$preCompileDataBackupDir = "$backupDir/preCompiledData";
			if (copyFolder($sourceDir, $preCompileDataBackupDir)) {
				$responses[] = [
					'responseCode' => 1,
					'msg' => "PreCompile Data Folder copied successfully."
				];
			} else {
				$responses[] = [
					'responseCode' => 0,
					'msg' => "PreCompile Data Failed to copy folder."
				];
			}
			/*--------------------------------PreCompile Data Backup---------------------*/

			/*--------------------------------Uploads Folder Backup----------------------*/
			/*This oparation need more resourse & power. Will activate if server will be upgraded to higher version*/
			/*
			$sourceDir = "../uploads";
			$uploadsBackupDir = "$backupDir/uploads";
			if (copyFolder($sourceDir, $uploadsBackupDir)) {
				$responses[] = [
					'responseCode' => 1,
					'msg' => "Uploads Folder copied successfully."
				];
			} else {
				$responses[] = [
					'responseCode' => 0,
					'msg' => "Uploads Failed to copy folder."
				];
			}
			*/
			/*--------------------------------Uploads Folder Backup----------------------*/

			/*--------------------------------Make Zip file at the root------------------*/
			$zipFile = "../backup/$folderName.zip";
			try {
				zipFolder($backupDir, $zipFile);
				$responses[] = [
					'responseCode' => 1,
					'msg' => "Zip created successfully.",
					'zipPath' => $zipFile
				];
			} catch (Exception $e) {
				$responses[] = [
					'responseCode' => 0,
					'msg' => "Unable to create zip: " . $e->getMessage()
				];
			}
			/*--------------------------------Make Zip file at the root------------------*/

			/*--------------------------------Delete temp/Original folder----------------*/
			if (deleteFolder($backupDir)) {
				$responses[] = [
					'responseCode' => 1,
					'msg' => "Temp Folder deleted successfully."
				];
			} else {
				$responses[] = [
					'responseCode' => 0,
					'msg' => "Failed to delete temp folder."
				];
			}
			/*--------------------------------Delete temp/Original folder----------------*/

			// Final unified response
			echo json_encode([
				'responseCode' => 1,
				'messages' => $responses
			]);

			break;
		}
		/*-----------------------------SETTINGS APIs--------------------------------------------------*/
		
	/*=================================Sessioned API Section Ends============================================================*/
		
	default:{
		echo '{"messege" : "Case does not matched."}';
	}
}
?>