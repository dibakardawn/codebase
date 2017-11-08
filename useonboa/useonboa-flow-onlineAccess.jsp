<link href="/CBOL/sec/useonboa/css/useonboaOTP.css" rel="stylesheet"></link>
<link href="/CBOL/sec/useonboa/css/useonboaRWD.css" rel="stylesheet"></link>

<%@taglib prefix="s" uri="/struts-tags"%>
<%@taglib prefix="jfp" uri="/tags/JFPTags"%>
<%@taglib prefix="jfpui" uri="/tags/jfpui"%>
<%@taglib prefix="global" uri="/WEB-INF/tld/GlobalTags.tld"%> 
<global:masking/>

<jfp:cmset var="Pwd_Rule_NotUserID" contentId="Pwd_Rule_NotUserID" contentType="config" appId="cbol_sec_useonboa" />
<jfp:cmset var="Pwd_Rule_NoSpace" contentId="Pwd_Rule_NoSpace" contentType="config" appId="cbol_sec_useonboa" />
<jfp:cmset var="Pwd_Rule_1Letter1Digit" contentId="Pwd_Rule_1Letter1Digit" contentType="config" appId="cbol_sec_useonboa" />
<jfp:cmset var="Pwd_Rule_Length" contentId="Pwd_Rule_Length" contentType="config" appId="cbol_sec_useonboa" />
<jfp:cmset var="Pwd_Rule_RepeatChar" contentId="Pwd_Rule_RepeatChar" contentType="config" appId="cbol_sec_useonboa" />
<jfp:cmset var="Pwd_Rule_AllowedChar" contentId="Pwd_Rule_AllowedChar" contentType="config" appId="cbol_sec_useonboa" />

