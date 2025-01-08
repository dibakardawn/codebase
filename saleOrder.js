const MENUSELECTIONITEM = "saleOrders.php";
const inputDelay = 500;
const BARQRREGEX = new RegExp(`^${SITETITLE}_?`);
const SEARCHCUSTOMERCRITERIA = { keyword: "", companyTypeId: "", customerGrade: "", status: 1 };
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
const SEARCHSALEORDERCRITERIA = { keyword: "", status: 1 };
const PAGEDOCNAME = window.location.pathname.split('/').pop();

$(document).ready(() => {
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });

    const pageFunctions = {
        "saleOrders.php": saleOrderFunctionality.initSaleOrder,
        "saleOrderEntry.php": saleOrderFunctionality.initSaleOrdersEntry,
        "saleOrderDetail.php": saleOrderFunctionality.initSaleOrderDetail
    };
    
    if (pageFunctions[PAGEDOCNAME]) {
        pageFunctions[PAGEDOCNAME]();
    }

    appCommonFunctionality.cmsImplementationThroughID();
    appCommonFunctionality.cmsImplementationThroughRel();
});

const saleOrderFunctionality = (function (window, $) {
    const parent = {};

    parent.initSaleOrder = () => appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');

    parent.addSaleOrder = () => window.location = `saleOrderEntry.php`;

    parent.initSaleOrdersEntry = () => {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
        setupCustomerSearch();
        setupProductStock();
        setupScannerGun();
        if (!appCommonFunctionality.isMobile()) {
            $('#addProductQRScannerCam').prop('disabled', true);
        }
        BRANDS = JSON.parse($('#productBrandSerializedData').val());
        CATEGORIES = JSON.parse($('#productCatSerializedData').val());
    };

    const setupCustomerSearch = () => {
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
    };

    const setupProductStock = () => {
        if ($("#productStockPreCompileData").val() !== "") {
            PRODUCTSTOCKSYSREF = JSON.parse($("#productStockPreCompileData").val());
        }
    };

    const setupScannerGun = () => {
        let debounceTimer;
        $('#scannerGunData').on('input', function () {
            clearTimeout(debounceTimer);
            const scannerGunDataValue = $(this).val().replace(BARQRREGEX, '');
            debounceTimer = setTimeout(() => {
                captureProductCombinationFromBarQrCode(scannerGunDataValue);
            }, inputDelay);
        });
    };

    const populateCustomerSuggestionBox = (data) => {
        const customerData = JSON.parse(data);
        const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        let str = '';

        if (customerData.length > 0) {
            customerData.forEach(({customerId, customerGrade, companyName, companyType, buyerName, contactPerson, phone, email}) => {
                str += `<div id="customerResultItem_${customerId}" class="${customerResultItemClass} hover" onclick="saleOrderFunctionality.onSelectingCustomer(${customerId}, '${customerGrade}')">
                    <div class="f16">${companyName} (${getCompanyType(companyType)}) [${customerGrade}]</div>
                    <div class="f12">
                        <strong>${appCommonFunctionality.getCmsString(314)}: </strong><span class="blueText">${buyerName}</span><br>
                        <strong>${appCommonFunctionality.getCmsString(315)}: </strong><span class="blueText">${contactPerson}</span>
                    </div>`;
                if (!appCommonFunctionality.isMobile()) {
                    str += `<div class="f12">
                                <i class="fa fa-phone blueText"></i> ${phone}<br>
                                <i class="fa fa-envelope greenText"></i> <span class="blueText">${email}</span>
                            </div>`;
                }
                str += `</div>`;
            });
        } else {
            str += '<div class="customerResultItem">No Data</div>';
        }

        $("#customerSearchResult").html(str);
        $("#customerGroupAddonIcon").removeClass('fa-spinner fa-spin').addClass('fa-search');
        $("#selectedCustomerTitle, #saleOrderControlButtonHolder, #totalCalcSection").addClass('hide');
        $("#selectedCustomerSection, #customerDeliveryAddressTableHolder").html('');
        if (isCoCOrder) {
            $('div[id^="customerResultItem_"]').trigger('click');
        }
    };

    parent.onSelectingCustomer = (customerId, customerGrade) => {
        $("#selectedCustomerId").val(customerId);
        $("#selectedCustomerGrade").val(customerGrade);
        const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
        $("#selectedCustomerSection").html($(`#customerResultItem_${customerId}`).html()).addClass(customerResultItemClass);
        $("#selectedCustomerTitle").removeClass('hide');
        $('#customerSearchResult').html('');
        appCommonFunctionality.ajaxCall(`GETDELIVERYADDRESSES&customerId=${customerId}`, bindCustomerDeliveryAddressTable);
    };

    const bindCustomerDeliveryAddressTable = (data) => {
        const customerDeliveryAddressData = JSON.parse(data);
        let str = `<table id="customerDeliveryAddressTable" class="w3-table w3-striped w3-bordered w3-hoverable w3-white">
                    <tbody><tr><td width="100%"><strong>${appCommonFunctionality.getCmsString(316)}</strong></td></tr>`;

        if (customerDeliveryAddressData.length > 0) {
            customerDeliveryAddressData.forEach(({ deliveryAddressId, companyName }) => {
                str += `<tr class="f12">
                            <td width="100%">
                                <input type="radio" id="deliveryAddress_${deliveryAddressId}" name="deliveryAddress_${companyName}" class="marRig5" value="${deliveryAddressId}" onclick="saleOrderFunctionality.onSelectCustomerDeliveryAddressId(${deliveryAddressId})">
                                ${companyName}
                            </td>
                        </tr>`;
            });
        } else {
            str += '<tr class="f12"><td colspan="2">No Data</td></tr>';
        }
        str += '</tbody></table>';
        $("#customerDeliveryAddressTableHolder").html(str);
        $("#saleOrderControlButtonHolder").removeClass('hide');
    };

    parent.onSelectCustomerDeliveryAddressId = (deliveryAddressId) => {
        $("#selectedCustomerDeliveryAddressId").val(deliveryAddressId);
    };

    parent.mapCoCOrder = () => {
        isCoCOrder = true;
        SEARCHCUSTOMERCRITERIA.keyword = COMPANYTYPECoC;
        $("#customerSearch").val('');
        $('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
        appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
    };

    const getCompanyType = (companyTypeId) => {
        const companyTypeSerializedData = JSON.parse($("#companyTypeSerializedData").val() || "[]");
        const companyType = companyTypeSerializedData.find(item => parseInt(item.companyTypeId) === parseInt(companyTypeId));
        return companyType ? companyType.companyType : '';
    };

    parent.scannerGun = () => $("#scannerGunData").val('').focus();

    const captureProductCombinationFromBarQrCode = (scannerGunDataValue) => {
        if (PRODUCTSTOCKSYSREF.length > 0 && scannerGunDataValue !== '') {
            const product = PRODUCTSTOCKSYSREF.find(product => product.systemReference.toLowerCase() === scannerGunDataValue.toLowerCase());
            if (product) {
                ORDEROBJ.push(product);
                saleOrderFunctionality.scannerGun();
            } else {
                $("#productScannerErr").html(appCommonFunctionality.getCmsString(328));
                $('#scanningErrorAudio')[0].play().catch(console.error);
                setTimeout(() => $('#productScannerErr').html(''), 3000);
                saleOrderFunctionality.scannerGun();
            }
            saleOrderFunctionality.populateCart();
        }
    };

    parent.populateCart = () => {
        const orderMap = new Map();

        ORDEROBJ.forEach(order => {
            const key = `${order.productId}-${order.productCombinationId}`;

            if (orderMap.has(key)) {
                orderMap.get(key).qty += 1;
            } else {
                orderMap.set(key, { ...order, qty: 1 });
            }
        });

        const displayOrderArr = Array.from(orderMap.values());
        let totalBeforeTax = displayOrderArr.reduce((acc, { productTitle, productCode, qty, RPrice, WPrice }) => {
            const selectedCustomerGrade = $("#selectedCustomerGrade").val().toLowerCase();
            const effectivePrice = selectedCustomerGrade === 'r' ? RPrice : selectedCustomerGrade === 'w' ? WPrice : 0;

            return acc + (effectivePrice * qty);
        }, 0);

        let totalPrice = totalBeforeTax + ((totalBeforeTax * DEFAULTTAX) / 100);

        let str = `<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white minW720">
                    <tbody><tr><td width="80%"><b>${appCommonFunctionality.getCmsString(329)}</b></td><td width="10%"><b>Qty</b></td><td width="10%"><b>Price</b></td></tr>`;

        if (displayOrderArr.length > 0) {
            displayOrderArr.forEach(({ productTitle, productCode, qty, RPrice, WPrice }) => {
                const selectedCustomerGrade = $("#selectedCustomerGrade").val().toLowerCase();
                const effectivePrice = selectedCustomerGrade === 'r' ? RPrice : selectedCustomerGrade === 'w' ? WPrice : 0;

                str += `<tr>
                            <td><div class="pull-left f12 marleft5"><span>${productTitle} [${productCode}] ${appCommonFunctionality.getDefaultCurrency()}${effectivePrice}</span><br><span>[${getQRTextHtml(productCode)}]</span></div></td>
                            <td>${qty}</td>
                            <td>${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * qty).toFixed(2)}</td>
                        </tr>`;
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
            $("#totalPrice").html(appCommonFunctionality.getDefaultCurrency() + totalPrice.toFixed(2));
        }
    };

    const getQRTextHtml = (QRText, productCode) => {
        const QRTextArr1 = QRText.split('_');
        let QRText = QRTextArr1[0].replace((productCode + '-'), '');
        const QRTextArr2 = QRText.split('X');
        return QRTextArr2.reduce((str, featureVal) => {
            if (featureVal !== '') {
                const [feature, value] = featureVal.split(':');
                str += feature.toLowerCase() === 'color'
                    ? `${feature} : <i class="fa fa-square marRig5 marleft5" style="color:#${value}"></i>`
                    : `${feature}: ${value}`;
                str += (i < (QRTextArr2.length - 1)) && (QRTextArr2[i + 1] !== '') ? '<i class="fa fa fa-remove blueText marRig5 marleft5"></i>' : '';
            }
            return str;
        }, '');
    };

    parent.openQrScannerCamera = () => {
        const top = 50;
        const left = 16;
        const width = ($(window).width() - (left * 2)) * 0.9;
        const height = 348;

        const features = `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`;
        qrCodeScannerCameraPopupWindow = window.open(qrScannerCameraUrl, "qrCodeScannerCameraPopupWindow", features);

        qrCodeScannerCameraPopupCheckInterval = setInterval(() => {
            if (qrCodeScannerCameraPopupWindow.closed) {
                clearInterval(qrCodeScannerCameraPopupCheckInterval);
                scannerQRCodes = JSON.parse(localStorage.getItem("scannerQRCodes")) || [];
                if (scannerQRCodes.length > 0) {
                    scannerQRCodes.forEach(code => {
                        let scannerQRCode = code.replace(BARQRREGEX, '');
                        captureProductCombinationFromBarQrCode(scannerQRCode);
                    });
                    localStorage.removeItem("scannerQRCodes");
                }
            }
        }, 500);
    };

    parent.brandPedectiveSearch = (searchedText) => {
        $('#searchBrandIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
        if (BRANDS.length > 0 && searchedText.length > 2) {
            const searchedBrandObjArray = BRANDS.filter(({ brandName }) => brandName.toLowerCase().includes(searchedText.toLowerCase()));
            const str = searchedBrandObjArray.reduce((html, { brandId, brandName }) => {
                return html + `<div class="searchedItem hover" onclick="saleOrderFunctionality.onBrandSelection(${brandId})"><span class="padLeft4">${brandName}</span></div>`;
            }, '');
            $('#searchedBrands').html(str).removeClass('hide');
            $('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
        } else {
            $('#searchedBrands').html('').addClass('hide');
            $('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
        }
    };

    parent.onBrandSelection = (brandId) => {
        $('#brandId').val(brandId);
        $('#searchedBrands').html('').addClass('hide');
        $('#searchBrand').val('');
        saleOrderFunctionality.populateSelectedBrand(brandId);
    };

    parent.populateSelectedBrand = (brandId) => {
        if (brandId > 0) {
            const brand = BRANDS.find(({ brandId: id }) => parseInt(id) === parseInt(brandId));
            if (brand) {
                const str = `<div id="cms_45">Selected Brand : </div>
                             <div class="selectedBrandItem">
                                <div><span class="marleft5"><b>${brand.brandName}</b></span></div>
                                <div><span class="pull-right fa fa-remove redText hover" onclick="saleOrderFunctionality.removeBrandSelection();"></span></div>
                             </div>`;
                $('#selectedBrandItem').html(str);
            }
        }
    };

    parent.removeBrandSelection = () => {
        $('#brandId').val(0);
        $('#selectedBrandItem').html('');
        $('#searchBrand').focus();
    };

    parent.categoryPedectiveSearch = (searchedText) => {
        $('#searchCatIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
        if (CATEGORIES.length > 0 && searchedText.length > 2) {
            const searchedCatObjArray = CATEGORIES.filter(({ category }) => category.toLowerCase().includes(searchedText.toLowerCase()));
            const str = searchedCatObjArray.reduce((html, { categoryId, category }) => {
                return html + `<div class="searchedItem hover" onclick="saleOrderFunctionality.onCatSelection(${parseInt(categoryId)}, this)"><span class="padLeft4">${category}</span></div>`;
            }, '');
            $('#searchedCats').html(str).removeClass('hide');
            $('#searchCatIconSpan').html('<span class="fa fa-close redText hover" onClick="saleOrderFunctionality.resetSearchCatField();"></span><span class="fa fa-search marleft5 hover"></span>');
        } else {
            if (searchedText.length === 0) {
                $('#searchedCats').html('').addClass('hide');
                $('#searchCat').val('');
                $('#searchCatIconSpan').html('<span class="fa fa-search hover"></span>');
            }
        }
    };

    parent.resetSearchCatField = () => {
        $("#searchCat").val('');
        $('#searchedCats').html('').addClass('hide');
    };

    parent.onCatSelection = (catId, selfObj) => {
        if (catId > 0 && !SELECTEDCATEGORYIDARR.includes(parseInt(catId))) {
            SELECTEDCATEGORYIDARR.push(parseInt(catId));
            $("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
            if (selfObj !== null) {
                $(selfObj).hide();
            }
            saleOrderFunctionality.populateSelectedCategories();
        }
    };

    parent.populateSelectedCategories = function() {
		const selectedCategoriesHTML = CATEGORIES.filter(category => 
			SELECTEDCATEGORYIDARR.includes(parseInt(category.categoryId))
		).map(category => `
			<div class="selectedCatItem">
				<span class="fa fa-tags darkGreyText"></span>
				<span class="marleft5">${category.category}</span>
				<span class="fa fa-remove redText hover marleft5" onclick="saleOrderFunctionality.removeCatSelection(${parseInt(category.categoryId)});"></span>
			</div>
		`).join('');

		$('#selectedCatItem').html(selectedCategoriesHTML);
	};

	parent.removeCatSelection = function(categoryId) {
		SELECTEDCATEGORYIDARR = SELECTEDCATEGORYIDARR.filter(id => id !== categoryId);
		$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
		saleOrderFunctionality.populateSelectedCategories();
	};

	parent.initSaleOrderDetail = function() {
		appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
	};
	
	return parent;
}(window, window.$));