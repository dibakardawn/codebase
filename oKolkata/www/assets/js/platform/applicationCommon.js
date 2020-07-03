LOADTIME = 60000; // 60 seconds
AJAXTIMEOUT = 36000000;
MAXMOBILEWIDTHSUPPORT = 736;
POSTENDLIMIT = 500;
CATPOSTENDLIMIT = 200;
APPHEIGHTADJUSTED = false;

PROJECTPATH = 'https://okolkata.in/';

LASTTIMEAPIPATH = PROJECTPATH + 'api/api.php?MODE=RESPONSETIME';
CATEGORYAPIPATH = PROJECTPATH + 'api/api.php?MODE=CATEGORIES';
MENUAPIPATH = PROJECTPATH + 'api/api.php?MODE=MENU';
TAGCLOUDAPIPATH = PROJECTPATH + 'api/api.php?MODE=TAGCLOUD';
SETTINGSAPIPATH = PROJECTPATH + 'api/api.php?MODE=SETTINGS';

POSTLISTAPIPATH = PROJECTPATH + 'api/api.php?MODE=POSTS';
SEARCHPOSTLISTAPIPATH = PROJECTPATH + 'api/api.php?MODE=SEARCH';
INDIVIDUALPOSTAPIPATH = PROJECTPATH + 'api/api.php?MODE=POST';
USERSPECIFICPOSTAPIPATH = PROJECTPATH + 'api/api.php?MODE=USER';

$(document).ready(function () {
		//alert(location.protocol + '//' + location.hostname+(location.port ? ':'+location.port: ''));
		appCommonFunctionality.toggleHamburgarMenu();
		appCommonFunctionality.placeBannerImage();
		
		if (localStorage.getItem('LASTTIMERESPONSE') === null) {
			appCommonFunctionality.fetchLastTimeResponse();
		} else {
			appCommonFunctionality.bindSideMenu();
			appCommonFunctionality.commonEvents();
			appCommonFunctionality.bindPosts();
			appCommonFunctionality.bindTagCloud();
			appCommonFunctionality.bindSocialMedia();
			appCommonFunctionality.bindFooterText();
			appCommonFunctionality.bindTagCloudHeader();
			appCommonFunctionality.screenHeightAdjustment();
		}

		setInterval(function () {
			appCommonFunctionality.fetchLastTimeResponse();
		}, LOADTIME);
	});