<div class="container col-sm-12 col-md-12 cbolui-onboard-container">
	<div class="container">
	<s:if test="null!=context.useOnBoaSubmitCardDetailsVB && null!=context.useOnBoaSubmitCardDetailsVB.contactInfoAvailable && context.useOnBoaSubmitCardDetailsVB.contactInfoAvailable == true 
	  && null!= context.useOnBoaSubmitCardDetailsVB.activationMessage && 
	 context.useOnBoaSubmitCardDetailsVB.activationMessage !=''">
	 	<div id="activationMsg" class="col-xs-12 col-sm-12 col-md-12">
			<div>
            <s:if test="context.useOnBoaSubmitCardDetailsVB.card.activationStatus.toString() == 'FAILURE' ">
				<span class="icon icon-alert-info pull-left iconMargin"></span>
				<span>
				<s:property value="context.useOnBoaSubmitCardDetailsVB.activationMessage"/>
				</span>
			</s:if>   
			<s:else>
				<span class="glyphicon glyphicon-ok pull-left"></span>
				<span>
				<s:property value="context.useOnBoaSubmitCardDetailsVB.activationMessage"/>
				</span>
			</s:else>
			
           </div>   
		</div>    
	</s:if>
	<div class="col-md-12 col-sm-11 col-lg-11 col-lg-offset-1 col-md-offset-1 col-sm-offset-1">
        <div class="row col-md-11 col-sm-11" id="securityBodySection">
		<h1><jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_Hd"/></h1>
            
			<div id="pbar"></div>
			<div class="xs-pbar-step visible-xs"></div>
			
            <h3><jfp:cmout attribute="OnlAcc_Title.TEXT" contentType="copy" appId="cbol_sec_useonboa"/></h3>
			<div id="cardPageLevelError1" class="hidden">
				<span class="icon icon-page-error pull-left" id="errorSpan">Error</span>
						<p class="contains-icon"></p>
			</div>
			<s:if test="hasActionErrors()">
				<div class="row cbolui-approval" role="alert" id="pageLevelErrDiv">
					<div class="col-md-12 col-xs-12">
						<span class="icon icon-page-error pull-left">Error</span>
						<p class="contains-icon">
							<s:iterator value="actionErrors" id="error">
								<s:property value="error" />
							</s:iterator>
						</p>
					</div>
				</div>
			</s:if>
			
			<div id="cbolui-fieldsRequiredNotePanel" class="cbolui-show-error-above">
				<div>
					<em><jfp:message bundle="cbol.common.phrases" key="All_Fields_Required"/></em>
				</div>	
			</div>
			
            <form id="createUserIdForm" class="formMargin">    
                <fieldset class="row col-md-9 col-sm-9" id="durationFieldSet">
				<!--Iterator section for exisiting user id starts-->
				
				<s:if test="context.useOnBoaSubmitCardDetailsVB.primaryUser && null!=context.useOnBoaSubmitCardDetailsVB.userIdMap && context.useOnBoaSubmitCardDetailsVB.userIdMap.size()!=0 " > 
				<p><jfp:cmout attribute="OnlAcc_Intro.TEXT" contentType="copy" appId="cbol_sec_useonboa"/></p>
				
				<s:iterator value="context.useOnBoaSubmitCardDetailsVB.userIdMap" var="currentDevice" status="istatus">					
                    <div class="row">
                        <div class="col-xs-12 col-md-12 col-sm-12 radio">
                            <label for="duration" id="existingUserId_${istatus.index}-label">
                                <input type="radio" value="<s:property value="value" />" aria-labelledby="existingUserId_${istatus.index}-label"
								name="changeDurationRadio" id="existingUserId_${istatus.index}" tabindex="0">
                             <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_ExstUsrID" /> <s:property value="key"/></strong>
                            </label>
                        </div>
                    </div>

                    <div class="row cbolui-input-box hidden cbolui_shiftMargin" id="dynamicTextBox_${istatus.index}">
                        <div class="form-group col-xs-12 col-sm-5 col-md-5">
                            <!-- label -->
                            <label for="cbolui_onboard_existingPassword_${istatus.index}" 
                            id="cbolui_onboard_existingPassword_${istatus.index}-label">
                               <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_EntrPwd" />
                            </label>
                            <!-- input field -->
                            <div class="input-group">
                                <span class="input-group-addon password-icon"></span>
                                <input id="cbolui_onboard_existingPassword_${istatus.index}" type="password" class="form-control" 
                                aria-labelledby="cbolui_onboard_existingPassword_${istatus.index}-label" value="" tabindex="0">
                            </div>

                        </div>
                        
			         <div class="" style="margin-top: 30px;">
			            <div class="row cbolui-input-box" id="forgotPasswordyWraper">
			              <jfp:cmlink id="cbolui_onboard_forgotPass" contentId="OnlAcc_frgtPwd" styleClass="btn btn-default" appId="cbol_sec_useonboa" tabindex="0"/> 
			            </div>
                     </div>
                        
                    </div>
				</s:iterator>
                    <!--Iterator section for exisiting user id ends-->
					<!--Create New user id radio button-->
					
                    <div class="row">
                        <div class="col-xs-12 col-md-12 col-sm-12 radio">
                            <label for="durationTempOption" id="cbolui_onboard_createUserRadio-label">
                                <input type="radio" value="temporary" name="changeDurationRadio"
                                 aria-labelledby="cbolui_onboard_createUserRadio-label" id="cbolui_onboard_createUserRadio" tabindex="0">
                                <span><jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_CrtNwUsrID" /></span>
                            </label>
                        </div>
                    </div>
					
					<div class="row cbolui-input-box createUserIdSection hidden cbolui_shiftMargin marTop3">
					<div id="userIdWrapper">
                        <div class="col-xs-12 col-sm-5 col-md-5 form-group">
                            <!-- label -->
                            <label for="userID" id="userID-label">
                                <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwUsrID" />
                                <button id="userIDTooltip" type="button" tabindex="0"
                                class="btn btn-info-svg tooltipstered cbolui-responsive-tooltip-icon"
                                role="img"></button>
                            </label>
                            <!-- input field -->
                            <div class="input-group">
                                <span class="input-group-addon glyphicon glyphicon-user"></span>
                                <input id="userID" name="userID" type="text" class="form-control" aria-labelledby="userID-label" 
                                placeholder="<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwUsrID_Def" />" value="" tabindex="0">
                            </div>
                             

                        </div> 
                     <div class="hidden" id="userIDTooltip-title"><jfp:cmout attribute="OnlAcc_NwUsrIDTltp.NAME" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" /></div>
					<div class="hidden" id="userIDTooltip-info"><jfp:cmout attribute="OnlAcc_NwUsrIDTltp.TEXT" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" /></div>
                         <div id="checkAvail" class="col-sm-12 col-md-12">
						</div> 
                        <!--Check availability-->
                        <div class="col-xs-12 col-sm-6 col-md-6 col-sm-offset-5 col-md-offset-5 linkPositionForMobile">
						<div class="row cbolui-input-box" id="checkAvailabilityWrapperDiv">
						<!-- <a href="#" id="Input_AvalabilityLink">Check Availabitlty</a>-->
						  <jfp:cmlink id="Input_AvalabilityLink" contentId="OnlAcc_chkAvlLnk" styleClass="btn btn-default" appId="cbol_sec_useonboa" tabindex="0"/>	
						</div>
                        </div>	
					</div>	
                    </div>
					<div class="row cbolui-input-box createUserIdSection hidden cbolui_shiftMargin" id="passwordWrapper">
                        <div class="form-group col-xs-12 col-sm-5 col-md-5">
                            <!-- label -->
                            <label for="password" id="password-label">
                             <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwPwd" />
                            </label>
                            <!-- input field -->
                            <div class="input-group">

                                <span class="input-group-addon password-icon"></span>
                                <input id="password" name="password" type="password" class="form-control passwordRuleMeterEnable" 
                                aria-labelledby="password-label" value="" tabindex="0">
                            </div>
					
                        </div>
						<div class="" style="margin-top: 34px;">
                            
                            <button id="password_tooltip" type="button" 
                                        class="btn btn-info-svg tooltipstered cbolui-responsive-tooltip-icon cbolui-password-strength-icon pull-left hidden-xs"
                                        role="img"></button>
                                        <div id="correctMsgDiv" class="pull-left"></div>
						<span id="password_tooltip-title" class="hidden"></span>
						<span id="password_tooltip-info"  class="hidden"></span>
										

                        </div>
                    </div>
					
					<div class="row cbolui-input-box createUserIdSection hidden cbolui_shiftMargin marTop3">
                        <div class="form-group col-xs-12 col-sm-5 col-md-5">
                            <!-- label -->
                            <label for="cbolui_onboard_confPassword" id="cbolui_onboard_confPassword-label">
                                <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwCnfrmpwd" />
                            </label>
                            <!-- input field -->
                            <div class="input-group">

                                <span class="input-group-addon password-icon"></span>
                                <input id="cbolui_onboard_confPassword" type="password" class="form-control" 
								aria-labelledby="cbolui_onboard_confPassword-label" value="" tabindex="0">
                            </div>

                        </div>  
                    </div>
                    
					</s:if>
					<s:else>
					<!--Create New user id radio button ends-->
					<!--For primary user-->
					<div id="userIdWrapper" class="row">
                        <div class="col-xs-12 col-sm-5 col-md-5 form-group">
                            <!-- label -->
                            <label for="userID" id="userID-label">
                               <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwUsrID" />
                               <button id="userIDTooltip" type="button" tabindex="0"
                                class="btn btn-info-svg tooltipstered cbolui-responsive-tooltip-icon"
                                role="img"></button>
                            </label>
                            <!-- input field -->
                            <div class="input-group">

                               <span class="input-group-addon glyphicon glyphicon-user"></span>
                                <input id="userID" name="userID" type="text" class="form-control" aria-labelledby="userID-label"
                                placeholder="<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwUsrID_Def" />" value="${userID}" tabindex="0">
                            </div>
                            
                             <div class="hidden" id="userIDTooltip-title"><jfp:cmout attribute="OnlAcc_NwUsrIDTltp.NAME" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" /></div>
							<div class="hidden" id="userIDTooltip-info"><jfp:cmout attribute="OnlAcc_NwUsrIDTltp.TEXT" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" /></div>

                        </div>
                            <div id="checkAvail" class="col-sm-12 col-md-12">
							</div>
                          <!--Check availability-->
                         <div class="col-xs-12 col-sm-6 col-md-6 col-sm-offset-5 col-md-offset-5 linkPositionForMobile">
						<div class="row cbolui-input-box" id="checkAvailabilityWrapperDiv">
						<!-- <a href="#" id="Input_AvalabilityLink">Check Availabitlty</a>-->
						  <jfp:cmlink id="Input_AvalabilityLink" contentId="OnlAcc_chkAvlLnk" styleClass="btn btn-default" appId="cbol_sec_useonboa" tabindex="0"/>	
						</div>
                        </div>	
                    </div>
					
					<div class="row cbolui-input-box" id="passwordWrapper">
                        <div class="form-group col-xs-12 col-sm-5 col-md-5">
                            
                            <label for="password" id="password-label">
                             <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwPwd" />
                            </label>
                           
                            <div class="input-group">
                                <span class="input-group-addon password-icon"></span>
                                <input id="password" name="password" type="password" class="form-control passwordRuleMeterEnable" 
								aria-labelledby="password-label" value="${password}" tabindex="0">
							</div>
							

                        </div>
						<div class="" style="margin-top: 34px;">
                            
                            <button id="password_tooltip" type="button" 
                                        class="btn btn-info-svg tooltipstered cbolui-responsive-tooltip-icon cbolui-password-strength-icon pull-left hidden-xs"
                                        role="img"></button>
                                        <div id="correctMsgDiv" class="pull-left"></div>
                        </div>
                        
                        <span id="password_tooltip-title" class="hidden"></span>
						<span id="password_tooltip-info"  class="hidden"></span>
                    </div>
					
					<div class="row cbolui-input-box">
                        <div class="form-group col-xs-12 col-sm-5 col-md-5">
                            <!-- label -->
                            <label for="cbolui_onboard_confPassword" id="cbolui_onboard_confPassword-label">
                                   <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_NwCnfrmpwd" />
                            </label>
                            <!-- input field -->
                            <div class="input-group">

                                <span class="input-group-addon password-icon"></span>
                                <input id="cbolui_onboard_confPassword" type="password" class="form-control" 
								aria-labelledby="cbolui_onboard_confPassword-label" value="${password}" tabindex="0">
                            </div>

                        </div>
                    </div>
                    <s:if test="!context.useOnBoaSubmitCardDetailsVB.primaryUser">
                    <div class="row cbolui-input-box" id="stcWrapper">
                        <div class="form-group col-xs-12 col-sm-5 col-md-5">
                            <!-- label -->
                            <label for="stcCode" id="stcCode-label">
                                  <jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_STC" />
						   		<button id="stcCodeTooltip" type="button" tabindex="0"
	                                class="btn btn-info-svg tooltipstered cbolui-responsive-tooltip-icon"
	                                role="img"></button>
                            </label>
                            <!-- input field -->
                            <div class="input-group">
                                <span class="input-group-addon">
								<!--securityCode-->
								<jfp:message bundle='cbol_sec_useonboa.bundle' key='OnlAcc_STCLbl'/>
								</span> 
                                <input id="stcCode" type="password" name="stcCode" class="form-control" aria-labelledby="stcCode-label"  
                                placeholder="<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_STCDef" />" value="${stcCode}" tabindex="0">
                            </div>
                        </div>
                    </div>
                    <div class="hidden" id="stcCodeTooltip-title"><jfp:cmout attribute="OnlAcc_STCTlt.NAME" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" /></div>
					<div class="hidden" id="stcCodeTooltip-info"><jfp:cmout attribute="OnlAcc_STCTlt.TEXT" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" /></div>
                    </s:if>
				</s:else>
				</fieldset>
				
				<s:if test="context.useOnBoaSubmitCardDetailsVB.primaryUser &&  null!=context.useOnBoaSubmitCardDetailsVB.card.paperlessEnrollment && !context.useOnBoaSubmitCardDetailsVB.card.paperlessEnrollment" >
					
                <div id="paperLessCommContainer" class="col-sm-11 col-md-11">
					<div class="row col-sm-12 col-md-12 col-lg-12 col-xs-12">
	                    <span id="paperlessHeaderText"><strong><jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_PaprlsHeadng" /></strong></span>
	                    	<span id="paperlessToggle">
								<label class="sr-only" for="switch-toggle" id="switch-toggle-label">
									<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_PaprlsHeadng" /></label>
							  <label class="toggle toggle-green">
								  <input type="checkbox" name="paperlessSelection" value="true" class="toggle-input" id="switch-toggle" tabindex="0" aria-labelledby="switch-toggle-label">
								  <span class="toggle-label" data-on="<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_ToggleYes" />" data-off="<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_ToggleNo" />"></span>
								  <span class="toggle-handle" ></span>
							   </label>
						   </span>
	                    
				   </div>
				</div>
				   <div id="paperLessComm" class="col-sm-11 col-md-11">
                    <p id="paparelessinstHeader"><strong><jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_PaprlsTnC" /></strong></p>
                    <p><jfp:cmout attribute="OnlAcc_PaprlsTnCTxt.TEXT" contentType="copy" appId="cbol_sec_useonboa"/></p>
                    <div class="form-group">
                        <label for="tncContainer" class="sr-only"></label>
                        <!--textarea readonly class="form-control noresize" rows="5" id="comment" -->
                        <div id="tncContainerWrapper">
							<div id="tncContainer">
	               			  <jfp:cmout attribute="OnlAcc_EnrollTxt.TEXT" contentType="copy" appId="cbol_sec_useonboa" escapeXml="false" />
						  	</div>
                        </div>						
                    </div>
				<fieldset class="col-md-8 cbolui-form-fieldset" id="paperlessFieldset">
                    <div class="row">
                        <div class="row col-xs-12 col-md-12 col-sm-12 checkbox">
                            <label for="paperlessOption" id="paperlessOption-label">
                                <input type="checkbox" value="" id="paperlessOption" tabindex="0" aria-labelledby="paperlessOption-label"/>
                                <span><jfp:message bundle="cbol_sec_useonboa.bundle" key="OnlAcc_Iagree" /></span>
                            </label>
                        </div>
                    </div>
                    </fieldset>
                </div>
                
				</s:if>
				
			<input type="hidden" name="${fekName}" value="${fek}" id="_flowExecutionKey" />
			<input type="hidden" name="_eventId" value="create" id="_eventId" />

            </form>
    
        </div>
		<div class="row col-md-11 col-sm-11">
			<nav id="cbolui-createUserCTA" class="row col-md-12 cbolui-bottom-nav hidden">
				<div class="col-md-12 row">
					<div class="cbolui-divider-standard"></div>
					<div class="pull-left centerAlign_mobileButton">
						<jfp:cmlink id="useonboa-cbolui-createUserIdSubmit" contentId="OnlAcc_CrtIdAnCont" styleClass="btn btn-primary" appId="cbol_sec_useonboa" tabindex="0" />
					</div>
				</div>
			</nav>
			<nav id="cbolui-linkUserCTA" class="row col-md-12 cbolui-bottom-nav hidden">
				<div class="col-md-12 row">
					<div class="cbolui-divider-standard"></div>
					<div class="pull-left centerAlign_mobileButton">
					<jfp:cmlink id="useonboa-cbolui-linkUser" contentId="OnlAcc_LnkCrdAnCont" styleClass="btn btn-primary" appId="cbol_sec_useonboa" tabindex="0"/>
					<!--  <a href="#" id="useonboa-cbolui-linkUser" class="btn btn-primary">Link USer</a>-->
					
					</div>
				</div>
			</nav>
		</div>
    </div>
	</div>
