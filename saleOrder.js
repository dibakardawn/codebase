const MENUSELECTIONITEM = "saleOrders.php";
const inputDelay = 500;
const BARQRREGEX = new RegExp(`^${SITETITLE}_?`);
let SEARCHCUSTOMERCRITERIA = {
    keyword: "",
    companyTypeId: "",
    customerGrade: "",
    status: 1
};
let isCoCOrder = false;
let ORDEROBJ = [];
let PRODUCTSTOCKSYSREF = {};
let qrCodeScannerCameraPopupWindow;
let qrCodeScannerCameraPopupCheckInterval;
const qrScannerCameraUrl = 'qrCodeScannerCamera.html';
let scannerQRCodes = [];
let BRANDS = [];
let CATEGORIES = [];
let SELECTEDCATEGORYIDARR = [];
let PRODUCTS = [];
let SEARCHSALEORDERCRITERIA = {
    keyword: "",
    status: 1
};
const PAGEDOCNAME = window.location.pathname.split('/').pop();

$(document).ready(function () {
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });

    switch (PAGEDOCNAME) {
        case "saleOrders.php":{
            saleOrderFunctionality.initSaleOrder();
            break;
		}
		
        case "saleOrderEntry.php":{
            saleOrderFunctionality.initSaleOrdersEntry();
            break;
		}
		
        case "saleOrderDetail.php":{
            saleOrderFunctionality.initSaleOrderDetail();
            break;
		}
    }

    appCommonFunctionality.cmsImplementationThroughID();
    appCommonFunctionality.cmsImplementationThroughRel();
});

