LOADTIME = 1000;
AJAXTIMEOUT = 36000000;
MAXMOBILEWIDTHSUPPORT = 736;

SITETITLE = 'B2B2C'; 
PROJECTPATH = 'http://educontrol.org/b2b2c/';
APIPATH = PROJECTPATH + 'api/api.php?ACTION=';
PRECOMPILEDDATAPATH = PROJECTPATH + 'api/preCompiledData/';
PRODUCTPRECOMPILEDDATAPATH = PROJECTPATH + 'api/preCompiledData/products/';
ALLOWEDEXTENSIONS = ['jpg', 'jpeg', 'png'];
CUSTREGFORMALLOWEDEXTENSIONS = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];
PRODUCTIMAGEURL = 'uploads/products/';
SITECOMMONIMAGE = PROJECTPATH + 'assets/images/logo.jpg';
LANGDATA = '';
QRCODEAPIURL = PROJECTPATH + 'api/qrcode.php?qr=' + SITETITLE + '_'; //https://educontrol.org/b2b2c/api/qrcode.php?qr=P0009-7-1847176
BARCODEAPIURL = PROJECTPATH + 'api/barcode.php?codetype=Code39&size=50&print=true&text=' + SITETITLE + '_'; //https://educontrol.org/b2b2c/api/barcode.php?codetype=Code39&size=50&print=true&text=5675675675675675
LANGTRANSLATEAPI = 'https://api.mymemory.translated.net/get?q=';
COUNTRYFLAGURL = "https://flagpedia.net/data/flags/h120/"; //https://flagpedia.net/data/flags/h120/in.png
COMPANYTYPECoC = 'CoC'; //Customer on Counter
DEFAULTTAX = 19;
DEFAULTADDRESS = '149-151 Daventry Road<br>Coventry CV3 5HD';
DEFAULTPHONE = '07468093530';
VATNUMBER = '378 083 956';

MOBMENUOPENED = false;