</div>
<span id="password-error-text" class="hidden"></span>


<div id="storeUserIdData" class='hidden'></div>
<div id="json" class="hidden"><s:property value="context.useOnBoaCreateUserVB.userIdAvailabilityJSON" /></div>
<span class="hidden" id="pbarjson"><s:property value="context.useOnBoaSubmitCardDetailsVB.progressBarListJSON"/></span>
<div id="validationJson" class="hidden">${context.jsonValidatorConfigObj}</div>
<span id="elseWhereText" class="hidden"><jfp:message bundle="cbol_sec_useonboa.bundle" key="ClkElsWhr" /></span>
<%--Start of Code for dynamic progress bar --%>
<script>
	<s:if test="null!=context.useOnBoaSubmitCardDetailsVB && context.useOnBoaSubmitCardDetailsVB.contactInfoAvailable == true">
			var currentStep = 1;
	</s:if>
	<s:else>
			var currentStep = 2;
	</s:else>
	var pbarObj = $('#pbarjson').text();
	pbarObj = JSON.parse(pbarObj);
	
	var currStep = pbarObj[currentStep-1].label;
	var pbarText = '<jfp:message bundle="cbol_sec_useonboa.bundle" key="Xs_pbar_step" arg0="'+currentStep+'"/>';
	$('div.xs-pbar-step').html('<b>'+pbarText+'</b>'+currStep);
