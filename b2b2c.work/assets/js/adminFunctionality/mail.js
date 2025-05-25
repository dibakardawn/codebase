const MENUSELECTIONITEM = "mail.php";
const PAGEDOCNAME = appCommonFunctionality.getPageName();

$(document).ready(function(){
	
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	mailFunctionality.initCms();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const mailFunctionality = (function (window, $) {
    const parent = {};
	
	parent.initCms = async function () {
		appCommonFunctionality.adjustMainContainerHight('mailSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
	};
	
	parent.openMail = function(mailId){
		var mailSubject = $("#subject_" + mailId).text();
		$('.modal-title').html(mailSubject);
		var mailBody = atob($("#hdnBody_" + mailId).val());
		//console.log(mailBody);
		$('.modal-body').html(mailBody);
		//$('.modal-body').css('height', $(window).height() * 65 / 100); //65% of window height
		$('#mailModal').modal('show');
	};
	
	parent.searchMail = function(){
		var search = $("#search").val();
		search = search.replace(/[^a-zA-Z ]/g, "");
		window.location.replace('mail.php?search=' + search);
	};
	
	return parent;
}(window, window.$));