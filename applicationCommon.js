const SITETITLE = 'B2B2C';
const PROJECTPATH = 'http://educontrol.org/b2b2c/';
const APIPATH = `${PROJECTPATH}api/api.php?ACTION=`;
const PRECOMPILEDDATAPATH = `${PROJECTPATH}api/preCompiledData/`;
const PRODUCTPRECOMPILEDDATAPATH = `${PROJECTPATH}api/preCompiledData/products/`;
const ALLOWEDEXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const CUSTREGFORMALLOWEDEXTENSIONS = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];
const PRODUCTIMAGEURL = 'uploads/products/';
const SITECOMMONIMAGE = `${PROJECTPATH}assets/images/logo.jpg`;
const QRCODEAPIURL = `${PROJECTPATH}api/qrcode.php?qr=${SITETITLE}_`;
const BARCODEAPIURL = `${PROJECTPATH}api/barcode.php?codetype=Code39&size=50&print=true&text=${SITETITLE}_`;
const LANGTRANSLATEAPI = 'https://api.mymemory.translated.net/get?q=';
const COUNTRYFLAGURL = "https://flagpedia.net/data/flags/h120/";

const PRODUCTSTOCKINDIVIDUALIDENTITY = false;
const LOADTIME = 1000;
const AJAXTIMEOUT = 36000000;
const MAXMOBILEWIDTHSUPPORT = 736;
const COMPANYTYPECoC = 'CoC';
let   ALLSET = false;
let   CMSDATA = '';
let   LANGUAGEPRECOMPILEDDATA = '';
// Set the localForage driver to IndexedDB (default)
localforage.setDriver(localforage.INDEXEDDB);

