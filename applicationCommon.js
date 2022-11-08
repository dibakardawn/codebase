LOADTIME = 1000;
AJAXTIMEOUT = 36000000;
MAXMOBILEWIDTHSUPPORT = 736;

PROJECTPATH = 'http://aa1baaron.de/';
APIPATH = PROJECTPATH + 'api/api.php?ACTION='
ALLOWEDEXTENSIONS = ['jpg', 'jpeg', 'png'];
CUSTREGFORMALLOWEDEXTENSIONS = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];
PRODUCTIMAGEURL = 'uploads/products/';
LENGTHOFBARCODE = 13;
BARCODEPREFIX = '42606805';
MOBMENUOPENED = false;
CARTORDERS = [];
ORDER = {'productId' : 0, 'productTitle' : '', 'products' : [], 'productPrice' : 0, 'cartonUnitQuantity' : 0, 'tax' : 0};
ORDERFORMED = false;
OTPLENGTH = 6;
ORDERTYPES = [
	[0, 'PLACED', 'Order Placed', 'Bestellung aufgegeben'],
	[1, 'APPROVED', 'Order Approved', 'Bestellung genehmigt'],
	[2, 'PACKED', 'Order Packed', 'Bestellung verpackt'],
	[3, 'SHIPPED', 'Order Shipped', 'Bestellung versandt'],
	[4, 'DELIVERED', 'Order Delivered', 'Bestellung geliefert'],
	
	[11, 'CANCELLED1', 'Order Cancelled by Admin', 'Bestellung vom Admin storniert'],
	[12, 'CANCELLED2', 'Order Cancelled by You', 'Bestellung von Ihnen storniert'],
	[13, 'SPLITTED', 'Order Splitted', 'Auftrag aufgeteilt']
];
LANGDATA = '';

