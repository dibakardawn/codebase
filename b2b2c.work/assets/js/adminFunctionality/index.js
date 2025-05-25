const colorClasses = ['w3-red', 'w3-orange', 'w3-blue', 'w3-teal'];

$(document).ready(function () {
    indexFunctionality.initDashboard();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const indexFunctionality = (function (window, $) {
    const parent = {};

    parent.initDashboard = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('indexSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
			assignColorsToSections();
			clearMandatoryLocalStorages();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
    };
	
	const assignColorsToSections = function(){
		$('.w3-quarter .w3-container').each(function(index){
			const colorClass = colorClasses[index % colorClasses.length];
			$(this).addClass(colorClass);
		});
	};
	
	const clearMandatoryLocalStorages = function(){
		localStorage.removeItem("scannerQRCodes");
		localStorage.removeItem("CUSTOMERBALANCESHEETCRITERIA");
		localStorage.removeItem("CUSTOMERBALANCESHEETVEWCRITERIA");
		localStorage.removeItem("FINANCESEARCHCRITERIA");
		localStorage.removeItem("FINANCEVEWCRITERIA");
	}

    return parent;
})(window, jQuery);
