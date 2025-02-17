const MENUSELECTIONITEM = "saleOrders.php";
/*-----------------Pre-Compiled Variables---------------------------------*/
let COMPANYTYPEPRECOMPILEDDATA = [];
let ORDERSALESTATUSPRECOMPILEDDATA = [];
let COUNTRYPRECOMPILEDDATA = [];
let PRODUCTLIVESTOCKPRECOMPILEDDATA = [];
let PRODUCTPRECOMPILEDDATA = [];
let BRANDPRECOMPILEDDATA = [];
let CATEGORYPRECOMPILEDDATA = [];
/*-----------------Pre-Compiled Variables---------------------------------*/

/*-----------------Commonly Used Variables--------------------------------*/
let ORDEROBJ = [];
let NEWORDEROBJ = []; //for Order Splitting
let ORDER = {};
/*-----------------Commonly Used Variables--------------------------------*/

/*-----------------Search & Selected Variables----------------------------*/
let SEARCHCUSTOMERCRITERIA = {
    keyword: "",
    companyTypeId: "",
    customerGrade: "",
    status: 1
};
let SELECTEDCATEGORYIDARR = [];
let SEARCHSALEORDERCRITERIA = {
    keyword: "",
    status: 1
};
let productQtyObj = {
	value : 0,
	productCombinationId : 0
};
/*-----------------Search & Selected Variables----------------------------*/

/*-----------------QR Code Scanner Camera Popup Variables-----------------*/
let qrCodeScannerCameraPopupWindow;
let qrCodeScannerCameraPopupCheckInterval;
const qrScannerCameraUrl = 'qrCodeScannerCamera.html';
let scannerQRCodes = [];
/*-----------------QR Code Scanner Camera Popup Variables-----------------*/

const inputDelay = 500;
let ORDERGUID = '';
const BARQRREGEX = new RegExp(`^${SITETITLE}_?`);
let isCoCOrder = false;
const WEIGHTSIGN = 'Weight:';
const PAGEDOCNAME = appCommonFunctionality.getPageName();