const appCommonFunctionality = (function (window, $) {
	const parent = {};
	
	/*---------------------------------------------------Common Static Functions-------------------------------------*/
    parent.isMobile = function () { return window.outerWidth <= MAXMOBILEWIDTHSUPPORT; };

	parent.shapeString = function (str, i) { 
		return str.length > i ? str.substring(0, i) : str; 
	};

	parent.ObjectLength = function (object) { 
		return Object.keys(object).length; 
	};

	parent.makeArrayUnique = function (arr) { 
		return [...new Set(arr)]; 
	};

	parent.getOccurrenceInArray = function (array, value) { 
		return array.filter(v => v === value).length; 
	};

	parent.findDuplicateArrayElements = function (arr) {
		const countMap = arr.reduce((acc, val) => {
			acc[val] = (acc[val] || 0) + 1;
			return acc;
		}, {});
		return Object.keys(countMap).filter(key => countMap[key] > 1);
	};

	parent.allElementsFromUrl = function () { 
		return window.location.href.split('/'); 
	};

	parent.lastElementFromUrl = function () {
		const parts = window.location.href.split('/');
		return parts[parts.length - 1];
	};

	parent.getPageName = function () { 
		return location.pathname.split('/').pop(); 
	};

	parent.getUrlParameter = function (param) {
		const params = new URLSearchParams(window.location.search);
		return params.has(param) ? params.get(param) : false;
	};

	parent.showPromptMsg = function (msg) {
		const promptMsgW = 240, promptMsgH = 72;
		const $body = $('body');

		$body.addClass("makeHazy").append(
			`<div id='promptMsg' class='promptMsg' style='width:${promptMsgW}px; height:${promptMsgH}px;'>${msg}</div>`
		);

		const leftSpace = ($(window).width() - promptMsgW) / 2;
		const topSpace = ($(window).height() - promptMsgH) / 2;

		$("#promptMsg").css({ position: "fixed", left: leftSpace, top: topSpace, "z-index": 9999 });

		setTimeout(function () {
			$body.removeClass("makeHazy");
			$("#promptMsg").remove();
		}, 1000);
	};

	parent.showLoader = function () {
		const loaderSize = 100;
		const $body = $('body');

		if (!$body.hasClass("makeHazy")) {
			$body.addClass("makeHazy").append(
				`<img id='loadingImg' src='${PROJECTPATH}assets/images/loading.svg' style='width:${loaderSize}px; height:${loaderSize}px;'>`
			);

			const leftSpace = ($(window).width() - loaderSize) / 2;
			const topSpace = ($(window).height() - loaderSize) / 2;

			$("#loadingImg").css({ position: "fixed", left: leftSpace, top: topSpace, "z-index": 9999 });
		}
	};

	parent.hideLoader = function () {
		$('body').removeClass("makeHazy");
		$("#loadingImg").remove();
	};

	parent.raiseValidation = function (inputId, validationText, appendWithParent = false) {
		const inputObj = appendWithParent ? $(`#${inputId}`).parent() : $(`#${inputId}`);

		if (!inputObj.hasClass("validationError")) {
			inputObj.addClass("validationError");

			if (!parent.isMobile() && validationText) {
				inputObj.after(`<div id='${inputId}_validationText' class='redText'>${validationText}</div>`);
			} else {
				$("#alertMessege .msgContent").html(validationText);
				$("#alertMessege").show();
			}
		} else if ($(`#${inputId}_validationText`).length) {
			$(`#${inputId}_validationText`).remove();
			if (validationText) {
				inputObj.after(`<div id='${inputId}_validationText' class='redText'>${validationText}</div>`);
			}
		}
	};

	parent.removeValidation = function (selector, inputId, detachWithParent = false) {
		const inputObj = detachWithParent ? $(`#${selector}`).parent() : $(`#${selector}`);

		if (inputObj.hasClass("validationError")) {
			inputObj.removeClass("validationError");

			if (!parent.isMobile()) {
				$(`#${inputId}_validationText`).remove();
			} else {
				$("#alertMessege .msgContent").html("");
				$("#alertMessege").hide();
			}
		}
	};

	parent.emailRegexValidation = function (email) { 
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
	};

	parent.capitalizeFirstLetter = function (str) { 
		return str.charAt(0).toUpperCase() + str.slice(1); 
	};

	parent.capitalizeInputValue = function (inputId) {
		const $input = $(`#${inputId}`);
		$input.val($input.val().toUpperCase());
	};

	parent.decapitalizeInputValue = function (inputId) {
		const $input = $(`#${inputId}`);
		$input.val($input.val().toLowerCase());
	};

	parent.deselectDropDown = function (dropdownId) { 
		$(`#${dropdownId}`).prop('selectedIndex', -1); 
	};

	parent.startTimer = function (duration, display) {
		let timer = duration;

		setInterval(function () {
			let minutes = String(Math.floor(timer / 60)).padStart(2, "0");
			let seconds = String(timer % 60).padStart(2, "0");

			display.text(`${minutes}:${seconds}`);

			if (--timer < 0) {
				timer = duration;
			}
		}, 1000);
	};

	parent.addZeroesToNumber = function (str, max) { 
		return str.toString().padStart(max, "0"); 
	};

	parent.socialShare = function (title, url, desc) {
		if (navigator.share) {
			navigator.share({ title, text: desc, url }).catch(console.error);
		} else {
			const shareURL = parent.isMobile()
				? `whatsapp://send?text=${title} - ${url}`
				: `https://web.whatsapp.com/send?text=${title} - ${url}`;
			window.open(shareURL, '_blank');
		}
	};

	parent.copyToClipboard = function (text) {
		navigator.clipboard.writeText(text)
			.then(() => parent.showPromptMsg('Text Copied!'))
			.catch(err => console.error("Failed to copy text:", err));
	};

	parent.numberToWords = function (num) {
		if (num > 999999999) return 'overflow';

		const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ',
			'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
		const b = ['', '', 'twenty ', 'thirty ', 'forty ', 'fifty ', 'sixty ', 'seventy ', 'eighty ', 'ninety '];

		const n = num.toString().padStart(9, '0').match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
		if (!n) return '';

		return [
			n[1] != 0 ? (a[n[1]] || b[n[1][0]] + a[n[1][1]]) + 'crore ' : '',
			n[2] != 0 ? (a[n[2]] || b[n[2][0]] + a[n[2][1]]) + 'lakh ' : '',
			n[3] != 0 ? (a[n[3]] || b[n[3][0]] + a[n[3][1]]) + 'thousand ' : '',
			n[4] != 0 ? (a[n[4]] || b[n[4][0]] + a[n[4][1]]) + 'hundred ' : '',
			n[5] != 0 ? ((n[1] || n[2] || n[3] || n[4]) ? 'and ' : '') + (a[n[5]] || b[n[5][0]] + a[n[5][1]]) + 'only' : ''
		].join('');
	};
	
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
	
	parent.reloadPage = function () { 
		location.reload(true); 
	};
	/*---------------------------------------------------Common Static Functions-------------------------------------*/
	
	/*---------------------------------------------------Common Service Consumptions---------------------------------*/
	parent.ajaxCall = function (qryStr, callback, type = "POST", data = "", showLoader = true, async = true) {
		$.ajax({
			type: type,
			url: APIPATH + qryStr,
			async: async,
			timeout: AJAXTIMEOUT,
			data: data,
			beforeSend: function () {
				if(showLoader){
					parent.showLoader();
				}
			},
			success: function (response) {
				parent.hideLoader();
				callback(response);
			},
			error: function (xhr, status, error) {
				console.error(`AJAX Error: ${error}`, xhr);
				parent.hideLoader();
			}
		});
	};

	parent.ajaxCallLargeData = function (qryStr, callData, callback) {
		parent.ajaxCall(qryStr, callback, "POST", callData);
	};
	
	parent.ajaxPreCompiledDataCall = function (qryStr, showLoader = true) {
		return $.ajax({
            type: "POST",
            url: APIPATH + qryStr,
            timeout: AJAXTIMEOUT,
            beforeSend: function() {
				if(showLoader){
					appCommonFunctionality.showLoader();
				}
            }
        });
	};

	parent.translateLanguage = function (textStr, sourceLang, targetLang, callback) {
		$.ajax({
			type: "POST",
			url: LANGTRANSLATEAPI + encodeURI(textStr) + '&langpair=' + sourceLang + '|' + targetLang,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: {},
			beforeSend: function(xhr) {
				parent.showLoader();
			},
			success: function(data) {
				//alert(JSON.stringify(data));
				parent.hideLoader();
				callback(data, targetLang);
			},
			error: function(xhr, status, error) {
				//alert(JSON.stringify(xhr));
				parent.hideLoader();
			}
		});
	};

	parent.fileUploadAjaxCall = function (qryStr, fieldName, callback) {
		const fd = new FormData();
		const files = document.getElementById(fieldName).files;
		
		if (files.length > 0) {
			fd.append('file', files[0]);
			parent.ajaxCall(qryStr, callback, "POST", fd, false);
		} else {
			console.warn("No file selected for upload.");
		}
	};

	parent.generateImageAjaxCall = function (qryStr, base64Data, callback) {
		if (qryStr.length > 0 && base64Data.imageData.length > 0) {
			parent.ajaxCall(qryStr, callback, "POST", base64Data, false);
		} else {
			console.warn("Invalid request: Missing query string or image data.");
		}
	};

	parent.sendMails = function () {
		parent.ajaxCall("GETNOTSENTMAILS", function (data) {
			console.log("Mails Sent Successfully:", JSON.parse(data));
		});
	};

	parent.getDefaultCurrency = function () {
		return appCommonFunctionality.getDefaultData('CURRENCY').currencySign;
	};
	
	parent.getDefaultData = function(identifire){
		const projectInformationData = JSON.parse($('#projectInformationData').val());
		switch (identifire) {
			
			case "COUNTRY":
				return {
					country: projectInformationData?.defaultInformation?.country || null,
					countryId: projectInformationData?.defaultInformation?.countryId || null
				};
				
			case "CURRENCY":
				return {
					currency: projectInformationData?.defaultInformation?.currency || null,
					currencySign: projectInformationData?.defaultInformation?.currencySign || null
				};
				
			case "TAX":
				return projectInformationData?.defaultInformation?.tax || null;
				
			case "ADMINMAIL":
				return projectInformationData?.defaultInformation?.adminMail || null;
				
			case "SYSTEMMAIL":
				return projectInformationData?.defaultInformation?.systemMail || null;
				
			case "SYSREFPREFIX":
				return projectInformationData?.defaultInformation?.systemReferencePrefix || null;
				
			default:
				return null;
		}
	};
	/*---------------------------------------------------Common Service Consumptions---------------------------------*/
	
	/*---------------------------------------------------IndexedDB interactions--------------------------------------*/
	parent.continousLiveTimeTracker = function() {
        const liveTimeIntervalId = window.setInterval(() => {
			$.when(
				parent.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=LIVETIME', false)
			).done(function(response) {
				parent.hideLoader();
				getLiveTimeStore(response);
			}).fail(function() {
				parent.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
        }, LOADTIME);
    };
	
	const getLiveTimeStore = async (response) => {
        const existingLiveTimeStr = localStorage.getItem('LIVETIME');
        const currentLiveTime = JSON.parse(response);
        if (existingLiveTimeStr === null) { // for the first time
            localStorage.setItem('LIVETIME', response);
            for (const item of currentLiveTime) {
				$.when(
					parent.ajaxPreCompiledDataCall(`PRECOMPILEDDATA&type=${item.objectName}`, false)
				).done(function(response) {
					parent.hideLoader();
					storePrecompliedData(item.objectName, response);
				}).fail(function() {
					parent.hideLoader();
					console.error('Error in one or both AJAX calls');
				});
            }
        } else {
            const existingLiveTime = JSON.parse(existingLiveTimeStr);
            for (const [index, existingItem] of existingLiveTime.entries()) {
                const currentItem = currentLiveTime[index];
                if (existingItem.objectName === currentItem.objectName &&
                    existingItem.lastUpdatedTime !== currentItem.lastUpdatedTime) {
					$.when(
						parent.ajaxPreCompiledDataCall(`PRECOMPILEDDATA&type=${currentItem.objectName}`, false)
					).done(function(response) {
						parent.hideLoader();
						storePrecompliedData(currentItem.objectName, response);
					}).fail(function() {
						parent.hideLoader();
						console.error('Error in one or both AJAX calls');
					});
                }
            }
            localStorage.setItem('LIVETIME', JSON.stringify(currentLiveTime));
        }
    };
	
	const storePrecompliedData = (objectName, precompiledResponse) => {
		console.log(`Saved Object Name: ${objectName}`);
		//console.log(`Response: ${response}`);
		localforage.setItem(objectName, precompiledResponse).then(function () {
			//console.log('Data has been saved');
			ALLSET = true;
		}).catch(function (err) {
			console.error('Error saving data:', err);
			ALLSET = false;
		});
	};

	parent.readPrecompliedData = async function(objectName) {
		try {
			const value = await localforage.getItem(objectName);
			//console.log('Retrieved data:', value);
			return value;
		} catch (err) {
			console.error('Error retrieving data:', err);
			return null;
		}
	};
	
	parent.checkIndexedDBDataExistance = function(key) {
		return localforage.getItem(key).then((value) => {
			if (value === null) {
				//console.log(`Key "${key}" does not exist.`);
				return false;
			} else {
				//console.log(`Key "${key}" exists.`);
				return true;
			}
		}).catch((err) => {
			//console.error(`Error checking key "${key}":`, err);
			return false;
		});
	};
	
	parent.getIndexedDBSize = function(){
		navigator.storage.estimate().then((estimate) => {
			console.log(`Quota: ${estimate.quota} bytes`);
			console.log(`Usage: ${estimate.usage} bytes`);
		});
	};

	parent.checkAllSet = async function() {
        const existingLiveTimeStr = localStorage.getItem('LIVETIME');
        if (existingLiveTimeStr !== null) {
            const existingLiveTime = JSON.parse(existingLiveTimeStr);
            for (const item of existingLiveTime) {
                const exists = await parent.checkIndexedDBDataExistance(item.objectName, item.objectId);
                if (!exists) return false;
            }
            return true;
        }
        return false;
    };
	/*---------------------------------------------------IndexedDB interactions--------------------------------------*/
	
	/*---------------------------------------------------Language functionality Section------------------------------*/
	parent.getDefaultLang = function(){
		var defaultLanguage = LANGUAGEPRECOMPILEDDATA.filter(function (langobj) { return parseInt(langobj.isDefault) === 1 });
		return defaultLanguage;
	};
	
	parent.getOtherLangs = function(){
		var otherLanguages = LANGUAGEPRECOMPILEDDATA.filter(function (langobj) { return parseInt(langobj.isDefault) !== 1 });
		return otherLanguages;
	};
	
	parent.setLang = function(lang){
		localStorage.setItem('lang', lang);
	};
	
	parent.getLang = function(){
		return localStorage.getItem("lang");
	};
	
	parent.getCmsString = function(cmsId){
		var cmsText = '';
		var langInUse = appCommonFunctionality.getLang();
		if(CMSDATA.length > 0 && langInUse !== null){
			for(var i = 0; i < CMSDATA.length; i++){
				if(parseInt(CMSDATA[i].cmsId) === cmsId){
					cmsText = CMSDATA[i]["content_" + langInUse];
				}
			}
		}
		return cmsText;
	};
	
	parent.bindLangDDL = function(){
		var str = '';
		var langInUse = appCommonFunctionality.getLang();
		for(var i = 0; i < LANGUAGEPRECOMPILEDDATA.length; i++){
			if(LANGUAGEPRECOMPILEDDATA[i].sign === langInUse){
				str = str + '<option value="' + LANGUAGEPRECOMPILEDDATA[i].sign + '" selected>' + LANGUAGEPRECOMPILEDDATA[i].language + '</option>';
			}else{
				str = str + '<option value="' + LANGUAGEPRECOMPILEDDATA[i].sign + '">' + LANGUAGEPRECOMPILEDDATA[i].language + '</option>';
			}
		}
		$("#languageDDL").html(str);
	};
	
	parent.changeLang = function(langSign){
		parent.setLang(langSign);
		parent.cmsImplementationThroughID();
		parent.cmsImplementationThroughRel();
	};
	
	parent.cmsImplementationThroughID = function(){
		var langInUse = appCommonFunctionality.getLang();
		//CMS implemented through ID
		$("[id^=cms_]").each(function(e){
			var objectArr = this.id.split("_");
			var cmsId = parseInt(objectArr[1]);
			//console.log("cmsId : ", cmsId); //Open if needed for debug
			for(var i = 0; i < CMSDATA.length; i++){
				if(parseInt(CMSDATA[i].cmsId) === cmsId && langInUse !== null){
					this.innerText = CMSDATA[i]["content_" + langInUse];
				}
			}
		});
		//CMS implemented through ID
	};
	
	parent.cmsImplementationThroughRel = function(){
		var langInUse = appCommonFunctionality.getLang();
		//CMS implemented through rel, cant use id
		$("[rel^=cms_]").each(function(e){
			var objectArr = this.attributes.rel.value.split("_");
			var cmsId = parseInt(objectArr[1]);
			for(var i = 0; i < CMSDATA.length; i++){
				if(parseInt(CMSDATA[i].cmsId) === cmsId && langInUse !== null){
					if(typeof this.attributes.type !== 'undefined'){
						var typeofinput = this.attributes.type.nodeValue;
						if(typeofinput === 'text' || typeofinput === 'number'){
							this.placeholder = CMSDATA[i]["content_" + langInUse];
						}else if(typeofinput === 'button' || typeofinput === 'submit'){
							this.innerText = CMSDATA[i]["content_" + langInUse];
						}
					}else{
						this.innerText = CMSDATA[i]["content_" + langInUse];
					}
				}
			}
		});
		//CMS implemented through rel, cant use id
	};
	
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
	};
	
	parent.loadVoices = function(){
		// Load voices asynchronously
		window.speechSynthesis.onvoiceschanged = () => {
			window.speechSynthesis.getVoices().forEach(voice => {
				//console.log(voice.name, voice.lang);
			});
		};
	};
	/*---------------------------------------------------Language functionality Section------------------------------*/
	
	/*---------------------------------------------------Common Admin functionality Section--------------------------*/
	parent.adminCommonActivity = async function() {
		parent.toggleSidebar();
		parent.continousLiveTimeTracker();
		let allSetTimer = setTimeout(async () => {
			if (await parent.checkAllSet()) {
				LANGUAGEPRECOMPILEDDATA = await parent.readPrecompliedData('LANGUAGE');
				LANGUAGEPRECOMPILEDDATA = JSON.parse(LANGUAGEPRECOMPILEDDATA);
				if (parent.getLang() === null) {
					var defalutLang = parent.getDefaultLang();
					parent.setLang(defalutLang[0].sign);
				}
				if (LANGUAGEPRECOMPILEDDATA.length > 0 && $("#CMSDATA").length > 0) {
					if (LANGUAGEPRECOMPILEDDATA.length > 0) {
						parent.bindLangDDL();
					}
					if ($("#CMSDATA").val().length > 0) {
						CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
						appCommonFunctionality.cmsImplementationThroughID();
						appCommonFunctionality.cmsImplementationThroughRel();
					}
				}
				clearTimeout(allSetTimer);
			}
		}, 500);
	};
	
	parent.getCountryName = function(countryId, includeFlag) {
		let str = '';
		if (COUNTRYPRECOMPILEDDATA.length > 0) {
			const countryData = COUNTRYPRECOMPILEDDATA.find(item => parseInt(item.countryId) === parseInt(countryId));
			if (countryData) {
				str = `<span>${countryData.country}</span>`;
				if (includeFlag) {
					str += `<span class="marleft5"><img src="${COUNTRYFLAGURL}${countryData.countryCode.toLowerCase()}.png" class="w24 h18"></span>`;
				}
			}
		}
		return str;
	};
	
	parent.bindCountryDropdown = function(ddlId, defaultOptionCMSid) {
		let str = `<option value="" id="cms_${defaultOptionCMSid}">-- Select Country --</option>`;

		if (COUNTRYPRECOMPILEDDATA.length > 0) {
			COUNTRYPRECOMPILEDDATA.forEach(country => {
				str += `<option value="${country.countryId}" id="${country.countryCode}">${country.country}</option>`;
			});
			$(`#${ddlId}`).html(str);
		}

		const $countryHdn = $("#countryHdn");
		if ($countryHdn.length > 0) {
			const countryVal = $countryHdn.val();
			$(`#${ddlId}`).val(countryVal).trigger("change");
		}
	};
	
	parent.toggleSidebar = function() { // Admin use only
		const $menuIcon = $("#adminHeaderHamburgerMenu");
		const $sidebar = $("#mySidebar");
		const $main = $('.w3-main');
		
		const isOpen = $menuIcon.hasClass("fa-close");
		const sidebarWidth = isOpen ? '0px' : '300px';
		const mainMargin = isOpen ? '0px' : '300px';

		// Toggle menu icon
		$menuIcon.toggleClass("fa-close fa-bars");
		
		// Set sidebar width and main margin
		$sidebar.css({
			"width": sidebarWidth,
			"display": isOpen ? 'none' : 'block'
		}).toggleClass("w3-collapse", isOpen);

		$main.css("margin-left", mainMargin);
	};
	
	parent.adjustMainContainerHight = function(mainSectionId){ // Admin use only
		var winH = $(window).height();
		var mainSectionH = winH - 54 - 48 - 85; /* Header  :: 54px ; Footer :: 48px; Over all Margin & Padding :: 85;*/
		$("#" + mainSectionId).css("min-height", mainSectionH + "px");
	};
	
	parent.checkCustomerEmailExists = function(){
		var email = $("#email").val();
		appCommonFunctionality.ajaxCall('CHECKCUSTOMEREMAILEXISTS&email=' + email, appCommonFunctionality.showEmailStatus);
	};
	
	parent.showEmailStatus = function(data){
		var data = JSON.parse(data);
		$("#emailInfoIcon, #emailOkIcon, #emailCrossIcon").addClass('hide');
		if(parseInt(data.responseCode) === 0){
			$("#emailCrossIcon").removeClass('hide');
		}else if(parseInt(data.responseCode) === 1){
			$("#emailOkIcon").removeClass('hide');
			appCommonFunctionality.removeValidation("email", "email", false);
		}
	};
	/*---------------------------------------------------Common Admin functionality Section--------------------------*/
	
	return parent;
})(window, jQuery);