appCommonFunctionality = (function (window, $) {

	/*---------------------------------------------------Common Functionality-------------------------------------*/

	parent.isMobile = function () {
		var isMobileView = false;
		if (window.outerWidth <= MAXMOBILEWIDTHSUPPORT) {
			isMobileView = true;
		}
		//return isMobileView; //It will be always true for this project only.
		return true;
	},

	parent.shapeString = function (str, i) {
		if (str.length > i) {
			str = str.substring(0, i) + "...";
		}
		return str;
	},

	parent.ObjectLength = function (object) {
		var length = 0;
		for (var key in object) {
			if (object.hasOwnProperty(key)) {
				++length;
			}
		}
		return length;
	},

	parent.allElementsFromUrl = function () {
		var url = window.location.href;
		var paramArr = url.split('/');
		return paramArr;
	},

	parent.lastElementFromUrl = function () {
		var url = window.location.href;
		var paramArr = url.split('/');
		var pagenameUrl = paramArr[paramArr.length - 1];
		return pagenameUrl;
	},

	parent.cammelCaseToNormalString = function (str) {
		return str.replace(/([A-Z])/g, ' $1').trim();
	},
	
	parent.ucFirst = function(str) {
		return str = str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
	},

	parent.convertLetterToUppercaseAfterEverySpace = function(str) {
		str.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			return letter.toUpperCase();
		});
	},

	parent.showPomptMsg = function (msg) {
		var pomptMsgH = 72;
		var pomptMsgW = 240;
		$('body').append("<div id='pomptMsg' class='pomptMsg text-center' style='width:" + pomptMsgW + "px; height:" + pomptMsgH + "px;'>" + msg + "</div>");
		var leftSpace = (($(window).width() / 2) - (pomptMsgW / 2));
		var topSpace = (($(window).height() / 2) - (pomptMsgH / 2));
		$("#pomptMsg").css("position", "fixed").css("left", leftSpace).css("top", topSpace).css("z-index", 9999);
		var pomptMsgIntervalId = window.setInterval(function () {
			$("#pomptMsg").remove();
			clearInterval(pomptMsgIntervalId);
		}, 1000);
	},

	parent.showLoder = function () {
		if (!$('body').hasClass("makeHazy")) {
			var loaderWH = 200;
			$('body').addClass("makeHazy").append("<img id='loadingImg' src='assets/images/loading.svg' style='width:" + loaderWH + "px; height:" + loaderWH + "px;'>");
			var leftSpace = (($(window).width() / 2) - (loaderWH / 2));
			var topSpace = (($(window).height() / 2) - (loaderWH / 2));
			$("#loadingImg").css("position", "fixed").css("left", leftSpace).css("top", topSpace).css("z-index", 9999);
		}
	},

	parent.hideLoder = function () {
		$('body').removeClass("makeHazy");
		$("#loadingImg").remove();
	},

	parent.imgError = function (image) {
		image.onerror = "";
		image.src = PROJECTPATH + "assets/images/noImageFound.png";
		return true;
	},

	parent.makeArrayUnique = function (list) {
		var result = [];
		$.each(list, function (i, e) {
			if ($.inArray(e, result) == -1) result.push(e);
		});
		return result;
	},

	parent.sortArray = function (a, b) {
		return a - b;
	},

	parent.sortArrayOfObjects = function (a, b) {
		if (a[0] === b[0]) {
			return 0;
		} else {
			return (a[0] < b[0]) ? -1 : 1;
		}
	},

	parent.UrlExists = function (url) {
		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		return http.status != 404;
	},

	parent.getExtFile = function (filename) {
		return filename.substr((filename.lastIndexOf('.') + 1));
	},

	parent.goToHome = function () {
		window.location.href = "index.html";
	},
	/*---------------------------------------------------Common Functionality-------------------------------------*/

	/*---------------------------------------------------API ~ Local Storage Functionality------------------------*/

	parent.fetchLastTimeResponse = function () {
		$.ajax({
			type: "GET",
			url: LASTTIMEAPIPATH,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				//showLoder();
			},
			success: function (data) {
				//alert(JSON.stringify(data));
				//hideLoder();
				makeDecisionToCallOtherAPIs(data);
			},
			error: function (xhr, status, error) {
				//alert(JSON.stringify(xhr));
				//hideLoder();
			}
		});
	},

	makeDecisionToCallOtherAPIs = function (data) {
		if (localStorage.getItem('LASTTIMERESPONSE') === null) {
			callStaticResponse();
			fetchPosts(0 ,0);
			localStorage.setItem('LASTTIMERESPONSE', data);
		} else {
			var tempData = data;
			data = JSON.parse(data);
			var prev_lastTimeResObj = JSON.parse(localStorage.getItem('LASTTIMERESPONSE'));
			if (prev_lastTimeResObj.staticResponseTime !== data.staticResponseTime) {
				callStaticResponse();
			}
			if (prev_lastTimeResObj.dynamicResponseTime !== data.dynamicResponseTime) {
				fetchPosts(0, 0);
			}
			localStorage.setItem('LASTTIMERESPONSE', tempData);
		}
	},
	
	callStaticResponse = function(){
		fetchCategories();
		fetchMenus();
		fetchTagCloud();
		fetchSettings();
		screenHeightAdjustment();
		commonEvents();
	},
	
	fetchCategories = function () {
		$.ajax({
			type: "GET",
			url: CATEGORYAPIPATH,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				//showLoder();
			},
			success: function (data) {
				//alert(data);
				//hideLoder();
				localStorage.setItem('CATEGORIES', data);
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				//hideLoder();
			}
		});
	},
	
	fetchMenus = function () {
		$.ajax({
			type: "GET",
			url: MENUAPIPATH,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				//showLoder();
			},
			success: function (data) {
				//alert(data);
				//hideLoder();
				localStorage.setItem('MENUS', data);
				appCommonFunctionality.bindSideMenu();
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				//hideLoder();
				appCommonFunctionality.bindSideMenu();
			}
		});
	},
	
	fetchTagCloud = function () {
		$.ajax({
			type: "GET",
			url: TAGCLOUDAPIPATH,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				//showLoder();
			},
			success: function (data) {
				//alert(data);
				//hideLoder();
				localStorage.setItem('TAGCLOUD', data);
				appCommonFunctionality.bindTagCloud();
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				//hideLoder();
				appCommonFunctionality.bindSideMenu();
			}
		});
	},
	
	fetchSettings = function () {
		$.ajax({
			type: "GET",
			url: SETTINGSAPIPATH,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				//showLoder();
			},
			success: function (data) {
				//alert(data);
				//hideLoder();
				localStorage.setItem('SETTINGS', data);
				appCommonFunctionality.bindSocialMedia();
				appCommonFunctionality.bindFooterText();
				appCommonFunctionality.bindTagCloudHeader();
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				//hideLoder();
			}
		});
	},
	
	fetchPosts = function (categoryId, endLimit) {
		var extraParams = '&startLimit=0';
		if(endLimit === 0){
			extraParams = extraParams + '&endLimit=' + POSTENDLIMIT;
		}else{
			extraParams = extraParams + '&endLimit=' + endLimit;
		}
		if(categoryId !== 0){
			extraParams = extraParams + '&categoryId=' + categoryId;
			bindCacheCategoryPosts(categoryId);
		}
		$.ajax({
			type: "GET",
			url: POSTLISTAPIPATH + extraParams,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				showLoder();
			},
			success: function (data) {
				//alert(data);
				hideLoder();
				if(categoryId !== 0){
					bindCategoryPosts(categoryId, data);
				}else{
					localStorage.setItem('POSTS', data);
					bindPosts();
				}
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				hideLoder();
				if(categoryId !== 0){
					bindCacheCategoryPosts(categoryId);
				}else{
					bindPosts();
				}
			}
		});
	},
	
	fetchSearchPosts = function(searchStr){
		$.ajax({
			type: "GET",
			url: SEARCHPOSTLISTAPIPATH + '&searchItem=' + searchStr,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				showLoder();
			},
			success: function (data) {
				//alert(data);
				hideLoder();
				bindSearchedPosts(searchStr, data);
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				hideLoder();
			}
		});
	},

	fetchIndividualPosts = function (postId) {
		bindCacheIndividualPost(postId);
		$.ajax({
			type: "GET",
			url: INDIVIDUALPOSTAPIPATH + '&postId=' + postId,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				showLoder();
			},
			success: function (data) {
				//alert(data);
				hideLoder();
				bindIndividualPost(data);
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				hideLoder();
				bindCacheIndividualPost(postId);
			}
		});
	},
	
	fetchPage = function(pageId){
		$.ajax({
			type: "GET",
			url: INDIVIDUALPOSTAPIPATH + '&postId=' + pageId + '&postType=PAGE',
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				showLoder();
			},
			success: function (data) {
				//alert(data);
				hideLoder();
				bindIndividualPost(data);
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				hideLoder();
			}
		});
	},
	
	fetchUserPosts = function(userId){
		$.ajax({
			type: "GET",
			url: USERSPECIFICPOSTAPIPATH + '&userId=' + userId,
			async: true,
			/*contentType : "text/plain",
			dataType : "application/json",*/
			timeout: AJAXTIMEOUT,
			data: "",
			beforeSend: function (xhr) {
				showLoder();
			},
			success: function (data) {
				//alert(data);
				hideLoder();
				bindUserPosts(data);
			},
			error: function (xhr, status, error) {
				// alert(xhr);
				hideLoder();
			}
		});
	},
	/*---------------------------------------------------API ~ Local Storage Functionality------------------------*/

	/*---------------------------------------------------Application Functionality--------------------------------*/

	parent.toggleHamburgarMenu = function () {
		if ($(".hamburger").length > 0) {
			$(".hamburger").on('click', function (e) {
				this.classList.toggle("is-active");
				/*-------------------------Open Close activity-------------------*/
				if ($(".mobmenu").is(":visible")) {
					$(".mobmenu").addClass('hide');
				} else {
					$(".mobmenu").removeClass('hide');
				}
				/*-------------------------Open Close activity-------------------*/
			});
		}
	},
	
	parent.closeHamburgarMenu = function () {
		if ($(".mobmenu").is(":visible")) {
			$(".hamburger").click();
			$('[id^=mobSubMenuHolder_]').addClass('hide');
			$('[id^=mobSubMenuDownCevron_]').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
		}
	},
	
	parent.bindSideMenu = function(){
		if (localStorage.getItem('MENUS') !== null) {
			var str = "";
			var menuObj = JSON.parse(localStorage.getItem('MENUS'));
			for (var i = 0; i < menuObj.length; i++) {
				if (parseInt(menuObj[i].parentId) === 0) {
					str = str + '<div id="mobMenu_' + menuObj[i].menuType + '_' + menuObj[i].itemId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobMenuItem">' + menuObj[i].menuName + bindSubMenu(parseInt(menuObj[i].menuId)) + '</div>';
				}
			}
			$('#mobMenuItemHolder').html(str);
			bindMenuEvents();
		}
	},
	
	bindSubMenu = function(parentId){
		if (localStorage.getItem('MENUS') !== null) {
			var str = "";
			var menuObj = JSON.parse(localStorage.getItem('MENUS'));
			for (var i = 0; i < menuObj.length; i++) {
				if (parseInt(menuObj[i].parentId) === parentId) {
					str = str + '<div id="mobMenu_' + menuObj[i].menuType + '_' + menuObj[i].itemId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mobMenuItem">' + menuObj[i].menuName + bindSubMenu() + '</div>';
				}
			}
			if(str !== ""){
				str = '  <span id="mobSubMenuDownCevron_' + parentId + '" class="glyphicon glyphicon-menu-down f14"></span><div id="mobSubMenuHolder_' + parentId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 hide">' + str + '</div>';
			}
			return str;
		}
	},
	
	bindMenuEvents = function(){
		$('[id^=mobSubMenuDownCevron_]').on('click', function(e){
			var idArr = (this.id).split("_");
			if ($('#mobSubMenuHolder_' + idArr[1]).is(":visible")){
				$('#mobSubMenuHolder_' + idArr[1]).addClass('hide');
				$(this).removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
			}else{
				$('[id^=mobSubMenuHolder_]').addClass('hide');
				$('[id^=mobSubMenuDownCevron_]').removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
				$('#mobSubMenuHolder_' + idArr[1]).removeClass('hide');
				$(this).removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');
			}
			e.preventDefault();
			e.stopPropagation();
		});
		
		$('[id^=mobMenu_]').on('click', function(e){
			var idArr = (this.id).split("_");
			if(idArr[1] === 'CAT'){
				registerPageActivity('CATEGORY', parseInt(idArr[2]), CATPOSTENDLIMIT);
				fetchPosts(parseInt(idArr[2]), CATPOSTENDLIMIT);
			}else if(idArr[1] === 'PAGE'){
				registerPageActivity('PAGE', parseInt(idArr[2]), 0);
				fetchPage(parseInt(idArr[2]));
			}
			e.preventDefault();
			e.stopPropagation();
			closeHamburgarMenu();
		});
	},
	
	parent.commonEvents = function(){
		$('#headerLogo, #bannerImgHolder').on('click', function(e){ 
			registerPageActivity('MAIN', 0, 0);
			window.location.reload(); 
		});
		$('#notificationBell, #notificationCount').on('click', function(e){ 
			registerPageActivity('NOTIFICATION', 0, 0);
			appCommonFunctionality.openNotification(); 
		});
		$('#shareIcon').on('click', function(e){ 
			if (localStorage.getItem('SETTINGS') !== null) {
				var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
				var options = {
					message: settingsObj.ogDesc, // not supported on some apps (Facebook, Instagram)
					subject: settingsObj.ogDesc, // fi. for email
					img : PROJECTPATH + 'assets/images/socialLogo.png',
					url: PROJECTPATH,
					chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
					appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
				};
				launchPadApp.socialsharing(options);
			}
		});
		$('#bookmarkPage').on('click', function(e){ 
			registerPageActivity('BOOKMARK', '', 0);
			appCommonFunctionality.openBookmark(); 
		});
	},
	
	parent.placeBannerImage = function(){
		$('#bannerImgHolder').html('<img id="headerBanner" src="' + PROJECTPATH + 'upload/banner/headerBanner_mob.jpg" alt="headerBanner">');
	},
	
	parent.bindPosts = function(){
		if (localStorage.getItem('SETTINGS') !== null) {
			var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
			$('#postHeader').html(settingsObj.content_recentPost);
			$('#postIndivIcons').remove();
		}
		if (localStorage.getItem('POSTS') !== null) {
			var str = "";
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			for (var i = 0; i < postObj.length; i++) {
				str = str + '<div id="postId_' + postObj[i].postId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + postObj[i].postImg + ');">';
					str = str + '<div class="shocialBtns">';
						str = str + '<i id="bookMark_' + postObj[i].postId + '" class="glyphicon glyphicon-bookmark pull-right f24 lightRed" aria-hidden="true"></i>';
					str = str + '</div>';
					str = str + '<div class="headLineOnFade">' + postObj[i].postHeader + '</div>';
					str = str + '<div class="postOtherDetails">';
						str = str + '<div id="postUser_' + postObj[i].authorId + '" class="pull-left">' + postObj[i].FirstName + ' ' + postObj[i].LastName + '</div>';
						str = str + '<div class="pull-right">' + postObj[i].modifiedDate + '</div>';
					str = str + '</div>';
				str = str + '</div>';
			}
			$('#postHolder').html(str);
			bindPostEvents();
			//$("#mainSection").animate({scrollTop: 0}, 1000); //In app the delay is not working...
			$("#mainSection").animate({scrollTop: 0});
		}
	},
	
	bindSearchedPosts = function(searchStr, searchedData){
		if (localStorage.getItem('SETTINGS') !== null) {
			var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
			$('#postHeader').html(settingsObj.content_keyword + ' : " ' + searchStr + ' "');
			$('#postIndivIcons').remove();
		}
		if (searchedData !== null) {
			searchedData = JSON.parse(searchedData);
			var str = "";
			for (var i = 0; i < searchedData.length; i++) {
				str = str + '<div id="postId_' + searchedData[i].postId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + searchedData[i].postImg + ');">';
					str = str + '<div class="shocialBtns">';
						str = str + '<i id="bookMark_' + searchedData[i].postId + '" class="glyphicon glyphicon-bookmark pull-right f24 lightRed" aria-hidden="true"></i>';
					str = str + '</div>';
					str = str + '<div class="headLineOnFade">' + searchedData[i].postHeader + '</div>';
					str = str + '<div class="postOtherDetails">';
						str = str + '<div id="postUser_' + searchedData[i].authorId + '" class="pull-left">' + searchedData[i].FirstName + ' ' + searchedData[i].LastName + '</div>';
						str = str + '<div class="pull-right">' + searchedData[i].modifiedDate + '</div>';
					str = str + '</div>';
				str = str + '</div>';
			}
			$('#postHolder').html(str);
			bindPostEvents();
			$("#mainSection").animate({scrollTop: 0});
		}
	},
	
	bindCategoryPosts = function(categoryId, catData){
		$('#postHeader').html(getCategoryName(categoryId));
		$('#postIndivIcons').remove();
		catData = JSON.parse(catData);
		if (catData !== null) {
			var str = "";
			for (var i = 0; i < catData.length; i++) {
				str = str + '<div id="postId_' + catData[i].postId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + catData[i].postImg + ');">';
					str = str + '<div class="shocialBtns">';
						str = str + '<i id="bookMark_' + catData[i].postId + '" class="glyphicon glyphicon-bookmark pull-right f24 lightRed" aria-hidden="true"></i>';
					str = str + '</div>';
					str = str + '<div class="headLineOnFade">' + catData[i].postHeader + '</div>';
					str = str + '<div class="postOtherDetails">';
						str = str + '<div id="postUser_' + catData[i].authorId + '" class="pull-left">' + catData[i].FirstName + ' ' + catData[i].LastName + '</div>';
						str = str + '<div class="pull-right">' + catData[i].modifiedDate + '</div>';
					str = str + '</div>';
				str = str + '</div>';
			}
			$('#postHolder').html(str);
			bindPostEvents();
			$("#mainSection").animate({scrollTop: 0});
		}
	},
	
	bindCacheCategoryPosts = function(categoryId){
		$('#postHeader').html(getCategoryName(categoryId));
		$('#postIndivIcons').remove();
		if (localStorage.getItem('POSTS') !== null) {
			var str = "";
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			for (var i = 0; i < postObj.length; i++) {
				var categoryIdArr = postObj[i].categories.split(",");
				for(var j = 0; j < categoryIdArr.length; j++){
					categoryIdArr[j] = parseInt(categoryIdArr[j]);
				}
				if($.inArray(parseInt(categoryId), categoryIdArr) !== -1){
					str = str + '<div id="postId_' + postObj[i].postId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + postObj[i].postImg + ');">';
						str = str + '<div class="shocialBtns">';
							str = str + '<i id="bookMark_' + postObj[i].postId + '" class="glyphicon glyphicon-bookmark pull-right f24 lightRed" aria-hidden="true"></i>';
						str = str + '</div>';
						str = str + '<div class="headLineOnFade">' + postObj[i].postHeader + '</div>';
						str = str + '<div class="postOtherDetails">';
							str = str + '<div id="postUser_' + postObj[i].authorId + '" class="pull-left">' + postObj[i].FirstName + ' ' + postObj[i].LastName + '</div>';
							str = str + '<div class="pull-right">' + postObj[i].modifiedDate + '</div>';
						str = str + '</div>';
					str = str + '</div>';
				}
			}
			$('#postHolder').html(str);
			bindPostEvents();
			$("#mainSection").animate({scrollTop: 0});
		}
		
	},
	
	bindPostEvents = function(){
		$('[id^=postId_]').on('click', function(e){
			var idArr = (this.id).split("_");
			var postId = parseInt(idArr[1]);
			registerPageActivity('POST', postId, 0);
			fetchIndividualPosts(postId);
		});
		bindAddRemoveBookmarkEvents();
		bindSocialsharingEvents();
		bindUserEvents();
		bindPostCategoryEvents();
	},
	
	bindIndividualPost = function(postData){
		if(postData != null){
			postData = JSON.parse(postData);
			postData = postData[0];
			$('#postHeader').html(postData.postHeader);
			$('#postIndivIcons').remove();
			if(poatAvilableInLocalStorage(postData.postId)){
				$('#postHeader').after("<div id='postIndivIcons' class='pull-right'><i id='bookMark_" + postData.postId + "' class='glyphicon glyphicon-bookmark pull-right bookmarkIcon2 lightRed' aria-hidden='true'></i><img id='socialsharing_" + postData.postId + "' src='assets/images/share.png' alt='share'></div>");
			}
			var str = '';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image: url(' + postData.postImg + ');"></div>';
			str = str + '<div id="postUser_' + postData.authorId + '" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-left f18 nopaddingOnly"><span class="glyphicon glyphicon-user"></span> ' + postData.FirstName + ' ' + postData.LastName + '</div>';
			str = str + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right f18 nopaddingOnly"><span class="glyphicon glyphicon-time"></span> ' + postData.modifiedDate + '</div>';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop10">';
			for(var i = 0; i < postData.categories.length; i++){
				if(typeof postData.categories[i].category !== "undefined"){
					str = str + '<div id="postCat_' + postData.categories[i].categoryId + '" class="pull-left f18 nopaddingOnly marRight5"><span class="glyphicon glyphicon-tag"></span> ' + postData.categories[i].category + '</div>';
				}
			}
			str = str + '</div>';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 postContent nopaddingOnly f22 marTop10">' + decodeURI(window.atob(postData.postContent)) + '</div>';
			str = str + '<div id="postIndivIcons" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">';
				str = str + '<i id="bookMark_' + postData.postId + '" class="glyphicon glyphicon-bookmark pull-right bookmarkIcon2 lightRed" aria-hidden="true"></i>';
				str = str + '<img id="socialsharing_' + postData.postId + '" class="pull-right" src="assets/images/share.png" alt="share">';
			str = str + '</div>';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">';
				//str = str + '<div id="fb-root"></div><div class="fb-comments" data-href="' + PROJECTPATH + 'post/' + postData.postSlug + '" data-width="" data-numposts="5"></div>';
				str = str + '<iframe src="' + PROJECTPATH + 'fbcm_post/' + postData.postSlug + '" width="100%" height="300" style="border: none;"></iframe>';
			str = str + '</div>';
			var relatedPostStr = bindRelatedPost(parseInt(postData.postId));
			if(relatedPostStr.length > 0){
				str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 relatedPostScroller nopaddingOnly marBot10">' + relatedPostStr + '</div>';
			}
			$('#postHolder').html(str);
			if(relatedPostStr.length > 0){
				bindPostEvents();
			}
			//bindfbInit();
			$("#mainSection").animate({scrollTop: 0});
		}
	},
	
	bindCacheIndividualPost = function(postId){
		if (localStorage.getItem('POSTS') !== null) {
			var str = "";
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			for (var i = 0; i < postObj.length; i++) {
				if(parseInt(postId) === parseInt(postObj[i].postId)){
					$('#postHeader').html(postObj[i].postHeader);
					$('#postIndivIcons').remove();
					if(poatAvilableInLocalStorage(postObj[i].postId)){
						$('#postHeader').after("<div id='postIndivIcons' class='pull-right'><i id='bookMark_" + postObj[i].postId + "' class='glyphicon glyphicon-bookmark pull-right bookmarkIcon2 lightRed' aria-hidden='true'></i><img id='socialsharing_" + postObj[i].postId + "' src='assets/images/share.png' alt='share'></div>");
					}
					var str = '';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image: url(' + postObj[i].postImg + ');"></div>';
					str = str + '<div id="postUser_' + postObj[i].authorId + '" class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-left f18 nopaddingOnly"><span class="glyphicon glyphicon-user"></span> ' + postObj[i].FirstName + ' ' + postObj[i].LastName + '</div>';
					str = str + '<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right f18 nopaddingOnly"><span class="glyphicon glyphicon-time"></span> ' + postObj[i].modifiedDate + '</div>';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marTop10">';
					var postCatArr = (postObj[i].categories).split(",");
					for(var j = 0; j < postCatArr.length; j++){
						if(typeof postCatArr[j] !== "undefined"){
							str = str + '<div id="postCat_' + postCatArr[j] + '" class="pull-left f18 nopaddingOnly marRight5"><span class="glyphicon glyphicon-tag"></span> ' + getCategoryName(parseInt(postCatArr[j])) + '</div>';
						}
					}
					str = str + '</div>';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 postContent nopaddingOnly f22 marTop10">';
						for(var k = 0; k < 12; k++){
							str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 animated-background nopaddingOnly"></div>';
						}
					str = str + '</div>';
					str = str + '<div id="postIndivIcons" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">';
						str = str + '<i id="bookMark_' + postObj[i].postId + '" class="glyphicon glyphicon-bookmark pull-right bookmarkIcon2 lightRed" aria-hidden="true"></i>';
						str = str + '<img id="socialsharing_' + postObj[i].postId + '" class="pull-right" src="assets/images/share.png" alt="share">';
					str = str + '</div>';
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot10">';
						//str = str + '<div id="fb-root"></div><div class="fb-comments" data-href="' + PROJECTPATH + 'post/' + postObj[i].postSlug + '" data-width="" data-numposts="5"></div>';
						str = str + '<iframe src="' + PROJECTPATH + 'fbcm_post/' + postObj[i].postSlug + '" width="100%" height="300" style="border: none;"></iframe>';
					str = str + '</div>';
					var relatedPostStr = bindRelatedPost(parseInt(postObj[i].postId));
					if(relatedPostStr.length > 0){
						str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 relatedPostScroller nopaddingOnly marBot10">' + relatedPostStr + '</div>';
					}
					$('#postHolder').html(str);
					if(relatedPostStr.length > 0){
						bindPostEvents();
					}
					//bindfbInit();
					$("#mainSection").animate({scrollTop: 0});
				}
			}
		}
	},
	
	bindUserEvents = function(){
		$('[id^=postUser_]').on('click', function(e){
			var idArr = (this.id).split("_");
			var userId = parseInt(idArr[1]);
			registerPageActivity('USER', userId, 0);
			fetchUserPosts(userId);
			e.preventDefault();
			e.stopPropagation();
		});
	},
	
	bindPostCategoryEvents = function(){
		$('[id^=postCat_]').on('click', function(e){
			var idArr = (this.id).split("_");
			var catId = parseInt(idArr[1]);
			registerPageActivity('POST', catId, 0);
			fetchPosts(catId, CATPOSTENDLIMIT);
		});
	},
	
	bindfbInit = function(){
		var fbInit = setInterval(function () {
			if($('.fb-comments').html().length === 0){
				window.fbAsyncInit = function() {
					FB.init({
					  appId      : '408686133080906',
					  cookie     : true,
					  xfbml      : true,
					  version    : 'v7.0'
					});
					  
					FB.AppEvents.logPageView();   
					  
				};
				(function(d, s, id) {
				   var js, fjs = d.getElementsByTagName(s)[0];
				   if (d.getElementById(id)) return;
				   js = d.createElement(s); js.id = id;
				   js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
				   fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
			}else{
				clearInterval(fbInit);
			}
		}, 5000);
	},
	
	bindUserPosts = function(userPostData){
		userPostData = JSON.parse(userPostData);
		if(userPostData != null && userPostData.length > 0){
			$('#postHeader').html(userPostData[0].FirstName + ' ' + userPostData[0].LastName);
			$('#postIndivIcons').remove();
			var str = '';
			if (localStorage.getItem('SETTINGS') !== null) {
				var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
				str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 marBot10 f22 nopaddingOnly">' + settingsObj.content_otherArticles + '</div>';
			}
			for(var i = 0; i < userPostData.length; i++){
				str = str + '<div id="postId_' + userPostData[i].postId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + userPostData[i].postImg + ');">';
					str = str + '<div class="shocialBtns">';
						str = str + '<i id="bookMark_' + userPostData[i].postId + '" class="glyphicon glyphicon-bookmark pull-right f24 lightRed" aria-hidden="true"></i>';
					str = str + '</div>';
					str = str + '<div class="headLineOnFade">' + userPostData[i].postHeader + '</div>';
					str = str + '<div class="postOtherDetails">';
						str = str + '<div id="postUser_' + userPostData[i].authorId + '" class="pull-left">' + userPostData[i].FirstName + ' ' + userPostData[i].LastName + '</div>';
						str = str + '<div class="pull-right">' + userPostData[i].modifiedDate + '</div>';
					str = str + '</div>';
				str = str + '</div>';
			}
		}
		$('#postHolder').html(str);
		bindPostEvents();
		$("#mainSection").animate({scrollTop: 0});
	},
	
	bindRelatedPost = function(postId){
		var str = '';
		if(localStorage.getItem('POSTS') !== null) {
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			var postCategoryStr = '';
			for (var i = 0; i < postObj.length; i++) {
				if(parseInt(postObj[i].postId) === parseInt(postId)){
					postCategoryStr = postObj[i].categories;
				}
			}
			var postCategoryArr = postCategoryStr.split(','); //List of categories of the postId
			var tempPostArr = [];
			for (var i = 0; i < postObj.length; i++) {
				var postCatArr = (postObj[i].categories).split(","); //List of categories of every posts
				for(var j = 0; j < postCategoryArr.length; j++){
					if($.inArray(postCategoryArr[j], postCatArr) !== -1){
						if(parseInt(postObj[i].postId) !== parseInt(postId)){
							tempPostArr.push(postObj[i]);
						}
					}
				}
			}
			if(tempPostArr.length > 0){
				str = str + '<div style="width:' + ((252 * tempPostArr.length) + 100) + 'px">'; //242px every related poat items + 100 extra
				for (var i = 0; i < tempPostArr.length; i++) {
					str = str + '<div id="postId_' + tempPostArr[i].postId + '" class="col-lg-8 col-md-8 col-sm-8 col-xs-8 nopaddingOnly relatedPostImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + tempPostArr[i].postImg + ');">';
						str = str + '<div class="relatedHeadLineOnFade">' + tempPostArr[i].postHeader + '</div>';
					str = str + '</div>';
				}
				str = str + '</div>'
			}
			tempPostArr = [];
		}
		return str;
	},
	
	parent.bindTagCloudHeader = function(){
		if (localStorage.getItem('SETTINGS') !== null) {
			var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
			$('#tagCloudHeader').html(settingsObj.content_tagCloud);
		}
	},
	
	parent.bindTagCloud = function(){
		if (localStorage.getItem('TAGCLOUD') !== null) {
			var tagCloudObj = JSON.parse(localStorage.getItem('TAGCLOUD'));
			var str = '';
			for(var i = 0; i < tagCloudObj.tagCloudItems.length; i++){
				str = str + '<div id="tagCloudItem_' + tagCloudObj.tagCloudItems[i].type + '_' + tagCloudObj.tagCloudItems[i].id + '" class="tagCloudItem">' + tagCloudObj.tagCloudItems[i].name + '</div>';
			}
			$('#tagCloudItems').html(str);
			bindTagCloudEvents();
		}
	},
	
	bindTagCloudEvents = function(){
		$('[id^=tagCloudItem_]').on('click', function(e){
			var idArr = (this.id).split("_");
			if(idArr[1] === 'CAT'){
				registerPageActivity('CATEGORY', parseInt(idArr[2]), CATPOSTENDLIMIT);
				fetchPosts(parseInt(idArr[2]), CATPOSTENDLIMIT);
			}else if(idArr[1] === 'SEARCH'){
				registerPageActivity('SEARCH', idArr[2], 0);
				fetchSearchPosts(idArr[2]);
			}
			e.preventDefault();
			e.stopPropagation();
			closeHamburgarMenu();
		});
	},
	
	parent.bindSocialMedia = function(){
		if (localStorage.getItem('SETTINGS') !== null) {
			var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
			$('#socialIconHeader').html(settingsObj.content_socialMedia);
			$('#facebookIcon').html('<a href="' + settingsObj.facebook + '" target="_blank"><img src="assets/images/fb-icon.png" alt="facebook"></a>');
			$('#twitterIcon').html('<a href="' + settingsObj.twitter + '" target="_blank"><img src="assets/images/twitter-icon.png" alt="twitter"></a>');
		}
	},
	
	parent.bindFooterText = function(){
		if (localStorage.getItem('SETTINGS') !== null) {
			var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
			$('#footerSection').html(settingsObj.content_footerText);
		}
	},

	bindAddRemoveBookmarkEvents = function(){
		$('[id^=bookMark_]').on('click', function(e){
			var idArr = (this.id).split("_");
			var postId = parseInt(idArr[1]);
			addRemoveBookmark(postId);
			e.preventDefault();
			e.stopPropagation();
		});
		colorBookmark();
	},
	
	bindSocialsharingEvents = function(){
		$('[id^=socialsharing_]').on('click', function(e){
			var idArr = (this.id).split("_");
			var postId = parseInt(idArr[1]);
			if (localStorage.getItem('POSTS') !== null) {
				var postArr = JSON.parse(localStorage.getItem('POSTS'));
				for (var i = 0; i < postArr.length; i++) {
					if(parseInt(postArr[i].postId) === parseInt(postId)) {
						var options = {
							message: postArr[i].postHeader, // not supported on some apps (Facebook, Instagram)
							subject: postArr[i].postHeader, // fi. for email
							img : PROJECTPATH + 'upload/posts/' + postArr[i].postImg,
							url: PROJECTPATH + 'post/' + postArr[i].postSlug,
							chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
							appPackageName: 'com.apple.social.facebook' // Android only, you can provide id of the App you want to share with
						};
						launchPadApp.socialsharing(options);
					}
				}
			}
		});
	},
	
	addRemoveBookmark = function(postId) {
		if (localStorage.getItem('BOOKMARK') !== null) {
			var bookMarkArr = JSON.parse(localStorage.getItem('BOOKMARK'));
			if($.inArray(postId, bookMarkArr) !== -1){
				var tempBookMark = [];
				for(var i = 0; i < bookMarkArr.length; i++){
					if(parseInt(bookMarkArr[i]) !== parseInt(postId)){
						tempBookMark.push(bookMarkArr[i]);
					}
				}
				bookMarkArr = [];
				bookMarkArr = tempBookMark;
				tempBookMark = [];
				showPomptMsg('Bookmark Removed.');
			}else{
				bookMarkArr.push(postId);
				showPomptMsg('Bookmark Added.');
			}
			bookMarkArr = makeArrayUnique(bookMarkArr).sort(sortArray);
			localStorage.setItem('BOOKMARK', JSON.stringify(bookMarkArr));
		} else {
			var bookMarkArr = [];
			bookMarkArr.push(postId);
			localStorage.setItem('BOOKMARK', JSON.stringify(bookMarkArr));
		}
		colorBookmark();
	},
	
	colorBookmark = function () {
		if (localStorage.getItem('BOOKMARK') !== null) {
			var bookmarkArr = JSON.parse(localStorage.getItem('BOOKMARK'));
			$('[id^=bookMark_]').each(function() {
				var idIdentifier = (this.id).replace("bookMark_", "");
				//console.log(idIdentifier);
				if(bookmarkArr.indexOf(parseInt(idIdentifier)) > -1){
					$(this).removeClass('lightRed').addClass('red');
				}else{
					$(this).removeClass('red').addClass('lightRed');
				}
			});
		}
	},

	parent.openBookmark = function () {
		if (localStorage.getItem('POSTS') !== null && localStorage.getItem('BOOKMARK') !== null) {
			var postArr = JSON.parse(localStorage.getItem('POSTS'));
			var bookmarkArr = JSON.parse(localStorage.getItem('BOOKMARK'));
			var tempPostArr = [];
			for (var i = 0; i < postArr.length; i++) {
				if(bookmarkArr.indexOf(parseInt(postArr[i].postId)) > -1) {
					tempPostArr.push(postArr[i]);
				}
			}
			if (localStorage.getItem('SETTINGS') !== null) {
				var settingsObj = JSON.parse(localStorage.getItem('SETTINGS'));
				$('#postHeader').html(settingsObj.content_bookmark);
				$('#postIndivIcons').remove();
			}
			var str = '';
			for (var i = 0; i < tempPostArr.length; i++) {
				str = str + '<div id="postId_' + tempPostArr[i].postId + '" class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly postImage" style="background-image:linear-gradient(to bottom, rgba(245, 246, 252, 0.00), rgba(64, 26, 0)), url(' + tempPostArr[i].postImg + ');">';
					str = str + '<div class="headLineOnFade">' + tempPostArr[i].postHeader + '</div>';
					str = str + '<div class="postOtherDetails">';
						str = str + '<div id="postUser_' + tempPostArr[i].authorId + '" class="pull-left">' + tempPostArr[i].FirstName + ' ' + tempPostArr[i].LastName + '</div>';
						str = str + '<div class="pull-right">' + tempPostArr[i].modifiedDate + '</div>';
					str = str + '</div>';
				str = str + '</div>';
			}
			$('#postHolder').html(str);
			bindPostEvents();
			$("#mainSection").animate({scrollTop: 0});
		}
	},
	
	parent.showCountNotification = function () {
		if (localStorage.getItem('POSTS') !== null) {
			var notificationCount = 0;
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			var highestPostId = parseInt(postObj[0].postId);
			if (localStorage.getItem('NOTIFICATION') !== null) {
				var notificationObj = JSON.parse(localStorage.getItem('NOTIFICATION'));
				if(notificationObj.highestPostId < highestPostId){
					for(var i = 0; i < postObj.length; i++){
						if(parseInt(postObj[i].postId) === parseInt(notificationObj.highestPostId)){
							break;
						}else{
							notificationCount++;
						}
					}
				}
			}
			if(notificationCount > 9){
				notificationCount = 9; // To maintain Notification count 1 digit
			}
			if(notificationCount > 0){
				$('#notificationCount').removeClass('hide').html(notificationCount);
			}
		}
	},

	parent.openNotification = function () {
		if($("#notificationCount").is(":visible")){
			$('#notificationCount').addClass('hide');
		}
		fetchPosts(0, 0);
		var notificationHeaderIntervalId = window.setInterval(function () {
			if($('#postHeader').html() !== 'Notifications' && !$('body').hasClass("makeHazy")){
				$('#postHeader').html('Notifications');
				setHighestPostIdForNotification();
				clearInterval(notificationHeaderIntervalId);
			}
		}, 1000);
	},
	
	setHighestPostIdForNotification = function(){
		if (localStorage.getItem('POSTS') !== null) {
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			var highestPostId = parseInt(postObj[0].postId);
			var notificationObj = {'highestPostId' : highestPostId};
			localStorage.setItem('NOTIFICATION', JSON.stringify(notificationObj));
		}
	},
	
	registerPageActivity = function(pageName, id, limit){
		if(pageName === 'CATEGORY' && limit === 0){
			limit = CATPOSTENDLIMIT;
		}
		var activityStr = {"activityName" : pageName, "id" : id, "limit" : limit};
		var pageActivityArr = [];
		if (localStorage.getItem('PAGEACTIVITY') !== null) {
			var pageActivityArr = JSON.parse(localStorage.getItem('PAGEACTIVITY'));
		}
		pageActivityArr.push(activityStr);
		localStorage.setItem('PAGEACTIVITY', JSON.stringify(pageActivityArr));
	},
	
	parent.clearPageActivity = function(){
		localStorage.removeItem('PAGEACTIVITY');
		localStorage.removeItem('PAGEACTIVITYINDEX');
	},
	
	parent.gotoPreviousActivity = function(e){
		if (localStorage.getItem('PAGEACTIVITY') !== null) {
			var pageActivityArr = JSON.parse(localStorage.getItem('PAGEACTIVITY'));
			var PAGEACTIVITYINDEX = 0;
			if (localStorage.getItem('PAGEACTIVITYINDEX') === null) {
				PAGEACTIVITYINDEX = (pageActivityArr.length - 2);				
			}else{
				PAGEACTIVITYINDEX = (parseInt(localStorage.getItem('PAGEACTIVITYINDEX')) - 1);
			}
			localStorage.setItem('PAGEACTIVITYINDEX', PAGEACTIVITYINDEX);
			var pageActivity = "";
			if(PAGEACTIVITYINDEX > -1){
				pageActivity = pageActivityArr[PAGEACTIVITYINDEX];
				switch (pageActivity.activityName) {
				
				  case 'MAIN':{
					window.location.reload(); 
					break;
				  }
				  
				  case 'CATEGORY':{
					fetchPosts(parseInt(pageActivity.id), pageActivity.limit);
					break;
				  }
				  
				  case 'POST':{
					fetchIndividualPosts(parseInt(pageActivity.id));
					break;
				  }
				  
				  case 'PAGE':{
					fetchPage(parseInt(pageActivity.id));
					break;
				  }
				  
				  case 'SEARCH':{
					fetchSearchPosts(pageActivity.id);
					break;
				  }
				  
				  case 'USER':{
					fetchUserPosts(parseInt(pageActivity.id));
					break;
				  }
				  
				  case 'NOTIFICATION':{
					appCommonFunctionality.openNotification();
					break;
				  }
				  
				  case 'BOOKMARK':{
					appCommonFunctionality.openBookmark();
					break;
				  }

				}
				e.preventDefault();
			}else{
				clearPageActivity();
				navigator.app.exitApp();
			}
		}
	},

	parent.screenHeightAdjustment = function(){
		var screenHeightAdjustmentIntervalId = setInterval(function () {
			var bannerImgHolderHTML = $('#bannerImgHolder').html();
			var postHeaderHTML = $('#postHeader').html();
			var postHolderHTML  = $('#postHolder').html();
			var tagCloudHeaderHTML = $('#tagCloudHeader').html();
			var tagCloudItemsHTML = $('#tagCloudItems').html();
			var socialIconHeaderHTML = $('#socialIconHeader').html();
			var footerSectionHTML = $('#footerSection').html();
			if(!APPHEIGHTADJUSTED && bannerImgHolderHTML.length > 0 && postHeaderHTML.length > 0 && postHolderHTML.length > 0 && tagCloudHeaderHTML.length > 0 && tagCloudItemsHTML.length > 0 && socialIconHeaderHTML.length > 0 && footerSectionHTML.length > 0){
				var headerHeight = 50; // $("#headerSection").height(); Facing problem with this.
				var footerHeight = 20; // $("#footerSection").height(); Facing problem with this.
				var screenHeight = screen.height - headerHeight - footerHeight;
				
				$('#mainSection').css('height', screenHeight + 'px').css('top', headerHeight + 'px');
				$('#mobMenu').css('height', screenHeight + 'px').css('top', (headerHeight - 2) + 'px');
				$('#mobMenuItemHolder').css('height', screenHeight + 'px');
				APPHEIGHTADJUSTED = true;
				showCountNotification();
				clearInterval(screenHeightAdjustmentIntervalId);
			}
		}, 1000); //Every Second loop to adjust screen height & it ends when done.
	},
	
	getCategoryParentId = function (catId) {
		var categoryParentId = 0;
		if (localStorage.getItem('CATEGORIES') !== null) {
			var catObj = JSON.parse(localStorage.getItem('CATEGORIES'));
			for (var i = 0; i < catObj.length; i++) {
				if (catObj[i].categoryId === catId) {
					categoryParentId = catObj[i].parentId;
				}
			}
		}
		return categoryParentId;
	},

	getCategoryName = function (catId) {
		var categoryName = "";
		if (localStorage.getItem('CATEGORIES') !== null) {
			var catObj = JSON.parse(localStorage.getItem('CATEGORIES'));
			for (var i = 0; i < catObj.length; i++) {
				if (parseInt(catObj[i].categoryId) === catId) {
					categoryName = catObj[i].category;
				}
			}
		}
		return categoryName;
	},
	
	poatAvilableInLocalStorage = function(postId){
		var avilableFlag = false;
		if (localStorage.getItem('POSTS') !== null) {
			var postObj = JSON.parse(localStorage.getItem('POSTS'));
			for (var i = 0; i < postObj.length; i++) {
				if (parseInt(postObj[i].postId) === parseInt(postId)) {
					avilableFlag = true;
				}
			}
		}
		return avilableFlag;
	}

	/*---------------------------------------------------Application Functionality--------------------------------*/
	return parent;
}(window, window.$));