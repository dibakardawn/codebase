const	MENUSELECTIONITEM = "supplier.php";
const	PAGEDOCNAME = appCommonFunctionality.getPageName();
let		COUNTRYPRECOMPILEDDATA = [];
let		SUPPLIERDATA = {};
let		ADDITIONALDATA = {};

$(document).ready(function(){
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	switch (PAGEDOCNAME) {
		
        case "supplier.php":{
			supplierFunctionality.initSupplier();
            break;
		}
		
        case "supplierEntry.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COUNTRY')
			).done(function(countryResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				supplierFunctionality.supplierEntry(countryResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
        case "supplierDetail.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COUNTRY')
			).done(function(countryResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				supplierFunctionality.supplierDetail(countryResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
    }
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const supplierFunctionality = (function (window, $) {
    const parent = {};
	
	parent.initSupplier = async function () {
		appCommonFunctionality.adjustMainContainerHight('supplierSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
	};
	
	parent.addSupplier = function(){
		window.location.replace('supplierEntry.php');
	};
	
	parent.editSupplier = function(){
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
		window.location.replace('supplierEntry.php?supplierId=' + supplierId);
	};
	
	parent.supplierEntry = async function (countryResponse) {
		appCommonFunctionality.adjustMainContainerHight('supplierSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		COUNTRYPRECOMPILEDDATA = JSON.parse(countryResponse);
		appCommonFunctionality.bindCountryDropdown('supplierCountry', 482);
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
		if(parseInt(supplierId) > 0){
			appCommonFunctionality.ajaxCall('GETSUPPLIERDATA&supplierId=' + supplierId, bindSupplierData, "POST", "", true, true);
		}
		if(appCommonFunctionality.isMobile()){
			$('#supplierName, #supplierTown, #supplierPostCode, #supplierContactNo, #supplierEmail, #bankName, #SWIFT, #supplierVat, #IEC, #PAN, #REX').parent().parent().removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
		}
	};
	
	const bindSupplierData = function(supplierData){
		appCommonFunctionality.hideLoader();
		SUPPLIERDATA = JSON.parse(supplierData)?.msg?.[0];
		const additionalDataObj = JSON.parse(decodeURI(window.atob(SUPPLIERDATA.additionalData)));
		const finalAdditionalDataObj = additionalDataObj?.paymentInformation || "[]";
		ADDITIONALDATA = finalAdditionalDataObj;
		if(PAGEDOCNAME === 'supplierEntry.php'){
			$('#supplierName').val(SUPPLIERDATA?.supplierName);
			$('#supplierContactPerson').val(SUPPLIERDATA?.supplierContactPerson);
			$('#supplierAddress').val(SUPPLIERDATA?.supplierAddress);
			$('#supplierTown').val(SUPPLIERDATA?.supplierTown);
			$('#supplierPostCode').val(SUPPLIERDATA?.supplierPostCode);
			$('#supplierCountry').val(SUPPLIERDATA?.supplierCountry);
			$('#supplierCountry').trigger('onchange');
			let supplierContactArr = SUPPLIERDATA?.supplierContactNo.split(' ')
			$('#supplierContactNo').val(supplierContactArr[1]);
			$('#supplierEmail').val(SUPPLIERDATA?.supplierEmail);
			$('#supplierFax').val(SUPPLIERDATA?.supplierFax);
			if (finalAdditionalDataObj !== null) {
				$('#bankName').val(ADDITIONALDATA?.bankName);
				$('#accountNo').val(ADDITIONALDATA?.accountNo);
				$('#bankAddress').val(ADDITIONALDATA?.bankAddress);
				$('#SWIFT').val(ADDITIONALDATA?.SWIFT);
				$('#supplierVat').val(ADDITIONALDATA?.supplierVat);
				$('#GSTIN').val(ADDITIONALDATA?.GSTIN);
				$('#IEC').val(ADDITIONALDATA?.IEC);
				$('#PAN').val(ADDITIONALDATA?.PAN);
				$('#REX').val(ADDITIONALDATA?.REX);
				$('#ARN').val(ADDITIONALDATA?.ARN);
			}
		}else if(PAGEDOCNAME === 'supplierDetail.php'){
			appCommonFunctionality.showLoader();
			let str = '';
			setTimeout(function() {
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(454) + ' </b>';
					str = str + SUPPLIERDATA?.supplierName;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(456) + ' </b>';
					str = str + SUPPLIERDATA?.supplierContactPerson;
				str = str + '</div>';
				str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(458) + ' </b>';
					str = str + SUPPLIERDATA?.supplierAddress;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(460) + ' </b>';
					str = str + SUPPLIERDATA?.supplierTown;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(462) + ' </b>';
					str = str + SUPPLIERDATA?.supplierPostCode;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(486) + ' </b>';
					str = str + appCommonFunctionality.getCountryName(SUPPLIERDATA?.supplierCountry, true);
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(464) + ' </b>';
					str = str + SUPPLIERDATA?.supplierContactNo;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>Email : </b>';
					str = str + '<a href="mailto:' + SUPPLIERDATA?.supplierEmail + '">' + SUPPLIERDATA?.supplierEmail + '</a>';
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>FAX : </b>';
					str = str + SUPPLIERDATA?.supplierFax;
				str = str + '</div>';
				$('#supplierBasicData').html(str);
					
				str = '';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(468) + ' </b>';
					str = str + ADDITIONALDATA?.bankName;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(470) + ' </b>';
					str = str + ADDITIONALDATA?.accountNo;
				str = str + '</div>';
				str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>' + appCommonFunctionality.getCmsString(472) + ' </b>';
					str = str + ADDITIONALDATA?.bankAddress;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>SWIFT : </b>';
					str = str + ADDITIONALDATA?.SWIFT;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>VAT : </b>';
					str = str + ADDITIONALDATA?.supplierVat;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>GST : </b>';
					str = str + ADDITIONALDATA?.GSTIN;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>IEC : </b>';
					str = str + ADDITIONALDATA?.IEC;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>PAN :</b>';
					str = str + ADDITIONALDATA?.PAN;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>REX : </b>';
					str = str + ADDITIONALDATA?.REX;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>ARN : </b>';
					str = str + ADDITIONALDATA?.ARN;
				str = str + '</div>';
				str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					str = str + '<b>ARN : </b>';
					str = str + ADDITIONALDATA?.ARN;
				str = str + '</div>';
				$('#supplierFinancialData').html(str);
				appCommonFunctionality.hideLoader();
			}, LOADTIME);
		}
	};
	
	parent.changeCountry = function(){
		const selectedOptionId = $('#supplierCountry option:selected').attr('id');
        if (selectedOptionId.includes('_')) return;
        $("#flagImg").attr('src', COUNTRYFLAGURL + selectedOptionId.toLowerCase() + '.png');
		
        COUNTRYPRECOMPILEDDATA.forEach(data => {
            if (data.countryCode === selectedOptionId) {
                $("#supplierContactNoExtension").text(data.telePhoneExt);
            }
        });
	};
	
	parent.checkEmailAvilable = function(){
		var supplierEmail = $("#supplierEmail").val();
		if (supplierEmail === "") {
			appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(483), true);
			$("#supplierEmail").focus();
		}else if(supplierEmail !== ""){
			var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			if (!regex.test(supplierEmail)){
				appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(483), true);
				$("#supplierEmail").focus();
			}else{
				appCommonFunctionality.removeValidation("supplierEmail", "supplierEmail", true);
				appCommonFunctionality.ajaxCall('CHECKSUPPLIEREMAILEXISTS&supplierEmail=' + supplierEmail, responseCheckEmailAvilable, "POST", "", true, true);
			}
		}else {
			appCommonFunctionality.removeValidation("supplierEmail", "supplierEmail", true);
			appCommonFunctionality.ajaxCall('CHECKSUPPLIEREMAILEXISTS?supplierEmail=' + supplierEmail, responseCheckEmailAvilable, "POST", "", true, true);
		}
	};
	
	const responseCheckEmailAvilable = function(response){
		$('#emailInfoIcon').addClass('hide');
		response = JSON.parse(response);
		if(parseInt(response.responseCode) === 1){
			$('#emailOkIcon').removeClass('hide');
			$('#emailCrossIcon').addClass('hide');
		}else{
			appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(485), true);
			$('#emailOkIcon').addClass('hide');
			$('#emailCrossIcon').removeClass('hide');
		}
	};
	
	parent.saveSupplier = function(){
		if(validateSupplierEntry()){
			const paymentInformation = {
				bankName : $('#bankName').val(),
				accountNo : $('#accountNo').val(),
				bankAddress : $('#bankAddress').val(),
				SWIFT : $('#SWIFT').val(),
				supplierVat : $('#supplierVat').val(),
				GSTIN : $('#GSTIN').val(),
				IEC : $('#IEC').val(),
				PAN : $('#PAN').val(),
				REX : $('#REX').val(),
				ARN : $('#ARN').val()
			};
			const additionalData = {
				paymentInformation : paymentInformation
			};
			const supplierData = {
                supplierId: parseInt($("#supplierId").val()),
                supplierName: $("#supplierName").val(),
                supplierContactPerson: $("#supplierContactPerson").val(),
                supplierAddress: $("#supplierAddress").val(),
                supplierTown: $("#supplierTown").val(),
                supplierPostCode: $("#supplierPostCode").val(),
                supplierCountry: $("#supplierCountry").val(),
                supplierContactNo: $("#supplierContactNoExtension").text() + ' ' + $("#supplierContactNo").val(),
                supplierEmail: $("#supplierEmail").val(),
                supplierFax: $("#supplierFax").val(),
                additionalData: window.btoa(encodeURI(JSON.stringify(additionalData))),
				status : 1,
				selectedLang: $('#languageDDL').val() ? $('#languageDDL').val() : 'en'
            };
            appCommonFunctionality.ajaxCallLargeData('SAVESUPPLIER', supplierData, receiveResponseAfterSaveSupplierData);
		}
	};
	
	const validateSupplierEntry = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Supplier Name Validation----------------------------------------*/
		var supplierName = $("#supplierName").val();
		if (supplierName === "") {
			appCommonFunctionality.raiseValidation("supplierName", appCommonFunctionality.getCmsString(455), true);
			$("#supplierName").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("supplierName", "supplierName", true);
		}
		/*----------------------------------------------------Supplier Name Validation----------------------------------------*/
		
		/*----------------------------------------------------Supplier Contact Person Validation------------------------------*/
		var supplierContactPerson = $("#supplierContactPerson").val();
		if (supplierContactPerson === "") {
			appCommonFunctionality.raiseValidation("supplierContactPerson", appCommonFunctionality.getCmsString(457), true);
			$("#supplierContactPerson").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("supplierContactPerson", "supplierContactPerson", true);
		}
		/*----------------------------------------------------Supplier Contact Person Validation------------------------------*/
		
		/*----------------------------------------------------Supplier Address Validation-------------------------------------*/
		var supplierAddress = $("#supplierAddress").val();
		if (supplierAddress === "") {
			appCommonFunctionality.raiseValidation("supplierAddress", appCommonFunctionality.getCmsString(459), true);
			$("#supplierAddress").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("supplierAddress", "supplierAddress", true);
		}
		/*----------------------------------------------------Supplier Address Validation-------------------------------------*/
		
		/*----------------------------------------------------Supplier Town Validation----------------------------------------*/
		var supplierTown = $("#supplierTown").val();
		if (supplierTown === "") {
			appCommonFunctionality.raiseValidation("supplierTown", appCommonFunctionality.getCmsString(461), true);
			$("#supplierTown").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("supplierTown", "supplierTown", true);
		}
		/*----------------------------------------------------Supplier Town Validation----------------------------------------*/
		
		/*----------------------------------------------------Supplier PostCode Validation------------------------------------*/
		var supplierPostCode = $("#supplierPostCode").val();
		if (supplierPostCode === "") {
			appCommonFunctionality.raiseValidation("supplierPostCode", appCommonFunctionality.getCmsString(463), true);
			$("#supplierPostCode").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("supplierPostCode", "supplierPostCode", true);
		}
		/*----------------------------------------------------Supplier PostCode Validation------------------------------------*/
		
		/*----------------------------------------------------Supplier Country Validation-------------------------------------*/
		var supplierCountry = $("#supplierCountry").val();
		if (supplierCountry === "") {
			appCommonFunctionality.raiseValidation("supplierCountry", appCommonFunctionality.getCmsString(484), true);
			$("#supplierCountry").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("supplierCountry", "supplierCountry", true);
		}
		/*----------------------------------------------------Supplier Country Validation-------------------------------------*/
		
		/*----------------------------------------------------Supplier ContactNo Validation-----------------------------------*/
		var supplierContactNo = $("#supplierContactNo").val().replace(/[^0-9 +]/gi,'');
		if (supplierContactNo === "") {
			appCommonFunctionality.raiseValidation("supplierContactNo", appCommonFunctionality.getCmsString(465), true);
			$("#supplierContactNo").focus();
			errorCount++
		}else if(supplierContactNo.length < 9){
			appCommonFunctionality.raiseValidation("supplierContactNo", appCommonFunctionality.getCmsString(465), true);
			$("#supplierContactNo").focus();
			errorCount++
		}else if(supplierContactNo.length > 17){
			appCommonFunctionality.raiseValidation("supplierContactNo", appCommonFunctionality.getCmsString(465), true);
			$("#supplierContactNo").focus();
			errorCount++
		}else {
			appCommonFunctionality.removeValidation("supplierContactNo", "supplierContactNo", true);
		}
		/*----------------------------------------------------Supplier ContactNo Validation----------------------------------*/
		
		/*----------------------------------------------------Supplier Email Validation--------------------------------------*/
		var supplierEmail = $("#supplierEmail").val();
		if (supplierEmail === "") {
			appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(483), true);
			$("#supplierEmail").focus();
			errorCount++
		}else if(supplierEmail !== ""){
			var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			if (!regex.test(supplierEmail)){
				appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(483), true);
				$("#supplierEmail").focus();
				errorCount++
			}else{
				appCommonFunctionality.removeValidation("supplierEmail", "supplierEmail", true);
			}
		}else {
			appCommonFunctionality.removeValidation("supplierEmail", "supplierEmail", true);
		}
		/*----------------------------------------------------Supplier Email Validation--------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const receiveResponseAfterSaveSupplierData = function(responseData){
		responseData = JSON.parse(responseData);
		if(parseInt(responseData.supplierId) > 0){
			supplierFunctionality.gotoSupplierDetail(responseData.supplierId);
		}
	};
	
	parent.supplierDetail = async function (countryResponse) {
		appCommonFunctionality.adjustMainContainerHight('supplierSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		COUNTRYPRECOMPILEDDATA = JSON.parse(countryResponse);
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
		if(parseInt(supplierId) > 0){
			appCommonFunctionality.ajaxCall('GETSUPPLIERDATA&supplierId=' + supplierId, bindSupplierData, "POST", "", true, true);
		}
	};
	
	parent.gotoSupplier = function(){
		window.location.replace('supplier.php');
	};
	
	parent.gotoSupplierDetail = function(supplierId){
		window.location.replace('supplierDetail.php?supplierId=' + supplierId);
	};
	
	parent.openSupplierSignatureModal = function(){
		$('#signatureModal').modal('show');
        setTimeout(function() {
            if ($("#signatureModal").length > 0) {
                const signatureCanvasW = $('#signatureCanvas').width();
                const winH = screen.height;
                $("#signatureCanvas").html(`<canvas id='signature' width='${(signatureCanvasW * 98 / 100)}px' height='${(winH * 50 / 100)}px'></canvas>`);
                const canvas = document.getElementById("signature");
                const signaturePad = new SignaturePad(canvas);
            }
        }, LOADTIME);
	};
	
	parent.processSupplierSignature = function() {
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
        const canvas = document.getElementById("signature");
        $('#signatureModal').modal('hide');
		$("#supplierSignBase64").val(canvas.toDataURL());
		const supplierSignData = {
			supplierId: supplierId,
			supplierSignData: $("#supplierSignBase64").val()
		};
		appCommonFunctionality.ajaxCallLargeData('SUPPLIERSIGNATURE', supplierSignData, appCommonFunctionality.reloadPage);
    };
	
	parent.deleteSupplierSignature = function(){
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
		if(parseInt(supplierId) > 0){
			 appCommonFunctionality.ajaxCall('DELETESUPPLIERSIGNATURE&supplierId=' + supplierId, appCommonFunctionality.reloadPage);
		}
	};
	
	parent.createPurchaseOrder = function(){
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
		if(parseInt(supplierId) > 0){
			window.location.replace('purchaseOrderInput.php?supplierId=' + supplierId);
		}
	};
	
	parent.searchPurchaseOrder = function(){
		const supplierId = appCommonFunctionality.getUrlParameter('supplierId') ?? 0;
		if(parseInt(supplierId) > 0){
			window.location.replace('purchaseOrders.php?supplierId=' + supplierId);
		}
	};
	
	return parent;
}(window, window.$));