const saleOrderFunctionality = (function (window, $) {
    const parent = {};

    parent.initSaleOrder = function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
    };

    parent.addSaleOrder = () => {
        window.location = `saleOrderEntry.php`;
    };

    parent.initSaleOrdersEntry = function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');

        $("#customerSearch").on('keyup', function () {
            const customerSearchKeyword = $(this).val();
            if (customerSearchKeyword.length > 2) {
                isCoCOrder = false;
                SEARCHCUSTOMERCRITERIA.keyword = customerSearchKeyword;
                $('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
                appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
            } else {
                $('#customerSearchResult').html('');
            }
        });

        if ($("#productStockPreCompileData").val() !== "") {
            PRODUCTSTOCKSYSREF = JSON.parse($("#productStockPreCompileData").val());
        }
		
		/*----------------------Scanner device implementation-----------------------------*/
        let debounceTimer;
        $('#scannerGunData').on('input', function () {
            clearTimeout(debounceTimer);
            const scannerGunDataValue = $(this).val().replace(BARQRREGEX, '');
            debounceTimer = setTimeout(() => {
                captureProductCombinationFromBarQrCode(scannerGunDataValue);
            }, inputDelay);
        });
		/*----------------------Scanner device implementation-----------------------------*/
		
		if(!appCommonFunctionality.isMobile()){
			$('#addProductQRScannerCam').prop('disabled', true);
		}
		
		BRANDS = JSON.parse($('#productBrandSerializedData').val());
		CATEGORIES = JSON.parse($('#productCatSerializedData').val());
    };

    const populateCustomerSuggestionBox = function (data) {
        $('#customerGroupAddonIcon').removeClass('fa-spinner fa-spin').addClass('fa-search');
        const customerData = JSON.parse(data);
        const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        let str = '';

        if (customerData.length > 0) {
            customerData.forEach(customer => {
                const customerId = customer.customerId;
                const customerGrade = customer.customerGrade;

                str += `<div id="customerResultItem_${customerId}" class="${customerResultItemClass} hover" onclick="saleOrderFunctionality.onSelectingCustomer(${customerId}, '${customerGrade}')">`;

                if (customer.companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()) {
                    str += `<div class="f16">${customer.companyName}</div>`;
                } else {
                    str += `<div class="f16">${customer.companyName} (${getCompanyType(customer.companyType)}) [${customerGrade}]</div>
                            <div class="f12">
                                <strong><span id="cms_314">${appCommonFunctionality.getCmsString(314)}</span>: </strong>
                                <span class="blueText">${customer.buyerName}</span><br>
                                <strong><span id="cms_315">${appCommonFunctionality.getCmsString(315)}</span>: </strong>
                                <span class="blueText">${customer.contactPerson}</span>
                            </div>`;
                    if (!appCommonFunctionality.isMobile()) {
                        str += `<div class="f12">
                                    <i class="fa fa-phone blueText"></i> ${customer.phone}<br>
                                    <i class="fa fa-envelope greenText"></i> <span class="blueText">${customer.email}</span>
                                </div>`;
                    }
                }
                str += `</div>`;
            });
        } else {
            str += '<div class="customerResultItem">No Data</div>';
        }

        $("#customerSearchResult").html(str);
        $("#selectedCustomerTitle, #saleOrderControlButtonHolder, #totalCalcSection").addClass('hide');
        $("#selectedCustomerSection, #customerDeliveryAddressTableHolder").html('');
        if (isCoCOrder) {
            $('div[id^="customerResultItem_"]').trigger('click');
        }
    };

    parent.onSelectingCustomer = function (customerId, customerGrade) {
        $("#selectedCustomerId").val(customerId);
        $("#selectedCustomerGrade").val(customerGrade);
        const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        $("#selectedCustomerSection").html($(`#customerResultItem_${customerId}`).html()).addClass(customerResultItemClass);
        $("#selectedCustomerTitle").removeClass('hide');
        $('#customerSearchResult').html('');
        appCommonFunctionality.ajaxCall(`GETDELIVERYADDRESSES&customerId=${customerId}`, bindCustomerDeliveryAddressTable);
    };

    const bindCustomerDeliveryAddressTable = function (data) {
        const customerDeliveryAddressData = JSON.parse(data);
        let str = `<table id="customerDeliveryAddressTable" class="w3-table w3-striped w3-bordered w3-hoverable w3-white"><tbody><tr><td width="100%"><strong id="cms_316">${appCommonFunctionality.getCmsString(316)}</strong></td></tr>`;

        if (customerDeliveryAddressData.length > 0) {
            if (customerDeliveryAddressData[0].companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()) {
                const data = customerDeliveryAddressData[0];
                str += `<tr class="f12"><td width="100%">${data.companyName}</td></tr>`;
            } else {
				let isFirst = true;
                customerDeliveryAddressData.forEach((data, index) => {
					str += `<tr class="f12"><td width="100%"><input type="radio" id="deliveryAddress_${data.deliveryAddressId}" name="deliveryAddress_${data.companyName}" class="marRig5" value="${data.deliveryAddressId}" ${isFirst ? 'checked' : ''} onchange="saleOrderFunctionality.onSelectCustomerDeliveryAddressId(${data.deliveryAddressId})"><b rel="cms_322">Company Name</b>: ${data.companyName} | <b rel="cms_323">Contact person</b>: ${data.contactPerson} | <b rel="cms_324">Phone</b>: ${data.phone} | <b>Email</b>: <a href="mailto: ${data.email}" class="blueText">${data.email}</a> | <b rel="cms_325">Address</b>: ${data.address} | <b rel="cms_326">Town</b>: ${data.town} | <b>Postcode</b>: ${data.postCode} | <b rel="cms_327">Country</b>: <span>${appCommonFunctionality.getCountryName(data.country, true)}</span></td></tr>`;
                    isFirst = false;
                });
            }
        } else {
            str += '<tr class="f12"><td colspan="2">No Data</td></tr>';
        }
        str += '</tbody></table>';
        $("#customerDeliveryAddressTableHolder").html(str);
        $("#saleOrderControlButtonHolder").removeClass('hide');
    };

    parent.onSelectCustomerDeliveryAddressId = function (deliveryAddressId) {
        $("#selectedCustomerDeliveryAddressId").val(deliveryAddressId);
    };

    parent.mapCoCOrder = function () {
        isCoCOrder = true;
        SEARCHCUSTOMERCRITERIA.keyword = COMPANYTYPECoC;
        $("#customerSearch").val('');
        $('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
        appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
    };

    const getCompanyType = function (companyTypeId) {
        const companyTypeSerializedData = JSON.parse($("#companyTypeSerializedData").val() || "[]");
        const companyType = companyTypeSerializedData.find(item => parseInt(item.companyTypeId) === parseInt(companyTypeId));
        return companyType ? companyType.companyType : '';
    };

    parent.scannerGun = function () {
        $("#scannerGunData").val('').focus();
    };

    const captureProductCombinationFromBarQrCode = function (scannerGunDataValue) {
        let productFound = false;
        if (PRODUCTSTOCKSYSREF.length > 0 && scannerGunDataValue !== '') {
            PRODUCTSTOCKSYSREF.some(product => {
                if (product.systemReference.toLowerCase() === scannerGunDataValue.toLowerCase()) {
                    ORDEROBJ.push(product);
                    productFound = true;
                    saleOrderFunctionality.scannerGun();
                    return true;
                }
                return false;
            });

            if (!productFound) {
                $("#productScannerErr").html(appCommonFunctionality.getCmsString(328));
                $('#scanningErrorAudio')[0].play().catch(error => {
                    console.error('Error playing audio:', error);
                });
				setTimeout(function() {
					$('#productScannerErr').html('');
				}, 3000);
                saleOrderFunctionality.scannerGun();
            }
            saleOrderFunctionality.populateCart();
        }
    };
	
    parent.populateCart = function () {
        const displayOrderArr = [];
        const orderMap = new Map();

        ORDEROBJ.forEach(order => {
            const productId = parseInt(order.productId);
            const productCombinationId = parseInt(order.productCombinationId);
            const key = `${productId}-${productCombinationId}`;

            if (orderMap.has(key)) {
                orderMap.get(key).qty += 1;
            } else {
                orderMap.set(key, { ...order, qty: 1 });
            }
        });

        displayOrderArr.push(...orderMap.values());

        let totalPrice = 0;
        let totalBeforeTax = 0;
        let str = `<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white minW720"><tbody><tr><td width="80%"><b>${appCommonFunctionality.getCmsString(329)}</b></td><td width="10%"><b>Qty</b></td><td width="10%"><b>${appCommonFunctionality.getCmsString(330)}</b></td></tr>`;

        if (displayOrderArr.length > 0) {
            displayOrderArr.forEach(item => {
                const selectedCustomerGrade = $("#selectedCustomerGrade").val().toLowerCase();
                const effectivePrice = selectedCustomerGrade === 'r' ? item.RPrice : selectedCustomerGrade === 'w' ? item.WPrice : 0;

                str += `<tr><td><div class="pull-left f12 marleft5"><span>${item.productTitle} [${item.productCode}] ${appCommonFunctionality.getDefaultCurrency()}${effectivePrice}</span><br><span>[${item.productCombinationId}] - ${getQRTextHtml(item.productCombinationQR, item.productCode)}</span></div></td><td>x ${item.qty}</td><td>${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</td></tr>`;
                totalBeforeTax += effectivePrice * item.qty;
            });
        } else {
            str += '<tr><td colspan="3">No Data</td></tr>';
        }

        str += '</tbody></table>';
        $("#cartTableHolder").html(str);
		if (displayOrderArr.length > 0) {
			$("#totalCalcSection").removeClass('hide');
			$("#totalBeforeTax").html(appCommonFunctionality.getDefaultCurrency() + totalBeforeTax.toFixed(2));
			$("#taxP").html(DEFAULTTAX);
			totalPrice = totalBeforeTax + ((totalBeforeTax * DEFAULTTAX) / 100);
			$("#totalPrice").html(appCommonFunctionality.getDefaultCurrency() + totalPrice.toFixed(2));
		}
    };

    const getQRTextHtml = function (QRText, productCode) {
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
	
	parent.openQrScannerCamera = function() {
		const top = 50;
		const left = 16;
		const width = ($(window).width() - (left * 2)) * 0.9;
		const height = 348;

		const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`;
		let qrCodeScannerCameraPopupWindow = window.open(qrScannerCameraUrl, "qrCodeScannerCameraPopupWindow", features);

		let qrCodeScannerCameraPopupCheckInterval = setInterval(() => {
			if (qrCodeScannerCameraPopupWindow.closed) {
				clearInterval(qrCodeScannerCameraPopupCheckInterval);

				let scannerQRCodes = JSON.parse(localStorage.getItem("scannerQRCodes")) || [];
				//alert(JSON.stringify(scannerQRCodes)); //alert whole array of scanned codes
				if (scannerQRCodes.length > 0) {
					scannerQRCodes.forEach(code => {
						let scannerQRCode = code.replace(BARQRREGEX, '');
						//alert(scannerQRCode); //alert individual scanned code
						captureProductCombinationFromBarQrCode(scannerQRCode);
					});
					localStorage.removeItem("scannerQRCodes");
				}
			}
		}, 500);
	};
	
	parent.brandPedectiveSearch = function(searchedText){
		$('#searchBrandIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
		if(BRANDS.length > 0 && searchedText.length > 2){
			var searchedBrandObjArray = [];
			for(var i = 0; i < BRANDS.length; i++){
				if((BRANDS[i].brandName.toLowerCase()).indexOf(searchedText.toLowerCase()) !== -1){
					searchedBrandObjArray.push(BRANDS[i]);
				}
			}
			var str = '';
			for(var i = 0; i < searchedBrandObjArray.length; i++){
				str = str + '<div class="searchedItem hover" onclick="saleOrderFunctionality.onBrandSelection(' + searchedBrandObjArray[i].brandId + ')">';
					//str = str + '<span><img src="' + PROJECTPATH + 'uploads/brand/' + searchedBrandObjArray[i].brandImage + '" class="field5Circle" alt="' + searchedBrandObjArray[i].brandName + '"></span>'; //Open on demand
					str = str + '<span class="padLeft4">' + searchedBrandObjArray[i].brandName + '</span>';
				str = str + '</div>';
			}
			$('#searchedBrands').html(str).removeClass('hide');
			$('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
		}else{
			$('#searchedBrands').html('').addClass('hide');
			$('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
		}
	};
	
	parent.onBrandSelection = function(brandId){
		$('#brandId').val(brandId);
		$('#searchedBrands').html('').addClass('hide');
		$('#searchBrand').val('');
		saleOrderFunctionality.populateSelectedBrand(brandId);
	};
	
	parent.populateSelectedBrand = function(brandId){
		var str = '';
		if(brandId > 0){
			for(var i = 0; i < BRANDS.length; i++){
				if(parseInt(BRANDS[i].brandId) === parseInt(brandId)){
					str = '<div id="cms_45">Selected Brand : </div>';
					str = str + '<div class="selectedBrandItem">';
						str = str + '<div>';
							//str = str + '<span><img src="' + PROJECTPATH + 'uploads/brand/' + BRANDS[i].brandImage + '" alt="' + BRANDS[i].brandName + '" class="productImage"></span>'; //Open on demand
							str = str + '<span class="marleft5"><b>' + BRANDS[i].brandName + '</b></span>';
						str = str + '</div>';
						str = str + '<div>';
							str = str + '<span class="pull-right fa fa-remove redText hover" onclick="saleOrderFunctionality.removeBrandSelection();"></span>';
						str = str + '</div>';
					str = str + '</div>';
				}
			}
			$('#selectedBrandItem').html(str);
		}
	};
	
	parent.removeBrandSelection = function(){
		$('#brandId').val(0);
		$('#selectedBrandItem').html('');
		$('#searchBrand').focus();
	};
	
	parent.categoryPedectiveSearch = function(searchedText){
		$('#searchCatIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
		if(CATEGORIES.length > 0 && searchedText.length > 2){
			var searchedCatObjArray = [];
			for(var i = 0; i < CATEGORIES.length; i++){
				if((CATEGORIES[i].category.toLowerCase()).indexOf(searchedText.toLowerCase()) !== -1){
					searchedCatObjArray.push(CATEGORIES[i]);
				}
			}
			var str = '';
			for(var i = 0; i < searchedCatObjArray.length; i++){
				str = str + '<div class="searchedItem hover" onclick="saleOrderFunctionality.onCatSelection(' + parseInt(searchedCatObjArray[i].categoryId) + ', this)">';
					str = str + '<span class="padLeft4">' + searchedCatObjArray[i].category + '</span>';
				str = str + '</div>';
			}
			$('#searchedCats').html(str).removeClass('hide');
			$('#searchCatIconSpan').html('<span class="fa fa-close redText hover" onClick="saleOrderFunctionality.resetSearchCatField();"></span><span class="fa fa-search marleft5 hover"></span>');
		}else{
			if(searchedText.length === 0){
				$('#searchedCats').html('').addClass('hide');
				$('#searchCat').val('');
				$('#searchCatIconSpan').html('<span class="fa fa-search hover"></span>');
			}
		}
	};
	
	parent.resetSearchCatField = function(){
		$("#searchCat").val('');
		$('#searchedCats').html('').addClass('hide');
	};
	
	parent.onCatSelection = function(catId, selfObj){
		var str = '';
		if(catId > 0){
			if(!SELECTEDCATEGORYIDARR.includes(parseInt(catId))){
				SELECTEDCATEGORYIDARR.push(parseInt(catId));
				$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
			}
			if(selfObj !== null){
				$(selfObj).hide();
			}
			saleOrderFunctionality.populateSelectedCategories();
		}
	};
	
	parent.populateSelectedCategories = function(){
		var str = '';
		for(var i = 0; i < CATEGORIES.length; i++){
			if(SELECTEDCATEGORYIDARR.includes(parseInt(CATEGORIES[i].categoryId))){
				str = str + '<div class="selectedCatItem">';
					str = str + '<span class="fa fa-tags darkGreyText"></span>';
					str = str + '<span class="marleft5">' + CATEGORIES[i].category + '</span>';
					str = str + '<span class="fa fa-remove redText hover marleft5" onclick="saleOrderFunctionality.removeCatSelection(' + parseInt(CATEGORIES[i].categoryId) + ');"></span>';
				str = str + '</div>';
			}
		}
		$('#selectedCatItem').html(str);
	};
	
	parent.removeCatSelection = function(categoryId){
		var index = SELECTEDCATEGORYIDARR.indexOf(categoryId);
		if (index > -1) {
			SELECTEDCATEGORYIDARR.splice(index, 1);
			$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
		}
		saleOrderFunctionality.populateSelectedCategories();
	};
	
	parent.initSaleOrderDetail = function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
    };

    return parent;
}(window, window.$));