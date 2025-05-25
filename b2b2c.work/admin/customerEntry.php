<?php
include('../config/config.php');
include('auth.php');
echo "Loading...";
$section = "ADMIN";
$page = "CUSTOMER";

$customerId=isset($_REQUEST['customerId'])?(int)$_REQUEST['customerId']:0;
?>
<!DOCTYPE html>
<html>
	<head>
		<title><?php echo SITETITLE; ?> Admin | Customer Entry</title>
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
		<script type='text/javascript' src='<?php echo SITEURL; ?>assets/js/adminFunctionality/customers.js'></script>
		<!-------------------------------------------------Application Specific JS------------------------------------------------->
	</head>
   <body class="w3-light-grey">
      <?php include('includes/header.php'); ?>
      <?php include('includes/sidebar.php'); ?>
      <div class="w3-main">
         <div id="customerSectionHolder">
            <header class="w3-container" style="padding-top:22px">
               <h5><b><i class="fa <?php if(isset($allPages)) { echo getPageBootstrapIcon($allPages, basename($_SERVER['PHP_SELF'])); } ?>"></i> <span id="cms_199">Customer Entry</span></b></h5>
            </header>
            <div class="w3-row-padding w3-margin-bottom">
				<h5><?php if($customerId > 0){ ?><span id="cms_200">Edit</span><?php }else{ ?><span id="cms_201">Add</span><?php } ?> <span id="cms_202">Personal Data</span></h5>
				<div class="sectionBlock2 marBot20">
				
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					
						<div id="companyNameHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="companyNameSpan" class="input-group-addon"><span id="cms_193">Company Name </span> : </span>
								<input id="companyName" name="companyName" type="text" class="form-control" placeholder="Please Enter Company Name" autocomplete="off" value="<?php if(isset($companyName)){ echo $companyName; } ?>" rel="cms_203">
							</div>
						</div>
						
						<div id="companyTypeHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
							<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<select id="companyType" name="companyType" class="h34 w98p marBot5">
									<option value="0" id="cms_189">-- Company Type --</option>
								</select>
							</div>
							
							<div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
								<select id="customerGrade" name="customerGrade" class="h34 w98p marBot5">
									<option value="" id="cms_204">-- Select Customer Grade --</option>
								</select>
							</div>
							
							<div id="statusHolder" class="col-lg-4 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
								<label id="status_switch" class="switch pull-left" onchange="customerFunctionality.onSwitchChange(this.id, event)">
									<input id="status" name="status" type="checkbox" value="1" checked="checked">
									<span id="statusSlider" class="slider"></span>
								</label>
								<label id="status_lbl_1" class="pull-left marTop5 marleft5 greenText"><span id="cms_205">Active</span></label>
								<label id="status_lbl_0" class="pull-left marTop5 marleft5 redText"><span id="cms_206">Inactive</span></label>
							</div>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="buyerNameTitleHolder" class="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<select id="buyerNameTitle" name="buyerNameTitle" class="h34 w98p marBot5">
								<option value="" id="cms_207">-- Select Title --</option>
								<option value="Mr">Mr</option>
								<option value="Mrs">Mrs</option>
								<option value="Miss">Miss</option>
								<option value="Dr">Dr</option>
							</select>
						</div>
						
						<div id="buyerFirstNameHolder" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="buyerFirstNameSpan" class="input-group-addon"><span id="cms_208">Buying Manager Firstname</span>: </span>
								<input id="buyerFirstName" name="buyerFirstName" type="text" class="form-control" placeholder="Please Enter Buying Manager Firstname" autocomplete="off" value="" rel="cms_209">
							</div>
						</div>
						
						<div id="buyerLastNameHolder" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="buyerLastNameSpan" class="input-group-addon"><span id="cms_210">Buying Manager Lastname</span>: </span>
								<input id="buyerLastName" name="buyerLastName" type="text" class="form-control" placeholder="Please Enter Buying Manager Lastname" autocomplete="off" value="" rel="cms_211">
							</div>
						</div>
						<input id="buyerName" name="buyerName" type="hidden" value="<?php if(isset($buyerName)){ echo $buyerName; } ?>">
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="contactPersonTitleHolder" class="col-lg-2 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<select id="contactPersonTitle" name="contactPersonTitle" class="h34 w98p marBot5">
								<option value="" id="cms_207">-- Select Title --</option>
								<option value="Mr">Mr</option>
								<option value="Mrs">Mrs</option>
								<option value="Miss">Miss</option>
								<option value="Dr">Dr</option>
							</select>
						</div>
						
						<div id="contactPersonFirstnameHolder" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="contactPersonFirstnameSpan" class="input-group-addon"><span id="cms_212">Contact Person Firstname</span>: </span>
								<input id="contactPersonFirstname" name="contactPersonFirstname" type="text" class="form-control" placeholder="Please Enter Contact Person Firstname" autocomplete="off" value="" rel="cms_213">
							</div>
						</div>
						
						<div id="contactPersonSurnameHolder" class="col-lg-5 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="contactPersonSurnameSpan" class="input-group-addon"><span id="cms_214">Contact Person Surname</span>: </span>
								<input id="contactPersonSurname" name="contactPersonSurname" type="text" class="form-control" placeholder="Please Enter Contact Person Surname" autocomplete="off" value="" rel="cms_215">
							</div>
						</div>
						<input type="hidden" id="contactPerson" name="contactPerson" value="">
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="addressHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="addressSpan" class="input-group-addon"><span id="cms_216">Address</span> : </span>
								<input id="address" name="address" type="text" class="form-control" placeholder="Please Enter Address" autocomplete="off" value="" rel="cms_217">
							</div>
						</div>
						
						<div id="postCodeHolder" class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
							<div class="input-group marBot5">
								<span id="postCodeSpan" class="input-group-addon"><span id="cms_218">Postcode</span> : </span>
								<input id="postCode" name="postCode" type="text" class="form-control" placeholder="Please Enter Postcode" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_219">
							</div>
						</div>
						
						<div id="countryHolder" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<select id="country" name="country" class="pull-left w84p h34 marBot5" onchange="customerFunctionality.changeCountry()" autocomplete="off">
							</select>
							<input type="hidden" id="countryHdn" name="countryHdn" value="">
							<div class="pull-left marleft5"><img id="flagImg" src="<?php echo SITEURL.'assets/images/flag.jpg' ?>" class="w50 h34"></div>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="townHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="townSpan" class="input-group-addon"><span id="cms_220">Town</span> : </span>
								<input id="town" name="town" type="text" class="form-control" placeholder="Please Enter Town" autocomplete="off" value="" rel="cms_221">
							</div>
						</div>
						
						<div id="phoneHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="phoneSpan" class="input-group-addon"><span id="cms_222">Phone</span> : </span>
								<span id="phoneExtension" class="input-group-addon">000</span>
								<input id="phone" name="phone" type="text" class="form-control" placeholder="Please Enter Phone" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_213">
							</div>
						</div>
						
						<div id="faxHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="faxSpan" class="input-group-addon">Fax : </span>
								<input id="fax" name="fax" type="number" class="form-control" placeholder="Please Enter Fax" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_224">
							</div>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="emailHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="emailSpan" class="input-group-addon">Email : </span>
								<input id="email" name="email" type="text" class="form-control" placeholder="Please Enter Email" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" onblur="appCommonFunctionality.checkCustomerEmailExists()" <?php if($customerId > 0){ echo  "disabled"; } ?> rel="cms_225">
								<span id="emailExtSpan" class="input-group-addon">
									<span id="emailInfoIcon" class="glyphicon glyphicon-info-sign blueText f18"></span>
									<span id="emailOkIcon" class="glyphicon glyphicon-ok-circle greenText f18 hide"></span>
									<span id="emailCrossIcon" class="glyphicon glyphicon-remove-circle redText f18 hide"></span>
									<span id="emailRefreshIcon" class="glyphicon glyphicon-refresh greenText f18 hover" onclick="customerFunctionality.generateArbiteryEmail();"></span>
								</span>
							</div>
						</div>
						
						<div id="mobileHolder" class="col-lg-6 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="mobileSpan" class="input-group-addon"><span id="cms_226">Mobile</span> : </span>
								<span id="mobileExtension" class="input-group-addon">000</span>
								<input id="mobile" name="mobile" type="text" class="form-control" placeholder="Please Enter Mobile" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_227">
							</div>
						</div>
					</div>
					
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div id="websiteHolder" class="col-lg-9 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="websiteSpan" class="input-group-addon"><span id="cms_228">WebSite</span> : </span>
								<input id="website" name="website" type="text" class="form-control" placeholder="Please Enter WebSite" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_229">
							</div>
						</div>
						
						<div id="existingIdHolder" class="col-lg-3 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="existingIdSpan" class="input-group-addon"><span id="cms_230">Existing Id</span> : </span>
								<input id="existingId" name="existingId" type="text" class="form-control" placeholder="Please Enter Existing Id" autocomplete="off" value="" rel="cms_231">
							</div>
						</div>
					</div>
					
				</div>
				
				<h5><?php if($customerId > 0){ ?><span id="cms_200">Edit</span><?php }else{ ?><span id="cms_201">Add</span><?php } ?> <span id="cms_232">Financial Data</span></h5>
				<div class="sectionBlock2 marBot20">
				
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<?php if($customerId == 0){ ?>
							<div id="accountHolderFlagHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
								<label id="accountHolderFlag_switch" class="switch pull-left" onchange="customerFunctionality.onSwitchChange(this.id, event)">
									<input id="accountHolderFlag" name="accountHolderFlag" type="checkbox" value="">
									<span id="accountHolderFlagSlider" class="slider"></span>
								</label>
								<label id="accountHolderFlag_lbl_0" class="pull-left marTop5 marleft5 redText"><span id="cms_237">If it is not same as the company ?</span></label>
								<label id="accountHolderFlag_lbl_1" class="pull-left marTop5 marleft5 greenText"><span id="cms_238">Same as the company name</span></label>
							</div>
						<?php } ?>
						
						<div id="accountHolderNameHolder" class="col-lg-8 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="accountHolderNameSpan" class="input-group-addon"><span id="cms_239">Account Holder name</span>: </span>
								<input id="accountHolderName" name="accountHolderName" type="text" class="form-control" placeholder="Please Enter Account Holder Name" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_240">
							</div>
						</div>

					</div>
				
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">

						<div id="bankHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="input-group marBot5">
								<span id="bankSpan" class="input-group-addon">Bank : </span>
								<input id="bank" name="bank" type="text" class="form-control" placeholder="Please Enter Bank Name" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_415">
							</div>
						</div>
						
						<div id="accountNoHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="accountNoSpan" class="input-group-addon">A/C No : </span>
								<input id="accountNo" name="accountNo" type="text" class="form-control" placeholder="Please Enter Bank Account No" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_241">
							</div>
						</div>
						
						<div id="sortCodeHolder" class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noRightPaddingOnly">
							<div class="input-group marBot5">
								<span id="sortCodeSpan" class="input-group-addon">Sort Code : </span>
								<input id="sortCode" name="sortCode" type="text" class="form-control" placeholder="Please Enter Sort Code" autocomplete="off" value="" onkeyup="customerFunctionality.formatInputValue(this.id)" rel="cms_242">
							</div>
						</div>
					</div>
					<input id="bankDetails" name="bankDetails" type="hidden" value="">
				</div>
				
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5 text-center">
					<input id="customerId" name="customerId" type="hidden" value="<?php echo $customerId; ?>">
					<input id="additionalInformation" name="additionalInformation" type="hidden" value="">
					<button type="button" class="btn btn-success" rel="cms_243" onclick="customerFunctionality.saveCustomer()">Save</button>
				</div>
            </div>
         </div>
         <br>
         <?php include('includes/footer.php'); ?>
      </div>
   </body>
</html>