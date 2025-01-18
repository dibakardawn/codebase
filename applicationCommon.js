LOADTIME = 1000;
AJAXTIMEOUT = 36000000;
MAXMOBILEWIDTHSUPPORT = 736;

SITETITLE = 'LLID'; 
PROJECTPATH = 'http://educontrol.org/LLID/';
APIPATH = PROJECTPATH + 'api/api.php?ACTION=';
PRECOMPILEDDATAPATH = PROJECTPATH + 'api/preCompiledData/';


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
	}
});

appCommonFunctionality = (function(window, $) {

    /*---------------------------------------------------Common Static Functions-------------------------------------*/
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
	/*---------------------------------------------------Common Service Consumptions---------------------------------*/
	
    return parent;
}(window, window.$));