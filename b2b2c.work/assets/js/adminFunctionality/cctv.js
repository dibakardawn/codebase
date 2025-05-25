const MENUSELECTIONITEM = "cctvs.php";

/*-----------------Commonly Used Variables--------------------------------*/
let CCTVDATA = [];
/*-----------------Commonly Used Variables--------------------------------*/

$(document).ready(function () {
    cctvFunctionality.initCCTVs();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const cctvFunctionality = (function (window, $) {
    const parent = {};

    parent.initCCTVs = async function () {
		try {
			await appCommonFunctionality.adminCommonActivity();
			CCTVDATA = JSON.parse($("#safeCCTVSerializedData").val()) || [];
			$('#cctvDDL').trigger('change');
			appCommonFunctionality.adjustMainContainerHight('cameraSectionHolder');
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
			$('#cctvDDL').trigger('change');// placed this purposefully
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
    };
	
	const populateCCTVs = function(noofCCTVs) {
		const mobClass = appCommonFunctionality.isMobile() ? 'noPaddingOnly' : 'noLeftPaddingOnly';
		const gridClass = noofCCTVs === 9 ? 'col-lg-4 col-md-4 col-sm-4' : 'col-lg-3 col-md-3 col-sm-3';
		const cctvClass = noofCCTVs === 9 ? 'cctv9' : 'cctv9Plus';
		let str = '';
		for (let i = 0; i < noofCCTVs; i++) {
			const cctvData = CCTVDATA[i] || null;
			const cctvId = cctvData ? cctvData.cctvId : 0;
			str += `
			<div class="${gridClass} col-xs-12 ${mobClass} marBot10">
				<div class="${cctvClass}">
					<div class="cctv-content">
						${cctvData ? `
						<video width="100%" controls autoplay muted playsinline>
							<source src="http://your-proxy-server/stream?ip=${encodeURIComponent(cctvData.url)}&port=${encodeURIComponent(cctvData.port)}&user=${encodeURIComponent(cctvData.username)}&pass=${encodeURIComponent(cctvData.password)}" type="application/x-mpegURL">
							Your browser does not support the video tag.
						</video>
						` : `
						<img src="../assets/images/cctv.gif" alt="cctv" class="w100">
						`}
					</div>
					<button type="button" class="btn btn-success btn-xs cctv-config-btn" onclick="cctvFunctionality.openCCTVModal(${cctvId})">
						<i class="fa fa-cogs"></i>
					</button>
				</div>
			</div>`;
		}
		$("#cctvHolder").html(str);

		if (typeof Hls !== 'undefined' && Hls.isSupported()) {
			$('video').each(function() {
				const video = this;
				const hls = new Hls();
				hls.loadSource(video.querySelector('source').src);
				hls.attachMedia(video);
				hls.on(Hls.Events.MANIFEST_PARSED, () => {
					video.play().catch(e => console.log('Autoplay prevented:', e));
				});
			});
		}
	};
	
	parent.onChangeCCTV = function(){
		const noofCCTVs = parseInt($('#cctvDDL').val());
		populateCCTVs(noofCCTVs);
		appCommonFunctionality.adjustMainContainerHight('cameraSectionHolder');
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	};
	
	parent.openCCTVModal = function(cctvId){
		if(cctvId > 0){
			for(let i = 0; i < CCTVDATA.length; i++){
				if(parseInt(CCTVDATA[i].cctvId) === parseInt(cctvId)){
					$('#url').val(CCTVDATA[i].url);
					$('#port').val(CCTVDATA[i].port);
					$('#username').val(CCTVDATA[i].username);
					$('#password').val(CCTVDATA[i].password);
					$('#cctvId').val(CCTVDATA[i].cctvId);
				}
			}
		}else{
			$('#url, #port, #username, #password').val('');
			$('#cctvId').val(0);
		}
		$('#CCTVModal').modal('show');
	};
	
	parent.validateCCTVEntryForm = function(){
		let errorCount = 0;
		
		/*----------------------------------------CCTV URL Validation----------------------------------------*/
		let url = $("#url").val() || "";
		if(url === ""){
		   appCommonFunctionality.raiseValidation("url", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("url", "url", true);
		}
		/*----------------------------------------CCTV URL Validation----------------------------------------*/
		
		/*----------------------------------------CCTV PORT Validation---------------------------------------*/
		let port = $("#port").val() || "";
		if(port === ""){
		   appCommonFunctionality.raiseValidation("port", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("port", "port", true);
		}
		/*----------------------------------------CCTV PORT Validation---------------------------------------*/
		
		/*----------------------------------------CCTV Username Validation-----------------------------------*/
		let username = $("#username").val() || "";
		if(username === ""){
		   appCommonFunctionality.raiseValidation("username", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("username", "username", true);
		}
		/*----------------------------------------CCTV Username Validation-----------------------------------*/
		
		/*----------------------------------------CCTV Password Validation-----------------------------------*/
		let password = $("#password").val() || "";
		if(password === ""){
		   appCommonFunctionality.raiseValidation("password", "", true);
		   errorCount++
		}else{
		   appCommonFunctionality.removeValidation("password", "password", true);
		}
		/*----------------------------------------CCTV Password Validation-----------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.deleteCCTVConfiguration = function(){
		let cctvId = $('#cctvId').val();
		window.location = `cctvs.php?ACTION=DELETE&cctvId=` + cctvId;
	};

    return parent;
})(window, jQuery);