</script>

<jfpui:activation wrapperSet="#pbar">
	<jsp:attribute name="properties">
	{	
		sections: pbarObj,
	
		currentSection: currentStep,
		currentStep: 0,
		rollover: false,
		styleClass: 'cM-progressbar'
	}
	</jsp:attribute>
	<jsp:attribute name="topics">
	{
		'/topic/activation':['click','postconstruction']
	}
	</jsp:attribute>
</jfpui:activation>
<%--End of Code for dynamic progress bar --%>

<script>
var availabilityJson = $('#json').text();
var suggst='${context.useOnBoaCreateUserVB.userIdAvailable}';
<s:if test="hasFieldErrors()">
var fieldErrorLength=1;
var fieldErrorList = new Array();
</s:if>
<s:else>
var fieldErrorLength=0;
</s:else>
var userIdListCheck='<s:property value="context.useOnBoaSubmitCardDetailsVB.userIdList.size()"/>';
var primaryUserVal= '<s:property value="context.useOnBoaSubmitCardDetailsVB.primaryUser"/>';
var userIdonPage='${userId}';
var confirmPwdEmptyMsg='<jfp:message bundle="cbol_sec_useonboa.bundle" key="CnfrmPwEmpty" />';
var paswdNotMatchMsg='<jfp:message bundle="cbol_sec_useonboa.bundle" key="PwNtMatch" />';
var paperlessOptnEmpty= '<jfp:message bundle="cbol_sec_useonboa.bundle" key="SlctPaprlsChkbx" />';
var pwdEmptyMsg='<jfp:message bundle="cbol_sec_useonboa.bundle" key="OnAcc_PwdEmptyMsg" />';
var userIdEmptyMsg= '<jfp:message bundle="cbol_sec_useonboa.bundle" key="UsrIdMandErr" />';
var userIdonPage='${userId}';
var tempUserId='${userID}';
var tempPwd='${password}';
var paperlessSelection='${paperlessSelection}';
var isLinkFlow='${context.useOnBoaLinkUserVB.linkFlow}';
var hasError=false;
var isAdminFlow='${context.useOnBoaSubmitCardDetailsVB.adminFlow}';
//var originalUserID=$('#userID').val();

