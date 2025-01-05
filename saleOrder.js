const MENUSELECTIONITEM = "saleOrders.php";
let SEARCHCUSTOMERCRITERIA = {
	keyword: "",
	companyTypeId: "",
	customerGrade: "",
	status: 1
};
let isCoCOrder = false;
const inputDelay = 500;
//let BARQRREGEX = /^B2B2C_?/;
const BARQRREGEX = new RegExp(`^${SITETITLE}_?`);
let ORDEROBJ = [];
let PRODUCTSTOCKSYSREF = {};
let SEARCHSALEORDERCRITERIA = {
	keyword: "",
	status: 1
};
const PAGEDOCNAME = (window.location.pathname).substring((window.location.pathname).lastIndexOf("/") + 1);


$(document).ready(function() {

    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });

    if (PAGEDOCNAME === "saleOrders.php") {
        saleOrderFunctionality.initSaleOrder();
    } else if (PAGEDOCNAME === "saleOrderEntry.php") {
        saleOrderFunctionality.initSaleOrdersEntry();
    } else if (PAGEDOCNAME === "saleOrderDetail.php") {
        saleOrderFunctionality.initSaleOrderDetail();
    }

    appCommonFunctionality.cmsImplementationThroughID();
    appCommonFunctionality.cmsImplementationThroughRel();
});

