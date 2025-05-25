<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
	<div id="loginSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
			<h1 id="cms_48">Login</h1>
			<div><img src="<?php echo SITEURL; ?>assets/images/logo.jpg" class="loginLogo" alt="logo"></div>
			<p id="cms_49">Please enter your email id.</p>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center userInputHolder">
			<div class="input-group marBot5 w80p">
				<span id="usernameSpan1" class="input-group-addon">Username : </span>
				<input id="username" name="username" type="text" class="form-control" placeholder="* Enter your email" autocomplete="off" value="">
				<span id="usernameSpan2" class="input-group-addon">
					<span class="glyphicon glyphicon-play hover" onclick="appCommonFunctionality.getOTP();"></span>
				</span>
			</div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center" id="loginResponse"></div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
			<p><span id="cms_50">If you dont have an account, please go to</span> <span id="cms_51" class="regLoginLink" onClick="appCommonFunctionality.gotoSection('REG')">Registration</span>.</p>
		</div>
	</div>
	
	<div id="otpSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
			<h1 id="cms_52">OTP</h1>
			<div><img src="<?php echo SITEURL; ?>assets/images/logo.jpg" class="loginLogo" alt="logo"></div>
			<p id="cms_53">Please check your email id, and enter the OTP that have been sent to your mail.</p>
			<h3 id="otpTimer" class="text-center"></h3>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center userInputHolder">
			<div class="text-center">
				<input id="otpInput_1" name="otpInput_1" class="otpInput" type="number" oninput='appCommonFunctionality.digitValidate(this)' onkeyup='appCommonFunctionality.otpTabChange(1)' maxlength=1 autocomplete="off">
				<input id="otpInput_2" name="otpInput_2" class="otpInput" type="number" oninput='appCommonFunctionality.digitValidate(this)' onkeyup='appCommonFunctionality.otpTabChange(2)' maxlength=1 autocomplete="off">
				<input id="otpInput_3" name="otpInput_3" class="otpInput" type="number" oninput='appCommonFunctionality.digitValidate(this)' onkeyup='appCommonFunctionality.otpTabChange(3)' maxlength=1 autocomplete="off">
				<input id="otpInput_4" name="otpInput_4" class="otpInput" type="number" oninput='appCommonFunctionality.digitValidate(this)' onkeyup='appCommonFunctionality.otpTabChange(4)' maxlength=1 autocomplete="off">
				<input id="otpInput_5" name="otpInput_5" class="otpInput" type="number" oninput='appCommonFunctionality.digitValidate(this)' onkeyup='appCommonFunctionality.otpTabChange(5)' maxlength=1 autocomplete="off">
				<input id="otpInput_6" name="otpInput_6" class="otpInput" type="number" oninput='appCommonFunctionality.digitValidate(this)' onkeyup='appCommonFunctionality.otpTabChange(6)' maxlength=1 autocomplete="off">
				<div id="supplierLoginMsg" class="text-center loginError"></div>
				<button id="loginBtn" type="button" class="btn btn-primary btn-lg marTop24" rel="cms_125" onclick="appCommonFunctionality.submitOTP();">Validate OTP</button>
			</div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center" id="otpResponse"></div>
	</div>
	
	<div id="registrationSection" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly hide">
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
			<h1 id="cms_55">Register</h1>
			<p id="cms_56">Please fill in this form to create an account.</p>
			<p><span id="cms_57">If you are a existing customer, please go to</span> <span id="cms_48" class="regLoginLink" onClick="appCommonFunctionality.gotoSection('LOGIN')">login</span>.</p>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_68" type="text" placeholder="* Company Name" id="companyName" name="companyName" value="">
			</div>
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24">
				<select id="companyType" name="companyType" class="ddl" onChange="appCommonFunctionality.validateCustomerRegistrationForm(false)">
					<option value="0" id="cms_69">-- Select Company Type --</option>
					<?php
						$companyType_sql = "SELECT `companyTypeId`,`companyType` FROM `companyType` WHERE 1";
						$companyType_sql_res = mysqli_query($dbConn, $companyType_sql);
						while($companyType_sql_res_fetch = mysqli_fetch_array($companyType_sql_res)){
						?>
					<option value="<?php echo $companyType_sql_res_fetch["companyTypeId"]; ?>"><?php echo $companyType_sql_res_fetch["companyType"]; ?></option>
					<?php } ?>
				</select>
			</div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 marBot24">
				<select id="buyerNameTitle" name="buyerNameTitle" class="ddl">
					<option value="" id="cms_269">-- Select Title --</option>
					<option value="Mr">Mr</option>
					<option value="Mr">Mrs</option>
					<option value="Mr">Miss</option>
					<option value="Mr">Dr</option>
				</select>
			</div>
			<div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_272" type="text" placeholder="* Buying manager first name" id="buyerFirstName" name="buyerFirstName" value="">
			</div>
			<div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_273" type="text" placeholder="* Buying manager last name" id="buyerLastName" name="buyerLastName" value="">
			</div>
			<input type="hidden" id="buyerName" name="buyerName" value="">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 marBot24">
				<select id="contactPersonTitle" name="contactPersonTitle" class="ddl">
					<option value="" id="cms_269">-- Select Title --</option>
					<option value="Mr">Mr</option>
					<option value="Mr">Mrs</option>
					<option value="Mr">Miss</option>
					<option value="Mr">Dr</option>
				</select>
			</div>
			<div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_270" type="text" placeholder="* Contact person first name" id="contactPersonFirstName" name="contactPersonFirstName" value="">
			</div>
			<div class="col-lg-5 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_271" type="text" placeholder="* Contact person last name" id="contactPersonLastName" name="contactPersonLastName" value="">
			</div>
			<input type="hidden" id="contactPersonName" name="contactPersonName" value="">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot24">
			<input class="w3-input w3-border" rel="cms_61" type="text" placeholder="Address" id="address" name="address" value="">
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_274" type="text" placeholder="Post Code" id="postCode" name="postCode" value="">
			</div>
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_275" type="text" placeholder="Town" id="town" name="town" value="">
			</div>
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 marBot24">
				<select id="country" name="country" class="ddl">
					<option value="" id="cms_276">-- Select Country --</option>
					<?php for($i = 0; $i < count(BUSINESSCOUNTRIES); $i++){?>
					<option value="<?php echo BUSINESSCOUNTRIES[$i]; ?>"><?php echo BUSINESSCOUNTRIES[$i]; ?></option>
					<?php } ?>
				</select>
			</div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_62" type="text" placeholder="* Phone" id="phone" name="phone" value="" onKeyup="appCommonFunctionality.validateCustomerRegistrationForm(false)">
			</div>
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24 magazineHolder">
				<input class="w3-input w3-border w92p pull-left" rel="cms_64" type="text" placeholder="* Email" id="email" name="email" value="" onKeyup="appCommonFunctionality.validateCustomerRegistrationForm(false)" onfocusout="appCommonFunctionality.checkEmailExists()">
				<span id="emailInfoIcon" class="glyphicon glyphicon-info-sign f34 pull-left marLeft5 blueText"></span>
				<span id="emailOkIcon" class="glyphicon glyphicon-ok-circle f34 pull-left marLeft5 greenText hide"></span>
				<span id="emailCrossIcon" class="glyphicon glyphicon-remove-circle f34 pull-left marLeft5 redText hide"></span>
			</div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_65" type="text" placeholder="Mobile" id="mobile" name="mobile" value="">
			</div>
			<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 marBot24">
				<input class="w3-input w3-border" rel="cms_67" type="text" placeholder="* TAX Number" id="tax" name="tax" value="" onKeyup="appCommonFunctionality.validateCustomerRegistrationForm(false)">
			</div>
		</div>
		<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot24 text-center">
			<button type="button" id="register" class="btn btn-success" rel="cms_55" onclick="appCommonFunctionality.submitCustomerRegistration()">Register</button>
		</div>
	</div>
</div>