var validationRules = [
    {
		validationCase: "OTHUSERID",
        message: "${Pwd_Rule_NotUserID.RuleText}",
        isValid: ''
    },
    {
		validationCase: "SPACENOTALLOW",
        message: "${Pwd_Rule_NoSpace.RuleText}",
        isValid: ''
    },
    {
		validationCase: "ONECHARONEDIGIT",
        message: "${Pwd_Rule_1Letter1Digit.RuleText}",
		isValid: ''
	},
	{
		validationCase: "ONECHARONEDIGITONESPLCHAR",
        message: "${Pwd_Rule_AllowedChar.RuleText}",
		isValid: ''
	},
    {
		validationCase: "NOCONCCHARMRTHN2",
        message: "${Pwd_Rule_RepeatChar.RuleText}",
		isValid: ''
    },
	/*{
		validationCase: "CUSTOMREGEX",
        message: "Custome Regex Validations",
		isValid: '',
		Signature: new RegExp('/^[a-zA-z0-9\"\^!@#$%&*\\\/\(\)_,-.?+~\{\}\[\]]+$/')
    },*/
    {
		validationCase: "MAXMINLIMIT",
        message: "${Pwd_Rule_Length.RuleText}",
		isValid: '',
		maxLength:"${Pwd_Rule_Length.maxLength}",
		minLength:"${Pwd_Rule_Length.minLength}"
    }
];
	//::_::1
    $(document).ready(function () {
	citiResponsive.useOnBoa.initialize('createUserIdForm');
	$('#userID').mask();
	citiResponsive.utils.makeMaskedInputsReadable();
	citiResponsive.utils.PlaceHolderForIE('createUserIdForm','cbolui-placeHolder','btn btn-primary');
	//$('#password').val('');
   // $('#cbolui_onboard_confPassword').val('');
    if(primaryUserVal=="false"){
    	$('#userID').mask();
		citiResponsive.utils.makeMaskedInputsReadable();
		$('#cbolui-createUserCTA').removeClass('hidden');
		$('#cbolui-linkUserCTA').addClass('hidden');
	}
	else if(availabilityJson != '' && userIdListCheck!=null && userIdListCheck!=0){
		$('#cbolui_onboard_createUserRadio').attr("checked","checked");
		$('.createUserIdSection').removeClass('hidden');
		$('#userID').mask();
		citiResponsive.utils.makeMaskedInputsReadable();
		$('#cbolui-createUserCTA').removeClass('hidden');
		$('#cbolui-linkUserCTA').addClass('hidden');
	}
	else if(primaryUserVal=="true" && userIdListCheck!=null && userIdListCheck!=0){
		$('#existingUserId_0').attr("checked","checked");
		$('#dynamicTextBox_0').removeClass('hidden');
		$('#cbolui-createUserCTA').addClass('hidden');
		$('#cbolui-linkUserCTA').removeClass('hidden');
	}

	else{
		$('#userID').mask();
		citiResponsive.utils.makeMaskedInputsReadable();
		$('#cbolui-createUserCTA').removeClass('hidden');
		$('#cbolui-linkUserCTA').addClass('hidden');
	}
		
		//-----------------------Ids-------------------------------------------
		citiResponsive.passwordRuleMeter.passwordField = 'password';
		citiResponsive.passwordRuleMeter.userIdField = 'userID';
		citiResponsive.passwordRuleMeter.toolTipId = 'password_tooltip';
		citiResponsive.passwordRuleMeter.outerMsgHolderDiv = 'correctMsgDiv';
		//-----------------------Ids-------------------------------------------
		//-----------------------Containts-------------------------------------
		citiResponsive.passwordRuleMeter.errorText = '<jfp:cmout attribute="OnlAcc_PswrdGuide.TEXT" contentType="copy" appId="cbol_sec_useonboa"/>';
		citiResponsive.passwordRuleMeter.validStatusText = '<jfp:cmout attribute="OnlAcc_PswrdGuide.TEXT1" contentType="copy" appId="cbol_sec_useonboa"/>';
		citiResponsive.passwordRuleMeter.invalidStatusText = '<jfp:cmout attribute="OnlAcc_PswrdGuide.TEXT2" contentType="copy" appId="cbol_sec_useonboa"/>';
		citiResponsive.passwordRuleMeter.initialStatusText = '<jfp:cmout attribute="OnlAcc_PswrdGuide.NAME" contentType="copy" appId="cbol_sec_useonboa"/>';
		citiResponsive.passwordRuleMeter.rulesHeaderText = '<jfp:cmout attribute="OnlAcc_PswrdGuide.TEXT3" contentType="copy" appId="cbol_sec_useonboa"/>';
		//-----------------------Containts-------------------------------------
		//-----------------------Class-----------------------------------------
		citiResponsive.passwordRuleMeter.outerContainerClass = 'pull-left passwordRuleMeterToolTipBox';
		citiResponsive.passwordRuleMeter.innerContainerClass = 'col-md-12';
		citiResponsive.passwordRuleMeter.initialStatusTextCssClass = 'passwordRuleMeterToolTip-initialStatusText';
		citiResponsive.passwordRuleMeter.rulesHeaderTextCssClass = 'passwordRuleMeterToolTip-rulesHeaderText';
		citiResponsive.passwordRuleMeter.passwordRuleMeterToolTipMesseges = 'ToolTipMesseges';
		citiResponsive.passwordRuleMeter.passwordRuleMeterToolTipErrorMesseges = 'glyphicon glyphicon-remove pull-left';
		citiResponsive.passwordRuleMeter.passwordRuleMeterToolTipCorrectMesseges = 'glyphicon glyphicon-ok pull-left';
		//-----------------------Class-----------------------------------------
		citiResponsive.passwordRuleMeter.init();
		
		//citiResponsive.utils.attachTooltips('appBody')
		$('#switch-toggle').prop("checked","true");
		$("#paperLessComm").show();
		
		<s:if test="hasFieldErrors()">
		//hasError=true;
		<s:iterator  status="stat" value="fieldErrors" >                   
			var key='<s:property value="key"/>';
			var msg='<s:property value="value[0]"/>';
			/*if(key=='userID'){
				hasError=true;
			}*/
			userid= userIdonPage;
			var a=$("input[name=changeDurationRadio][value="+userid+"]").attr('checked', 'checked').trigger('change');
			if(a.length>0 && userIdonPage!='' && userIdonPage!='temporary'){
			userid= userIdonPage;
			$("input[name=changeDurationRadio][value="+userid+"]").attr('checked', 'checked');
			var checkSelected= $("#createUserIdForm input[type='radio']:checked").attr('id').split("_");
			var fieldId= "cbolui_onboard_existingPassword_"+checkSelected[1];
			key=fieldId;
			fieldErrorList.push({fieldId:key,error:msg}); 
			}
			else if(userIdonPage=='' && tempUserId==''){
			$("#cbolui_onboard_createUserRadio").attr('checked', 'checked').trigger('click');
			$('#cbolui-createUserCTA').removeClass('hidden');
			$('#cbolui-linkUserCTA').addClass('hidden');
			$('#password').val('');
			$('#correctMsgDiv').text('');
			$('#cbolui_onboard_confPassword').val('');
			fieldErrorList.push({fieldId:key,error:msg}); 
			}
			else if(userIdonPage=='temporary'){
			$("#cbolui_onboard_createUserRadio").attr('checked', 'checked').trigger('click');
			$('#cbolui-createUserCTA').removeClass('hidden');
			$('#cbolui-linkUserCTA').addClass('hidden');
			fieldErrorList.push({fieldId:key,error:msg}); 
			}
			else{
				$("#cbolui_onboard_createUserRadio").attr('checked', 'checked').trigger('click');
				$('#cbolui-createUserCTA').removeClass('hidden');
				$('#cbolui-linkUserCTA').addClass('hidden');
				$('#checkAvail').empty();
				//availabilityJson='';
				if(key!='stcCode'){
				//originalUserID='';
				//$('#userID').val('');
				$('#password').val('');
				$('#correctMsgDiv').text('');
				$('#cbolui_onboard_confPassword').val('');
				$('#userID').val(tempUserId);
			    $('#userIDMasked').trigger('focus');
				}
				fieldErrorList.push({fieldId:key,error:msg}); 
				}
		</s:iterator>  
		setTimeout(function(){
			citiResponsive.utils.renderFieldErrors(fieldErrorList);
		},0);
		
		</s:if>

		<s:if test="hasActionErrors()">
				if(primaryUserVal=="true"){
						var radioSelected= '<s:property value="context.useOnBoaSetUpUserIB.radioSelected"/>';
						var id= "existingUserId_"+radioSelected;
						$('#'+id).attr("checked","checked").trigger("change");
						$('#'+id).removeClass('hidden');
						if(isLinkFlow=="true"){
							$('#cbolui-createUserCTA').addClass('hidden');
							$('#cbolui-linkUserCTA').removeClass('hidden');
							}
							else{
							$('#cbolui-createUserCTA').removeClass('hidden');
							$('#cbolui-linkUserCTA').addClass('hidden');
							}
							if (paperlessSelection=="true") {
									$('#paperlessOption').prop("checked",true);
								}
				}
				else{
						$('#userID').val(tempUserId);
						$('#password').val(tempPwd);
						$('#cbolui_onboard_confPassword').val(tempPwd);
						$('#stcCode').val('');
				}
				</s:if>
		
    });
	//::_::2
