const MENUSELECTIONITEM = "Settings.php";
const colorClasses = ['w3-red', 'w3-orange', 'w3-blue', 'w3-teal'];
let calenderDataOption = ['PO', 'SO'];

/*-----------------Commonly Used Variables--------------------------------*/
let CALENDAR_DATA = [];
let COUNTRY_DATA = [];
let CURRENCY_DATA = [];
/*-----------------Commonly Used Variables--------------------------------*/

const PAGEDOCNAME = appCommonFunctionality.getPageName();
$(document).ready(function(){
	
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	switch (PAGEDOCNAME) {
		
        case "Settings.php":{
			settingsFunctionality.initSettings();
            break;
		}
		
		case "countries.php":{
			settingsFunctionality.initCountries();
            break;
		}
		
		case "currency.php":{
			settingsFunctionality.initCurrency();
            break;
		}
		
		case "languages.php":{
			settingsFunctionality.initLanguages();
            break;
		}
		
		case "cms.php":{
			settingsFunctionality.initCms();
            break;
		}
		
		case "cmsEntry.php":{
			settingsFunctionality.initCmsEntry();
            break;
		}
		
		case "calendar.php":{
			appCommonFunctionality.ajaxCallLargeData('CALENDERDATA', {"calenderDataOption" : calenderDataOption.join(',')}, settingsFunctionality.initCalendar);
            break;
		}
		
		case "companyTypes.php":{
			settingsFunctionality.initCompanyTypes();
            break;
		}
		
		case "features.php":{
			settingsFunctionality.initProductFeatures();
            break;
		}
		
		case "packingBoxes.php":{
			settingsFunctionality.initPackingBoxes();
            break;
		}
		
		case "financeCategory.php":{
			settingsFunctionality.initFinanceCategory();
            break;
		}
		
		case "stockStorages.php":{
			settingsFunctionality.initStockStorages();
            break;
		}
		
		case "imageManualCrop.php":{
			settingsFunctionality.initImageManualCrop();
            break;
		}
		
		case "imageFilters.php":{
			settingsFunctionality.initImageFilters();
            break;
		}
		
		case "backUp.php":{
			settingsFunctionality.initBackup();
            break;
		}
		
    }
	
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const settingsFunctionality = (function (window, $) {
    const parent = {};
	
	/*--------------------------------------Settings Main---------------------------------*/
	parent.initSettings = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('settingsSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
			assignColorsToSections();
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
	/*--------------------------------------Settings Main---------------------------------*/
	
	/*--------------------------------------Country---------------------------------------*/
	parent.initCountries = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('countrySectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			COUNTRY_DATA = JSON.parse($('#countryData').val());
			bindCountryTable();
			if(appCommonFunctionality.isMobile()){
				$('#countryCode').parent().parent().addClass('nopaddingOnly');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	const bindCountryTable = function(){
		let str = `
		<table class="table table-bordered table-striped minW720">
			<thead>
			  <tr>
				<th id="cms_826">Country</th>
				<th id="cms_828">Country Code</th>
				<th id="cms_830">Telephone Ext</th>
				<th id="cms_834">Is Default</th>
			  </tr>
			</thead>
			<tbody>
		`;

		COUNTRY_DATA.forEach(country => {
			str += `
			  <tr>
				<td>${country.country}</td>
				<td>${country.countryCode}</td>
				<td>${country.telePhoneExt}</td>
				<td>
				  <input type="radio" name="defaultCountry" 
						 value="${country.countryId}" 
						 ${country.isDefault ? 'checked' : ''} onclick="settingsFunctionality.makeDefaultCountry(${country.countryId})">
				  <!--<i class="fa fa-trash marleft5 redText hover" onclick="settingsFunctionality.deleteCountry(${country.countryId})"></i>-->
				</td>
			  </tr>
			`;
		});

		str += `
			</tbody>
		</table>
		`;
		$("#countryTableHolder").html(str);
	};
	
	parent.makeDefaultCountry= function(countryId){
		window.location = "countries.php?ACTION=MAKEDEFAULT&countryId=" + countryId;
	};
	
	parent.deleteCountry = function(countryId){
		window.location = "countries.php?ACTION=DELETE&countryId=" + countryId;
	};
	/*--------------------------------------Country---------------------------------------*/
	
	/*--------------------------------------Currency--------------------------------------*/
	parent.initCurrency = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('currencySectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			CURRENCY_DATA = JSON.parse($('#currencyData').val());
			bindCurrencyTable();
			if(appCommonFunctionality.isMobile()){
				$('#currencySign').parent().parent().addClass('nopaddingOnly');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	const bindCurrencyTable = function() {
		let str = `
		<table class="table table-bordered table-striped">
			<thead>
			  <tr>
				<th id="cms_835">Currency</th>
				<th id="cms_837">Currency Sign</th>
				<th id="cms_834">Is Default</th>
			  </tr>
			</thead>
			<tbody>
		`;

		CURRENCY_DATA.forEach(currency => {
			str += `
			  <tr>
				<td>${currency.currency}</td>
				<td>${currency.currencySign}</td>
				<td>
				  <input type="radio" name="defaultCurrency" 
						 value="${currency.currencyId}" 
						 ${currency.isDefault ? 'checked' : ''} 
						 onclick="settingsFunctionality.makeDefaultCurrency(${currency.currencyId})">
				  <!--<i class="fa fa-trash marleft5 redText hover" 
					 onclick="settingsFunctionality.deleteCurrency(${currency.currencyId})"></i>-->
				</td>
			  </tr>
			`;
		});

		str += `
			</tbody>
		</table>
		`;
		$("#currencyTableHolder").html(str);
	};
	
	parent.validateCurrencyEntryForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Currency Name Validation-------------------------------*/
		if($("#currency").val() === ''){
			appCommonFunctionality.raiseValidation("currency", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("currency", "currency", true);
		}
		/*-------------------------------------Currency Name Validation-------------------------------*/
		
		/*-------------------------------------Currency Sign Validation-------------------------------*/
		if($("#currencySign").val() === ''){
			appCommonFunctionality.raiseValidation("currencySign", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("currencySign", "currencySign", true);
		}
		/*-------------------------------------Currency Sign Validation-------------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.makeDefaultCurrency= function(currencyId){
		window.location = "currency.php?ACTION=MAKEDEFAULT&currencyId=" + currencyId;
	};
	
	parent.deleteCurrency = function(currencyId){
		window.location = "currency.php?ACTION=DELETE&currencyId=" + currencyId;
	};
	/*--------------------------------------Currency--------------------------------------*/
	
	/*--------------------------------------Languages-------------------------------------*/
	parent.initLanguages = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('languageSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			bindLanguageTable();
			if(appCommonFunctionality.isMobile()){
				$('#sign').parent().parent().addClass('nopaddingOnly');
				$('#submitBtn').removeClass('pull-left').addClass('pull-right');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	const bindLanguageTable = function() {
		let languageData = JSON.parse($('#languageData').val());
		let str = `
			<table class="table table-bordered table-striped">
				<thead>
					<tr>
						<th id="cms_930">${appCommonFunctionality.getCmsString(930)}</th>
						<th id="cms_834">${appCommonFunctionality.getCmsString(834)}</th>
					</tr>
				</thead>
				<tbody>`;
		languageData.forEach(language => {
			str += `
				<tr>
					<td>
						<span>${language.language} [${language.sign}]</span>
						<i class="fa fa-trash marleft5 redText hover" onclick="settingsFunctionality.deleteLanguage(${language.langId})"></i>
					</td>
					<td>
						<input type="radio" name="defaultLanguage" value="${language.langId}" 
							${language.isDefault ? 'checked' : ''} 
							onclick="settingsFunctionality.makeDefaultLanguage(${language.langId})">
					</td>
				</tr>`;
		});
		str += `
				</tbody>
			</table>`;
		$('#languageTableContainer').html(str);
	};
	
	parent.deleteLanguage = function(langId){
		window.location = "languages.php?ACTION=DELETE&langId=" + langId;
	};
	
	parent.makeDefaultLanguage = function(langId){
		window.location = "languages.php?ACTION=SETDEFAULTLANG&langId=" + langId;
	};
	/*--------------------------------------Languages-------------------------------------*/
	
	/*--------------------------------------Content---------------------------------------*/
	parent.initCms = async function() {
		appCommonFunctionality.adjustMainContainerHight('cmsSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		const section = appCommonFunctionality.getUrlParameter('section');
		const page = appCommonFunctionality.getUrlParameter('page');
		if (section && page) {
			checkCmsData();
		}
	};
	
	const checkCmsData = async function() {
		if (CMSDATA.length > 0) {
			populateCmsTable();
		} else {
			setTimeout(checkCmsData, 500);
		}
	};
	
	const populateCmsTable = function() {
		let str = `
			<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW720">
				<tbody>
					<tr>
						<td width="10%"><strong>Id</strong></td>
						<td width="85%"><strong>Content</strong></td>
						<td width="5%"><strong>Action</strong></td>
					</tr>
		`;
		if (CMSDATA.length > 0) {
			CMSDATA.sort((a, b) => b.cmsId - a.cmsId);
			CMSDATA.forEach(cms => {
				const attributes = Object.entries(cms)
					.filter(([key]) => key !== 'cmsId')
					.map(([key, value]) => `<b>${appCommonFunctionality.capitalizeFirstLetter(key)}:</b> ${value}`)
					.join('<br />');

				str += `
					<tr>
						<td>${cms.cmsId}</td>
						<td>${attributes}</td>
						<td>
							<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="settingsFunctionality.editCms(${cms.cmsId})"></i>
							<i class="fa fa-trash-o marleft5 redText hover" onclick="settingsFunctionality.deleteCms(${cms.cmsId})"></i>
						</td>
					</tr>
				`;
			});
		} else {
			str += '<tr><td colspan="3">No Contents to Display</td></tr>';
		}
		str += `
				</tbody>
			</table>
		`;
		$("#cmsTableHolder").html(str);
	};
	
	parent.editCms = function(cmsId){
		window.location.replace('cmsEntry.php?cmsId=' + cmsId);
	};
	
	parent.deleteCms = function(cmsId) {
		const section = appCommonFunctionality.getUrlParameter('section');
		const page = appCommonFunctionality.getUrlParameter('page');
		if (section && page && parseInt(cmsId) > 0) {
			const url = `cms.php?cmsId=${cmsId}&section=${section}&page=${page}&ACTION=DELETE`;
			window.location.replace(url);
		}
	};
	
	parent.gotoAddCms = function(){
		window.location.replace('cmsEntry.php');
	};
	
	parent.initCmsEntry = async function() {
		appCommonFunctionality.adjustMainContainerHight('cmsSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		var langDataTimer = window.setInterval(function(){
		  if (LANGUAGEPRECOMPILEDDATA.length) {
				DEFAULTLANGUAGEOBJ = appCommonFunctionality.getDefaultLang();
				OTHERLANGUAGEOBJ = appCommonFunctionality.getOtherLangs();
				const cmsId = appCommonFunctionality.getUrlParameter('cmsId') || 0;
				if (cmsId > 0) {
					populateLangInputs();
					mapInputValues(cmsId);
				} else {
					const section = appCommonFunctionality.getUrlParameter('section');
					const page = appCommonFunctionality.getUrlParameter('page');
					if (section && page) {
						populateLangInputs();
					}
				}
				clearTimeout(langDataTimer);
			}
		}, 500);
	};

	parent.onSectionDDLChange = function() {
		const section = $("#section").val();
		const pages = {
			"cms.php": `cms.php?section=${section}`,
			"cmsEntry.php": `cmsEntry.php?section=${section}`
		};
		if (pages[PAGEDOCNAME]) {
			window.location.replace(pages[PAGEDOCNAME]);
		}
	};
	
	parent.onPageDDLChnage = function(){
		var section = $("#section").val();
		var page = $("#page").val();
		if(PAGEDOCNAME === "cms.php"){
			window.location.replace('cms.php?section=' + section + '&page=' + page);
		}else if(PAGEDOCNAME === "cmsEntry.php"){
			window.location.replace('cmsEntry.php?section=' + section + '&page=' + page);
		}
	};
	
	const populateLangInputs = function() {
		let str = `
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
				<div class="col-lg-11 col-md-11 col-sm-11 col-xs-11 nopaddingOnly">
					<div class="input-group marBot5">
						<span id="content_${DEFAULTLANGUAGEOBJ[0].sign}Span" class="input-group-addon">Content ${DEFAULTLANGUAGEOBJ[0].language} : </span>
						<input id="content_${DEFAULTLANGUAGEOBJ[0].sign}" name="content_${DEFAULTLANGUAGEOBJ[0].sign}" type="text" class="form-control" placeholder="Please Enter Content ${DEFAULTLANGUAGEOBJ[0].language}" autocomplete="off" value="" onkeyup="settingsFunctionality.checkCMSInputs()">
					</div>
				</div>
				<div class="col-lg-1 col-md-1 col-sm-1 col-xs-1 nopaddingOnly">
					<button type="button" class="btn btn-success pull-right marBot5 marRig5" onClick="settingsFunctionality.translateContents()">Translate</button>
				</div>
			</div>
		`;
		OTHERLANGUAGEOBJ.forEach(lang => {
			str += `
				<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
					<div class="input-group marBot5">
						<span id="content_${lang.sign}Span" class="input-group-addon">Content ${lang.language} : </span>
						<input id="content_${lang.sign}" name="content_${lang.sign}" type="text" class="form-control" placeholder="Please Enter Content ${lang.language}" autocomplete="off" value="" onkeyup="settingsFunctionality.checkCMSInputs()">
					</div>
				</div>
			`;
		});
		str += `
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly text-center">
				<button type="submit" class="btn btn-success marTop5">Save</button>
			</div>
		`;
		$("#cmsInputs").html(str);
	};
	
	const mapInputValues = function(cmsId) {
		const cmsItem = CMSDATA.find(item => parseInt(cmsId) === parseInt(item.cmsId));
		if (cmsItem) {
			Object.entries(cmsItem).forEach(([key, value]) => {
				if (key !== 'cmsId') {
					$(`#${key}`).val(value);
				}
			});
		}
	};
	
	parent.translateContents = function() {
		const defaultLangContent = $(`#content_${DEFAULTLANGUAGEOBJ[0].sign}`).val();
		const defaultLangSign = DEFAULTLANGUAGEOBJ[0].sign;
		OTHERLANGUAGEOBJ.forEach(lang => {
			appCommonFunctionality.translateLanguage(defaultLangContent, defaultLangSign, lang.sign, populateTranslatedContents);
		});
	};
	
	populateTranslatedContents = function(translatedResponse, targetLang){
		$("#content_" + targetLang).val(translatedResponse.responseData.translatedText.replace(/'/g, '`'));
	};
	
	parent.validateCmsEntry = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Section Validation-------------------------------------------------*/
		var section = $("#section").val();
		if (section === "") {
			appCommonFunctionality.raiseValidation("section", "", false);
			$("#section").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("section", "section", false);
		}
		/*----------------------------------------------------Section Validation-------------------------------------------------*/
		
		/*----------------------------------------------------Page Validation----------------------------------------------------*/
		var page = $("#page").val();
		if (page === "") {
			appCommonFunctionality.raiseValidation("page", "", false);
			$("#page").focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("page", "page", false);
		}
		/*----------------------------------------------------Page Validation----------------------------------------------------*/
		
		/*----------------------------------------------------Default Language Validation----------------------------------------*/
		var defaultLangcontent = $("#content_" + DEFAULTLANGUAGEOBJ[0].sign).val();
		if (defaultLangcontent === "") {
			appCommonFunctionality.raiseValidation("content_" + DEFAULTLANGUAGEOBJ[0].sign, "", false);
			$("#content_" + DEFAULTLANGUAGEOBJ[0].sign).focus();
			errorCount++
		} else {
			appCommonFunctionality.removeValidation("content_" + DEFAULTLANGUAGEOBJ[0].sign, "content_" + DEFAULTLANGUAGEOBJ[0].sign, false);
		}
		/*----------------------------------------------------Default Language Validation----------------------------------------*/
		
		/*----------------------------------------------------Other Language Validation------------------------------------------*/
		for(var i = 0; i < OTHERLANGUAGEOBJ.length; i++){
			var otherLangcontent = $("#content_" + OTHERLANGUAGEOBJ[i].sign).val();
			if (otherLangcontent === "") {
				appCommonFunctionality.raiseValidation("content_" + OTHERLANGUAGEOBJ[i].sign, "", false);
				$("#content_" + OTHERLANGUAGEOBJ[i].sign).focus();
				errorCount++
			} else {
				appCommonFunctionality.removeValidation("content_" + OTHERLANGUAGEOBJ[i].sign, "content_" + OTHERLANGUAGEOBJ[i].sign, false);
			}
		}
		/*----------------------------------------------------Other Language Validation------------------------------------------*/
		
		if (errorCount === 0) {
			parent.checkCMSInputs();
			return true;
		} else {
			return false;
		}
	};
	
	parent.checkCMSInputs = function() {
		$('input[id^="content_"]').each(function() {
			var value = $(this).val();
			if (value) {
				var newValue = value.replace(/'/g, '`');
				$(this).val(newValue);
			}
		});
	};
	/*--------------------------------------Content---------------------------------------*/
	
	/*--------------------------------------Calender--------------------------------------*/
	parent.initCalendar = async function (calenderResponse) {
		appCommonFunctionality.adjustMainContainerHight('calendarHolder');
		await appCommonFunctionality.adminCommonActivity();
		bindCheckBoxes();
		CALENDAR_DATA = JSON.parse(calenderResponse) || [];
		populateFullCalendar();
	};
	
	const bindCheckBoxes = function(){
		$('input[type="checkbox"]').each(function() {
			if (calenderDataOption.includes($(this).val())) {
				$(this).prop('checked', true);
			}
		});
	};
	
	parent.selectCheckBox = async function(){
		calenderDataOption = $('input[type="checkbox"]')
            .filter(':checked')
            .map(function() {
                return $(this).val();
            })
            .get();
		appCommonFunctionality.ajaxCallLargeData('CALENDERDATA', {"calenderDataOption" : calenderDataOption.join(',')}, settingsFunctionality.initCalendar);
		await appCommonFunctionality.adminCommonActivity();
	};
	
	const populateFullCalendar = function() {
		const calendarEl = document.getElementById('calendar');
		const today = moment().format('YYYY-MM-DD');
		const calendar = new FullCalendar.Calendar(calendarEl, {
			headerToolbar: {
				left: appCommonFunctionality.isMobile() ? 'prev,next' : 'prevYear,prev,next,nextYear today',
				center: 'title',
				right: 'timeGridDay,dayGridWeek,dayGridMonth'
			},
			initialDate: today,
			initialView: 'dayGridMonth',
			navLinks: false,
			editable: false,
			dayMaxEvents: true,
			visibleRange: {
				start: settingsFunctionality.getCalculatedDate('START'),
				end: settingsFunctionality.getCalculatedDate('END'),
			},
			events: CALENDAR_DATA,
			eventClick: function(info) {
				const eventTitle = info?.event?.title;
				if (!eventTitle) return;
				const [prefix, id] = eventTitle.split('_');
				switch (prefix) {
					case 'ORDP':{
						window.location = `purchaseOrderDetails.php?purchaseOrderId=${parseInt(id)}`;
						break;
					}
					case 'ORDS':{
						window.location = `saleOrderDetails.php?orderId=${parseInt(id)}`;
						break;
					}
					case 'SLD':{
						window.location = 'salesDairy.php';
						break;
					}
					default:{
						console.warn('Unknown event prefix:', prefix);
					}
				}
			},
			eventContent: function(arg) {
				/*const customEl = document.createElement('div');
				customEl.innerHTML = arg.event.title;
				return { domNodes: [customEl] };*/
			},
			eventDidMount: function(info) {
				//info.el.classList.remove('fc-h-event');
			}
		});

		calendar.render();
		if (appCommonFunctionality.isMobile()) {
			$("#fc-dom-1").css('font-size', '1.1em');
			$(".fc-toolbar-title").html('');
		}
		$(".fc-event").addClass('hover');
	};
	
	parent.getCalculatedDate = function(direction) {
        const today = moment();
        let calculatedDate = direction === 'START' ? today.subtract(6, 'months') : today.add(12, 'months');
        return calculatedDate.format('YYYY-MM-DD');
    };
	/*--------------------------------------Calender--------------------------------------*/
	
	/*--------------------------------------Company Types---------------------------------*/
	parent.initCompanyTypes = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('companyTypeSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			builtCompanyTypeTable();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	parent.validateCompanyTypeForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Company Type Validation-------------------------------*/
		if($("#companyType").val() === ''){
			appCommonFunctionality.raiseValidation("companyType", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("companyType", "companyType", true);
		}
		/*-------------------------------------Company Type Validation-------------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const builtCompanyTypeTable = function() {
		const companyTypeData = JSON.parse($('#companyTypeData').val());
		const str = `
			<table class="table table-bordered table-striped">
				<thead>
					<tr>
						<th id="cms_884">${appCommonFunctionality.getCmsString(884)}</th>
					</tr>
				</thead>
				<tbody>
					${companyTypeData.map(item => `
						<tr>
							<td>${item.companyType}<i class="fa fa-trash pull-right redText hover" onclick="settingsFunctionality.deleteCompanyType(${item.companyTypeId})"></i></td>
						</tr>
					`).join('')}
				</tbody>
			</table>
		`;
		$('#companyTypeTableContainer').html(str);
	};
	
	parent.deleteCompanyType = function(companyTypeId){
		window.location.replace('companyTypes.php?ACTION=DELETE&companyTypeId=' + companyTypeId);
	};
	/*--------------------------------------Company Types---------------------------------*/
	
	/*--------------------------------------Product Features------------------------------*/
	parent.initProductFeatures = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('productFeatureSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			builtProductFeatureTable();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	parent.validateProductFeatureForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Feature Title Validation-------------------------------*/
		if($("#featureTitle").val() === ''){
			appCommonFunctionality.raiseValidation("featureTitle", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("featureTitle", "featureTitle", true);
		}
		/*-------------------------------------Feature Title Validation-------------------------------*/
		
		/*-------------------------------------Feature Type Validation--------------------------------*/
		if($("#featureType").val() === ''){
			appCommonFunctionality.raiseValidation("featureType", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("featureType", "featureType", true);
		}
		/*-------------------------------------Feature Type Validation--------------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const builtProductFeatureTable = function() {
		const productFeatureData = JSON.parse($('#productFeatureData').val());
		const str = `
			<table class="table table-bordered table-striped">
				<thead>
					<tr>
						<th id="cms_887">${appCommonFunctionality.getCmsString(887)}</th>
					</tr>
				</thead>
				<tbody>
					${productFeatureData.map(item => `
						<tr>
							<td>
								${item?.featureTitle} [${item?.featureType}${item?.featureUnit ? ` - ${item.featureUnit}` : ''}]
								<i class="fa fa-trash pull-right redText hover" onclick="settingsFunctionality.deleteProductFeature(${item?.featureId})"></i>
							</td>
						</tr>
					`).join('')}
				</tbody>
			</table>
		`;
		$('#productFeatureTableContainer').html(str);
	};
	
	parent.deleteProductFeature = function(featureId){
		window.location.replace('features.php?ACTION=DELETE&featureId=' + featureId);
	};
	/*--------------------------------------Product Features------------------------------*/
	
	/*--------------------------------------Packing Boxes---------------------------------*/
	parent.initPackingBoxes = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('packingBoxSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			builtPacketTable();
			if(appCommonFunctionality.isMobile()){
				$('#packetNumber').parent().parent().addClass('nopaddingOnly');
				$('#submitBtn').removeClass('pull-left').addClass('pull-right');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	parent.validatePackingBoxForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Packet Name Validation-------------------------------*/
		if($("#packetName").val() === ''){
			appCommonFunctionality.raiseValidation("packetName", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("packetName", "packetName", true);
		}
		/*-------------------------------------Packet Name Validation-------------------------------*/
		
		/*-------------------------------------Packet Number Validation-----------------------------*/
		if($("#packetNumber").val() === ''){
			appCommonFunctionality.raiseValidation("packetNumber", "", true);
			errorCount++;
		}else if(parseInt($("#packetNumber").val()) > 0){
			if(checkIfPacketNumberExists(parseInt($("#packetNumber").val()))){
				appCommonFunctionality.raiseValidation("packetNumber", appCommonFunctionality.getCmsString(902), true);
				errorCount++;
			}
		}else { 
			appCommonFunctionality.removeValidation("packetNumber", "packetNumber", true);
		}
		/*-------------------------------------Packet Number Validation-----------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const checkIfPacketNumberExists = function(packetNumber) {
		const packetDataStr = $('#packetData').val();
		try {
			const packetData = JSON.parse(packetDataStr);
			return packetData.some(packet => packet.packetNumber === packetNumber);
		} catch (e) {
			console.error("Error parsing packetData:", e);
			return false;
		}
	};
	
	const builtPacketTable = function() {
		const packetData = JSON.parse($('#packetData').val() || '[]');
		const { getCmsString } = appCommonFunctionality;
		const dimensionSeparator = 'x';
		const deletePacketIcon = (id) => 
			`<i class="fa fa-trash pull-right redText hover" onclick="settingsFunctionality.deletePacket(${id})"></i>`;
		const addDimensionButton = (packetId) => `
			<i class="fa fa-plus marleft5 greenText hover" 
			   onclick="settingsFunctionality.addDimensionItem(${packetId})"></i>
		`;
		const dimensionControls = (packetId, index, isLast) => `
			<i class="fa fa-close marleft5 redText hover" 
			   onclick="settingsFunctionality.deleteDimensionItem(${packetId}, ${index})"></i>
			${addDimensionButton(packetId)}
			${!isLast ? '<br>' : ''}
		`;
		const rows = packetData.map(item => {
			let dimensionsHtml = '';
			try {
				const dimensions = JSON.parse(item.dimention || '[]');
				if (dimensions.length === 0) {
					dimensionsHtml = addDimensionButton(item.packetId);
				} else {
					dimensionsHtml = dimensions.map((dim, i) => {
						const { width = 0, height = 0, length = 0 } = dim;
						return `
							<span>${width}${dimensionSeparator}${height}${dimensionSeparator}${length}</span>
							${dimensionControls(item.packetId, i, i === dimensions.length - 1)}
						`;
					}).join('');
				}
			} catch (e) {
				console.error('Invalid dimension format:', item.dimention);
				dimensionsHtml = addDimensionButton(item.packetId);
			}
			return `
				<tr>
					<td>${item.packetNumber} - ${item.packetName} ${deletePacketIcon(item.packetId)}</td>
					<td class="f12">${dimensionsHtml}</td>
				</tr>
			`;
		});
		$('#packetTableContainer').html(`
			<table class="table table-bordered table-striped">
				<thead>
					<tr>
						<th id="cms_896">${getCmsString(896)}</th>
						<th><span id="cms_901">${getCmsString(901)}</span> [WxHxL]</th>
					</tr>
				</thead>
				<tbody>${rows.join('')}</tbody>
			</table>
		`);
	};

	parent.deletePacket = function(packetId){
		window.location.replace('packingBoxes.php?ACTION=DELETE&packetId=' + packetId);
	};
	
	parent.addDimensionItem = function(packetId){
		$('#packetIdHdn').val(packetId);
		$('#packingBoxDimensionModal').modal('show');
	};
	
	parent.addPackingBoxDimension = function(){
		let width = $('#width').val();
		let height = $('#height').val();
		let length = $('#length').val();
		let packetId = $('#packetIdHdn').val();
		window.location.replace('packingBoxes.php?ACTION=ADDPACKINGBOXDIMENSION&packetId=' + packetId + '&width=' + width + '&height=' + height + '&length=' + length);
	};
	
	parent.deleteDimensionItem = function(packetId, index){
		window.location.replace('packingBoxes.php?ACTION=DELETEPACKINGBOXDIMENSION&packetId=' + packetId + '&index=' + index);
	};
	/*--------------------------------------Packing Boxes---------------------------------*/
	
	/*--------------------------------------Finance Categories----------------------------*/
	parent.initFinanceCategory = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('financeCategorySectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			bindEarningTable();
			bindExpenseTable();
			if(appCommonFunctionality.isMobile()){
				$('#financeTypeTitle').parent().parent().addClass('nopaddingOnly');
				$('#submitBtn').removeClass('pull-left').addClass('pull-right');
				$('#earningTableContainer').parent().addClass('nopaddingOnly');
			}
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	parent.validateFinanceCategoryForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Finance Type Validation-------------------------------*/
		if($("#financeType").val() === ''){
			appCommonFunctionality.raiseValidation("financeType", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("financeType", "financeType", true);
		}
		/*-------------------------------------Finance Type Validation-------------------------------*/
		
		/*-------------------------------------Finance Type Title Validation-------------------------*/
		if($("#financeTypeTitle").val() === ''){
			appCommonFunctionality.raiseValidation("financeTypeTitle", "", true);
			errorCount++;
		}else { 
			appCommonFunctionality.removeValidation("financeTypeTitle", "financeTypeTitle", true);
		}
		/*-------------------------------------Finance Type Title Validation-------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const bindEarningTable = function() {
		try {
			const earningData = JSON.parse($('#earningData').val() || '[]');
			const str = `
				<table class="table table-bordered table-striped">
					<thead>
						<tr>
							<th id="cms_918"${appCommonFunctionality.getCmsString(918)}</th>
						</tr>
					</thead>
					<tbody>
						${earningData.map(item => `
							<tr>
								<td>
									${item.earningTypeTitle || ''}
									${item.earningTypeId !== financeCategoryORDS ? 
										`<i class="fa fa-trash pull-right redText hover notAllowed" 
										  onclick="settingsFunctionality.deleteEarningType(${item.earningTypeId || 0})"></i>` 
										: ''
									}
								</td>
							</tr>
						`).join('')}
					</tbody>
				</table>
			`;
			$('#earningTableContainer').html(str);
		} catch (e) {
			console.error('Error parsing earning data:', e);
			$('#earningTableContainer').html('<div class="alert alert-danger">Error loading earning data</div>');
		}
	};
	
	parent.deleteEarningType = function(earningTypeId){
		window.location.replace('financeCategory.php?ACTION=DELETE&financeType=EARNING&earningTypeId=' + earningTypeId);
	};

	const bindExpenseTable = function() {
		try {
			const expenseData = JSON.parse($('#expenseData').val() || '[]');
			const str = `
				<table class="table table-bordered table-striped">
					<thead>
						<tr>
							<th id="cms_917"${appCommonFunctionality.getCmsString(917)}</th>
						</tr>
					</thead>
					<tbody>
						${expenseData.map(item => `
							<tr>
								<td>
									${item.expenseTypeTitle || ''} 
									${item.expenseTypeId !== financeCategoryORDP ? 
										`<i class="fa fa-trash pull-right redText hover notAllowed" 
										  onclick="settingsFunctionality.deleteExpenseType(${item.expenseTypeId || 0})"></i>` 
										: ''
									}
								</td>
							</tr>
						`).join('')}
					</tbody>
				</table>
			`;
			$('#expenseTableContainer').html(str);
		} catch (e) {
			console.error('Error parsing expense data:', e);
			$('#expenseTableContainer').html('<div class="alert alert-danger">Error loading expense data</div>');
		}
	};
	
	parent.deleteExpenseType = function(expenseTypeId){
		window.location.replace('financeCategory.php?ACTION=DELETE&financeType=EXPENSE&expenseTypeId=' + expenseTypeId);
	};
	/*--------------------------------------Finance Categories----------------------------*/
	
	/*--------------------------------------Stock Storages--------------------------------*/
	parent.initStockStorages = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('stockStorageSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			buildStockStorageTree();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	const buildStockStorageTree = function() {
		try {
			const storageData = JSON.parse($('#stockStorageData').val() || '[]');
			$('#treeview').empty();
			const makeStorageTreeItem = function(parentId) {
				let str = '';
				storageData.filter(item => parseInt(item.parentId) === parseInt(parentId))
					.forEach(item => {
						const hasChildren = storageData.some(child => parseInt(child.parentId) === parseInt(item.storageId));
						str += `<li data-id="${item.storageId}">
							${hasChildren ? '<i class="fa fa-plus"></i>' : '<i class="fa fa-plus lightGreyText" style="visibility:hidden;"></i>'}
							<label class="marleft5">
								<span class="marleft5"><i class="fa fa-th"></i></span>
								<span class="marleft5">${item.storageName}</span>
							</label>
							<span>
								<i class="fa fa-plus marleft5 greenText hover" 
								   onclick="settingsFunctionality.openStockStorageModal(${item.storageId})"></i>
								<i class="fa fa-close marleft5 redText hover" 
								   onclick="settingsFunctionality.deleteStockStorage(${item.storageId})"></i>
							</span>
							${hasChildren ? `<ul>${makeStorageTreeItem(item.storageId)}</ul>` : ''}
						</li>`;
					});
				return str;
			};
			$('#treeview').html(makeStorageTreeItem(0));
			$('#treeview-container').hummingbird();
			//$('.fa-plus').click();
		} catch (e) {
			console.error('Error building stock storage tree:', e);
			$('#treeview-container').html('<div class="alert alert-danger">Error loading storage data</div>');
		}
	};
	
	parent.openStockStorageModal = function(parentId){
		$('#parentId').val(parentId);
		$('#stockStorageModal').modal('show');
	};
	
	parent.validateStockStorageForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Storage Name Validation-------------------------------*/
		if($("#storageName").val() === ''){
			appCommonFunctionality.raiseValidation("storageName", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("storageName", "storageName", true);
		}
		/*-------------------------------------Storage Name Validation-------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.deleteStockStorage = function(storageId){
		window.location.replace('stockStorages.php?ACTION=DELETE&storageId=' + storageId);
	};
	/*--------------------------------------Stock Storages--------------------------------*/
	
	/*--------------------------------------Image Crop------------------------------------*/
	parent.initImageManualCrop = async function () {
		await appCommonFunctionality.adminCommonActivity();
		appCommonFunctionality.adjustMainContainerHight('productImageManualCropSectionHolder');
		$('#cropbox').rcrop({
			minSize : [160,90],
			preserveAspectRatio : false,
			grid : true,
			preview : {
				display: true,
				size : [630,420],
			}
		}).on('rcrop-changed rcrop-ready', function(){
			var values = $('#cropbox').rcrop('getValues');
			//console.log(values);
			$('#x').val(values.x);
			$('#y').val(values.y);
			$('#width').val(values.width);
			$('#height').val(values.height);
		});
		if(appCommonFunctionality.isMobile()){
			$('.warningText').removeClass('hide');
		}
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	};
	
	parent.reCrop = function(){
		var x = $('#x').val();
		var y = $('#y').val();
		var w = $('#width').val();
		var h = $('#height').val();
		$('#cropbox').rcrop('resize', w, h, x, y);
	};
	
	parent.saveCroppedImage = function(){
		$('#xCord').val($('#x').val());
		$('#yCord').val($('#y').val());
		$('#croppedwidth').val($('#width').val());
		$('#croppedHeight').val($('#height').val());
		$('#imageManualCropForm').submit();
	};
	/*--------------------------------------Image Crop------------------------------------*/
	
	/*--------------------------------------Image filters---------------------------------*/
	parent.initImageFilters = async function () {
		await appCommonFunctionality.adminCommonActivity();
		appCommonFunctionality.adjustMainContainerHight('productImageFiltersSectionHolder');
		if(appCommonFunctionality.isMobile()){
			$('.warningText').removeClass('hide');
			$('.radioText').each(function(){ 
				$(this).text(appCommonFunctionality.shapeString($(this).text(), 8)); 
			});
		}
		let canvasResizeTimer = setTimeout(function () {
			var $canvas = $('#inputImg');
			if ($canvas.is('[style]')) {
				$canvas.removeAttr('style');
				clearTimeout(canvasResizeTimer);
			}
		}, LOADTIME);
	};
	
	parent.changeFilter = function(controlId, value){
		if($("#" + controlId + "_value").length > 0){
			$("#" + controlId + "_value").text(value);
		}
		appCommonFunctionality.showLoader();
		switch (controlId) {
			
			case "brightness":{
				Caman("#inputImg", function () {
					this.brightness(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "contrast":{
				Caman("#inputImg", function () {
					this.contrast(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "saturation":{
				Caman("#inputImg", function () {
					this.saturation(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "vibrance":{
				Caman("#inputImg", function () {
					this.vibrance(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "exposure":{
				Caman("#inputImg", function () {
					this.exposure(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "hue":{
				Caman("#inputImg", function () {
					this.hue(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "sepia":{
				Caman("#inputImg", function () {
					this.sepia(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "gamma":{
				Caman("#inputImg", function () {
					this.gamma(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "noise":{
				Caman("#inputImg", function () {
					this.noise(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "clip":{
				Caman("#inputImg", function () {
					this.clip(value).render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "vintage":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.vintage().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "lomo":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.lomo().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "clarity":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.clarity().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "sinCity":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.sinCity().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "sunrise":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.sunrise().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "crossProcess":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.crossProcess().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "orangePeel":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.orangePeel().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "love":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.love().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "grungy":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.grungy().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "jarques":{
				Caman("#inputImg", function () {
					this.jarques().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "pinhole":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.pinhole().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "oldBoot":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.oldBoot().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "glowingSun":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.glowingSun().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "hazyDays":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.hazyDays().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "herMajesty":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.herMajesty().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "nostalgia":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.nostalgia().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "concentrate":{
				Caman("#inputImg", function () {
					this.revert(false);
					this.concentrate().render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
			
			case "revert":{
				$('input[type=radio], input[name="imageFilter"]').prop('checked', false);
				Caman("#inputImg", function () {
					this.revert(false);
					this.render(function(){ appCommonFunctionality.hideLoader(); });
				});
				break;
			}
		}
	};
	
	parent.saveChanges = function(){
		var folder = $('#folder').val();
		var imageFile = $('#imageFile').val();
		var id = $('#id').val();
		var canvas = document.getElementById('inputImg');
		var dataURL = window.btoa(encodeURI(canvas.toDataURL()));
		$('#imgBase64Data').val(dataURL);
		if($('#imgBase64Data').val().length > 0){
			appCommonFunctionality.showLoader();
			//$('#imageFilterForm').submit(); //temp xxxx server plan :(
		}
		var qryStr = 'GENERATEPROCESSEDIMAGE&folder=' + folder + '&imageFile=' + imageFile;
		var callData = {"imageData" : dataURL};
		appCommonFunctionality.generatImageAjaxCall(qryStr, callData, parent.gotoRespectiveModule());
	};
	
	parent.gotoRespectiveModule = function(data){
		var folder = $('#folder').val();
		var imageFile = $('#imageFile').val();
		var id = $('#id').val();
		if(folder === "products"){
			window.location.replace('productDetail.php?productId=' + id);
		}else if(folder === "productCategory"){
			window.location.replace('categoryEntry.php?categoryId=' + id);
		}else if(folder == "userImage"){
			window.location.replace('userDetail.php?userId=' + id);
		}
	};
	/*--------------------------------------Image filters---------------------------------*/
	
	/*--------------------------------------BackUp----------------------------------------*/
	parent.initBackup = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('backUpSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			$('#backUpName').val(SITETITLE + '_' + appCommonFunctionality.getCurrentDatetime().replace(':', '-'));
			populateBackupFiles();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
        } catch (error) { 
			console.error('Error during initialization:', error); 
		}
	};
	
	parent.createBackup = function(){
		if(validateBackupForm()){
			let backUpName = $('#backUpName').val();
			const queryString = `CREATEBACKUP&backUpName=${backUpName}`;
			appCommonFunctionality.ajaxCall(queryString, receiveOnBackupCreated);
		}
	};
	
	const validateBackupForm = function(){
		var errorCount = 0;
		
		/*-------------------------------------Backup Name Validation-------------------------------*/
		if($("#backUpName").val() === ''){
			appCommonFunctionality.raiseValidation("backUpName", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("backUpName", "backUpName", true);
		}
		/*-------------------------------------Backup Name Validation-------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const receiveOnBackupCreated = function(response){
		response = JSON.parse(response);
		appCommonFunctionality.reloadPage();
	};
	
	const populateBackupFiles = function () {
		let zipFileSerializedData = JSON.parse($('#zipFileSerializedData').val());
		let files = zipFileSerializedData.zipFiles || [];
		files.sort((a, b) => extractDateFromFileName(b) - extractDateFromFileName(a));
		let str = '<table class="table table-bordered table-striped">';
		str += '<thead><tr>';
		str += '<th id="cms_879">File Name</th>';
		str += '<th id="cms_880">Date & Time</th>';
		str += '<th id="cms_881">Action</th>';
		str += '</tr></thead><tbody>';
		if (files.length === 0) {
			str += '<tr><td id="cms_882" colspan="3" class="text-center">No backup files found.</td></tr>';
		} else {
			files.forEach(function (fileName) {
				let dateTime = parseDateTimeFromFileName(fileName);
				str += '<tr>';
				str += '<td>';
				str += '<i class="fa fa-file-zip-o marRig5 redText"></i>';
				str += fileName;
				str += '<a href="' + PROJECTPATH + 'backup/' + fileName + '" download="">';
				str += '<i class="fa fa-download greenText hover marleft5"></i>';
				str += '</a>';
				str += '</td>';
				str += '<td>' + dateTime + '</td>';
				str += '<td>';
				str += '<i class="fa fa-trash marleft5 redText hover" onclick="settingsFunctionality.deleteBackup(\'' + fileName + '\')"></i>';
				str += '</td>';
				str += '</tr>';
			});
		}
		str += '</tbody></table>';
		$('#backUpTableHolder').html(str);
	};

	const extractDateFromFileName = function(fileName) {
		const match = fileName.match(/_(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})\.zip$/);
		if (match) {
			const [ , year, month, day, hour, minute ] = match;
			return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
		}
		return new Date(0); // fallback for invalid format
	};

	const parseDateTimeFromFileName = function(fileName) {
		const match = fileName.match(/_(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})\.zip$/);
		if (match) {
			const [ , year, month, day, hour, minute ] = match;
			const date = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
			const dayNum = parseInt(day, 10);
			const daySuffix = (d => {
				if (d >= 11 && d <= 13) return 'th';
				switch (d % 10) {
					case 1: return 'st';
					case 2: return 'nd';
					case 3: return 'rd';
					default: return 'th';
				}
			})(dayNum);
			const monthNames = [
				'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November', 'December'
			];
			let hourNum = parseInt(hour, 10);
			const ampm = hourNum >= 12 ? 'PM' : 'AM';
			hourNum = hourNum % 12;
			hourNum = hourNum === 0 ? 12 : hourNum;
			return `${dayNum}${daySuffix} ${monthNames[parseInt(month, 10) - 1]} ${year} ${String(hourNum).padStart(2, '0')}:${minute} ${ampm}`;
		}
		return 'N/A';
	};
	
	parent.deleteBackup = function(fileName){
		window.location = `backUp.php?ACTION=DELETE&backUpName=` + fileName;
	};
	/*--------------------------------------BackUp----------------------------------------*/
	
	return parent;
})(window, jQuery);