$(document).ready(function() {
	var urlParts = appCommonFunctionality.allElementsFromUrl();
	if(urlParts[3] === '' || urlParts[3].startsWith("#")){
		appCommonFunctionality.productScroller();
		appCommonFunctionality.productCollectionDescSlider();
		if(appCommonFunctionality.isMobile()){
			$('#contactAddress').addClass('nopaddingOnly');
			$('.img-list img').css('height', $('.img-list img').width() + 'px');
			$('.bannerImg').addClass('bannerImgMob').removeClass('bannerImg');
		}
		$("#contactSndMsgBtn").on('click', function(e){
			if(appCommonFunctionality.contactFormValidation()){
				appCommonFunctionality.sendContactMailtoAdmin();
			}
		});
	}else if(urlParts[3] === 'login'){
		appCommonFunctionality.loginEvents();
		appCommonFunctionality.otpEvents();
	}else if(urlParts[3] === 'products'){
		var individualProductHeight = window.innerHeight - $('#navbar').height() - $('#footer').height() - 22; //22 is padding & margin
		$('.productBody').css('min-height', individualProductHeight + 'px');
		if(appCommonFunctionality.isMobile()){
			$('#headerText, #productItems').addClass('nopaddingOnly f18').removeClass('f33 lh56');
			$('.H250').removeClass('H250');
			$('.carouselHolder').css("min-height", "auto");
		}else{
			$('#headerText, #productItems').addClass('f33 lh56').removeClass('nopaddingOnly f18');
			$('.carouselHolder').removeClass('carouselHolder').addClass('carouselHolderDesk');
		}
	}else if(urlParts[3] === 'productDetails'){
		appCommonFunctionality.placeProductDesc();
		//appCommonFunctionality.placeOrder();
		appCommonFunctionality.storeOrderItems();
		appCommonFunctionality.poplulateBarCodes();
		if(appCommonFunctionality.isMobile()){
			$('.carouselHolder').removeClass('carouselHolder').addClass('carouselHolderMob');
		}
	}else if(urlParts[3] === 'orders'){
		appCommonFunctionality.callOrders();
	}else if(urlParts[3] === 'orderDetails'){
		appCommonFunctionality.callOrderDetails(urlParts[4]);
	}else if(urlParts[3] === 'cart'){
		appCommonFunctionality.populateCart();
	}else if(urlParts[3] === 'magazine'){
		appCommonFunctionality.populateMagazine();
	}
	
	if(appCommonFunctionality.isMobile()){
		appCommonFunctionality.toggleMobileMenu();
		$('.hamburgerMenu, .mobMenu').on('click', function(e){
			appCommonFunctionality.toggleMobileMenu();
		});
		$('.lang').removeClass('w3-right').addClass('w3-right');
	}
	
	if(appCommonFunctionality.getLang() === null){
		appCommonFunctionality.setLang('eng'); //setting default Langulage as English
	}
	if($("#langData").length > 0){
		if($("#langData").val().length > 0){
			LANGDATA = JSON.parse($("#langData").val().replace(/'/g, '"'));
		}
	}
	appCommonFunctionality.toggleHeaderLangFlag(false);
	appCommonFunctionality.adjustFrontEndHeight();
});

appCommonFunctionality = (function(window, $) {

    /*---------------------------------------------------Common Functionality-------------------------------------*/
	parent.w3_open = function(){
		var mySidebar = $("#mySidebar");
		var overlayBg = $("#myOverlay");
		if (mySidebar.css('display') === 'block') {
			mySidebar.css('display', 'none');
			overlayBg.css('display', 'none');
		} else {
			mySidebar.css('display', 'block');
			overlayBg.css('display', 'block');
		}
	},
	
	parent.w3_close = function(){
		var mySidebar = $("#mySidebar");
		var overlayBg = $("#myOverlay");
		mySidebar.css('display', 'none');
		overlayBg.css('display', 'none');
	},
	
	parent.isMobile = function() {
		var isMobileView = false;
		if (window.outerWidth <= MAXMOBILEWIDTHSUPPORT) {
			isMobileView = true;
		}
		return isMobileView;
	}

	parent.shapeString = function(str, i) {
		if (str.length > i) {
			str = str.substring(0, i);
		}
		return str;
	},

	parent.ObjectLength = function(object) {
		var length = 0;
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				++length;
			}
		}
		return length;
	},
	
	parent.makeArrayUnique = function(realArr){
		var uniqueChars = [];
		realArr.forEach((c) => {
			if (!uniqueChars.includes(c)) {
				uniqueChars.push(c);
			}
		});
		return uniqueChars;
	},
	
	parent.findDuplicateArrayElements = function(arr){
		var sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
		// JS by default uses a crappy string compare.
		// (we use slice to clone the array so the
		// original array won't be modified)
		var results = [];
		for (var i = 0; i < sorted_arr.length - 1; i++) {
			if (sorted_arr[i + 1] == sorted_arr[i]) {
				results.push(sorted_arr[i]);
			}
		}
		return results;
	}

	parent.allElementsFromUrl = function() {
		var url = window.location.href;
		var paramArr = url.split('/');
		return paramArr;
	},

	parent.lastElementFromUrl = function() {
		var url = window.location.href;
		var paramArr = url.split('/');
		var pagenameUrl = paramArr[paramArr.length - 1];
		return pagenameUrl;
	},
	
	parent.getPageName = function(){
		return location.pathname.split('/').slice(-1)[0];
	},
	
	parent.getUrlParameter = function(sParam){
		var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

		for (i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
			}
		}
		return false;
	},
	
	parent.showPomptMsg = function(msg) {
		var pomptMsgH = 72;
		var pomptMsgW = 240;
		$('body').addClass("makeHazy").append("<div id='pomptMsg' class='pomptMsg' style='width:" + pomptMsgW + "px; height:" + pomptMsgH + "px;'>" + msg + "</div>");
		var leftSpace = (($(window).width()/2) - (pomptMsgW/2));
		var topSpace = (($(window).height()/2) - (pomptMsgH/2));
		$("#pomptMsg").css("position", "fixed").css("left", leftSpace).css("top", topSpace).css("z-index", 9999);
		var pomptMsgIntervalId = window.setInterval(function() {
			$('body').removeClass("makeHazy");
			$("#pomptMsg").remove();
			clearInterval(pomptMsgIntervalId);
		}, 1000);
	},
	
	parent.showLoder = function() {
		var loaderWH = 100;
		$('body').addClass("makeHazy").append("<img id='loadingImg' src='" + PROJECTPATH + "assets/images/loading.svg' style='width:" + loaderWH + "px; height:" + loaderWH + "px;'>");
		var leftSpace = (($(window).width()/2) - (loaderWH/2));
		var topSpace = (($(window).height()/2) - (loaderWH/2));
		$("#loadingImg").css("position", "fixed").css("left", leftSpace).css("top", topSpace).css("z-index", 9999);
	},

	parent.hideLoder = function() {
		$('body').removeClass("makeHazy");
		$("#loadingImg").remove();
	},
	
	parent.raiseValidation = function(inputId, validationText, appendWithParent) {
		var inputObj = "";
		if(appendWithParent){
			inputObj = $("#" + inputId).parent();
		}else{
			inputObj = $("#" + inputId);
		}
		if (!inputObj.hasClass("validationError")) {
			inputObj.addClass("validationError");
			if (!isMobile()) {
				if (validationText !== "") {
					inputObj.after("<div id='" + inputId + "_validationText' class='redText'>" + validationText + "</div>");
				}
			} else {
				$("#alertMessege .msgContent").html(validationText);
				$("#alertMessege").show();
			}
		} else {
			if ($("#" + inputId + "_validationText").length > 0) {
				$("#" + inputId + "_validationText").remove();
				if (validationText !== "") {
					inputObj.after("<div id='" + inputId + "_validationText' class='redText'>" + validationText + "</div>");
				}
			}
		}
	},
	
	parent.removeValidation = function(selector, inputId, detachWithParent) {
		var inputObj = "";
		if(detachWithParent){
			inputObj = $("#" + selector).parent();
		}else{
			inputObj = $("#" + selector);
		}
		if (inputObj.hasClass("validationError")) {
			inputObj.removeClass("validationError");
			if (!isMobile()) {
				if ($("#" + inputId + "_validationText").length > 0) {
					$("#" + inputId + "_validationText").remove();
				}
			} else {
				$("#alertMessege .msgContent").html("");
				$("#alertMessege").hide();
			}

		}
	},
	
	parent.emailRegexValidation = function(emailId) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailId)){
			return (true)
		}else{
			return false;
		}
	},
	
	parent.capitalizeFirstLetter = function(str){
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	
	parent.startTimer = function(duration, display){
		var timer = duration, minutes, seconds;
		setInterval(function () {
			minutes = parseInt(timer / 60, 10);
			seconds = parseInt(timer % 60, 10);

			minutes = minutes < 10 ? "0" + minutes : minutes;
			seconds = seconds < 10 ? "0" + seconds : seconds;

			display.text(minutes + ":" + seconds);

			if (--timer < 0) {
				timer = duration;
			}
		}, 1000);
	},
	
	parent.addZeroesToNumber = function(str, max){
		str = str.toString();
		return str.length < max ? addZeroesToNumber("0" + str, max) : str;
	},
	
	parent.socialShare = function(Title, URL, desc){
		if(typeof navigator.share==='undefined' || !navigator.share){
			//alert('Your browser does not support Android Native Share');
			if(appCommonFunctionality.isMobile()){
				window.open('whatsapp://send?text=' + Title + ' - ' + URL, '_blank');
			}else{
				window.open('https://web.whatsapp.com//send?text=' + Title + ' - ' + URL, '_blank');
			}
		} else {
			try{
				//alert('Title : ' + Title + ' | URL : ' + URL); // test for mobile device
				navigator.share({title:Title, text:desc, url:URL});
			} catch (error) {
				console.log('Error sharing: ' + error);
				return;
			}   
		}
	},
	/*---------------------------------------------------Common Functionality-------------------------------------*/
	
	/*---------------------------------------------------Front Functionality-------------------------------------*/
	
	parent.ajaxCall = function(qryStr, callback) {
		$.ajax({
			type: "GET",
			url: APIPATH + qryStr,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function(xhr) {
				showLoder();
			},
			success: function(data) {
				//alert(JSON.stringify(data));
				hideLoder();
				callback(data);
			},
			error: function(xhr, status, error) {
				//alert(JSON.stringify(xhr));
				hideLoder();
			}
		});
	},
	
	parent.fileUploadAjaxCall = function(qryStr, fieldName, callback) {
		var fd = new FormData();
        var files = $('#' + fieldName)[0].files;
        if(files.length > 0 ){
           fd.append('file',files[0]);
		   $.ajax({
				type: "POST",
				url: APIPATH + qryStr,
				data: fd,
				timeout: AJAXTIMEOUT,
				contentType: false,
				processData: false,
				beforeSend: function(xhr) {
					showLoder();
				},
				success: function(data) {
					//alert(JSON.stringify(data));
					hideLoder();
					callback(data);
				},
				error: function(xhr, status, error) {
					//alert(JSON.stringify(xhr));
					hideLoder();
				}
			});
		}
	},
	
	parent.generatImageAjaxCall = function(qryStr, base64DataUrl, callback) {
		debugger;
        if(qryStr.length > 0 && base64DataUrl.length > 0){
		   $.ajax({
				type: "POST",
				url: APIPATH + qryStr,
				data:{ 
					 image: base64DataUrl
				},
				timeout: AJAXTIMEOUT,
				contentType: false,
				processData: false,
				beforeSend: function(xhr) {
					showLoder();
				},
				success: function(data) {
					debugger;
					//alert(JSON.stringify(data));
					hideLoder();
					callback(data);
				},
				error: function(xhr, status, error) {
					//alert(JSON.stringify(xhr));
					hideLoder();
				}
			});
		}
	},
	
	parent.adjustMainContainerHight = function(mainSectionId){ // Admin use only
		var winH = $(window).height();
		var mainSectionH = winH - 54 - 48 - 85; /* Header  :: 54px ; Footer :: 48px; Over all Margin & Padding :: 85;*/
		$("#" + mainSectionId).css("min-height", mainSectionH + "px");
	},
	
	parent.adjustFrontEndHeight = function(){ //Front End Use only
		var headerHeader = $('#navbar').height();
		var footerHeader = $('#footer').height();
		var siteBodyMinHeight = (window.innerHeight - (headerHeader + footerHeader));
		$('.siteBody').css('min-height', siteBodyMinHeight + 'px');
	},
	
	parent.toggleMobileMenu = function(){
		if(MOBMENUOPENED){
			$('.hamburgerMenu').html('<span class="glyphicon glyphicon-remove white f33"></span>');
			$('.mobMenuHolder').removeClass('hide');
		}else{
			$('.hamburgerMenu').html('<span class="glyphicon glyphicon-menu-hamburger white f33"></span>');
			$('.mobMenuHolder').addClass('hide');
		}
		MOBMENUOPENED = !MOBMENUOPENED;
	},
	
	parent.menuClick = function(scrolDivId){
		$('.mobMenuHolder').click();
		if(scrolDivId === 'myCarousel'){
			if(window.location.href === PROJECTPATH){
				$('html, body').animate({
					scrollTop: 0
				}, 1000);
			}else{
				window.location.href = PROJECTPATH;
			}
		}else if(scrolDivId === 'login'){
			window.location.href = PROJECTPATH + 'login';
		}else if(scrolDivId === 'orders'){
			window.location.href = PROJECTPATH + 'orders';
		}else if(scrolDivId === 'cart'){
			window.location.href = PROJECTPATH + 'cart';
		}else if(scrolDivId === 'notice'){
			window.location.href = PROJECTPATH + 'notice';
		}else if(scrolDivId === 'logout'){
			appCommonFunctionality.customerLogout();
		}else{
			if(window.location.href === PROJECTPATH){
				$('html, body').animate({
					scrollTop: $("#" + scrolDivId).offset().top - $('#navbar').height()
				}, 1000);
			}else{
				window.location.href = PROJECTPATH + '#' + scrolDivId;
			}
		}
	},
	
	parent.toggleHeaderLangFlag = function(i){
		if(getLang() === 'eng'){
			$('#lang').html('<img src="' + PROJECTPATH + 'assets/images/gem-icon.png" alt="eng" class="w100p hover marLeft5" onClick="appCommonFunctionality.toggleHeaderLangFlag(true)">');
			if(i){ setLang('gem'); }
		}else if(getLang() === 'gem'){
			$('#lang').html('<img src="' + PROJECTPATH + 'assets/images/eng-icon.png" alt="gem" class="w100p hover marLeft5" onClick="appCommonFunctionality.toggleHeaderLangFlag(true)">');
			if(i){ setLang('eng'); }
		}
		
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	},
	
	parent.getCmsString = function(cmsId){
		var cmsText = '';
		for(var i = 0; i < LANGDATA.length; i++){
			if(parseInt(LANGDATA[i].cmsId) === cmsId){
				if(getLang() === 'eng'){
					cmsText = LANGDATA[i].content_en;
				}else if(getLang() === 'gem'){
					cmsText = LANGDATA[i].content_gm;
				}
			}
		}
		return cmsText;
	},
	
	parent.cmsImplementationThroughID = function(){
		//CMS implemented through ID
		$("[id^=cms_]").each(function(e){
			var objectArr = this.id.split("_");
			var cmsId = parseInt(objectArr[1]);
			for(var i = 0; i < LANGDATA.length; i++){
				if(parseInt(LANGDATA[i].cmsId) === cmsId){
					if(getLang() === 'eng'){
						this.innerText = LANGDATA[i].content_en;
					}else if(getLang() === 'gem'){
						this.innerText = LANGDATA[i].content_gm;
					}
				}
			}
		});
		//CMS implemented through ID
	},
	
	parent.cmsImplementationThroughRel = function(){
		//CMS implemented through rel, cant use id
		$("[rel^=cms_]").each(function(e){
			var objectArr = this.attributes.rel.value.split("_");
			var cmsId = parseInt(objectArr[1]);
			for(var i = 0; i < LANGDATA.length; i++){
				if(parseInt(LANGDATA[i].cmsId) === cmsId){
					var typeofinput = this.attributes.type.nodeValue;
					if(getLang() === 'eng'){
						if(typeofinput === 'text'){
							this.placeholder = LANGDATA[i].content_en;
						}else if(typeofinput === 'button'){
							this.innerText = LANGDATA[i].content_en;
						}
					}else if(getLang() === 'gem'){
						if(typeofinput === 'text'){
							this.placeholder = LANGDATA[i].content_gm;
						}else if(typeofinput === 'button'){
							this.innerText = LANGDATA[i].content_gm;
						}
					}
				}
			}
		});
		//CMS implemented through rel, cant use id
	},
	
	parent.setLang = function(lang){
		localStorage.setItem('lang', lang);
	},
	
	parent.getLang = function(){
		return localStorage.getItem("lang");
	},
	
	parent.gotoProducts = function(){
		window.location.href = PROJECTPATH + 'products';
	},
	
	parent.productScroller = function(){
		if($("#scroller").length){
			$("#scroller").simplyScroll({
			  speed: 1
			});
			$(".productScrollerImage").on('click', function(e){
				window.location.href = PROJECTPATH + 'login';
			});
		}
	},
	
	parent.contactFormValidation = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Contact Name Validation----------------------------------------*/
		var name = $("#name").val().replace(/[^a-z0-9 ]/gi,'');
		$("#name").val(name);
		if (name === "") {
			appCommonFunctionality.raiseValidation("name", "", false);
			$("#name").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("name", "name", false);
		}
		/*----------------------------------------------------Contact Name Validation----------------------------------------*/
		
		/*----------------------------------------------------Contact Email Validation---------------------------------------*/
		var email = $("#email").val();
		if (email === "") {
			appCommonFunctionality.raiseValidation("email", "", false);
			$("#email").focus();
			errorCount++
		}else if(email !== ""){
			var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			if (!regex.test(email)){
				appCommonFunctionality.raiseValidation("email", "", false);
				$("#email").focus();
				errorCount++
			}else{
				appCommonFunctionality.removeValidation("email", "email", false);
			}
		}else {
			appCommonFunctionality.removeValidation("email", "email", false);
		}
		/*----------------------------------------------------Contact Email Validation---------------------------------------*/
		
		/*----------------------------------------------------Contact Comment Validation-------------------------------------*/
		var comment = $("#comment").val().replace(/[^a-z0-9 ]/gi,'');
		$("#comment").val(comment);
		if (comment === "") {
			appCommonFunctionality.raiseValidation("comment", "", false);
			$("#comment").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("comment", "comment", false);
		}
		/*----------------------------------------------------Contact Comment Validation-------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	},
	
	parent.sendContactMailtoAdmin = function(){
		var name = $("#name").val().replace(/[^a-z0-9 ]/gi,'');
		var email = $("#email").val();
		var comment = $("#comment").val().replace(/[^a-z0-9 ]/gi,'');
		var qryStr = APIPATH + "CONTACT&name=" + name + "&email=" + email + "&comment=" + comment;
		appCommonFunctionality.ajaxCall(qryStr, contactFormResponseReceiver);
	},
	
	parent.contactFormResponseReceiver = function(data){
		$("#name, #email, #comment").val('');
		appCommonFunctionality.showPomptMsg(appCommonFunctionality.getCmsString(112));
	},
	
	parent.productCollectionDescSlider = function(){
		if($("[id^=productCollectionDescHdn_]").length > 0){
			$("[id^=productCollectionDescHdn_]").each(function() {
				$('#' + this.id.replace('Hdn', '')).html(decodeURI(window.atob($('#' + this.id).val())));
			});
		}
	},
	
	parent.placeProductDesc = function(){
		if($("#productDescActual").length > 0 && $("#productDesc").length > 0){
			$("#gotoAllProducts").on('click', function(e){
				window.location.href = PROJECTPATH + 'products';
			});
			$("#productDescActual").html(decodeURI(window.atob($("#productDesc").val())));
			if($('#myCarousel').length > 0 && $('.item img').length > 0){
				$('.item img').css('height', '350px').css('width', '100%');
			}
			orderForm();
			if(isMobile()){
				$('#productDetails').addClass('nopaddingOnly');
			}
		}
	},
	
	parent.gotoSection = function(section){
		if(section === 'LOGIN'){
			$('#loginSection').removeClass('hide');
			$('#otpSection').addClass('hide');
			$('#registrationSection').addClass('hide');
		}else if(section === 'OTP'){
			$('#loginSection').addClass('hide');
			$('#otpSection').removeClass('hide');
			$('#registrationSection').addClass('hide');
		}else if(section === 'REG'){
			$('#loginSection').addClass('hide');
			$('#otpSection').addClass('hide');
			$('#registrationSection').removeClass('hide');
		}else{
			$('#loginSection').addClass('hide');
			$('#otpSection').addClass('hide');
			$('#registrationSection').addClass('hide');
		}
	},
	
	parent.checkEmailExists = function(){
		var email = $("#email").val();
		appCommonFunctionality.ajaxCall('CHECKEMAILEXISTS&email=' + email, appCommonFunctionality.showEmailStatus);
	},
	
	parent.showEmailStatus = function(data){
		var data = JSON.parse(data);
		$("#emailInfoIcon, #emailOkIcon, #emailCrossIcon").addClass('hide');
		if(parseInt(data.responseCode) === 0){
			$("#emailCrossIcon").removeClass('hide');
		}else if(parseInt(data.responseCode) === 1){
			$("#emailOkIcon").removeClass('hide');
		}
	},
	
	parent.submitCustomerRegistration = function(){
		if(validateCustomerRegistrationForm(true)){
			var str = "REGISTER";
			var companyName = $("#companyName").val();
			str = str + "&companyName=" + companyName;
			var companyType = parseInt($("#companyType").val());
			str = str + "&companyType=" + companyType;
			var buyerName = $("#buyerName").val();
			str = str + "&buyerName=" + buyerName;
			var contactPersonName = $("#contactPersonName").val();
			str = str + "&contactPersonName=" + contactPersonName;
			var address = $("#address").val();
			str = str + "&address=" + address;
			var phone = $("#phone").val();
			str = str + "&phone=" + phone;
			var fax = $("#fax").val();
			str = str + "&fax=" + fax;
			var email = $("#email").val();
			str = str + "&email=" + email;
			var mobile = $("#mobile").val();
			str = str + "&mobile=" + mobile;
			var vat = $("#vat").val();
			str = str + "&vat=" + vat;
			var tax = $("#tax").val();
			str = str + "&tax=" + tax;
			//console.log(str);
			appCommonFunctionality.ajaxCall(str, appCommonFunctionality.registrationResponse);
		}
	},
	
	parent.validateCustomerRegistrationForm = function(focusEnabled){
		var errorCount = 0;
		
		/*----------------------------------------------------Company Name Validation----------------------------------------*/
		var companyName = $("#companyName").val().replace(/[^a-z0-9 ]/gi,'');
		$("#companyName").val(companyName);
		if (companyName === "") {
			appCommonFunctionality.raiseValidation("companyName", "", false);
			if(focusEnabled){
				$("#companyName").focus();
			}
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("companyName", "companyName", false);
		}
		/*----------------------------------------------------Company Name Validation----------------------------------------*/
		
		/*----------------------------------------------------Company Type Validation----------------------------------------*/
		var companyType = parseInt($("#companyType").val());
		if (companyType === 0) {
			appCommonFunctionality.raiseValidation("companyType", "", false);
			if(focusEnabled){
				$("#companyType").focus();
			}
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("companyType", "companyType", false);
		}
		/*----------------------------------------------------Company Type Validation----------------------------------------*/
		
		/*----------------------------------------------------Buyer Name Validation------------------------------------------*/
		var buyerName = $("#buyerName").val().replace(/[^a-z0-9 ]/gi,'');
		$("#buyerName").val(buyerName);
		if (buyerName === "") {
			appCommonFunctionality.raiseValidation("buyerName", "", false);
			if(focusEnabled){
				$("#buyerName").focus();
			}
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("buyerName", "buyerName", false);
		}
		/*----------------------------------------------------Buyer Name Validation------------------------------------------*/
		
		/*----------------------------------------------------Contact Person Name Validation---------------------------------*/
		var contactPersonName = $("#contactPersonName").val().replace(/[^a-z0-9 ]/gi,'');
		$("#contactPersonName").val(contactPersonName);
		if (contactPersonName === "") {
			appCommonFunctionality.raiseValidation("contactPersonName", "", false);
			if(focusEnabled){
				$("#contactPersonName").focus();
			}
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("contactPersonName", "contactPersonName", false);
		}
		/*----------------------------------------------------Contact Person Name Validation---------------------------------*/
		
		/*----------------------------------------------------Phone Validation-----------------------------------------------*/
		var phone = $("#phone").val().replace(/[^0-9 +]/gi,'');
		if (phone === "") {
			appCommonFunctionality.raiseValidation("phone", "", false);
			if(focusEnabled){
				$("#phone").focus();
			}
			errorCount++
		}else if(phone.length < 9){
			appCommonFunctionality.raiseValidation("phone", "", false);
			if(focusEnabled){
				$("#phone").focus();
			}
			errorCount++
		}else if(phone.length > 17){
			appCommonFunctionality.raiseValidation("phone", "", false);
			if(focusEnabled){
				$("#phone").focus();
			}
			errorCount++
		}else {
			appCommonFunctionality.removeValidation("phone", "phone", false);
		}
		/*----------------------------------------------------Phone Validation-----------------------------------------------*/
		
		/*----------------------------------------------------Email Validation-----------------------------------------------*/
		var email = $("#email").val();
		if (email === "") {
			appCommonFunctionality.raiseValidation("email", "", false);
			if(focusEnabled){
				$("#email").focus();
			}
			errorCount++
		}else if(email !== ""){
			var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			if (!regex.test(email)){
				appCommonFunctionality.raiseValidation("email", "", false);
				if(focusEnabled){
					$("#email").focus();
				}
				errorCount++
			}else{
				appCommonFunctionality.removeValidation("email", "email", false);
			}
		}else {
			appCommonFunctionality.removeValidation("email", "email", false);
		}
		/*----------------------------------------------------Email Validation-----------------------------------------------*/
		
		/*----------------------------------------------------VAT Validation-------------------------------------------------*/
		var vat = $("#vat").val().replace(/[^a-z0-9 ]/gi,'').toUpperCase();
		$("#vat").val(vat);
		if (vat === "") {
			appCommonFunctionality.raiseValidation("vat", "", false);
			if(focusEnabled){
				$("#vat").focus();
			}
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("vat", "vat", false);
		}
		/*----------------------------------------------------VAT Validation-------------------------------------------------*/
		
		/*----------------------------------------------------TAX Validation-------------------------------------------------*/
		var tax = $("#tax").val().replace(/[^a-z0-9 ]/gi,'').toUpperCase();
		$("#tax").val(tax);
		if (tax === "") {
			appCommonFunctionality.raiseValidation("tax", "", false);
			if(focusEnabled){
				$("#tax").focus();
			}
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("tax", "tax", false);
		}
		/*----------------------------------------------------TAX Validation-------------------------------------------------*/
		
		/*----------------------------------------------------Company Registration Form Validation---------------------------*/
		if (document.getElementById("compRegForm").files.length === 0) {
			$(".compRegFormHolder").addClass('validationError');
			errorCount++
		} else if(!CUSTREGFORMALLOWEDEXTENSIONS.includes(document.getElementById("compRegForm").files[0]['type'])){
			$(".compRegFormHolder").addClass('validationError');
			errorCount++
		}else {
			$(".compRegFormHolder").removeClass('validationError');
		}
		/*----------------------------------------------------Company Registration Form Validation---------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	},
	
	parent.registrationResponse = function(data){
		var data = JSON.parse(data);
		var customerId = parseInt(data.msg);
		if(customerId > 0){
			var qryStr = 'REGISTRATIONFORMUPLOAD&customerId=' + customerId;
			appCommonFunctionality.fileUploadAjaxCall(qryStr, 'compRegForm', registrationFormUploadComplete);
		}else{
			showPomptMsg('Somthing went wrong !!!');
		}
	},
	
	parent.registrationFormUploadComplete = function(data){
		showPomptMsg('Registration is complete !!!');
	},
	
	parent.loginEvents = function(e){
		if($("#username").length > 0){
			var username = localStorage.getItem("username");
			if(username){
				$("#username").val(username);
			}
			$("#username").keyup(function(e){
				if(e.which == 13) {
					appCommonFunctionality.getOTP();
				}
			});
		}
	},
	
	parent.getOTP = function(){
		if(loginFormValidate()){
			var str = "GENERATEOTP";
			var username  = $("#username").val();
			localStorage.setItem("username", username);
			str = str + "&username=" + username;
			appCommonFunctionality.ajaxCall(str, appCommonFunctionality.sendOtp);
		}
	},
	
	parent.sendOtp = function(data){
		var data = JSON.parse(data);
		var responseCode = parseInt(data.responseCode);
		if(responseCode === 1){
			$("#loginResponse").text('').removeClass('redText');
			appCommonFunctionality.removeValidation("username", "username", false);
			
			var otpDelay = 60 * 2;
			var otpSpan2Obj = $("#otpSpan2");
			appCommonFunctionality.startTimer(otpDelay, otpSpan2Obj);
			appCommonFunctionality.gotoSection('OTP');
		}else if(responseCode === 0){
			appCommonFunctionality.raiseValidation("username", "", false);
			$("#loginResponse").text(data.msg).addClass('redText');
		}
	},
	
	parent.loginFormValidate = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Username Validation-----------------------------------------------*/
		var username = $("#username").val();
		if (username === "") {
			appCommonFunctionality.raiseValidation("username", "", false);
			$("#username").focus();
			errorCount++
		}else if(username !== ""){
			var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			if (!regex.test(username)){
				appCommonFunctionality.raiseValidation("username", "", false);
				$("#username").focus();
				errorCount++
			}else{
				appCommonFunctionality.removeValidation("username", "username", false);
			}
		}else {
			appCommonFunctionality.removeValidation("username", "username", false);
		}
		/*----------------------------------------------------Username Validation-----------------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	},
	
	parent.otpEvents = function(e){
		if($('#otp').length > 0){
			appCommonFunctionality.adjustMainContainerHight('otpSection');
			$('#otp').keyup(function(e){
				var otp = $('#otp').val();
				if(otp.length === OTPLENGTH) {
					$("#otp").prop("readonly", true);
					appCommonFunctionality.submitOTP();
				}else{
					if(otp.length > OTPLENGTH){
						e.stopPropagation();
						e.preventDefault();
					}
				}
			});
		}
	},
	
	parent.submitOTP = function(){
		var otp = $('#otp').val();
		var username = $('#username').val();
		var qryStr = 'VALIDATEOTP&otp=' + otp + '&username=' + username;
		appCommonFunctionality.ajaxCall(qryStr, handleLoginResponse);
	},
	
	parent.handleLoginResponse = function(data){
		var data = JSON.parse(data);
		var responseCode = parseInt(data.responseCode);
		if(responseCode === 1){
			$("#otpResponse").text('').removeClass('redText');
			appCommonFunctionality.removeValidation("otp", "otp", false);
			window.location.href = PROJECTPATH + 'products';
		}else if(responseCode === 0){
			appCommonFunctionality.raiseValidation("otp", "", false);
			$("#otpResponse").text(data.msg).addClass('redText');
		}
	},
	
	parent.customerLogout = function(){
		var qryStr = 'CUSTOMERLOGOUT';
		appCommonFunctionality.ajaxCall(qryStr, handleLogoutResponse);
	},
	
	parent.handleLogoutResponse = function(){
		window.location.href = PROJECTPATH + 'login';
	},
	
	parent.customerOrders = function(){
		window.location.href = PROJECTPATH + 'orders';
	}
	
	parent.orderForm = function(){
		var str = '';
		if($('#colorCodesHdn').length > 0 && $('#productPrice').length > 0 && $('#cartonUnitQuantity').length > 0){
			var colorCodesHdn = $('#colorCodesHdn').val();
			var productPrice = parseFloat($('#productPrice').val());
			var cartonUnitQuantity = parseFloat($('#cartonUnitQuantity').val());
			var tax = parseFloat($('#tax').val());
			if(colorCodesHdn.length > 0 && productPrice > 0 && cartonUnitQuantity > 0){
				colorCodesHdn = colorCodesHdn.replace(/'/g, '"');
				var colorCodeArr = JSON.parse(colorCodesHdn);
				str = str + '<table class="table">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th><span id="cms_41">Colors</span></th>';
							for(var i = 0; i < colorCodeArr.length; i++){
								str = str + '<th><div class="pull-left colorCircle" style="background-color:' + colorCodeArr[i].colorCode + '"></div><div class="pull-left marTop2">' + colorCodeArr[i].colorName + '</div></th>';
							}
							str = str + '<th><span id="cms_42">Unit Price</span></th>';
							str = str + '<th><span id="cms_43">Sub total</span></th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						str = str + '<tr>';
							str = str + '<td><span id="cms_44">Quantity</span></td>';
							for(var i = 0; i < colorCodeArr.length; i++){
								var colorCode = colorCodeArr[i].colorCode.replace("#", "");
								str = str + '<td><input id="quantity_' + colorCode + '" name="quantity_' + colorCode + '" placeholder="0" value="0" autocomplete="off" type="number" class="form-control"></td>';
							}
							str = str + '<td>' + productPrice + '</td>';
							str = str + '<td id="quantityPrice"></td>';
						str = str + '</tr>';
						str = str + '<tr>';
							str = str + '<td><span id="cms_45">Carton</span>(' + cartonUnitQuantity + ')</td>';
							for(var i = 0; i < colorCodeArr.length; i++){
								var colorCode = colorCodeArr[i].colorCode.replace("#", "");
								str = str + '<td><input id="carton_' + colorCode + '" name="quantity_' + colorCode + '" placeholder="0" value="0" autocomplete="off" type="number" class="form-control"></td>';
							}
							str = str + '<td>' + (productPrice * cartonUnitQuantity).toFixed(2) + '</td>';
							str = str + '<td id="cartonPrice"></td>';
						str = str + '</tr>';
						str = str + '<tr>';
							str = str + '<td><span id="cms_46">Tax</span> (' + tax + '%)</td>';
							str = str + '<td colspan="' + (colorCodeArr.length  + 1)+ '"></td>';
							str = str + '<td id="taxAmount"></td>';
						str = str + '</tr>';
						str = str + '<tr>';
							str = str + '<td><span id="cms_47">Total</span></td>';
							str = str + '<td colspan="' + (colorCodeArr.length  + 1)+ '"></td>';
							str = str + '<td id="totalAmount"></td>';
						str = str + '</tr>';
					str = str + '</tbody>';
				str = str + '</table>';
			}
		}
		$('#orderForm').html(str);
		orderFormControl();
	},
	
	parent.orderFormControl = function(){
		$("[id^=quantity_],[id^=carton_]").on('keyup mouseup', function(e){
			orderPriceCalculation(this.id);
		});
	},
	
	parent.orderPriceCalculation = function(inputId){
		var colorCodesHdn = $('#colorCodesHdn').val();
		colorCodesHdn = colorCodesHdn.replace(/'/g, '"');
		var colorCodeArr = JSON.parse(colorCodesHdn);
		
		var productId = parseInt($("#productId").val());
		ORDER.productId = productId;
		
		var productTitle = $("#productTitle").text()
		ORDER.productTitle = productTitle;
		
		var productPrice = parseFloat($('#productPrice').val());
		ORDER.productPrice = productPrice;
		
		var cartonUnitQuantity = parseFloat($('#cartonUnitQuantity').val());
		ORDER.cartonUnitQuantity = cartonUnitQuantity;
		
		var tax = parseFloat($('#tax').val());
		ORDER.tax = tax;
	
		if(!ORDERFORMED){
			var productArr = [];
			for(var i = 0; i < colorCodeArr.length; i++){
				var product = {'colorCode': colorCodeArr[i].colorCode, 'colorName': colorCodeArr[i].colorName, 'quantity': 0, 'carton': 0};
				productArr.push(product);
			}
			ORDER.products = productArr;
			//console.log('empty order : ', ORDER);
			ORDERFORMED = true;
		}
		
		var quantity = 0;
		$("[id^=quantity_]").each(function() {
			if(parseFloat($('#' + this.id).val()) < 0){
				$('#' + this.id).val(0);
			}else{
				quantity = quantity + parseFloat($('#' + this.id).val());
				if(this.id === inputId){
					var colorCode = "#" + this.id.replace("quantity_", "");
					for(var i = 0; i < ORDER.products.length; i++){
						if(ORDER.products[i].colorCode === colorCode){
							ORDER.products[i].quantity = parseFloat($('#' + this.id).val());
						}
					}
				}
			}
		});
		var quantityPrice = (quantity * productPrice);
		$('#quantityPrice').html('€' + quantityPrice.toFixed(2) + '/-');
		
		var carton = 0;
		$("[id^=carton_]").each(function() {
			if(parseFloat($('#' + this.id).val()) < 0){
				$('#' + this.id).val(0);
			}else{
				carton = carton + parseFloat($('#' + this.id).val());
				if(this.id === inputId){
					var colorCode = "#" + this.id.replace("carton_", "");
					for(var i = 0; i < ORDER.products.length; i++){
						if(ORDER.products[i].colorCode === colorCode){
							ORDER.products[i].carton = parseFloat($('#' + this.id).val());
						}
					}
				}
			}
		});
		var cartonPrice = (carton * cartonUnitQuantity * productPrice);
		$('#cartonPrice').html('€' + cartonPrice.toFixed(2) + '/-');
		
		var taxAmount = (((quantityPrice + cartonPrice) * tax) / 100);
		$('#taxAmount').html('€' + taxAmount.toFixed(2) + '/-');
		
		var totalAmount = (quantityPrice + cartonPrice + taxAmount);
		$('#totalAmount').html('€' + totalAmount.toFixed(2) + '/-');
		
		console.log('complete order : ', ORDER);
	},
	
	parent.storeOrderItems = function(){
		$("#quantityBtn").on('click', function(e){
			if(sessionStorage.getItem("CUSTOMERCART") !== null){
				CARTORDERS = JSON.parse(sessionStorage.getItem("CUSTOMERCART"));
			}
			CARTORDERS.push(ORDER);
			sessionStorage.setItem("CUSTOMERCART", JSON.stringify(CARTORDERS));
			appCommonFunctionality.orderForm();
			window.location.href = PROJECTPATH + 'cart';
		});
	},
	
	parent.poplulateBarCodes = function(){
		var str = '';
		if($('#colorCodesHdn').length > 0){
			var colorCodesHdn = $('#colorCodesHdn').val();
			if(colorCodesHdn.length > 0){
				var productCode = $('#productCode').val();
				colorCodesHdn = colorCodesHdn.replace(/'/g, '"');
				var colorCodeArr = JSON.parse(colorCodesHdn);
				for(var i = 0; i < colorCodeArr.length; i++){
					var barCodeUrl = PROJECTPATH + PRODUCTIMAGEURL + 'Barcode/' + productCode + '/' + colorCodeArr[i].barCode + '.png';
					str = str + '<div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot5">';
						str = str + '<div class="barCodeHolder pull-left">';
							str = str + '<h5 class="text-center"><b>' + colorCodeArr[i].colorName + '</b></h5>';
							str = str + '<div class="pull-left">';
								str = str + '<img id="barCodeImg_' + i + '" src="' + barCodeUrl + '" onerror="appCommonFunctionality.barCodeImgError(this);">';
							str = str + '</div>';
							str = str + '<div class="pull-left colorBox" style="background-color: ' + colorCodeArr[i].colorCode + ';"></div>';
							str = str + '<div class="pull-left">';
								str = str + '<a href="' + barCodeUrl + '" download><i class="fa fa-download greenText hover f24 marLeft5 marRight5"></i></a>';
							str = str + '</div>';
						str = str + '</div>';
					str = str + '</div>';
				}
			}
		}
		$('#qrCodeHolder').after(str);
	},
	
	parent.barCodeImgError = function(image) {
		image.onerror = "";
		image.src = PROJECTPATH + PRODUCTIMAGEURL + "Barcode/nobarCodeimage.png";
		return true;
	}
	
	parent.placeOrder = function(){
		$("#quantityBtn").on('click', function(e){
			appCommonFunctionality.orderForm();
			var order_encrypted = window.btoa(encodeURI(JSON.stringify(ORDER)));
			var qryStr = 'PLACEORDER&order=' + order_encrypted;
			appCommonFunctionality.ajaxCall(qryStr, handlePLaceOrderResponse);
		});
	},
	
	parent.handlePLaceOrderResponse = function(data){
		window.location.href = PROJECTPATH + 'orders';
	},
	
	parent.callOrders = function(){
		var qryStr = 'ORDERS';
		appCommonFunctionality.ajaxCall(qryStr, populateOrders);
	},
	
	parent.populateOrders = function(data){
		var data = JSON.parse(data);
		var responseCode = parseInt(data.responseCode);
		var str = "<div id='cms_95' class='text-center'>No orders avilable</div>";
		if(responseCode === 1){
			str = '<table class="table">';
				str = str + '<thead>';
					str = str + '<tr>';
						str = str + '<th id="cms_96">Order Code</th>';
						str = str + '<th id="cms_97">Status</th>';
						str = str + '<th id="cms_98">Order Date</th>';
						str = str + '<th id="cms_99">Delivery Date</th>';
						str = str + '<th id="cms_100">Action</th>';
					str = str + '</tr>';
				str = str + '</thead>';
				str = str + '<tbody>';
				for(var i = 0; i < data.msg.length; i++){
					str = str + '<tr>';
						str = str + '<td><span class="blueText hover" onclick="appCommonFunctionality.gotoOrderDetails(\'' + data.msg[i].orderCode + '\')">' + data.msg[i].orderCode + '</span></td>';
						str = str + '<td>' + appCommonFunctionality.getOrderType(data.msg[i].status) + '</td>';
						str = str + '<td>' + appCommonFunctionality.getDate(data.msg[i].orderDate) + '</td>';
						str = str + '<td>' + appCommonFunctionality.getDate(data.msg[i].deliveryDate) + '</td>';
						str = str + '<td>';
							str = str + '<span id="cms_101" class="blueText hover" onclick="appCommonFunctionality.gotoOrderDetails(\'' + data.msg[i].orderCode + '\')">Order Details</span>';
							if(parseInt(data.msg[i].status) < 10){
								str = str + ' | <span id="cms_102" class="redText hover" onclick="appCommonFunctionality.cancelOrderbyCustomer(' + data.msg[i].orderId + ')">Cancel Order</span>';
							}
						str = str + '</td>';
					str = str + '</tr>';
				}
				str = str + '</tbody>';
			str = str + '</table>';
		}
		$("#orderSection").html(str);
		appCommonFunctionality.toggleHeaderLangFlag(false);
	},
	
	parent.getOrderType = function(orderType){
		var str = '';
		for(var i = 0; i < ORDERTYPES.length; i++){
			if(parseInt(ORDERTYPES[i][0]) === parseInt(orderType)){
				if(getLang() === 'eng'){
					str = str + ORDERTYPES[i][2];
				}else if(getLang() === 'gem'){
					str = str + ORDERTYPES[i][3];
				}
			}
		}
		return str;
	},
	
	parent.getDate = function(dateStr){
		if(parseInt(dateStr)){ 
			return dateStr;
		}else{
			if(getLang() === 'eng'){
				dateStr =  'Date not finalized yet';
			}else if(getLang() === 'gem'){
				dateStr =  'Datum noch nicht finalisiert';
			}
			return dateStr;
		}
	},
	
	parent.gotoOrderDetails = function(orderCode){
		window.location.href = PROJECTPATH + 'orderDetails/' + orderCode;
	},
	
	parent.callOrderDetails = function(orderCode){
		var orderCodeArr = orderCode.split('_');
		var orderId = parseInt(orderCodeArr[1]);
		var qryStr = 'ORDERDETAILS&orderId=' + orderId;
		appCommonFunctionality.ajaxCall(qryStr, populateOrderDetails);
	},
	
	parent.populateOrderDetails = function(data){
		var data = JSON.parse(data);
		var responseCode = parseInt(data.responseCode);
		var str = '';
		if(responseCode === 1){
			str = str + '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12"><b id="cms_96">Order Code : </b>' + data.msg.orderCode + '</div>';
			str = str + '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12"><b id="cms_96">Status : </b>' + appCommonFunctionality.getOrderType(data.msg.status);
			if(parseInt(data.msg.status) < 10){
				str = str + ' [<span id="cms_102" class="blueText hover" onclick="appCommonFunctionality.cancelOrderbyCustomer(' + data.msg.orderId + ')">Cancel order</span>]';
			}
			str = str + '</div>';
			str = str + '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12"><b id="cms_98">Order Date : </b>' + appCommonFunctionality.getDate(data.msg.orderDate) + '</div>';
			str = str + '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 marBot24"><b id="cms_99">Delivery Date : </b>' + appCommonFunctionality.getDate(data.msg.deliveryDate) + '</div>';
			str = str + '<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 marBot24"></div>';
			str = str + '<div id="orderItemDetails" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">ORDER ITEM DETAILS NOT AVILABLRE</div>';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' + appCommonFunctionality.populateDeliveryNote(data.msg.deliveryNote) + '</div>';
		}else{
			str = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">' + data.msg + '</div>'
		}
		$("#orderDetailsSection").html(str);
		if(data.msg.orderItemObj.length > 0){
			var orderItemObj = JSON.parse(decodeURI(window.atob(data.msg.orderItemObj)));
			var str = '';
			for(var i = 0; i < orderItemObj.length; i++){
				str = str + appCommonFunctionality.populateOrderItems(orderItemObj[i]);	
			}
			$("#orderItemDetails").html(str);
			appCommonFunctionality.toggleHeaderLangFlag(false);
		}
	},
	
	parent.callShortProductDetails = function(productId){
		var qryStr = 'PRODUCTDETAILS&productId=' + productId;
		appCommonFunctionality.ajaxCall(qryStr, populateShortProductDetails);
	},
	
	parent.populateShortProductDetails = function(data){
		var data = JSON.parse(data);
		var responseCode = parseInt(data.responseCode);
		var str = '';
		if(responseCode === 1){
			str = str + '<b>Product : </b> <span class="blueText hover" onclick="appCommonFunctionality.gotoProductDetails(\'' + data.msg.productSlug + '\')">' + data.msg.productTitle + '</span> [' + data.msg.productCode + ']';
		}
		return str;
	},
	
	parent.gotoProductDetails = function(productSlug){
		window.location.href = PROJECTPATH + 'productDetails/' + productSlug;
	},
	
	parent.populateOrderItems = function(orderItemObj){
		var str = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly tableHolder marBot24">';
				str = str + '<div class="marLeft5"><b id="cms_83">Products : </b>' + orderItemObj.productTitle + '</div>';
				str = str + '<table class="table">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th id="cms_84">Colors</th>';
							for(var i = 0; i < orderItemObj.products.length; i++){
								str = str + '<th>';
									str = str + '<div class="pull-left colorCircle" style="background-color:' + orderItemObj.products[i].colorCode + '"></div>';
									str = str + '<div class="pull-left marTop2">' + orderItemObj.products[i].colorName + '</div>';
								str = str + '</th>';
							}
							str = str + '<th id="cms_85">Unit Price</th>';
							str = str + '<th id="cms_86">Sub total</th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						str = str + '<tr>';
							str = str + '<td id="cms_86">Quantity</td>';
							var totalProductQuantity = 0
							for(var i = 0; i < orderItemObj.products.length; i++){
								str = str + '<td>' + orderItemObj.products[i].quantity + '</td>';
								totalProductQuantity = totalProductQuantity + parseInt(orderItemObj.products[i].quantity);
							}
							str = str + '<td>€' + orderItemObj.productPrice.toFixed(2) + '</td>';
							str = str + '<td>€' + (totalProductQuantity * orderItemObj.productPrice).toFixed(2) + '/-</td>';
							var totalProductQuantityPrice = (totalProductQuantity * orderItemObj.productPrice);
					str = str + '</tr>';
					str = str + '<tr>';
						str = str + '<td><span id="cms_88">Carton</span>(' + orderItemObj.cartonUnitQuantity + ')</td>';
						var totalCartonQuantity = 0
						for(var i = 0; i < orderItemObj.products.length; i++){
							str = str + '<td>' + orderItemObj.products[i].carton + '</td>';
							totalCartonQuantity = totalCartonQuantity + parseInt(orderItemObj.products[i].carton);
						}
						str = str + '<td>€' + (orderItemObj.cartonUnitQuantity * orderItemObj.productPrice).toFixed(2) + '</td>';
						str = str + '<td>€' + (orderItemObj.cartonUnitQuantity * orderItemObj.productPrice * totalCartonQuantity).toFixed(2) + '/-</td>';
						var cartonUnitQuantityPrice = (orderItemObj.cartonUnitQuantity * orderItemObj.productPrice * totalCartonQuantity);
					str = str + '</tr>';
					str = str + '<tr>';
						str = str + '<td><span id="cms_89">Tax</span> (' + orderItemObj.tax + '%)</td>';
						str = str + '<td colspan="' + (orderItemObj.products.length + 1)+ '"></td>';
						str = str + '<td>€' + (((totalProductQuantityPrice + cartonUnitQuantityPrice) * orderItemObj.tax) / 100).toFixed(2) + '/-</td>';
						var totalTax = (((totalProductQuantityPrice + cartonUnitQuantityPrice) * orderItemObj.tax) / 100);
					str = str + '</tr>';
					str = str + '<tr>';
						str = str + '<td><span id="cms_90">Total</span></td>';
						str = str + '<td colspan="' + (orderItemObj.products.length + 1)+ '"></td>';
						str = str + '<td>€' + (totalProductQuantityPrice + cartonUnitQuantityPrice + totalTax).toFixed(2) + '/-</td>';
					str = str + '</tr>';
				str = str + '</tbody>';
			str = str + '</table>';
		str = str + '</div>';
		return str;
	},
	
	parent.populateDeliveryNote = function(deliveryNoteObj){
		var str = "";
		if(deliveryNoteObj.length > 0){
			for(var i = 0; i < deliveryNoteObj.length; i++){
				str = str + "<span>" + deliveryNoteObj[i].note + " [" + deliveryNoteObj[i].date + " ]</span><br />";
			}
			str = "<b>Delivery Note : </b><br />" + str;
		}
		return str;
	},
	
	parent.cancelOrderbyCustomer = function(orderId){
		var qryStr = 'CANCELORDERBYCUSTOMER&orderId=' + orderId;
		appCommonFunctionality.ajaxCall(qryStr, handlePLaceOrderResponse);
	},
	
	parent.populateCart = function(){
		if(sessionStorage.getItem("CUSTOMERCART") !== null){
			CARTORDERS = JSON.parse(sessionStorage.getItem("CUSTOMERCART"));
		}
		
		var str = "";
		if(CARTORDERS.length > 0){
			for(var i = 0; i < CARTORDERS.length; i++){
				str = str + "<div class='pull-left w100p'>";
					str = str + "<div class='pull-left w98p'>" + appCommonFunctionality.populateOrderItems(CARTORDERS[i]) + "</div>";
					str = str + "<div class='pull-right'><span class='glyphicon glyphicon-trash redText hover' onclick='appCommonFunctionality.removeItemFromCart(" + i + ")'></span></div>";
				str = str + "</div>";
			}
			$("#placeOrderSection").html('');
		}else{
			str = str + "<span id='cms_82' class='text-center'>Cart is Empty</span>";
			$("#placeOrderSection").html('');
		}
		$("#cartSection").html(str);
		appCommonFunctionality.populateCartTotalPrice();
	},
	
	parent.removeItemFromCart = function(index){
		if(sessionStorage.getItem("CUSTOMERCART") !== null){
			CARTORDERS = JSON.parse(sessionStorage.getItem("CUSTOMERCART"));
		}
		if(CARTORDERS.length > 0){
			CARTORDERS.splice(index, 1);
			sessionStorage.setItem("CUSTOMERCART", JSON.stringify(CARTORDERS));
			appCommonFunctionality.populateCart();
		}
	},
	
	parent.populateCartTotalPrice = function(){
		if(sessionStorage.getItem("CUSTOMERCART") !== null){
			CARTORDERS = JSON.parse(sessionStorage.getItem("CUSTOMERCART"));
		}
		var totalPrice = 0;
		if(CARTORDERS.length > 0){
			var productWiseTotalPrice = 0;
			for(var i = 0; i < CARTORDERS.length; i++){
				var productPrice = CARTORDERS[i].productPrice;
				var totalQuantity = 0;
				for(var j = 0; j < CARTORDERS[i].products.length; j++){
					var totalQuantity = totalQuantity + (CARTORDERS[i].products[j].carton * CARTORDERS[i].cartonUnitQuantity) + CARTORDERS[i].products[j].quantity;
				}
				productWiseTotalPrice = productWiseTotalPrice + (totalQuantity * productPrice);
				productWiseTotalPrice = productWiseTotalPrice + ((productWiseTotalPrice * CARTORDERS[i].tax) / 100);
			}
			
			var str = '<span class="pull-left"><span id="cms_91">Total price : </span>' + productWiseTotalPrice.toFixed(2) + '/-</span>';
			str = str + '<span class="pull-right"><button id="quantityBtn" rel="cms_92" type="button" class="btn btn-success pull-right marLeft5" onclick="appCommonFunctionality.confirmOrder()">confirm Order</button></span>';
			str = str + '<span class="pull-right"><button id="quantityBtn" rel="cms_93" type="button" class="btn btn-success pull-right" onclick="appCommonFunctionality.gotoProducts()">Continue shopping</button></span>';
			$("#placeOrderSection").html(str); 
		}
	},
	
	parent.confirmOrder = function(){
		if(sessionStorage.getItem("CUSTOMERCART") !== null){
			CARTORDERS = JSON.parse(sessionStorage.getItem("CUSTOMERCART"));
		}
		if(CARTORDERS.length > 0){
			var order_encrypted = window.btoa(encodeURI(JSON.stringify(CARTORDERS)));
			var qryStr = 'PLACEORDER&order=' + order_encrypted;
			sessionStorage.setItem("CUSTOMERCART", JSON.stringify([]));
			appCommonFunctionality.ajaxCall(qryStr, handlePLaceOrderResponse);
		}
	},
	
	parent.populateMagazine = function(){
		var str = '';
		/*--------------------------------Magazine Front Page-----------------------------------*/
		str = str + '<div class="magazinePage oddPage">';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<div class="magazineCover marTop24">';
					str = str + '<img src="' + PROJECTPATH + 'assets/images/logo.jpg" class="magazineLogo">';
				str = str + '</div>';
				str = str + '<h1 id="cms_108" class="text-center goldenText"></h1>';
				str = str + '<h1 class="text-center goldenText">' + appCommonFunctionality.capitalizeFirstLetter($("#magazineTitle").val()) + '</h1>';
				str = str + '<p id="cms_109" class="text-center goldenText"></p>';
				str = str + '<div class="text-center">';
						str = str + '<i class="fa fa-share-alt blueText f24" onclick="appCommonFunctionality.socialShare(\'' + $("#magazineTitle").val() + '\', \'' + window.location.href + '\', \'' + ' ' + '\')"></i>';
					str = str + '</div>';
			str = str + '</div>';
		str = str + '</div>';
		/*--------------------------------Magazine Front Page-----------------------------------*/

		/*--------------------------------Collection Pages--------------------------------------*/
		var products = $('#products').val();
		products = products.replace(/'/g, '"');
		//var MAGAZINEPRODUCTSDATA = JSON.parse(decodeURI(window.atob($('#products').val())));
		var MAGAZINEPRODUCTSDATA = JSON.parse(products);
		var collectionIds = MAGAZINEPRODUCTSDATA.collectionIds;
		var productIds = [];
		for(var i = 0; i < MAGAZINEPRODUCTSDATA.productIds.length; i++){
			productIds.push(parseInt(MAGAZINEPRODUCTSDATA.productIds[i].productId));
		}
		var populatedProducts = [];
		for(var i = 0; i < collectionIds.length; i++){
			var colObj = getCollectionObj(parseInt(collectionIds[i]));
			str = str + '<div class="magazinePage evenPage">';
				str = str + '<h3 class="text-center goldenText">' + colObj.collectionName + '</h3>';
				str = str + '<div class="magazineCover marTop24">';
					str = str + '<img src="' + PROJECTPATH + 'uploads/productCollection/' + colObj.collectionImage + '" alt="' + colObj.collectionImage + '" class="w92p productMagImage">';
				str = str + '</div>';
			str = str + '</div>';
			str = str + '<div class="magazinePage oddPage">';
				str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
					str = str + '<h3 class="text-center goldenText">' + colObj.collectionName + '</h3>';
					str = str + '<p class="text-center marTop24">' + decodeURI(window.atob(colObj.collectionDesc)) + '</p>';
				str = str + '</div>';
			str = str + '</div>';
			/*--------------------------------Product Pages with in this Collection------------*/
			var productArrWithInThisCollection = getSelectedProductInThisCollection(collectionIds[i], productIds);
			for(var j = 0; j < productArrWithInThisCollection.length; j++){
				var pObj = getProductObj(parseInt(productArrWithInThisCollection[j]));
				str = str + '<div class="magazinePage evenPage">';
					str = str + '<h3 class="text-center goldenText">' + pObj.productTitle + ' [' + pObj.productCode + ']' + '</h3>';
					str = str + '<div class="magazineCover marTop24">';
						var imgArr = pObj.productMainImage.split(",");
						var pMainImg = imgArr[0];
						str = str + '<img src="' + PROJECTPATH + 'uploads/products/' + pMainImg + '" alt="' + pMainImg + '" class="w92p productMagImage">';
					str = str + '</div>';
				str = str + '</div>';
				str = str + '<div class="magazinePage oddPage">';
					str = str + '<h3 class="text-center goldenText">' + pObj.productTitle + ' [' + pObj.productCode + ']' + '</h3>';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
						str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">' + decodeURI(window.atob(pObj.productDesc)) + '</div>';
						str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
							str = str + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">';
								str = str + '<p><b id="cms_85"></b> : € ' + pObj.productPrice + '/-</p>';
								str = str + '<img src="../uploads/products/QRCode/' + pObj.productCode + '.png" alt="' + pObj.productCode + '" class="w100Px">';
							str = str + '</div>';
							str = str + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">';
								str = str + '<p><b id="cms_84"></b> :</p>';
								str = str + '<div id="productColor_' + pObj.productId + '"></div>';
							str = str + '</div>';
						str = str + '</div>';
					str = str + '</div>';
				str = str + '</div>';
				populatedProducts.push(parseInt(pObj.productId));
			}
			/*--------------------------------Product Pages with in this Collection------------*/
		}
		/*--------------------------------Collection Pages-------------------------------------*/
		
		/*--------------------------------Product Pages out of this Collection-----------------*/
		var remainingProducts = productIds.filter(value => !populatedProducts.includes(value));
		for(var j = 0; j < remainingProducts.length; j++){
			var pObj = getProductObj(parseInt(remainingProducts[j]));
			str = str + '<div class="magazinePage evenPage">';
				str = str + '<h3 class="text-center goldenText">' + pObj.productTitle + ' [' + pObj.productCode + ']' + '</h3>';
				str = str + '<div class="magazineCover marTop24">';
					var imgArr = pObj.productMainImage.split(",");
					var pMainImg = imgArr[0];
					str = str + '<img src="' + PROJECTPATH + 'uploads/products/' + pMainImg + '" alt="' + pMainImg + '" class="w92p productMagImage">';
				str = str + '</div>';
			str = str + '</div>';
			str = str + '<div class="magazinePage oddPage">';
				str = str + '<h3 class="text-center goldenText">' + pObj.productTitle + ' [' + pObj.productCode + ']' + '</h3>';
				str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">' + decodeURI(window.atob(pObj.productDesc)) + '</div>';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
						str = str + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">';
							str = str + '<p><b id="cms_85"></b> : € ' + pObj.productPrice + '/-</p>';
							str = str + '<img src="../uploads/products/QRCode/' + pObj.productCode + '.png" alt="' + pObj.productCode + '" class="w100Px">';
						str = str + '</div>';
						str = str + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">';
							str = str + '<p><b id="cms_84"></b> :</p>';
							str = str + '<div id="productColor_' + pObj.productId + '"></div>';
						str = str + '</div>';
					str = str + '</div>';
				str = str + '</div>';
			str = str + '</div>';
			populatedProducts.push(parseInt(pObj.productId));
		}
		/*--------------------------------Product Pages out of this Collection-----------------*/
		
		/*--------------------------------Magazine End Page------------------------------------*/
		str = str + '<div class="magazinePage evenPage">';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<div class="magazineCover marTop24">';
					str = str + '<img src="' + PROJECTPATH + 'assets/images/logo.jpg" class="magazineLogo">';
				str = str + '</div>';
				str = str + '<h1 id="cms_110" class="text-center goldenText"></h1>';
				str = str + '<p id="cms_111" class="text-center goldenText"></p>';
			str = str + '</div>';
		str = str + '</div>';
		/*--------------------------------Magazine End Page------------------------------------*/
		$("#magazine").html(str);
		str = '';
		magazineFunctionality();
	},
	
	getCollectionObj = function(collectionId){
		var collectionObj = '';
		if($("#productCollectionSerializedData").val().length > 0){
			var productCollectionSerializedData = JSON.parse($("#productCollectionSerializedData").val());
			for(var i = 0; i < productCollectionSerializedData.length; i++){
				if(parseInt(collectionId) === parseInt(productCollectionSerializedData[i].collectionId)){
					collectionObj = productCollectionSerializedData[i];
				}
			}
		}
		return collectionObj;
	},
	
	getSelectedProductInThisCollection = function(collectionId, productIds){
		var allProductsInThisCollection = [];
		var productSerializedData = JSON.parse($("#productSerializedData").val());
		for(var i = 0; i < productSerializedData.length; i++){
			if(parseInt(collectionId) === parseInt(productSerializedData[i].collectionId)){
				allProductsInThisCollection.push(parseInt(productSerializedData[i].productId));
			}
		}
		return allProductsInThisCollection.filter(value => productIds.includes(value));
	},
	
	getProductObj = function(productId){
		var productObj = {};
		if($("#productSerializedData").val().length > 0){
			var productSerializedData = JSON.parse($("#productSerializedData").val());
			for(var i = 0; i < productSerializedData.length; i++){
				if(parseInt(productId) === parseInt(productSerializedData[i].productId)){
					productObj = productSerializedData[i];
					productObj.productPrice = getOfferedPrice(productId);
				}
			}
		}
		return productObj;
	},
	
	getOfferedPrice = function(productId){
		var offeredPrice = "";
		if($('#products').length > 0){
			var products = $('#products').val();
			products = products.replace(/'/g, '"');
			var products = JSON.parse(products);
			for(var i =0; i < products.productIds.length; i++){
				if(parseInt(productId) === parseInt(products.productIds[i].productId)){
					offeredPrice = products.productIds[i].productPrice;
				}
			}
		}
		return offeredPrice;
	},
	
	parent.magazineFunctionality = function(){
		var magazineWidth = 0;
		var headerHeader = $('#navbar').height();
		var footerHeader = $('#footer').height();
		var magazineHeight = (window.innerHeight - (headerHeader + footerHeader) - 30);
		var noOfPage = 'double';
		if(appCommonFunctionality.isMobile()){
			$('.leftArrow, .rightArrow').remove();
			magazineWidth = window.outerWidth - (16*2); /*16px for .w3-padding*/
			noOfPage = 'single';
		}else{
			magazineWidth = window.outerWidth - (16*2) - (60*2); /*16px for .w3-padding $ 60px for both side arrow*/
			noOfPage = 'double';
		}
		$("#magazine").width(magazineWidth).height(magazineHeight);
		$('#magazine').turn({
			display: noOfPage,
			acceleration: true,
			gradients: !$.isTouch,
			elevation:50,
			when: {
				turned: function(e, page) {
					/*console.log('Current view: ', $(this).turn('view'));*/
					/*----------------------------Resizing Magazine Product Image size----------------------*/
					var magazinePageH = $('.magazinePage').height();
					var productMagImageH = (magazinePageH * 82/100);
					$('.productMagImage').css('max-height', productMagImageH + 'px');
					/*----------------------------Resizing Magazine Product Image size----------------------*/
					appCommonFunctionality.cmsImplementationThroughID();
					mapProductColors();
					var audio = new Audio(PROJECTPATH + 'assets/images/pageTurn.mp3');
					audio.play();
				}
			}
		});
		if(appCommonFunctionality.isMobile()){
			$("#magazine").on("swipeleft",function(){
				$('#magazine').turn('next');
			}).on("swiperight",function(){
				$('#magazine').turn('previous');
			});
			$(".evenPage").removeClass('evenPage').addClass('oddPage');
		}else{
			$(window).bind('keydown', function(e){
				if (e.keyCode==37)
					$('#magazine').turn('previous');
				else if (e.keyCode==39)
					$('#magazine').turn('next');	
			});
			if($('.leftArrow').length > 0){
				$('.leftArrow').on('click', function(e){
					$('#magazine').turn('previous');
				});
			}
			if($('.rightArrow').length > 0){
				$('.rightArrow').on('click', function(e){
					$('#magazine').turn('next');
				});
			}
		}
		$('.ui-loader').remove(); //removing unnessery loading section
	},
	
	mapProductColors = function(){
		$('[id^=productColor_]').each(function () {
			var elemId = this.id;
			var elemIdArr = elemId.split('_');
			var productId = parseInt(elemIdArr[1]);
			if(parseInt(productId) > 0){
				var str = "PRODUCTCOLORS&productId=" + productId;
				appCommonFunctionality.ajaxCall(str, appCommonFunctionality.bindMagazineProductColor);
			}
		});
	},
	
	bindMagazineProductColor = function(colorObj){
		colorObj = JSON.parse(colorObj);
		var productId = colorObj.msg.productId;
		colorObj = colorObj.msg.productColors;
		var str = '';
		for(var i = 0; i < colorObj.length; i++){
			str = str + '<div class="pull-left colorCircle" style="background-color:' + colorObj[i].colorCode + '"></div>';
		}
		$("#productColor_" + productId).html(str);
	}
	
	/*---------------------------------------------------Front Functionality-------------------------------------*/
    return parent;
}(window, window.$));