const saleOrderFunctionality = (function(window, $) {
    const parent = {};

    parent.initSaleOrder = function() {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
    };
	
	parent.addSaleOrder = () => {
        window.location = `saleOrderEntry.php`;
    };

    parent.initSaleOrdersEntry = function() {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		$("#customerSearch").on('keyup', function(){
			var customerSearchKeyword = $("#customerSearch").val();
			if(customerSearchKeyword.length > 2){
				isCoCOrder = false;
				SEARCHCUSTOMERCRITERIA.keyword = customerSearchKeyword;
				$('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
				appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggsetionBox);
			}else{
				$('#customerSearchResult').html('');
			}
		});
		
		/*-----------------------------Capturing Product combinations for Sale order------------------------*/
		if($("#productStockPreCompileData").val() !== ""){
			PRODUCTSTOCKSYSREF = JSON.parse($("#productStockPreCompileData").val());
		}
		let debounceTimer;
		$('#scannerGunData').on('input', function() {
			clearTimeout(debounceTimer);
			let scannerGunDataValue = $(this).val();
			debounceTimer = setTimeout(function() {
				//console.log("scannerGunDataValue : ", scannerGunDataValue);
				scannerGunDataValue = scannerGunDataValue.replace(BARQRREGEX, '');
				captureProductCombinationFromBarQrCode(scannerGunDataValue);
			}, inputDelay);
		});
		/*-----------------------------Capturing Product combinations for Sale order------------------------*/
    };
	
	const populateCustomerSuggsetionBox = function(data){
		$('#customerGroupAddonIcon').removeClass('fa-spinner fa-spin').addClass('fa-search');
		var customerData = JSON.parse(data);
		var customerResultItemClass = 'customerResultItem';
		if(appCommonFunctionality.isMobile()){
			customerResultItemClass = 'customerResultItem-Mob';
		}
		var str = '';
		if(customerData.length > 0){
			for(let i = 0; i < customerData.length; i++){
				if(customerData[i].companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()){ //for CoC Option
					str = str + `<div id="customerResultItem_${customerData[i].customerId}" class="${customerResultItemClass} hover" onclick="saleOrderFunctionality.onSelectingCustomer(${customerData[i].customerId}, '${customerData[i].customerGrade}')">`;
						str = str + '<div class="f16">' + customerData[i].companyName + '</div>';
					str = str + '</div>';
				}else{
					str = str + `<div id="customerResultItem_${customerData[i].customerId}" class="${customerResultItemClass} hover" onclick="saleOrderFunctionality.onSelectingCustomer(${customerData[i].customerId}, '${customerData[i].customerGrade}')">`;
						str = str + '<div class="f16">' + customerData[i].companyName + ' (' + getCompanyType(customerData[i].companyType) + ') [' + customerData[i].customerGrade + ']</div>';
							str = str + '<div class="f12">';
								str = str + '<strong><span id="cms_314">' + appCommonFunctionality.getCmsString(314) + '</span>: </strong>';
								str = str + '<span class="blueText">' + customerData[i].buyerName + '</span><br>';
								str = str + '<strong><span id="cms_315">' + appCommonFunctionality.getCmsString(315) + '</span>: </strong>';
								str = str + '<span class="blueText">' + customerData[i].contactPerson + '</span>';
							str = str + '</div>';
						if(!appCommonFunctionality.isMobile()){
							str = str + '<div class="f12">';
								str = str + '<i class="fa fa-phone blueText"></i> ' + customerData[i].phone + '<br>';
								str = str + '<i class="fa fa-envelope greenText"></i> <span class="blueText">' + customerData[i].email + '</span>';
							str = str + '</div>';
						}
					str = str + '</div>';
				}
			}
		}else{
			str = str + '<div class="customerResultItem">No Data</div>';
		}
		$("#customerSearchResult").html(str);
		$("#selectedCustomerTitle, #saleOrderControlButtonHolder, #totalCalcSection").addClass('hide');
		$("#selectedCustomerSection, #customerDeliveryAddressTableHolder").html('');
		if(isCoCOrder){ //for CoC Option
			$('div[id^="customerResultItem_"]').trigger('click'); //xxxx correct
		}
	};
	
	parent.onSelectingCustomer = function(customerId, customerGrade){
		$("#selectedCustomerId").val(customerId);
		$("#selectedCustomerGrade").val(customerGrade);
		var customerResultItemClass = 'customerResultItem';
		if(appCommonFunctionality.isMobile()){
			customerResultItemClass = 'customerResultItem-Mob';
		}
		$("#selectedCustomerSection").html($("#customerResultItem_" + customerId).html()).addClass(customerResultItemClass);
		$("#selectedCustomerTitle").removeClass('hide');
		$('#customerSearchResult').html('');
		appCommonFunctionality.ajaxCall('GETDELIVERYADDRESSES&customerId=' + customerId, bindCustomerDeliveryAddressTable);
	};
	
	const bindCustomerDeliveryAddressTable = function(data) {
        const customerDeliveryAddressData = JSON.parse(data);
        let str = `<table id="customerDeliveryAddressTable" class="w3-table w3-striped w3-bordered w3-hoverable w3-white"><tbody><tr><td width="100%"><strong id="cms_316">` + appCommonFunctionality.getCmsString(316) + `</strong></td></tr>`;
        if (customerDeliveryAddressData.length > 0) {
			if(customerDeliveryAddressData[0].companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()){
				let data = customerDeliveryAddressData[0];
				str += `<tr class="f12"><td width="100%">${data.companyName} </td></tr>`;
			}else{
				let isFirst = true;
				customerDeliveryAddressData.forEach(data => {
					str += `<tr class="f12"><td width="100%"><input type="radio" id="deliveryAddress_${data.deliveryAddressId}" name="deliveryAddress_${data.companyName}" class="marRig5" value="${data.deliveryAddressId}" ${isFirst ? 'checked' : ''} onchange="saleOrderFunctionality.onSelectCustomerDeliveryAddressId(${data.deliveryAddressId})"><b rel="cms_322">Company Name</b>: ${data.companyName} | <b rel="cms_323">Contact person</b>: ${data.contactPerson} | <b rel="cms_324">Phone</b>: ${data.phone} | <b>Email</b>: <a href="mailto: ${data.email}" class="blueText">${data.email}</a> | <b rel="cms_325">Address</b>: ${data.address} | <b rel="cms_326">Town</b>: ${data.town} | <b>Postcode</b>: ${data.postCode} | <b rel="cms_327">Country</b>: <span>${appCommonFunctionality.getCountryName(data.country, true)}</span></td></tr>`;
					isFirst = false;
				});
			}
			$("#selectedCustomerDeliveryAddressId").val(customerDeliveryAddressData[0].deliveryAddressId);
        } else {
            str += '<tr class="f12"><td colspan="2">No Data</td></tr>';
        }
        str += '</tbody></table>';
        $("#customerDeliveryAddressTableHolder").html(str);
		$("#saleOrderControlButtonHolder").removeClass('hide');
    };
	
	parent.onSelectCustomerDeliveryAddressId = function(deliveryAddressId){
		$("#selectedCustomerDeliveryAddressId").val(deliveryAddressId);
	};
	
	parent.mapCoCOrder = function(){
		isCoCOrder = true;
		SEARCHCUSTOMERCRITERIA.keyword = COMPANYTYPECoC;
		$("#customerSearch").val('');
		$('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
		appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggsetionBox);
	}
	
	parent.initSaleOrderDetail = function() {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
    };
	
	const getCompanyType = function(companyTypeId) {
		const companyTypeSerializedData = JSON.parse($("#companyTypeSerializedData").val() || "[]");
		const companyType = companyTypeSerializedData.find(item => parseInt(item.companyTypeId) === parseInt(companyTypeId));
		return companyType ? companyType.companyType : '';
	};
	
	parent.scannerGun = function(){
		$("#scannerGunData").val('').focus();
	};
	
	const captureProductCombinationFromBarQrCode = function(scannerGunDataValue){
		let productFound = false;
		if(PRODUCTSTOCKSYSREF.length > 0 && scannerGunDataValue !== ''){
			for(var i = 0; i < PRODUCTSTOCKSYSREF.length; i++){
				if(PRODUCTSTOCKSYSREF[i].systemReference.toLowerCase() === scannerGunDataValue.toLowerCase()){
					ORDEROBJ.push(PRODUCTSTOCKSYSREF[i]);
					productFound = true;
					saleOrderFunctionality.scannerGun();
					break;
				}
			}
			//console.log("ORDEROBJ : ", ORDEROBJ);
			if(!productFound){
				$("#productScannerErr").html(appCommonFunctionality.getCmsString(328));
				$('#scanningErrorAudio')[0].play().catch(function(error) {
					console.error('Error playing audio:', error);
				});
				saleOrderFunctionality.scannerGun();
			}
			saleOrderFunctionality.populateCart();
		}
	};
	
	parent.populateCart = function(){
		/*------------------------------------------Prepareing Display Order Array-------------------------------------*/
		let displayOrderArr = [];
		let orderMap = new Map(); // Use a map to store product combinations and their quantities

		if (ORDEROBJ.length > 0) {
			for (let i = 0; i < ORDEROBJ.length; i++) {
				let productId = parseInt(ORDEROBJ[i].productId);
				let productCombinationId = parseInt(ORDEROBJ[i].productCombinationId);
				let key = `${productId}-${productCombinationId}`; // Create a unique key for the combination

				if (orderMap.has(key)) {
					orderMap.get(key).qty += 1; // Increment quantity if the combination already exists
				} else {
					let tempOrdObj = { ...ORDEROBJ[i], qty: 1 }; // Create a new object with qty initialized to 1
					orderMap.set(key, tempOrdObj); // Add the new combination to the map
				}
			}

			// Convert the map values to an array
			displayOrderArr = Array.from(orderMap.values());
		}
		/*------------------------------------------Prepareing Display Order Array-------------------------------------*/
		let totalPrice = 0;
		let totalBeforeTax = 0;
		let str = '';
		str = str + '<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW720">';
			str = str + '<tbody>';
				str = str + '<tr>';
					str = str + '<td width="80%"><b>' + appCommonFunctionality.getCmsString(329) + '</b></td>';
					str = str + '<td width="10%"><b>Qty</b></td>';
					str = str + '<td width="10%"><b>' + appCommonFunctionality.getCmsString(330) + '</b></td>';
				str = str + '</tr>';
				if(displayOrderArr.length > 0){
					for(var i = 0; i < displayOrderArr.length; i++){
						let selectedCustomerGrade = $("#selectedCustomerGrade").val();
						let effectivePrice = 0;
						if(selectedCustomerGrade.toLowerCase() === 'r'){
							effectivePrice = displayOrderArr[i].RPrice;
						}else if(selectedCustomerGrade.toLowerCase() === 'w'){
							effectivePrice = displayOrderArr[i].WPrice;
						}
						str = str + '<tr>';
							str = str + '<td>';
								//Open on demand
								//str = str + '<img src="' + PROJECTPATH + PRODUCTIMAGEURL + displayOrderArr[i].image + '" alt="' + displayOrderArr[i].image + '" class="productImage pull-left" onerror="appCommonFunctionality.onImgError(this)">';
								str = str + '<div class="pull-left f12 marleft5">';
									str = str + '<span>' + displayOrderArr[i].productTitle + ' [' + displayOrderArr[i].productCode + '] ' + appCommonFunctionality.getDefaultCurrency() + effectivePrice + '</span><br>';
									str = str + '<span>[' + displayOrderArr[i].productCombinationId + '] - ' + getQRTextHtml(displayOrderArr[i].productCombinationQR, displayOrderArr[i].productCode) + '</span>';
								str = str + '</div>';
							str = str + '</td>';
							str = str + '<td>x ' + displayOrderArr[i].qty + '</td>';
							str = str + '<td>' + appCommonFunctionality.getDefaultCurrency() + (effectivePrice * displayOrderArr[i].qty).toFixed(2)+ '</td>';
							totalBeforeTax = totalBeforeTax + (effectivePrice * displayOrderArr[i].qty);
						str = str + '</tr>';
					}
					//console.log("Total price before tax : ", totalBeforeTax);
				}else{
					str = str + '<tr><td colspan="3">No Data</td></tr>';
				}
			str = str + '</tbody>';
		str = str + '</table>';
		$("#cartTableHolder").html(str);
		$("#totalCalcSection").removeClass('hide');
		$("#totalBeforeTax").html(appCommonFunctionality.getDefaultCurrency() + totalBeforeTax.toFixed(2));
		$("#taxP").html(DEFAULTTAX);
		totalPrice = totalBeforeTax + ((totalBeforeTax * DEFAULTTAX)/100);
		$("#totalPrice").html(appCommonFunctionality.getDefaultCurrency() + totalPrice.toFixed(2));
	};
	
	const getQRTextHtml = function(QRText, productCode){
		var str = '';
		var QRTextArr1 = QRText.split('_');
		QRText = QRTextArr1[0].replace((productCode + '-'), '');
		var QRTextArr2 = QRText.split('X');
		for(var i = 0; i < QRTextArr2.length; i++){
			if(QRTextArr2[i] !== ''){
				var featureValArr = QRTextArr2[i].split(':');
				if(featureValArr[0].toLowerCase() === 'color'){
					str = str + featureValArr[0] + ' : <i class="fa fa-square marRig5 marleft5" style="color:#' + featureValArr[1] + '"></i>';
				}else{
					str = str + featureValArr[0] + ': ' + featureValArr[1];
				}
				if((i < (QRTextArr2.length - 1)) && (QRTextArr2[i + 1] !== '')){
					str = str + '<i class="fa fa fa-remove blueText marRig5 marleft5"></i>';
				}
			}
		}
		return str;
	};
	
    return parent;
}(window, window.$));