$(document).ready(function() {
	var urlParts = appCommonFunctionality.allElementsFromUrl();
	if(urlParts[4] === '' || urlParts[4].startsWith("#")){
		appCommonFunctionality.productScroller();
		appCommonFunctionality.productCollectionDescSlider();
		if(appCommonFunctionality.isMobile()){
			$('#productCollectionCarousel').parent().css('min-height', '0px !important');
			$('#contactAddress').addClass('nopaddingOnly');
			$('.img-list img').css('height', $('.img-list img').width() + 'px');
			$('.bannerImg, .bannerImg2').addClass('bannerImgMob').removeClass('bannerImg');
			$('#bannerText').remove();
		}
		$("#contactSndMsgBtn").on('click', function(e){
			if(appCommonFunctionality.contactFormValidation()){
				appCommonFunctionality.sendContactMailtoAdmin();
			}
		});
	}else if(urlParts[4] === 'login'){
		appCommonFunctionality.loginEvents();
	}else if(urlParts[4] === 'products'){
		var individualProductHeight = window.innerHeight - $('#navbar').height() - $('#footer').height() - 22; //22 is padding & margin
		$('.productBody').css('min-height', individualProductHeight + 'px');
		if(appCommonFunctionality.isMobile()){
			$('#headerText, .productItems').addClass('nopaddingOnly f18').removeClass('f33 lh56');
			$('.H250').removeClass('H250');
			$('.carouselHolder').css("min-height", "auto");
		}else{
			$('#headerText, .productItems').addClass('f33 lh56').removeClass('f18');
			$('.carouselHolder').removeClass('carouselHolder').addClass('carouselHolderDesk');
		}
		if(typeof urlParts[4] !== 'undefined'){
			appCommonFunctionality.mapProductColors();
		}
		appCommonFunctionality.showLoadMoreButton();
	}else if(urlParts[4] === 'offeredProducts'){
		if(appCommonFunctionality.isMobile()){
			$('#headerText, .productItems').addClass('nopaddingOnly f18').removeClass('f33 lh56');
			$('.H250').removeClass('H250');
		}else{
			$('#headerText, .productItems').addClass('f33 lh56').removeClass('f18');
		}
		appCommonFunctionality.mapProductColors();
	}else if(urlParts[4] === 'category'){
		var individualProductHeight = window.innerHeight - $('#navbar').height() - $('#footer').height() - 22; //22 is padding & margin
		$('.productBody').css('min-height', individualProductHeight + 'px');
		if(appCommonFunctionality.isMobile()){
			$('#headerText, .productItems').addClass('nopaddingOnly f18').removeClass('f33 lh56');
			$('.H250').removeClass('H250');
			$('.carouselHolder').css("min-height", "auto");
		}else{
			$('#headerText, .productItems').addClass('f33 lh56').removeClass('f18');
			$('.carouselHolder').removeClass('carouselHolder').addClass('carouselHolderDesk');
		}
		if(typeof urlParts[4] !== 'undefined'){
			appCommonFunctionality.mapProductColors();
		}
		appCommonFunctionality.showLoadMoreButton();
	}else if(urlParts[4] === 'productDetails'){
		appCommonFunctionality.placeProductDesc();
		appCommonFunctionality.storeOrderItems();
		//appCommonFunctionality.poplulateBarCodes(); //not nessesery will open on demand
		if(typeof urlParts[4] !== 'undefined'){
			appCommonFunctionality.mapProductColors();
			appCommonFunctionality.mapProductCategories();
		}
		if(appCommonFunctionality.isMobile()){
			$("#individualProductContainer").addClass('nopaddingOnly');
			$('.carouselHolder').removeClass('carouselHolder').addClass('carouselHolderMob');
			$("#offerPercentageContainer").addClass('text-center');
			$("#productDetails").removeClass('marBot24');
		}
	}else if(urlParts[4] === 'orders'){
		appCommonFunctionality.callOrders();
	}else if(urlParts[4] === 'orderDetails'){
		appCommonFunctionality.callOrderDetails(urlParts[4]);
	}else if(urlParts[4] === 'cart'){
		appCommonFunctionality.populateCart();
	}else if(urlParts[4] === 'deliveryAddress'){
		appCommonFunctionality.initDeliveryAddress();
	}else if(urlParts[4] === 'magazine'){
		appCommonFunctionality.populateMagazine();
	}else if(urlParts[4] === 'productCatalog'){
		appCommonFunctionality.placeProductDesc();
		appCommonFunctionality.bindProductCatalogBarcodesColors();
		//window.print();
	}else if(urlParts[4] === 'productCatalog'){
		appCommonFunctionality.placeProductDesc();
		appCommonFunctionality.bindProductCatalogBarcodesColors();
		//window.print();
	}else if(urlParts[4] === 'mediaOrder'){
		appCommonFunctionality.populateMediaOrders();
	}else if(urlParts[4] === 'orderInvoice'){
		appCommonFunctionality.populateLangDDL();
		appCommonFunctionality.populatePrintableOrderItem();
	}else if(urlParts[4] === 'exportDoc'){
		appCommonFunctionality.populateLangDDL();
		appCommonFunctionality.calculateTotalAmount();
	}else if(urlParts[4] === 'admin'){
		$("#mySidebar").css("width", "0px");
		$('.w3-main').css("margin-left", "0px");
		if(appCommonFunctionality.isMobile()){
			$(".rightIcon").addClass('w3-bar-item-mob').removeClass('w3-bar-item');
		}
	}
	
	if(appCommonFunctionality.getLang() === null){
		var defalutLang = appCommonFunctionality.getDefaultLang();
		appCommonFunctionality.setLang(defalutLang[0].sign);
	}
	if($("#langSerializedData").length > 0 && $("#langData").length > 0){
		if($("#langSerializedData").val().length > 0){
			bindLangDDL();
		}
		if($("#langData").val().length > 0){
			LANGDATA = JSON.parse($("#langData").val().replace(/'/g, '"'));
			cmsImplementationThroughID();
			cmsImplementationThroughRel();
		}
	}
	//appCommonFunctionality.sentMails();
	//appCommonFunctionality.showOfferOverlay();
	
	/*appCommonFunctionality.showLoder();
	window.onload = function() {
	  appCommonFunctionality.hideLoder();
	}*/
});

appCommonFunctionality = (function(window, $) {

    /*---------------------------------------------------Common Static Functions-------------------------------------*/
	parent.w3_toggle = function(){
		if($("#adminHeaderHamburgerMenu").hasClass("fa-bars")){
			$("#adminHeaderHamburgerMenu").removeClass("fa-bars").addClass("fa-close");
			$("#mySidebar").animate({width:'300px', display:'block'},350).removeClass("w3-collapse");
			$('.w3-main').css("margin-left", "300px");
			$("#mySidebar").css("display", "block");
		}else{
			$("#adminHeaderHamburgerMenu").addClass("fa-bars").removeClass("fa-close");
			$("#mySidebar").animate({width:'0px', display:'none'},350).addClass("w3-collapse");
			$('.w3-main').css("margin-left", "0px");
		}
	},
	
	parent.isMobile = function() {
		var isMobileView = false;
		if (window.outerWidth <= MAXMOBILEWIDTHSUPPORT) {
			isMobileView = true;
		}
		return isMobileView;
	},

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
	
	parent.getOccurrenceinAnarray = function(array, value) {
		return array.filter((v) => (v === value)).length;
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
	},

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
	
	parent.openScanningAnimationModal = function(){
		var loaderW = 170;
		var loaderH = 175;
		var str = "";
		str = str + "<div id='scanningAnimationHolder'>";
			str = str + "<div>";
				str = str + "<img id='scanningAnimationImg' src='" + PROJECTPATH + "assets/images/scanningAnimation.gif' style='width:" + loaderW + "px; height:" + loaderH + "px;'>";
			str = str + "</div>";
			str = str + "<div>";
				str = str + "<input type='text' id='scanningText' name='scanningText' value='' style='width:" + loaderW + "px; height:1px;'>";
			str = str + "</div>";
		str = str + "</div>";
		$('body').addClass("makeHazy").append(str);
		var leftSpace = (($(window).width()/2) - (loaderW/2));
		var topSpace = (($(window).height()/2) - (loaderH/2));
		$("#scanningAnimationHolder").css("position", "fixed").css("left", leftSpace).css("top", topSpace).css("z-index", 9999);
		$("#scanningText").focus();
	},
	
	parent.closeScanningAnimationModal = function(){
		$('body').removeClass("makeHazy");
		$("#scanningAnimationHolder").remove();
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
	
	parent.capitalizeInputValue = function(inputId){
		$("#" + inputId).val($("#" + inputId).val().toUpperCase());
	},
	
	parent.decapitalizeInputValue = function(inputId){
		$("#" + inputId).val($("#" + inputId).val().toLowerCase());
	},	
	
	parent.deselectDropDown = function(dropdownId){
		$("#" + dropdownId + " option:selected").removeAttr("selected");
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
	
	parent.copyClipBoard = function(copyText){
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val(copyText).select();
		document.execCommand("copy");
		$temp.remove();
		appCommonFunctionality.showPomptMsg('Text Copied..');
	},
	
	parent.numberToWords = function(num) {
		var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
		var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
		if ((num = num.toString()).length > 9) return 'overflow';
		n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return; var str = '';
		str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
		str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
		str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
		str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
		str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
		return str;
	},

	parent.onImgError = function(image) {
		image.onerror = "";
		image.src = PROJECTPATH + "assets/images/noImages.png";
		return true;
	},
	
	parent.validateUrl = function(value){
		return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
	},
	
	parent.isEven = function(n) {
		return n % 2 == 0;
	},
	
	parent.isOdd = function(n) {
		return Math.abs(n % 2) == 1;
	},
	
	parent.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
		.replace(/[xy]/g, function (c) {
			const r = Math.random() * 16 | 0, 
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	
	parent.randomNumber16Digit = function(){
		// Get the current timestamp in milliseconds
		var timestamp = Date.now();

		// Convert the timestamp to a hexadecimal string
		var hexTimestamp = timestamp.toString(16);

		// Extract the last 10 digits of the hexadecimal string
		var randomDigits = hexTimestamp.substr(-10);

		// Convert the hexadecimal digits to a decimal number
		var randomNumber = parseInt(randomDigits, 16);

		return randomNumber;
	},
	
	parent.reloadPage = function(){
		location.reload(true);
	}
	/*---------------------------------------------------Common Static Functions-------------------------------------*/
	
	/*---------------------------------------------------Common Service Consumptions---------------------------------*/
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
	
	parent.ajaxCallLargeData = function(qryStr, callData, callback) {
		$.ajax({
			type: "POST",
			url: APIPATH + qryStr,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: callData,
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
	
	parent.ajaxPreCompiledDataCall = function(qryStr, callback) {
		$.ajax({
			type: "GET",
			url: APIPATH + qryStr,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
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
	
	parent.translateLanguage = function(textStr, sourceLang, targetLang, callback){
		$.ajax({
			type: "POST",
			url: LANGTRANSLATEAPI + encodeURI(textStr) + '&langpair=' + sourceLang + '|' + targetLang,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: {},
			beforeSend: function(xhr) {
				showLoder();
			},
			success: function(data) {
				//alert(JSON.stringify(data));
				hideLoder();
				callback(data, targetLang);
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
	
	parent.generatImageAjaxCall = function(qryStr, base64Data, callback) { //xxxx this submittion is not working
        if(qryStr.length > 0 && base64Data.imageData.length > 0){
		   $.ajax({
				type: "POST",
				url: APIPATH + qryStr,
				data:base64Data,
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
	
	parent.sentMails = function() {
		$.ajax({
			type: "GET",
			url: APIPATH + "GETNOTSENTMAILS",
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
				var data = JSON.parse(data);
			},
			error: function(xhr, status, error) {
				//alert(JSON.stringify(xhr));
				hideLoder();
			}
		});
	},
	
	parent.getDefaultCurrency = function(){
		return '£';
	},
	/*---------------------------------------------------Common Service Consumptions---------------------------------*/
	
	/*---------------------------------------------------Language functionality Section------------------------------*/
	parent.getDefaultLang = function(){
		var languages = JSON.parse($("#langSerializedData").val());
		var defaultLanguage = languages.filter(function (langobj) { return parseInt(langobj.isDefault) === 1 });
		return defaultLanguage;
	},
	
	parent.getOtherLangs = function(){
		var languages = JSON.parse($("#langSerializedData").val());
		var otherLanguages = languages.filter(function (langobj) { return parseInt(langobj.isDefault) !== 1 });
		return otherLanguages;
	},
	
	parent.setLang = function(lang){
		localStorage.setItem('lang', lang);
	},
	
	parent.getLang = function(){
		return localStorage.getItem("lang");
	},
	
	parent.getCmsString = function(cmsId){
		var cmsText = '';
		var langInUse = appCommonFunctionality.getLang();
		if(LANGDATA.length > 0 && langInUse !== null){
			for(var i = 0; i < LANGDATA.length; i++){
				if(parseInt(LANGDATA[i].cmsId) === cmsId){
					cmsText = LANGDATA[i]["content_" + langInUse];
				}
			}
		}
		return cmsText;
	},
	
	parent.bindLangDDL = function(){
		var str = '';
		var langSerializedData = JSON.parse($("#langSerializedData").val());
		var langInUse = appCommonFunctionality.getLang();
		for(var i = 0; i < langSerializedData.length; i++){
			if(langSerializedData[i].sign === langInUse){
				str = str + '<option value="' + langSerializedData[i].sign + '" selected>' + langSerializedData[i].language + '</option>';
			}else{
				str = str + '<option value="' + langSerializedData[i].sign + '">' + langSerializedData[i].language + '</option>';
			}
		}
		$("#languageDDL").html(str);
	},
	
	parent.changeLang = function(langSign){
		setLang(langSign);
		cmsImplementationThroughID();
		cmsImplementationThroughRel();
	},
	
	parent.cmsImplementationThroughID = function(){
		var langInUse = appCommonFunctionality.getLang();
		//CMS implemented through ID
		$("[id^=cms_]").each(function(e){
			var objectArr = this.id.split("_");
			var cmsId = parseInt(objectArr[1]);
			//console.log("cmsId : ", cmsId); //Open if needed for debug
			for(var i = 0; i < LANGDATA.length; i++){
				if(parseInt(LANGDATA[i].cmsId) === cmsId && langInUse !== null){
					this.innerText = LANGDATA[i]["content_" + langInUse];
				}
			}
		});
		//CMS implemented through ID
	},
	
	parent.cmsImplementationThroughRel = function(){
		var langInUse = appCommonFunctionality.getLang();
		//CMS implemented through rel, cant use id
		$("[rel^=cms_]").each(function(e){
			var objectArr = this.attributes.rel.value.split("_");
			var cmsId = parseInt(objectArr[1]);
			for(var i = 0; i < LANGDATA.length; i++){
				if(parseInt(LANGDATA[i].cmsId) === cmsId && langInUse !== null){
					if(typeof this.attributes.type !== 'undefined'){
						var typeofinput = this.attributes.type.nodeValue;
						if(typeofinput === 'text' || typeofinput === 'number'){
							this.placeholder = LANGDATA[i]["content_" + langInUse];
						}else if(typeofinput === 'button' || typeofinput === 'submit'){
							this.innerText = LANGDATA[i]["content_" + langInUse];
						}
					}else{
						this.innerText = LANGDATA[i]["content_" + langInUse];
					}
				}
			}
		});
		//CMS implemented through rel, cant use id
	},
	
	parent.textToAudio = function(msg, lang){
		if (!msg || typeof msg !== "string") {
			console.error("Invalid message. Please provide a valid string.");
			return;
		}

		if ('speechSynthesis' in window) {
			let speech = new SpeechSynthesisUtterance();
			speech.lang = lang;
			speech.text = msg;
			speech.volume = 1; // Volume range: 0 to 1
			speech.rate = 1;   // Rate range: 0.1 to 10
			speech.pitch = 1;  // Pitch range: 0 to 2
			const voices = window.speechSynthesis.getVoices();
			if (voices.length) {
				voices.forEach(voice => {
					//console.log(voice.name, voice.lang);
				});
			} else {
				appCommonFunctionality.loadVoices();
			}
			window.speechSynthesis.speak(speech);
		} else {
			console.error("Speech synthesis is not supported in this browser.");
		}
	},
	
	parent.loadVoices = function(){
		// Load voices asynchronously
		window.speechSynthesis.onvoiceschanged = () => {
			window.speechSynthesis.getVoices().forEach(voice => {
				//console.log(voice.name, voice.lang);
			});
		};
	},
	/*---------------------------------------------------Language functionality Section------------------------------*/
	
    return parent;
}(window, window.$));