const SITETITLE = 'B2B2C';
const PROJECTPATH = 'http://educontrol.org/b2b2c/';
const APIPATH = `${PROJECTPATH}api/api.php?ACTION=`;
const PRECOMPILEDDATAPATH = `${PROJECTPATH}api/preCompiledData/`;
const PRODUCTPRECOMPILEDDATAPATH = `${PROJECTPATH}api/preCompiledData/products/`;
const ALLOWEDEXTENSIONS = ['jpg', 'jpeg', 'png'];
const CUSTREGFORMALLOWEDEXTENSIONS = ['application/pdf', 'image/jpg', 'image/jpeg', 'image/png'];
const PRODUCTIMAGEURL = 'uploads/products/';
const SITECOMMONIMAGE = `${PROJECTPATH}assets/images/logo.jpg`;
const QRCODEAPIURL = `${PROJECTPATH}api/qrcode.php?qr=${SITETITLE}_`;
const BARCODEAPIURL = `${PROJECTPATH}api/barcode.php?codetype=Code39&size=50&print=true&text=${SITETITLE}_`;
const LANGTRANSLATEAPI = 'https://api.mymemory.translated.net/get?q=';
const COUNTRYFLAGURL = "https://flagpedia.net/data/flags/h120/";

const LOADTIME = 5000;
const AJAXTIMEOUT = 36000000;
const MAXMOBILEWIDTHSUPPORT = 736;
const COMPANYTYPECoC = 'CoC';
const DEFAULTTAX = 19;
const DEFAULTADDRESS = '149-151 Daventry Road<br>Coventry CV3 5HD';
const DEFAULTPHONE = '07468093530';
const VATNUMBER = '378 083 956';

let   CMSDATA = '';
let   LANGUAGEPRECOMPILEDDATA = '';

