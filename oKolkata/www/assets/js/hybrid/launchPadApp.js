launchPadApp = (function(window, $) {

	parent.serviceAPI = 'https://okolkata.in/notification/notification.php';
	parent.FCMSenderId = '1071008946578';
	
    parent.initialize = function() {
		//alert('launchPadApp initialize called...');
		document.addEventListener('deviceready', onDeviceReady, false);
		document.addEventListener('backbutton', onBackKeyDown, false);
	},

	onDeviceReady = function() {
		//alert('launchPadApp onDeviceReady called...');
		pushFCMNotification();
		appCommonFunctionality.clearPageActivity();
	},
	
	//------------------------------------Social Sharing-------------------------------------
	parent.socialsharing = function(options){
		//alert(JSON.stringify(options));
		window.plugins.socialsharing.shareWithOptions(options, socialsharingOnSuccess, socialsharingOnError);
	},
	
	socialsharingOnSuccess = function(result) {
	  //alert("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
	  //alert("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
	  //appCommonFunctionality.showPomptMsg('Article Shared.');
	},
	 
	socialsharingOnError = function(msg) {
	  //alert("Sharing failed with message: " + msg);
	  //appCommonFunctionality.showPomptMsg('Somthing went Wrong.');
	},
	//------------------------------------Social Sharing-------------------------------------
	
	//------------------------------------FCM Push Notification------------------------------
	parent.pushFCMNotification = function() {
		var push = PushNotification.init({
			'android': {
				'senderID': FCMSenderId
			}
		});
		push.on('registration', function(data) {
			//alert(data.registrationId);
			registerDeviceId(data.registrationId);
		});
		push.on('notification', function(data) {
			//alert(JSON.stringify(data));
			var note = window.setInterval(function () {
				if (confirm('New news received, do you want to read it?')) {
					appCommonFunctionality.showCountNotification();
					appCommonFunctionality.fetchIndividualPosts(parseInt(data.message));
				}
				clearInterval(note);
			}, 5000);
		});
		push.on('error', function(e) {
			alert(e);
		});
	},

	registerDeviceId = function(registrationId) {
		$.ajax({
			type: 'POST',
			url: serviceAPI + '?ACTION=REGISTERDEVICE&platForm=Android&deviceId=' + registrationId,
			jsonpCallback: 'deviceRegistrationSuccess',
			error: function() {
				alert('Errr is occured');
			}
		});
	},

	deviceRegistrationSuccess = function(responce) {
		alert(JSON.stringify(responce));
	}
	//------------------------------------FCM Push Notification------------------------------
	
	//------------------------------------Hardware Back button functionality-----------------
	onBackKeyDown = function(e){
		appCommonFunctionality.gotoPreviousActivity(e);
	}
	//------------------------------------Hardware Back button functionality-----------------
	
    return parent;

}(window, window.$));