</script>

<script id="addCheckClass" type="text/x-jQuery-tmpl">
  					<div class="" id="avalabilityOptionDisplay">
						<span id="availabilityMessage1" class="hidden" >
						<span id="userID-error-text1" class="validation-message-danger1">
						<span class="icon icon-error pull-left">Error</span>
						<span id="errorTextForAvail" class="contains-icon"></span>
						<span id="appendData"></span>
						</span>
						</span>
						
						<span id="availabilityMessage2" class="hidden" >
						<span id="userID-error-text2">
						<span class="glyphicon glyphicon-ok"></span>
						<span id="successMsg" class="greenSuccessMsg"></span>
						</span>
						</span>
						<div id="availabilityOptions" class="hidden">
							<ul class="cN-linkButton">
							</ul>
						</div>
					</div>  
</script>


<!-- ********************************* Site catalyst implementation starts ********* -->
<script>
 
<s:if test="context.flowFrom!=null && context.flowFrom!=''">
	var siteCatFlowFrom = '${context.flowFrom}';
	citiResponsive.useOnBoa.flowFrom = siteCatFlowFrom;
</s:if>
var prop1 = '${pageDef.WEB_ANALYTICS.prop1}';
var prop2 = '${pageDef.WEB_ANALYTICS.prop2}';
var events = '${pageDef.WEB_ANALYTICS.events}';
var eVar70 = '${pageDef.WEB_ANALYTICS.eVar70}';
citiResponsive.useOnBoa.pageName= 'onlineAccess';
citiResponsive.useOnBoa.prop1 = prop1;
citiResponsive.useOnBoa.prop2 = prop2;
citiResponsive.useOnBoa.events = events;
citiResponsive.useOnBoa.eVar70 = eVar70;
citiResponsive.useOnBoa.logSiteCatalyst();
		
</script>


<!-- ********************************* Site catalyst implementation ends ******* -->