const appCommonFunctionality = (function (window, $) {
	const parent = {};
	
	/*---------------------------------------------------Common Static Functions-------------------------------------*/
    parent.isMobile = function () { return window.outerWidth <= MAXMOBILEWIDTHSUPPORT; };
	
	parent.isMobile = function () { 
		return window.outerWidth <= MAXMOBILEWIDTHSUPPORT; 
	};

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

		$body.addClass("makeHazy").append(
			`<img id='loadingImg' src='${PROJECTPATH}assets/images/loading.svg' style='width:${loaderSize}px; height:${loaderSize}px;'>`
		);

		const leftSpace = ($(window).width() - loaderSize) / 2;
		const topSpace = ($(window).height() - loaderSize) / 2;

		$("#loadingImg").css({ position: "fixed", left: leftSpace, top: topSpace, "z-index": 9999 });
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

	parent.reloadPage = function () { 
		location.reload(); 
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

	parent.ajaxPreCompiledDataCall = function (qryStr, callback) {
		parent.ajaxCall(qryStr, callback, "POST", "", false);
	};

	parent.translateLanguage = function (textStr, sourceLang, targetLang, callback) {
		const apiUrl = `${LANGTRANSLATEAPI}${encodeURIComponent(textStr)}&langpair=${sourceLang}|${targetLang}`;
		parent.ajaxCall(apiUrl, function (data) {
			callback(data, targetLang);
		}, "POST");
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
		return '£';
	};
	/*---------------------------------------------------Common Service Consumptions---------------------------------*/
	
	/*---------------------------------------------------IndexedDB interactions--------------------------------------*/
	parent.continousLiveTimeTracker = function(){
		var liveTimeIntervalId = window.setInterval(function(){
		  appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=LIVETIME', getLiveTimeStore);
		}, LOADTIME);
	};
	
	const storeDataInIndexedDB = function(storeName, indexName, response) {
        try {
            const parsedResponse = JSON.parse(response);

            // First, open the database to get the current version
            const request = indexedDB.open(storeName);
            
            request.onsuccess = function(event) {
                const db = event.target.result;
                deleteOldDatabase(storeName);
				
                // Now open the database with the new version
                const upgradeRequest = indexedDB.open(storeName, 1);

                upgradeRequest.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    if (!db.objectStoreNames.contains(storeName)) {
                        const objectStore = db.createObjectStore(storeName, { keyPath: indexName });
                        objectStore.createIndex(indexName, indexName, { unique: true });
                    }
                };

                upgradeRequest.onsuccess = function (event) {
                    const db = event.target.result;
                    console.log(`${storeName} Database opened successfully`);
                    const transaction = db.transaction([storeName], "readwrite");
                    const objectStore = transaction.objectStore(storeName);

                    parsedResponse.forEach((object) => {
                        const addRequest = objectStore.add(object);
                        addRequest.onerror = (error) => console.error(`Error adding ${storeName} object:`, error);
                    });

                    transaction.oncomplete = function(){
						appCommonFunctionality.hideLoader();
						console.log(`All ${storeName} records added successfully.`);
					}
                };

                upgradeRequest.onerror = function (error) {
					appCommonFunctionality.hideLoader();
                    console.error(`Failed to open IndexedDB for ${storeName}:`, error);
                };
            };

            request.onerror = function (error) {
				appCommonFunctionality.hideLoader();
                console.error("Failed to open IndexedDB:", error);
            };

        } catch (error) {
			appCommonFunctionality.hideLoader();
            console.error(`Error processing ${storeName} response:`, error);
        }
    };
	
	const deleteOldDatabase = function(databaseName) {
        const deleteRequest = indexedDB.deleteDatabase(databaseName);

        deleteRequest.onsuccess = function() {
            console.log(`Successfully deleted the old IndexedDB: ${databaseName}`);
        };

        deleteRequest.onerror = function(error) {
            console.error(`Error deleting the old IndexedDB: ${databaseName}`, error);
        };
    };
	
	parent.getIndexedDBSize = function(){
		navigator.storage.estimate().then((estimate) => {
			console.log(`Quota: ${estimate.quota} bytes`);
			console.log(`Usage: ${estimate.usage} bytes`);
		});
	};
	
	parent.checkIndexedDBDataExistance = function(storeName, key) { //just check if data exists in the store
		return new Promise((resolve, reject) => {
			// Open the IndexedDB
			const request = indexedDB.open(storeName);

			request.onsuccess = (event) => {
				const db = event.target.result;

				// Start a transaction and access the store
				const transaction = db.transaction([storeName], "readonly");
				const store = transaction.objectStore(storeName);

				// Check if the key exists in the store
				const getRequest = store.get(key);

				getRequest.onsuccess = () => {
					if (getRequest.result) {
						resolve(true); // Data exists
					} else {
						resolve(false); // Data doesn't exist
					}
				};

				getRequest.onerror = () => {
					reject("Error retrieving data from IndexedDB");
				};
			};

			request.onerror = () => {
				reject("Error opening IndexedDB");
			};
		});
	};
	
	parent.fetchIndexedDBData = function(storeName) {
		return new Promise((resolve, reject) => {
			// First, open the database to get the current version
			const request = indexedDB.open(storeName);

			request.onsuccess = function(event) {
				const db = event.target.result;
				//console.log("Database opened successfully.");
				
				const transaction = db.transaction([storeName], "readonly");
				const objectStore = transaction.objectStore(storeName);
				const getAllRequest = objectStore.getAll();
				
				getAllRequest.onsuccess = function() {
					const objects = getAllRequest.result;
					//console.log("Fetched objects:", objects);
					// Resolve the promise with the fetched objects
					resolve(objects);
				};

				getAllRequest.onerror = function(error) {
					console.error("Error fetching objects:", error);
					// Reject the promise with the error
					reject(error);
				};
			};

			request.onerror = function(error) {
				console.error("Error opening database:", error);
				// Reject the promise with the error
				reject(error);
			};
		});
	};
	
	parent.updateIndexedDBData = function(storeName, key, updatedData) {
		let request = indexedDB.open(storeName, 1);

		request.onsuccess = function (event) {
			let db = event.target.result;
			let transaction = db.transaction([storeName], "readwrite");
			let store = transaction.objectStore(storeName);
			
			// Get the existing record
			let getRequest = store.get(key);
			getRequest.onsuccess = function () {
				let data = getRequest.result;
				if (data) {
					// Merge updated data
					Object.assign(data, updatedData);

					// Put the updated record back
					let updateRequest = store.put(data);
					updateRequest.onsuccess = function () {
						console.log("Record updated successfully");
					};
					updateRequest.onerror = function () {
						console.log("Error updating record");
					};
				} else {
					console.log("Record not found");
				}
			};
			getRequest.onerror = function () {
				console.log("Error retrieving record");
			};
		};

		request.onerror = function () {
			console.log("Error opening database");
		};
	};
	
	const getLiveTimeStore = function(response) {
		const existingLiveTimeStr = localStorage.getItem('LIVETIME');
		const currentLiveTime = JSON.parse(response);
		if (existingLiveTimeStr === null) {
			localStorage.setItem('LIVETIME', response);
			currentLiveTime.forEach(item => {
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=' + item.objectName, (response) => {
					storeDataInIndexedDB(item.objectName, item.objectId, response);
				});
			});
		} else {
			const existingLiveTime = JSON.parse(existingLiveTimeStr);
			existingLiveTime.forEach((existingItem, index) => {
				const currentItem = currentLiveTime[index];
				if (existingItem.objectName === currentItem.objectName &&
					existingItem.lastUpdatedTime !== currentItem.lastUpdatedTime) {
					appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=' + currentItem.objectName, (response) => {
						storeDataInIndexedDB(currentItem.objectName, currentItem.objectId, response);
					});
				}
			});
			localStorage.setItem('LIVETIME', JSON.stringify(currentLiveTime));
		}
	};
	
	parent.checkAllSet = function(){
		const existingLiveTimeStr = localStorage.getItem('LIVETIME');
		try{
			if (existingLiveTimeStr !== null) {
				const existingLiveTime = JSON.parse(existingLiveTimeStr);
				const allExist = existingLiveTime.every(item => 
					parent.checkIndexedDBDataExistance(item.objectName, item.objectId)
				);
				return allExist;
			}
		}catch (error) {
			return false;
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
	parent.adminCommonActivity = function(){
		parent.toggleSidebar();
		parent.continousLiveTimeTracker();
		
		let allSetTimer = setTimeout(() => {
			if(parent.checkAllSet()){
				parent.fetchIndexedDBData('LANGUAGE').then(objects => {
					//console.log("Fetched objects from IndexedDB:", objects);
					LANGUAGEPRECOMPILEDDATA = objects;
					if(parent.getLang() === null){
						var defalutLang = parent.getDefaultLang();
						parent.setLang(defalutLang[0].sign);
					}
					if(LANGUAGEPRECOMPILEDDATA.length > 0 && $("#CMSDATA").length > 0){
						if(LANGUAGEPRECOMPILEDDATA.length > 0){
							parent.bindLangDDL();
						}
						if($("#CMSDATA").val().length > 0){
							CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
						}
					}
				})
				.catch(error => {
					console.error("Failed to fetch objects from IndexedDB:", error);
				});
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
	/*---------------------------------------------------Common Admin functionality Section--------------------------*/
	
	return parent;
})(window, jQuery);