$(document).ready(function () {
	
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function () {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
	switch (PAGEDOCNAME) {
        case "saleOrders.php":{
			saleOrderFunctionality.initSaleOrder();
            break;
		}
		
        case "saleOrderEntry.php":{
            saleOrderFunctionality.initSaleOrdersEntry();
            break;
		}
		
        case "saleOrderDetails.php":{
            saleOrderFunctionality.initSaleOrderDetail(true);
            break;
		}
		
		case "saleOrderSplit.php":{
            saleOrderFunctionality.initSaleOrdersSplit();
            break;
		}
    }
});

const saleOrderFunctionality = (function (window, $) {
    const parent = {};

    parent.initSaleOrder = async function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		appCommonFunctionality.ajaxCall("ORDERS", receiveOrdersResponse);
    };
	
	const receiveOrdersResponse = function (responseData) {
		ORDEROBJ = JSON.parse(responseData)?.msg || [];
		populateOrderTable(ORDEROBJ);
	};
	
	const populateOrderTable = function (parsedData) {
		if (!parsedData.length) {
			$('#saleOrderTableHolder').html('<p>No Data.</p>');
			return;
		}
		const getSortIcon = (field, cmsId) => `
			<i class="fa fa-sort-amount-asc hover marRig5" onclick="saleOrderFunctionality.sortOrderTable('ASC', '${field}')"></i>
			<strong id="cms_${cmsId}">${appCommonFunctionality.getCmsString(cmsId)}</strong>
			<i class="fa fa-sort-amount-desc hover marleft5" onclick="saleOrderFunctionality.sortOrderTable('DESC', '${field}')"></i>
		`;
		const getActionIcons = (orderId, orderStatus) => {
			let editOrderButton = '';
			let splitOrderButton = '';
			if (orderStatus <= 0) { //if greater than PLACED
				editOrderButton = `<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="saleOrderFunctionality.editOrder(${orderId})"></i>`;
			}
			if (orderStatus <= 1) { //if greater than APPROVED
				splitOrderButton = `<i class="fa fa-code-fork marleft5 blueText hover" onclick="saleOrderFunctionality.gotoSplitOrder(${orderId})"></i>`;
			}
			return `
				<div class="spaceBetweenSection">
					${editOrderButton}
					${splitOrderButton}
					<!--<i class="fa fa-trash-o marleft5 redText hover" onclick="saleOrderFunctionality.deleteOrder(${orderId})"></i>-->
					<i class="fa fa-tv marleft5 blueText hover" onclick="saleOrderFunctionality.gotoOrderDetails(${orderId})"></i>
				</div>
			`;
		};
		const rows = parsedData.map(order => `
			<tr>
				<td>
					<a href="saleOrderDetails.php?orderId=${order.orderId}" class="blueText">${order.orderCode}</a><br>
					<span class="f12">${appCommonFunctionality.getDefaultCurrency()} ${Number(order.totalPrice).toFixed(2)} </span>
				</td>
				<td>${order.companyName} [ ${order.customerGrade} ] - ${order.buyerName}</td>
				<td>${getOrderStatus(order.status)}</td>
				<td>${order.orderDate}</td>
				<td>${order.deliveryDate}</td>
				<td>${getActionIcons(order.orderId, order.status)}</td>
			</tr>
		`).join('');
		const table = `
			<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW1180">
				<tbody>
					<tr>
						<td width="10%">${getSortIcon('totalPrice', 364)}</td>
						<td width="40%"><strong id="cms_365">${appCommonFunctionality.getCmsString(365)}</strong></td>
						<td width="10%"><strong id="cms_366">${appCommonFunctionality.getCmsString(366)}</strong></td>
						<td width="15%">${getSortIcon('orderDate', 360)}</td>
						<td width="15%">${getSortIcon('deliveryDate', 353)}</td>
						<td width="10%"><strong id="cms_367">${appCommonFunctionality.getCmsString(367)}</strong></td>
					</tr>
					${rows}
				</tbody>
			</table>
		`;
		$('#saleOrderTableHolder').html(table);
	};

	const getOrderStatus = function (orderStatusId) {
		if (typeof ORDERSALESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERSALESTATUSPRECOMPILEDDATA !== null && 
			ORDERSALESTATUSPRECOMPILEDDATA.length > 0) {
			
			const status = ORDERSALESTATUSPRECOMPILEDDATA.find(item => item.orderStatusId === orderStatusId);
			return status ? status.orderStatus : "";
		}
		return "";
	};
	
	const getOrderStatusId = function (orderStatus) {
		if (typeof ORDERSALESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERSALESTATUSPRECOMPILEDDATA !== null && 
			ORDERSALESTATUSPRECOMPILEDDATA.length > 0) {
				const status = ORDERSALESTATUSPRECOMPILEDDATA.find(item => item.orderStatus === orderStatus);
				return status ? status.orderStatusId : 0;
		}
		return 0;
    };
	
	parent.sortOrderTable = function (order, field) {
        const orderData = ORDEROBJ;
        orderData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            if (!isNaN(valueA) && !isNaN(valueB)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }
            if (order === "ASC") return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            if (order === "DESC") return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        });
        populateOrderTable(orderData);
    };

    parent.addSaleOrder = () => {
        window.location = `saleOrderEntry.php`;
    };
	
	parent.editOrder = (orderId) => {
		if(PAGEDOCNAME === 'saleOrderDetails.php'){
			orderId = appCommonFunctionality.getUrlParameter('orderId');
		}
        window.location = `saleOrderEntry.php?orderId=` + orderId;
    };
	
	parent.gotoSplitOrder = (orderId) => {
		if(PAGEDOCNAME === 'saleOrderDetails.php'){
			orderId = appCommonFunctionality.getUrlParameter('orderId');
		}
        window.location = `saleOrderSplit.php?orderId=` + orderId;
    };
	
	parent.deleteOrder = (orderId) => {
		if(PAGEDOCNAME === 'saleOrderDetails.php'){
			orderId = appCommonFunctionality.getUrlParameter('orderId');
			appCommonFunctionality.ajaxCall("DELETEORDER&orderId=" + orderId, saleOrderFunctionality.gotoOrders);
		}
        appCommonFunctionality.ajaxCall("DELETEORDER&orderId=" + orderId, saleOrderFunctionality.initSaleOrder);
    };
	
	parent.gotoOrderDetails = (orderId) => {
        window.location = `saleOrderDetails.php?orderId=` + orderId;
    };

    parent.initSaleOrdersEntry = async function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		COMPANYTYPEPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COMPANYTYPE'));
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCTLIVESTOCK'));
		PRODUCTPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCT'));
		BRANDPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('BRAND'));
		CATEGORYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('CATEGORY'));
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (orderId) {
			$('#orderId').val(orderId);
			appCommonFunctionality.ajaxCall('ORDERDETAILS&orderId=' + orderId, receiveOrderDeatilsData);
		}
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
		}else{
			$('#searchCatSection').removeClass('noRightPaddingOnly').addClass('nopaddingOnly'); //for productSearchModal
		}
		
		/*----------------------#productKeyword on enter product serach-----------------------------*/
		$('#productKeyword').keypress(function(event) {
			// Check if the Enter key (key code 13) is pressed
			if (event.which === 13) {
				// Prevent the default action (form submission, etc.)
				event.preventDefault();
				// Trigger the product search function
				saleOrderFunctionality.productSearch();
			}
		});
		/*----------------------#productKeyword on enter product serach-----------------------------*/
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
                    str += `<div class="f16">${customer.companyName} [${customerGrade}]</div>`;
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
        $("#selectedCustomerTitle, #saleOrderControlButtonHolder").addClass('hide');
		//$('#placeOrderBtn').attr('disabled', true);
        $("#selectedCustomerSection, #customerDeliveryAddressTableHolder").html('');
        if (isCoCOrder) {
            $('div[id^="customerResultItem_"]').trigger('click');
			saleOrderFunctionality.populateCart();
			saleOrderFunctionality.populateNewOrderCart();
        }
		
		/*-------------------------Removing Cart area-------------------------*/ 
		/*xxxx remove after some day
		ORDEROBJ = [];
		$("#cartTableHolder").html('');
		$("#totalCalcSection").addClass('hide');
		$("#totalBeforeTax").html('');
		$("#taxP").html('');
		$("#totalPrice").html('');
		$('#placeOrderBtn').attr('disabled', true);*/
		/*-------------------------Removing Cart area-------------------------*/
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
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		let deliveryAddressId = $('#selectedCustomerDeliveryAddressId').val();
		if (customerDeliveryAddressData.length > 0) {
			if (customerDeliveryAddressData[0].companyName.toLowerCase() === COMPANYTYPECoC.toLowerCase()) {
				const data = customerDeliveryAddressData[0];
				str += `<tr class="f12"><td width="100%">${data.companyName}</td></tr>`;
				$("#selectedCustomerDeliveryAddressId").val(data.deliveryAddressId);
			} else {
				let isFirst = true; // Track the first item
				customerDeliveryAddressData.forEach((data, index) => {
					// Check if the orderId exists
					if (orderId) {
						// If the deliveryAddressId is already set and matches the current ID, mark it as selected
						if (parseInt(deliveryAddressId) > 0 && parseInt(deliveryAddressId) === parseInt(data.deliveryAddressId)) {
							isFirst = false; // Override the first-item logic
						}
					} else {
						// If no orderId, set the first item as selected
						if (isFirst) {
							$('#selectedCustomerDeliveryAddressId').val(data.deliveryAddressId);
						}
					}

					// Create the table row
					str += `<tr class="f12"><td width="100%">
						<input type="radio" id="deliveryAddress_${data.deliveryAddressId}" name="deliveryAddress_${data.companyName}" 
							class="marRig5" value="${data.deliveryAddressId}" 
							${parseInt(deliveryAddressId) === parseInt(data.deliveryAddressId) ? 'checked' : isFirst ? 'checked' : ''} 
							onchange="saleOrderFunctionality.onSelectCustomerDeliveryAddressId(${data.deliveryAddressId})">
						<b rel="cms_322">${appCommonFunctionality.getCmsString(322)}</b>: ${data.companyName} | 
						<b rel="cms_323">${appCommonFunctionality.getCmsString(323)}</b>: ${data.contactPerson} | 
						<b rel="cms_324">Phone</b>: ${data.phone} | 
						<b>Email</b>: <a href="mailto: ${data.email}" class="blueText">${data.email}</a> | 
						<b rel="cms_325">${appCommonFunctionality.getCmsString(325)}</b>: ${data.address} | 
						<b rel="cms_326">${appCommonFunctionality.getCmsString(326)}</b>: ${data.town} | 
						<b>Postcode</b>: ${data.postCode} | 
						<b rel="cms_327">${appCommonFunctionality.getCmsString(327)}</b>: <span>${appCommonFunctionality.getCountryName(data.country, true)}</span>
					</td></tr>`;
					isFirst = false; // Ensure only the first row initially sets this value
				});
			}
		} else {
			str += '<tr class="f12"><td colspan="2">No Data</td></tr>';
		}
		str += '</tbody></table>';
		$("#customerDeliveryAddressTableHolder").html(str);
		$("#saleOrderControlButtonHolder").removeClass('hide');
		
		if (!orderId) {
			/*-------------------------Removing Cart area-------------------------
			xxxx remove after some day
			ORDEROBJ = [];
			$("#cartTableHolder").html('');
			$("#totalCalcSection").addClass('hide');
			$("#totalBeforeTax").html('');
			$("#taxP").html('');
			$("#totalPrice").html('');
			$('#placeOrderBtn').attr('disabled', true);
			/*-------------------------Removing Cart area-------------------------*/
		}
		
		saleOrderFunctionality.populateCart();
		saleOrderFunctionality.populateNewOrderCart();
	};

    parent.onSelectCustomerDeliveryAddressId = function (deliveryAddressId) {
        $("#selectedCustomerDeliveryAddressId").val(deliveryAddressId);
		saleOrderFunctionality.populateCart();
		saleOrderFunctionality.populateNewOrderCart();
    };

    parent.mapCoCOrder = function () {
        isCoCOrder = true;
        SEARCHCUSTOMERCRITERIA.keyword = COMPANYTYPECoC;
        $("#customerSearch").val('');
        $('#customerGroupAddonIcon').removeClass('fa-search').addClass('fa-spinner fa-spin');
        appCommonFunctionality.ajaxCallLargeData('GETCUSTOMERS', SEARCHCUSTOMERCRITERIA, populateCustomerSuggestionBox);
    };
	
	const receiveOrderDeatilsData = function(orderDetailsData){
		orderDetailsData = JSON.parse(orderDetailsData)?.msg?.[0];
		const customerResultItemClass = appCommonFunctionality.isMobile() ? 'customerResultItem-Mob' : 'customerResultItem';
		const str = `
			<div class="f16">${orderDetailsData.companyName} (${getCompanyType(orderDetailsData.companyType)}) [${orderDetailsData.customerGrade}]</div>
			<div class="f12">
			  <strong><span id="cms_314">${appCommonFunctionality.getCmsString(314)}</span>: </strong>
			  <span class="blueText">${orderDetailsData.buyerName}</span><br>
			  <strong><span id="cms_315">${appCommonFunctionality.getCmsString(315)}</span>: </strong>
			  <span class="blueText">${orderDetailsData.contactPerson}</span>
			</div>
			<div class="f12">
			  <i class="fa fa-phone blueText"></i> ${orderDetailsData.phone}<br>
			  <i class="fa fa-envelope greenText"></i> <span class="blueText">${orderDetailsData.email}</span>
			</div>
		  `;
		$('#selectedCustomerSection').html(str).addClass(customerResultItemClass);
		$("#selectedCustomerTitle").removeClass('hide');
		$('#customerSearchResult').html('');
		$('#selectedCustomerId').val(orderDetailsData.customerId);
		$('#selectedCustomerGrade').val(orderDetailsData.customerGrade);
		$('#selectedCustomerDeliveryAddressId').val(orderDetailsData.deliveryAddressId);
        appCommonFunctionality.ajaxCall(`GETDELIVERYADDRESSES&customerId=${orderDetailsData.customerId}`, bindCustomerDeliveryAddressTable);
		if (orderDetailsData?.orderObj) {
			const decodedOrderObj = JSON.parse(decodeURI(window.atob(orderDetailsData.orderObj)));
			const finalOrderObj = JSON.parse(decodedOrderObj?.orderObj || "[]");
			if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
				ORDEROBJ = finalOrderObj;
				saleOrderFunctionality.populateCart();
			}
		}
	};

    const getCompanyType = function (companyTypeId) {
        const companyType = COMPANYTYPEPRECOMPILEDDATA.find(item => parseInt(item.companyTypeId) === parseInt(companyTypeId));
        return companyType ? companyType.companyType : '';
    };

    parent.scannerGun = function () {
        $("#scannerGunData").val('').focus();
    };
	
	parent.scannerGunDataInputFocus = function(){
		$('#barcodeScannerHolder').removeClass('hide');
	};
	
	parent.scannerGunDataInputFocusOut = function(){
		$('#barcodeScannerHolder').addClass('hide');
	};

    const captureProductCombinationFromBarQrCode = function (scannerGunDataValue) {
        let productFound = false;
        if (PRODUCTLIVESTOCKPRECOMPILEDDATA.length > 0 && scannerGunDataValue !== '') {
            PRODUCTLIVESTOCKPRECOMPILEDDATA.some(product => {
                if (product.systemReference && scannerGunDataValue && typeof product.systemReference === 'string' && typeof scannerGunDataValue === 'string' && product.systemReference.toLowerCase() === scannerGunDataValue.toLowerCase()) {
                    ORDEROBJ.push(product);
                    productFound = true;
                    saleOrderFunctionality.scannerGun();
                    return true;
                }
                return false;
            });
            if (!productFound) {
                $("#productScannerErr").html('* ' + appCommonFunctionality.getCmsString(328));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(328), appCommonFunctionality.getLang());
				setTimeout(function() {
					$('#productScannerErr').html('');
				}, 3000);
                saleOrderFunctionality.scannerGun();
            }
            saleOrderFunctionality.populateCart();
        }
    };
	
    parent.populateCart = function () {
		let hasCreditNote = false;
        const displayOrderArr = [];
		const orderMap = new Map();
		ORDEROBJ.forEach(order => {
			const productId = parseInt(order.productId);
			const productCombinationId = parseInt(order.productCombinationId);
			const key = `${productId}-${productCombinationId}`;

			if (orderMap.has(key)) {
				const existingOrder = orderMap.get(key);
				if (order.creditNote) {
					// Create a separate entry for creditNote items
					const creditNoteKey = `${key}-creditNote`;
					if (orderMap.has(creditNoteKey)) {
						orderMap.get(creditNoteKey).qty += 1;
					} else {
						orderMap.set(creditNoteKey, { ...order, qty: 1 });
					}
					hasCreditNote = true;
				} else {
					existingOrder.qty += 1;
				}
			} else {
				if (order.creditNote) {
					const creditNoteKey = `${key}-creditNote`;
					orderMap.set(creditNoteKey, { ...order, qty: 1 });
				} else {
					orderMap.set(key, { ...order, qty: 1 });
				}
			}
		});
		displayOrderArr.push(...orderMap.values());
		
        let totalPrice = 0;
        let totalBeforeTax = 0;
		let wideTableStyle = '';
		if(PAGEDOCNAME === 'saleOrderEntry.php'){
			wideTableStyle = 'minW720';
		}
        let str = `<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder ${wideTableStyle}"><tbody><tr><td width="75%" class="text-left"><b id="cms_329">${appCommonFunctionality.getCmsString(329)}</b></td><td width="10%" class="text-right"><b>Qty</b></td><td width="15%" class="text-right"><b id="cms_330">${appCommonFunctionality.getCmsString(330)}</b></td></tr>`;
        if (displayOrderArr.length > 0) {
            displayOrderArr.forEach(item => {
				let rowBgClass = '';
				if(item.creditNote){
					rowBgClass = 'bgLightRed';
				}
				const selectedCustomerGrade = $("#selectedCustomerGrade").val().toLowerCase();
                const RofferPercentage = item.RofferPercentage;
				const WofferPercentage = item.WofferPercentage;
				let offerText = '';
				let effectivePrice = 0;
				let originalPrice = 0;
				let offerPercentage = 0;
				if (selectedCustomerGrade === 'r') {
					originalPrice = item.RPrice;
					offerPercentage = RofferPercentage;
				} else if (selectedCustomerGrade === 'w') {
					originalPrice = item.WPrice;
					offerPercentage = WofferPercentage;
				}
				if (offerPercentage > 0) {
					effectivePrice = originalPrice - (originalPrice * offerPercentage / 100);
					offerText = '<span class="lineThrough">' + appCommonFunctionality.getDefaultCurrency() + originalPrice.toFixed(2) + '</span> ' + offerPercentage + '% off ' + appCommonFunctionality.getDefaultCurrency() + effectivePrice.toFixed(2);
				} else {
					effectivePrice = originalPrice;
					offerText = appCommonFunctionality.getDefaultCurrency() + effectivePrice.toFixed(2);
				}
				let QRTextHtml = getQRTextHtml(item.productCombinationQR, item.productCode);
				let weightInputHtml = '';
				if(QRTextHtml.indexOf(WEIGHTSIGN) != -1 && PAGEDOCNAME === 'saleOrderEntry.php'){
					weightInputHtml = `<div class="input-group input-group-md">
										<input type="number" id="productItemWeight_${item.productCombinationId}" name="productItemWeight_${item.productCombinationId}" oninput="saleOrderFunctionality.calcQtyOnWeight(this.value, ${item.productCombinationId})" value="0" autocomplete="off" class="marleft5 maxW64">
										<span class="input-group-addon">
											<i class="fa fa-balance-scale redText hover"></i>
										</span>
									</div>`
				}
				let qtyInputHTML = ``;
				if(PAGEDOCNAME === 'saleOrderEntry.php'){
					qtyInputHTML = `<div class="input-group input-group-md">
									<span class="input-group-addon greenText" onclick="saleOrderFunctionality.changeQty('+', ${item.productCombinationId})">
										<i class="fa fa-plus greenText"></i>
									</span>
									<input type="number" id="productItemQty_${item.productCombinationId}" name="productItemQty_${item.productCombinationId}" value="${item.qty}" step="1" min="0" autocomplete="off" onfocus="saleOrderFunctionality.storeProductItemQty(this.value, ${item.productCombinationId})"
									onchange="saleOrderFunctionality.productItemQtyInputKeyUp(this.value, ${item.productCombinationId})" class="maxW64">
									<span class="input-group-addon" onclick="saleOrderFunctionality.changeQty('-', ${item.productCombinationId})">
										<i class="fa fa-minus redText"></i>
									</span>
								</div>`;
				}else if(PAGEDOCNAME === 'saleOrderDetails.php'){
					if(item.creditNote){
						qtyInputHTML = `-${item.qty}`;
					}else{
						qtyInputHTML = `${item.qty}`;
					}
				}else if(PAGEDOCNAME === 'saleOrderSplit.php'){
					qtyInputHTML = `${item.qty} <i class="fa fa-hand-o-right greenText marleft5 hover" onclick="saleOrderFunctionality.transferToNewOrder(${item.productCombinationId})"></i>`;
				}
				let deleteBtnHTML = ``;
				if(PAGEDOCNAME === 'saleOrderEntry.php'){
					deleteBtnHTML = `<i class="fa fa-trash redText marleft5 hover" onclick="saleOrderFunctionality.removeFromCart(${item.productCombinationId})"></i>`;
				}
				if(item.creditNote){
					str += `<tr class="${rowBgClass}">
								<td class="text-left">
									<div class="pull-left f12">
										<span>${item.productTitle} [${item.productCode}] ${offerText}</span><br>
										<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
									</div>
									<div class="pull-left">${weightInputHtml}</div>
								</td>
								<td class="text-right">${qtyInputHTML}</td>
								<td class="text-right">
									<span> - ${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
									${deleteBtnHTML}
								</td>
							</tr>`;
					totalBeforeTax = totalBeforeTax - (effectivePrice * item.qty);
				}else{
					str += `<tr class="${rowBgClass}">
								<td class="text-left">
									<div class="pull-left f12">
										<span>${item.productTitle} [${item.productCode}] ${offerText}</span><br>
										<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
									</div>
									<div class="pull-left">${weightInputHtml}</div>
								</td>
								<td class="text-right">${qtyInputHTML}</td>
								<td class="text-right">
									<span>${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
									${deleteBtnHTML}
								</td>
							</tr>`;
					totalBeforeTax += effectivePrice * item.qty;
				}
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
			if(hasCreditNote){
				$('#creditNote').html('<span id="cms_372">' + appCommonFunctionality.getCmsString(372) + '</span> : <a href="' + PROJECTPATH + 'creditNote/' + ORDERGUID + '" target="_blank"><i class="fa fa-file-text redText"></i></a>');
			}
			$('#placeOrderBtn').attr('disabled', false);
		}else{
			$("#totalCalcSection").addClass('hide');
			$("#totalBeforeTax").html('');
			$("#taxP").html('');
			$("#totalPrice").html('');
			$('#placeOrderBtn').attr('disabled', true);
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
	
	parent.calcQtyOnWeight = function(weightValue, productCombinationId){
		alert(weightValue, productCombinationId);
		//need to get 500grms # make another function from QR text
		//I am here xxxx
	};
	
	parent.changeQty = function (operation, productCombinationId) {
		productCombinationId = parseInt(productCombinationId);
		if (operation === '+') {
			if(PRODUCTSTOCKINDIVIDUALIDENTITY){
				const existingReferences = new Set(ORDEROBJ.map(item => item.systemReference));
				const newItem = PRODUCTLIVESTOCKPRECOMPILEDDATA.find(item => 
					item.productCombinationId === productCombinationId &&
					!existingReferences.has(item.systemReference)
				);
				if (newItem) {
					ORDEROBJ.push(newItem);
				} else {
					alert(appCommonFunctionality.getCmsString(351));
				}
			}else{
				const newItem = PRODUCTLIVESTOCKPRECOMPILEDDATA.find(item => 
					item.productCombinationId === productCombinationId);
				if (newItem) {
					ORDEROBJ.push(newItem);
				} else {
					alert(appCommonFunctionality.getCmsString(351));
				}
			}
		} else if (operation === '-') {
			const indexToRemove = ORDEROBJ.slice().reverse().findIndex(item => 
				item.productCombinationId === productCombinationId
			);

			if (indexToRemove !== -1) {
				ORDEROBJ.splice(ORDEROBJ.length - 1 - indexToRemove, 1);
			}
		}
		saleOrderFunctionality.populateCart();
	};
	
	parent.storeProductItemQty = function(qtyVal, productCombinationId){
		productQtyObj.value = parseInt(qtyVal);
		productQtyObj.productCombinationId = parseInt(productCombinationId);
	};
	
	parent.productItemQtyInputKeyUp = function (qtyVal, productCombinationId) {
		qtyVal = parseInt(qtyVal, 10);
		productCombinationId = parseInt(productCombinationId, 10);
		if (productQtyObj.productCombinationId === productCombinationId) {
			const qtyDifference = qtyVal - productQtyObj.value;
			if (qtyDifference !== 0) {
				const operation = qtyDifference > 0 ? '+' : '-';
				const iterations = Math.abs(qtyDifference);
				for (let i = 0; i < iterations; i++) {
					saleOrderFunctionality.changeQty(operation, productCombinationId);
				}
				productQtyObj.value = qtyVal;
			}
		}
	};

	parent.removeFromCart = function(productCombinationId){
		ORDEROBJ = ORDEROBJ.filter(item => item.productCombinationId !== productCombinationId);
		saleOrderFunctionality.populateCart();
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
	
	parent.openProductSearchModal = function(){
		$("#productSearchModal").modal('show').on('shown.bs.modal', function () {
            $('#productKeyword').focus();
        });
	};
	
	parent.brandPredictiveSearch = function(searchedText) {
		$('#searchBrandIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
		if (BRANDPRECOMPILEDDATA.length > 0 && searchedText.length > 2) {
			const searchedBrandObjArray = BRANDPRECOMPILEDDATA.filter(brand => brand.brandName.toLowerCase().includes(searchedText.toLowerCase()));
			const str = searchedBrandObjArray.map(brand => `
				<div class="searchedItem hover" onclick="saleOrderFunctionality.onBrandSelection(${brand.brandId})">
					<span class="padLeft4">${brand.brandName}</span>
				</div>
			`).join('');
			$('#searchedBrands').html(str).removeClass('hide');
			$('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
		} else {
			$('#searchedBrands').html('').addClass('hide');
			$('#searchBrandIconSpan').html('<span class="fa fa-search hover"></span>');
		}
	};

	parent.onBrandSelection = function(brandId) {
		$('#brandId').val(brandId);
		$('#searchedBrands').html('').addClass('hide');
		$('#searchBrand').val('');
		saleOrderFunctionality.populateSelectedBrand(brandId);
	};

	parent.populateSelectedBrand = function(brandId) {
		const brand = BRANDPRECOMPILEDDATA.find(b => parseInt(b.brandId) === parseInt(brandId));
		if (brand) {
			const str = `
				<div id="cms_45">Selected Brand : </div>
				<div class="selectedBrandItem">
					<div>
						<span class="marleft5"><b>${brand.brandName}</b></span>
					</div>
					<div>
						<span class="pull-right fa fa-remove redText hover" onclick="saleOrderFunctionality.removeBrandSelection();"></span>
					</div>
				</div>
			`;
			$('#selectedBrandItem').html(str);
		}
	};

	parent.removeBrandSelection = function() {
		$('#brandId').val(0);
		$('#selectedBrandItem').html('');
		$('#searchBrand').focus();
	};

	parent.categoryPredictiveSearch = function(searchedText) {
		$('#searchCatIconSpan').html('<span class="fa fa-spinner fa-spin hover"></span>');
		if (CATEGORYPRECOMPILEDDATA.length > 0 && searchedText.length > 2) {
			const searchedCatObjArray = CATEGORYPRECOMPILEDDATA.filter(cat => cat.category.toLowerCase().includes(searchedText.toLowerCase()));
			const str = searchedCatObjArray.map(cat => `
				<div class="searchedItem hover" onclick="saleOrderFunctionality.onCatSelection(${parseInt(cat.categoryId)}, this)">
					<span class="padLeft4">${cat.category}</span>
				</div>
			`).join('');
			$('#searchedCats').html(str).removeClass('hide');
			$('#searchCatIconSpan').html('<span class="fa fa-close redText hover" onClick="saleOrderFunctionality.resetSearchCatField();"></span><span class="fa fa-search marleft5 hover"></span>');
		} else if (searchedText.length === 0) {
			$('#searchedCats').html('').addClass('hide');
			$('#searchCat').val('');
			$('#searchCatIconSpan').html('<span class="fa fa-search hover"></span>');
		}
	};

	parent.resetSearchCatField = function() {
		$("#searchCat").val('');
		$('#searchedCats').html('').addClass('hide');
	};

	parent.onCatSelection = function(catId, selfObj) {
		if (catId > 0 && !SELECTEDCATEGORYIDARR.includes(parseInt(catId))) {
			SELECTEDCATEGORYIDARR.push(parseInt(catId));
			$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
			if (selfObj !== null) {
				$(selfObj).hide();
			}
			populateSelectedCategories();
		}
	};

	const populateSelectedCategories = function() {
		const str = CATEGORYPRECOMPILEDDATA.filter(cat => SELECTEDCATEGORYIDARR.includes(parseInt(cat.categoryId)))
			.map(cat => `
				<div class="selectedCatItem">
					<span class="fa fa-tags darkGreyText"></span>
					<span class="marleft5">${cat.category}</span>
					<span class="fa fa-remove redText hover marleft5" onclick="saleOrderFunctionality.removeCatSelection(${parseInt(cat.categoryId)});"></span>
				</div>
			`).join('');
		$('#selectedCatItem').html(str);
	};

	parent.removeCatSelection = function(categoryId) {
		const index = SELECTEDCATEGORYIDARR.indexOf(categoryId);
		if (index > -1) {
			SELECTEDCATEGORYIDARR.splice(index, 1);
			$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
		}
		populateSelectedCategories();
	};
	
	parent.searchFormReset = function() {
		$("#productKeyword").val("");
		$("#searchBrand").val("").trigger('keyup');
		saleOrderFunctionality.removeBrandSelection();
		$("#searchCat").val("").trigger('keyup');
		const categoryIds = $("#categoryIds").val().split(",");
		categoryIds.forEach(id => saleOrderFunctionality.removeCatSelection(parseInt(id)));
		$("#seachedProductTable").removeClass('hide').html('');
		$("#productCombinationSection").addClass('hide').html('');
	};

	parent.productSearch = function() {
		const keywordTyped = $("#productKeyword").val().toLowerCase();
		const selectedBrandId = parseInt($("#brandId").val());
		const selectedCategoryIds = $("#categoryIds").val().split(',').map(Number);
		let searchedProducts = PRODUCTPRECOMPILEDDATA.filter(product => {
			const { brandId, categoryIds, productCode, productTitle, metaKeyWords } = product;
			const productCategories = categoryIds.split(',').map(Number);
			return (
				(selectedBrandId && brandId === selectedBrandId) ||
				(selectedCategoryIds.length && productCategories.some(element => selectedCategoryIds.includes(element))) ||
				(keywordTyped && (
					productCode.toLowerCase().includes(keywordTyped) ||
					productTitle.toLowerCase().includes(keywordTyped) ||
					metaKeyWords.toLowerCase().includes(keywordTyped)
				))
			);
		});
		populateProductTable(searchedProducts);
		searchedProducts = [];
	};
	
	const populateProductTable = (searchedProducts) => {
		let str = `<div id="cms_345">${appCommonFunctionality.getCmsString(345)}</div>`;
		if (searchedProducts.length > 0) {
			searchedProducts.forEach(product => {
				str += `
					<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot3">
						<div class="generalBox hover" onclick="saleOrderFunctionality.populateProductCombinations(${product.productId})">
							<i class="fa fa-gift"></i> ${product.productTitle} [${product.productCode}]
						</div>
					</div>`;
			});
		} else {
			str += `<div id="cms_346">${appCommonFunctionality.getCmsString(346)}</div>`;
		}
		$('#seachedProductTable').html(str);
	};

	parent.populateProductCombinations = function(productId){
		$("#seachedProductTable").addClass('hide');
		const filteredStocks = PRODUCTLIVESTOCKPRECOMPILEDDATA.filter(stock => stock.productId === parseInt(productId));
		const groupedByProductCombinationId = filteredStocks.reduce((acc, stock) => {
			acc[stock.productCombinationId] = stock;
			return acc;
		}, {});
		const uniqueStocks = Object.values(groupedByProductCombinationId);
		let str = '';
		if (uniqueStocks.length > 0) {
			uniqueStocks.forEach(stock => {
				str += `
					<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot3">
						<div class="generalBox hover" onclick="saleOrderFunctionality.selectProductCombinations(${stock.productId}, ${stock.productCombinationId})">
							${stock.productTitle} [${stock.productCode}] <i class="fa fa-caret-right"></i> [${stock.productCombinationId}] - ${getQRTextHtml(stock.productCombinationQR, stock.productCode)}
						</div>
					</div>
				`;
			});
		} else {
			str = '<span id="cms_349">' + appCommonFunctionality.getCmsString(349) + '</span>';
		}
		$("#productCombinations").html(str);
		$("#productCombinationSection").removeClass('hide');
	};

	parent.backToSearchedProductTable = function(){
		$("#productCombinationSection").addClass('hide');
		$("#seachedProductTable").removeClass('hide');
	};

	parent.selectProductCombinations = function(productId, productCombinationId){
		for(var i = 0; i < PRODUCTLIVESTOCKPRECOMPILEDDATA.length; i++){
			if(PRODUCTLIVESTOCKPRECOMPILEDDATA[i].productId === parseInt(productId) && PRODUCTLIVESTOCKPRECOMPILEDDATA[i].productCombinationId === parseInt(productCombinationId)){
				var exists = ORDEROBJ.some(function(order) {
					return order.systemReference === PRODUCTLIVESTOCKPRECOMPILEDDATA[i].systemReference;
				});
				if (!exists) {
					ORDEROBJ.push(PRODUCTLIVESTOCKPRECOMPILEDDATA[i]);
					break;
				}
			}
		}
		populateModalCart();
	};

	const populateModalCart = function(){
		let str = '';
		if (ORDEROBJ.length > 0) {
			const aggregatedStocks = ORDEROBJ.reduce((acc, stock) => {
				const key = `${stock.productId}_${stock.productCombinationId}`;
				if (!acc[key]) {
					acc[key] = { ...stock, count: 1 };
				} else {
					acc[key].count += 1;
				}
				return acc;
			}, {});

			for (let key in aggregatedStocks) {
				const stock = aggregatedStocks[key];
				str += `
					<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 noLeftPaddingOnly marBot3">
						<div class="generalBox hover">
							${stock.productTitle} [${stock.productCode}] <i class="fa fa-caret-right"></i> [${stock.productCombinationId}] - [${getQRTextHtml(stock.productCombinationQR, stock.productCode)}] X <b>${stock.count}</b> - <i class="fa fa-trash redText" onclick="saleOrderFunctionality.removeFromModalCart(${stock.productCombinationId})"></i>
						</div>
					</div>
				`;
			}
			$('#addToCartBtn').removeAttr('disabled');
		} else {
			str = '<span id="cms_349">' + appCommonFunctionality.getCmsString(349) + '</span>';
			$('#addToCartBtn').attr('disabled', 'disabled');
		}
		$("#selectedProductCombinations").html(str);
		$("#selectedProductCombinations, #selectedProductCombinationHeader").removeClass('hide');
	};

	parent.removeFromModalCart = function(productCombinationId){
		ORDEROBJ = ORDEROBJ.filter(item => item.productCombinationId !== productCombinationId);
		populateModalCart();
	};
	
	parent.placeOrder = function () {
		let errorMessages = [
			{ id: "#selectedCustomerId", errorCode: 354},
			{ id: "#selectedCustomerDeliveryAddressId", errorCode: 355}
		];
		let errorCount = errorMessages.reduce((count, field) => {
			if (parseInt($(field.id).val()) === 0) {
				alert(appCommonFunctionality.getCmsString(field.errorCode));
				appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(field.errorCode), appCommonFunctionality.getLang());
				return count + 1;
			}
			return count;
		}, 0);
		if (ORDEROBJ.length === 0) {
			alert(appCommonFunctionality.getCmsString(356));
			appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(356), appCommonFunctionality.getLang());
			errorCount++;
		}
		if (errorCount === 0) {
			const qryStr = 'PLACEORDER';
			const orderObj = {
				orderObj: JSON.stringify(ORDEROBJ),
				tax: $('#taxP').text()
			};
			let totalPrice = $('#totalPrice').text();
			totalPrice = totalPrice.replace(appCommonFunctionality.getDefaultCurrency(), '');
			const orderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
			let callData = {};
			if(PAGEDOCNAME === 'saleOrderDetails.php'){
				callData = {
					orderId: 0,
					parentOrderId: 0,
					customerId: parseInt(ORDER.customerId),
					deliveryAddressId: parseInt(ORDER.deliveryAddressId),
					orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
					totalPrice: ORDER.totalPrice,
					deliveryDate: ORDER.deliveryDate
				};
			}else{
				callData = {
					orderId: orderId,
					parentOrderId: 0,
					customerId: parseInt($("#selectedCustomerId").val()),
					deliveryAddressId: parseInt($("#selectedCustomerDeliveryAddressId").val()),
					orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
					totalPrice: totalPrice,
					deliveryDate: $('#deliveryDate').val()
				};
			}
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receivePlaceOrderResponse);
		}
	};

	const receivePlaceOrderResponse = function(responseData){
		responseData = JSON.parse(responseData);
		saleOrderFunctionality.gotoOrderDetails(responseData.responseCode)
	};

	parent.initSaleOrderDetail = async function (commonActivityFlag) {
		appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		if(commonActivityFlag === true){
			await appCommonFunctionality.adminCommonActivity();
		}
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (!orderId) {
			return;
		}
		const queryString = `ORDERDETAILS&orderId=${orderId}`;
		appCommonFunctionality.ajaxCall(queryString, receiveOrderDetailResponse);
	};

	const receiveOrderDetailResponse = function (responseData) {
		try {
			appCommonFunctionality.hideLoader();
			ORDER = JSON.parse(responseData)?.msg?.[0];
			ORDERGUID = ORDER.GUID;
			if (!ORDER) {
				console.error("Invalid response data.");
				return;
			}else if(ORDER === 'O'){
				saleOrderFunctionality.gotoOrders();
			}
			const currentStatus = getOrderStatus(ORDER.status);
			
			//Order Status Progress 
			$('#orderStatusProgress').html(orderStatusProgress(ORDER.status));
			
			// Section 1: Order Summary
			const orderSummaryHTML = `
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
					<div class="pull-left">
						<h2>${ORDER.orderCode} [${currentStatus}] </h2>
						<h2>£${parseFloat(ORDER.totalPrice).toFixed(2)}</h2>
						<div class="f14"><span id="cms_360">${appCommonFunctionality.getCmsString(360)}</span>: ${ORDER.orderDate}</div>
						<div class="f14"><span id="cms_353">${appCommonFunctionality.getCmsString(353)}</span>: ${ORDER.deliveryDate}</div>
					</div>
				</div>
				<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
					<!--<div class="pull-right productImageBlock5">
						<img src="${QRCODEAPIURL}${ORDER.orderCode}|${ORDER.totalPrice}GBP|${ORDER.orderDate}|${ORDER.deliveryDate}" 
							 alt="${ORDER.orderCode}" 
							 onerror="productFunctionality.onImgError(this);">
					</div>-->
				</div>`;
			$('#oderDetailsSection1').html(orderSummaryHTML);
			$('#deliveryDate').val(ORDER.deliveryDate);

			// Section 2: Billing and Delivery Information
			let oderDetailsSection2HTML = ``;
			if(ORDER.companyName.toLowerCase() !== 'coc'){
				oderDetailsSection2HTML = `
				<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white ordInfo-table roundedBorder">
					<tbody>
						<tr>
							<td width="50%"><strong id="cms_358">${appCommonFunctionality.getCmsString(358)}</strong></td>
							<td width="50%"><strong id="cms_359">${appCommonFunctionality.getCmsString(359)}</strong></td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_322">${appCommonFunctionality.getCmsString(322)}</b>: ${ORDER.companyName || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_322">${appCommonFunctionality.getCmsString(322)}</b>: ${ORDER.deliveryCompanyName || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_323">${appCommonFunctionality.getCmsString(323)}</b>: ${ORDER.contactPerson || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_323">${appCommonFunctionality.getCmsString(323)}</b>: ${ORDER.deliveryContactPerson || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_324">${appCommonFunctionality.getCmsString(324)}</b>: ${ORDER.phone || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_324">${appCommonFunctionality.getCmsString(324)}</b>: ${ORDER.deliveryPhone || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b>Email</b>: <a href="mailto:${ORDER.email || ''}" class="blueText">${ORDER.email || ''}</a> <br>
							</td>
							<td width="50%">
								<b>Email</b>: <a href="mailto:${ORDER.deliveryEmail || ''}" class="blueText">${ORDER.deliveryEmail || ''}</a> <br>
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_325">${appCommonFunctionality.getCmsString(325)}</b>: ${ORDER.address || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_325">${appCommonFunctionality.getCmsString(325)}</b>: ${ORDER.deliveryAddress || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_326">${appCommonFunctionality.getCmsString(326)}</b>: ${ORDER.town || ''} <br> 
							</td>
							<td width="50%">
								<b rel="cms_326">${appCommonFunctionality.getCmsString(326)}</b>: ${ORDER.deliveryTown || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b>Postcode</b>: ${ORDER.postCode || ''} <br> 
							</td>
							<td width="50%">
								<b>Postcode</b>: ${ORDER.deliveryPostCode || ''} <br> 
							</td>
						</tr>
						<tr class="f12">
							<td width="50%">
								<b rel="cms_327">${appCommonFunctionality.getCmsString(327)}</b>: <span>${appCommonFunctionality.getCountryName(ORDER.country, false)}</span>
							</td>
							<td width="50%">
								<b rel="cms_327">${appCommonFunctionality.getCmsString(327)}</b>: <span>${appCommonFunctionality.getCountryName(ORDER.deliveryCountry, false)}</span>
							</td>
						</tr>
					</tbody>
				</table>`;
			}else{
				oderDetailsSection2HTML = `<h2 class='text-right' id='cms_318'>${appCommonFunctionality.getCmsString(318)}</h2>
				<div class='text-right f14' id='cms_393'>${appCommonFunctionality.getCmsString(393)}</div>`;
			}
			$('#oderDetailsSection2').html(oderDetailsSection2HTML);

			// Section 3 & 4: Order Items & Billing section
			if (ORDER?.orderObj) {
				$("#selectedCustomerGrade").val(ORDER.customerGrade);
				$("#selectedCustomerId").val(ORDER.customerId);
				$("#selectedCustomerDeliveryAddressId").val(ORDER.deliveryAddressId);
				try {
					const decodedOrderObj = JSON.parse(decodeURI(window.atob(ORDER.orderObj)));
					const finalOrderObj = JSON.parse(decodedOrderObj?.orderObj || "[]");
					if (Array.isArray(finalOrderObj) && finalOrderObj.length) {
						ORDEROBJ = finalOrderObj;
						saleOrderFunctionality.populateCart();
						const oderDetailsSection4HTML = `
						<div class="receipt-header">
							<h4>${SITETITLE}</h4>
							<p>${DEFAULTADDRESS}</p>
							<p>Tel: ${DEFAULTPHONE}<br>VAT No:${VATNUMBER}<br><b>${ORDER.orderCode}</b> - ${ORDER.orderDate}</p>
						</div>
						
						<div id="billCartTableHolder" class="scrollX">
						</div>
						
						<div id="billTotalCalcSection" class="text-right f14">
						</div>
						
						<div class="text-center marBot10">
							<img src="${QRCODEAPIURL}${ORDER.orderCode}|${ORDER.totalPrice}GBP|${ORDER.orderDate}|${ORDER.deliveryDate}" alt="${ORDER.orderCode}" class="productQRCode" onerror="productFunctionality.onImgError(this);">
						</div>
						
						<div class="receipt-footer f14">
							<p><span id="cms_361">${appCommonFunctionality.getCmsString(361)}</span>: <span id="paymentModeBill"></span> | <span id="cms_362">${appCommonFunctionality.getCmsString(362)}</span>: ${appCommonFunctionality.addZeroesToNumber(ORDER.createdBy, 5)}</p>
							<h4><span id="cms_363">${appCommonFunctionality.getCmsString(363)}</span></h4>
						</div>`;
						$('#billPrint').html(oderDetailsSection4HTML);
						$('#billCartTableHolder').html($('#cartTableHolder').html());
						$('#billCartTableHolder table').removeClass().addClass('table receipt-items roundedBorder');
						$('#billTotalCalcSection').html(
							$('#totalCalcSection')
								.clone() // Clone the entire section
								.find('#paymentModeSection') // Find and exclude the #paymentModeSection
								.remove() // Remove it
								.end() // Return back to the cloned content
								.html() // Get the HTML string
								.replace(
									'col-lg-6 col-md-6 ', 
									'col-lg-12 col-md-12 '
								) // Replace the specific class
						);

					}
				} catch (error) {
					console.error("Failed to parse order object:", error);
				}
			}
			
			// Payment Information Section
			if (ORDER?.paymentInformation) {
				try {
					const decodedPaymentInformation = JSON.parse(decodeURI(window.atob(ORDER.paymentInformation)));
					const paymentMode = decodedPaymentInformation.paymentMode;
					const updatePaymentMethod = (selectedMethod, otherMethod) => {
						$(selectedMethod)
							.append('<i class="fa fa-check greentext f16 check-icon"></i>')
							.off("click")
							.removeClass('hover')
							.addClass('notAllowed');

						$(otherMethod)
							.off("click")
							.removeClass('hover')
							.addClass('notAllowed')
							.find('.fa-check')
							.remove();
					};
					if (paymentMode === 'CASH') {
						updatePaymentMethod("#payByCash", "#payByCard");
					} else if (paymentMode === 'CARD') {
						updatePaymentMethod("#payByCard", "#payByCash");
					}
					$("#paymentModeBill").html(paymentMode);
				} catch (error) {
					console.error("Failed to parse order object:", error);
				}
			}

			//Populate next order status redirection on action button
			const disableButtons = (selectors) => {
				$(selectors).prop('disabled', true);
			};
			const enableButtons = (selectors) => {
				$(selectors).prop('disabled', false);
			};
			switch (currentStatus) {
				
				case "PLACED":{
					disableButtons("#newOrderBtn");
					break;
				}
					
				case "APPROVED":{
					disableButtons("#newOrderBtn, #editOrderBtn");
					break;
				}
					
				case "PAID":{
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					break;
				}
					
				case "SHIPPED":
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					break;
					
				case "DELIVERED":{
					disableButtons("#newOrderBtn, #editOrderBtn, #splitOrderBtn, #deleteOrderBtn");
					break;
				}
					
				case "COMPLETED":
					disableButtons("#editOrderBtn, #splitOrderBtn, #actionBtn, #deleteOrderBtn");
					enableButtons("#newOrderBtn");
					break;
					
				case "CANCELLED1":{
					disableButtons("#editOrderBtn, #splitOrderBtn, #actionBtn, #deleteOrderBtn");
					enableButtons("#newOrderBtn");
					break;
				}
					
				case "CANCELLED2":{
					disableButtons("#editOrderBtn, #splitOrderBtn, #actionBtn, #deleteOrderBtn");
					enableButtons("#newOrderBtn");
					break;
				}
			}
			$('#orderStatusBunAction').html(generateOrderStatusLinks(ORDER.status));
			
			if (appCommonFunctionality.isMobile()) {
				$('#oderDetailsSection3').removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
			}
			
			appCommonFunctionality.cmsImplementationThroughID();
		} catch (error) {
			console.error("Error in receiveOrderDetailResponse:", error);
		}
	};
	
	const orderStatusProgress = function (orderStatusId) {
		const orderStatusSteps = ORDERSALESTATUSPRECOMPILEDDATA.filter(status => status.orderStatusId < (getOrderStatusId('COMPLETED') + 1));
		const totalSteps = orderStatusSteps.length;
		const activeSteps = orderStatusSteps.filter(step => step.orderStatusId <= orderStatusId).length; // Use the passed parameter
		const progressPercentage = ((activeSteps - 1) / (totalSteps - 1)) * 100; // Calculate percentage
		let progressHtml = `<div class="progress-container">`;
		progressHtml += `<div class="progress" id="progress" style="width: ${progressPercentage}%;"></div>`;
		orderStatusSteps.forEach((step) => {
			const isActive = step.orderStatusId <= orderStatusId ? "active" : "";
			progressHtml += `
				<div class="circle ${isActive}">
					<span class="stepText" id="cms_${step.orderStatusCmsId}">${appCommonFunctionality.getCmsString(step.orderStatusCmsId)}</span>
				</div>
			`;
		});
		progressHtml += `</div>`;
		return progressHtml;
	};
	
	parent.updatePaymentInformation = async function (paymentType) {
		const orderStatusId = getOrderStatusId('PAID');
		if(ORDER.status < orderStatusId){
			const orderId = appCommonFunctionality.getUrlParameter('orderId');
			const elements = {
				card: '#payByCard',
				cash: '#payByCash'
			};
			Object.keys(elements).forEach(type => {
				if (paymentType.toLowerCase() === type) {
					$(elements[type]).append('<i class="fa fa-check greentext f16 check-icon"></i>');
				} else {
					$(elements[type]).find('.fa-check').remove();
				}
			});
			$("#paymentModeBill").html(paymentType);
			
			// Get card machine information asynchronously (waiting for response)
			const cardMachineInfo = paymentType.toLowerCase() === 'card' ? await getInformationFromCardMachine() : {};
			const paymentInfo = {
				paymentMode: paymentType,
				cardMachineInfo: cardMachineInfo
			};
			const paymentInformation = {
				paymentInformation: window.btoa(encodeURI(JSON.stringify(paymentInfo)))
			};
			// Construct query string and execute AJAX call after awaiting response from getInformationFromCardMachine
			const queryString = `CHANGEORDERSTATUS&orderId=${orderId}&orderStatusId=${orderStatusId}`;
			appCommonFunctionality.ajaxCallLargeData(queryString, paymentInformation, receiveChangeOrderStatusResponse);
		}else{
			alert(appCommonFunctionality.getCmsString(394));
			appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(394), appCommonFunctionality.getLang());
		}
	};

	const getInformationFromCardMachine = async function () {
		appCommonFunctionality.showLoader();
		//xxxx Stripe Card reader integration
		// Simulate waiting for some async process (e.g., API call)
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					paymentIntent: {
						id: "pi_1XYZ...",
						object: "payment_intent",
						amount: 5000,
						currency: "usd",
						status: "succeeded",
						charges: {
							data: [
								{
									id: "ch_1ABC...",
									object: "charge",
									amount: 5000,
									currency: "usd",
									status: "succeeded",
									payment_method_details: {
										card_present: {
											brand: "visa",
											last4: "1234",
											country: "US",
											emv_auth_data: "A1B2C3..."
										}
									},
									created: 1674839172
								}
							]
						},
						created: 1674839170
					}
				});
			}, 2000); // Simulating a delay (e.g., API response)
		});
	};
	
	parent.printBill = function () {
		const content = $('#billPrint').html();
		if (!content) {
			console.error("No content available to print.");
			return;
		}

		// Load the HTML template using jQuery
		$.get('../assets/templates/saleOrderBill.html', function (template) {
			if (!template) {
				console.error("Failed to load print template.");
				return;
			}

			// Open the print window
			const printWindow = window.open('', '_blank', 'width=800,height=600');
			printWindow.document.open();

			// Insert the content into the template
			const htmlContent = template.replace('{{content}}', content);

			// Write the template with the content into the print window
			printWindow.document.write(htmlContent);
			printWindow.document.close();
			printWindow.print();
			printWindow.onafterprint = () => printWindow.close();
		}).fail(function () {
			console.error("Error loading the HTML template.");
		});
	};

	parent.gotoOrders = function(){
		window.location = `saleOrders.php`;
	};
	
	parent.openInvoice = function(){
		window.open(PROJECTPATH + `saleOrderInvoice/` + ORDER.GUID, '_blank').focus();
	};
	
	parent.openCartonTag = function(){
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		window.open('orderCartonDataPrint.php?orderId=' + orderId, '_blank').focus();
	};
	
	parent.openMail = function(){
		window.open('mail.php?search=' + ORDER.orderCode, '_blank').focus();
	};
	
	parent.openCreditNote = function() {
		if (ORDEROBJ.length > 0) {
			const creditNoteItems = ORDEROBJ.map(order => `
				<div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 f14 noLeftPaddingOnly">
					<div class="creditNoteItem">
						<input type="checkbox" id="productCombination_${order.productCombinationId}" name="productCombination_${order.productCombinationId}" value="${order.productCombinationId}" class="marRig5">
						<span>${order.productTitle} [${order.productCode}] <span>[${order.productCombinationId}] - ${getQRTextHtml(order.productCombinationQR, order.productCode)}</span></span>
					</div>
				</div>
			`).join('');
			$('#creditNoteTableHolder').html(creditNoteItems);
			$('#creditNoteModal').modal('show');
		}
	};
	
	const generateOrderStatusLinks = function(currentOrderStatusId) {
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
        const currentStatus = ORDERSALESTATUSPRECOMPILEDDATA.find(
            status => status.orderStatusId === currentOrderStatusId
        );

        if (!currentStatus) {
            console.error("Invalid order status ID provided.");
            return "";
        }

        const redirectionIds = currentStatus.redirectionOrderStatusIds
            ? currentStatus.redirectionOrderStatusIds.split(",").map(Number)
            : [];

        const redirectionStatuses = ORDERSALESTATUSPRECOMPILEDDATA.filter(
            status => redirectionIds.includes(status.orderStatusId)
        );
		
        let linksHtml = "";
        redirectionStatuses.forEach(status => {
            linksHtml += `<li class="hover" onClick="saleOrderFunctionality.changeOrderStatus('${orderId}', ${status.orderStatusId})">
                        <a id="cms_${status.orderStatusCmsId}">${appCommonFunctionality.getCmsString(status.orderStatusCmsId)}</a>
                      </li>`;
        });
        return linksHtml;
    };
	
	parent.changeOrderStatus = function(orderId, orderStatusId){
		const queryString = `CHANGEORDERSTATUS&orderId=${orderId}&orderStatusId=${orderStatusId}`;
		appCommonFunctionality.ajaxCall(queryString, receiveChangeOrderStatusResponse);
	};
	
	const receiveChangeOrderStatusResponse = function(response){
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if(parseInt(orderId) > 0){
			window.location = `saleOrderDetails.php?orderId=` + orderId;
		}
	};
	
	parent.initSaleOrdersSplit = async function () {
        appCommonFunctionality.adjustMainContainerHight('saleOrderSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		COMPANYTYPEPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COMPANYTYPE'));
		ORDERSALESTATUSPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('ORDERSALESTATUS'));
		COUNTRYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('COUNTRY'));
		PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCTLIVESTOCK'));
		PRODUCTPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('PRODUCT'));
		BRANDPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('BRAND'));
		CATEGORYPRECOMPILEDDATA = JSON.parse(await appCommonFunctionality.readPrecompliedData('CATEGORY'));
		/*----------------------Getting Pre-Compiled Data---------------------------------*/
		
		const orderId = appCommonFunctionality.getUrlParameter('orderId');
		if (orderId) {
			$('#orderId').val(orderId);
			appCommonFunctionality.ajaxCall('ORDERDETAILS&orderId=' + orderId, receiveOrderDeatilsData);
		}
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

		if(!appCommonFunctionality.isMobile()){
			$('#addProductQRScannerCam').prop('disabled', true);
		}else{
			$('#searchCatSection').removeClass('noRightPaddingOnly').addClass('nopaddingOnly'); //for productSearchModal
		}
    };
	
	parent.transferToNewOrder = function(productCombinationId){
		if(parseInt(productCombinationId) > 0){
			let index = ORDEROBJ.findIndex(obj => obj.productCombinationId === productCombinationId);
			if(index !== -1){
				let transferredObject = ORDEROBJ.splice(index, 1)[0];
				NEWORDEROBJ.push(transferredObject);
				//console.log(`Transferred object with productCombinationId ${productCombinationId}`);
				saleOrderFunctionality.populateCart();
				saleOrderFunctionality.populateNewOrderCart();
			} else {
				//console.log(`No object found with productCombinationId ${productCombinationId}`);
			}
		}
	};
	
	parent.populateNewOrderCart = function() {
		let selectedCustomerGrade = $("#selectedCustomerGrade").val().toLowerCase();
		let groupedOrderObj = [];
		let countMap = {};

		// Group by productCombinationId and add qty field
		$.each(NEWORDEROBJ, function(index, item) {
			if (countMap[item.productCombinationId]) {
				countMap[item.productCombinationId].qty++;
			} else {
				countMap[item.productCombinationId] = { ...item, qty: 1 };
				groupedOrderObj.push(countMap[item.productCombinationId]);
			}
		});

		// Sort groupedOrderObj by productCombinationId
		groupedOrderObj.sort((a, b) => a.productCombinationId - b.productCombinationId);

		let totalPriceBeforeTax = 0.00;
		let tableRows = '';

		if (groupedOrderObj.length > 0) {
			tableRows += `
				<table class="w3-table w3-striped w3-bordered w3-hoverable w3-white roundedBorder">
					<tbody>
						<tr>
							<td width="75%" class="text-left"><b id="cms_329">Products</b></td>
							<td width="10%" class="text-right"><b>Qty</b></td>
							<td width="15%" class="text-right"><b id="cms_330">Price</b></td>
						</tr>
			`;

			$.each(groupedOrderObj, function(index, item) {
				let productPrice = selectedCustomerGrade === 'w' ? item.WPrice : item.RPrice;
				let groupTotal = (productPrice * item.qty);
				totalPriceBeforeTax += groupTotal;

				tableRows += `
					<tr>
						<td class="text-left">
							<div class="pull-left f12">
								<span>${item.productTitle} [${item.productCode}] ${appCommonFunctionality.getDefaultCurrency()} ${productPrice}</span><br>
								<span>[${item.productCombinationId}] - ${getQRTextHtml(item.productCombinationQR, item.productCode)}</span>
							</div>
							<div class="pull-left"></div>
						</td>
						<td class="text-right">
							<i class="fa fa-hand-o-left greenText marRig5 hover" onclick="saleOrderFunctionality.transferToExistingOrder(${item.productCombinationId})"></i>
							${item.qty}
						</td>
						<td class="text-right">
							<span>${appCommonFunctionality.getDefaultCurrency()}${groupTotal.toFixed(2)}</span>
						</td>
					</tr>
				`;
			});

			tableRows += '</tbody></table>';
		}

		let totalTax = totalPriceBeforeTax * DEFAULTTAX / 100;
		let totalPrice = totalPriceBeforeTax + totalTax;

		$('#newCartTableHolder').html(tableRows);
		$('#totalBeforeTaxNew').html(appCommonFunctionality.getDefaultCurrency() + totalPriceBeforeTax.toFixed(2));
		$("#taxPNew").html(DEFAULTTAX);
		$("#totalPriceNew").html(appCommonFunctionality.getDefaultCurrency() + totalPrice.toFixed(2));
		$('#totalCalcSectionNew').toggleClass('hide', groupedOrderObj.length === 0);
	};
	
	parent.transferToExistingOrder = function(productCombinationId){
		if(parseInt(productCombinationId) > 0){
			let index = NEWORDEROBJ.findIndex(obj => obj.productCombinationId === productCombinationId);
			if(index !== -1){
				let transferredObject = NEWORDEROBJ.splice(index, 1)[0];
				ORDEROBJ.push(transferredObject);
				//console.log(`Transferred object with productCombinationId ${productCombinationId}`);
				saleOrderFunctionality.populateCart();
				saleOrderFunctionality.populateNewOrderCart();
			} else {
				//console.log(`No object found with productCombinationId ${productCombinationId}`);
			}
		}
	};
	
	parent.splitOrder = function() {
		let errorCount = 0;
		const errorMsg = appCommonFunctionality.getCmsString(356);
		const lang = appCommonFunctionality.getLang();

		if (ORDEROBJ.length === 0 || NEWORDEROBJ.length === 0) {
			alert(errorMsg);
			appCommonFunctionality.textToAudio(errorMsg, lang);
			errorCount++;
		}

		if (errorCount === 0) {
			const qryStr = 'PLACEORDER';
			const selectedCustomerId = parseInt($("#selectedCustomerId").val());
			const selectedCustomerDeliveryAddressId = parseInt($("#selectedCustomerDeliveryAddressId").val());
			const deliveryDate = $('#deliveryDate').val();
			const deliveryDateNew = $('#deliveryDateNew').val();
			const orderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;

			const processOrder = (orderObj, totalPrice, deliveryDate) => {
				totalPrice = totalPrice.replace(appCommonFunctionality.getDefaultCurrency(), '');
				const callData = {
					orderId: orderObj === ORDEROBJ ? orderId : 0,
					parentOrderId: 0,
					customerId: selectedCustomerId,
					deliveryAddressId: selectedCustomerDeliveryAddressId,
					orderObj: window.btoa(encodeURI(JSON.stringify({ orderObj: JSON.stringify(orderObj), tax: orderObj === ORDEROBJ ? $('#taxP').text() : $('#taxPNew').text() }))),
					totalPrice: totalPrice,
					deliveryDate: deliveryDate
				};
				appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receiveOrderSplitResponse);
			};

			processOrder(ORDEROBJ, $('#totalPrice').text(), deliveryDate);
			processOrder(NEWORDEROBJ, $('#totalPriceNew').text(), deliveryDateNew);
		}
	};
	
	const receiveOrderSplitResponse = function(responseData){
		responseData = JSON.parse(responseData);
		const orderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		if(parseInt(responseData.responseCode) > parseInt(orderId)){
			saleOrderFunctionality.gotoOrderDetails(responseData.responseCode);
		}
	};
	
	parent.createCreditNote = function() {
		// Get the selected productCombinationId values
		const selectedCreditNoteCombinationArray = $('input[id^="productCombination_"]:checked')
			.map(function() {
				return this.value;
			})
			.get();

		// Clone matching orders and add CreditNote attribute
		const filteredOrderObj = selectedCreditNoteCombinationArray.map(selectedId => {
			const matchingOrder = ORDEROBJ.find(order => order.productCombinationId.toString() === selectedId);
			return matchingOrder ? { ...matchingOrder, creditNote: true } : null;
		}).filter(order => order);

		// Push the filteredOrderObj items into ORDEROBJ
		ORDEROBJ.push(...filteredOrderObj);

		// Sort ORDEROBJ by productCombinationId
		ORDEROBJ.sort((a, b) => a.productCombinationId - b.productCombinationId);

		// Get the selected customer grade
		const customerGrade = $('#selectedCustomerGrade').val();

		// Calculate the total price from ORDEROBJ based on customer grade
		const totalPrice = ORDEROBJ.reduce((acc, order) => {
			const price = customerGrade === 'R' ? order.RPrice : (customerGrade === 'W' ? order.WPrice : 0);
			return acc + price;
		}, 0);

		// Calculate the total price to subtract for CreditNote items
		const creditNoteTotalPrice = ORDEROBJ.reduce((acc, order) => {
			if (order.creditNote) {
				const price = customerGrade === 'R' ? order.RPrice : (customerGrade === 'W' ? order.WPrice : 0);
				return acc + price;
			}
			return acc;
		}, 0);

		// Calculate the final total price
		const finalTotalPrice = (totalPrice - (creditNoteTotalPrice * 2)) * (1 + (DEFAULTTAX / 100));

		// Prepare the order object for the request
		const orderObj = {
			orderObj: JSON.stringify(ORDEROBJ),
			tax: $('#taxP').text()
		};
		const orderId = appCommonFunctionality.getUrlParameter('orderId') || 0;
		const callData = {
			orderId: orderId,
			parentOrderId: 0,
			customerId: parseInt($("#selectedCustomerId").val(), 10),
			deliveryAddressId: parseInt($("#selectedCustomerDeliveryAddressId").val(), 10),
			orderObj: window.btoa(encodeURI(JSON.stringify(orderObj))),
			totalPrice: finalTotalPrice,
			deliveryDate: $('#deliveryDate').val()
		};

		// Make the AJAX call
		appCommonFunctionality.ajaxCallLargeData('PLACEORDER', callData, receivePlaceOrderResponse);
	};
	
    return parent;
}(window, window.$));