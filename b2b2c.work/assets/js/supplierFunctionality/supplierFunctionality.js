const PAGEDOCNAME = appCommonFunctionality.getPageName();
/*-----------------Commonly Used Variables--------------------------------*/
let PURCHASEORDER = {};
let PURCHASEORDEROBJ = [];
let PURCHASEORDERGUID = '';
let PURCHASEORDERPACKINGOBJ = [];
let DEFAULTTAX = 0;
let PURCHASEORDERCLAUSES = [];
let PURCHASEORDERTNC = '';
let	SUPPLIERDATA = {};
let	ADDITIONALDATA = {};
/*-----------------Commonly Used Variables--------------------------------*/

/*-----------------Pre-Compiled Variables---------------------------------*/
let COUNTRYPRECOMPILEDDATA = [];
let PACKAGEPRECOMPILEDDATA = [];
let ORDERPURCHASESTATUSPRECOMPILEDDATA = [];
/*-----------------Pre-Compiled Variables---------------------------------*/

$(document).ready(function () {
    switch (PAGEDOCNAME) {
		
        case "login.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=LANGUAGE')
			).done(function(languageResponse) {
				LANGUAGEPRECOMPILEDDATA = JSON.parse(languageResponse);
				const defaultLang = appCommonFunctionality.getDefaultLang();
				appCommonFunctionality.setLang(defaultLang[0].sign);
				appCommonFunctionality.hideLoader();
				supplierFunctionality.initLogin();
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "index.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=ORDERPURCHASESTATUS')
			).done(function(orderPurchaseStatusResponse) {
				appCommonFunctionality.hideLoader();
				supplierFunctionality.initIndex(orderPurchaseStatusResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "orderDetails.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=ORDERPURCHASESTATUS')
			).done(function(orderPurchaseStatusResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				supplierFunctionality.initOrderDetails(orderPurchaseStatusResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "orderPackingDetails.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=PACKAGE'),
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=ORDERPURCHASESTATUS')
			).done(function(packageResponse, orderPurchaseStatusResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				supplierFunctionality.initOrderPackingDetails(packageResponse[0], orderPurchaseStatusResponse[0]);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "orderCartonTag.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COUNTRY')
			).done(function(countryResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				supplierFunctionality.initOrderCatonTag(countryResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "profile.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=COUNTRY')
			).done(function(countryResponse) {
				// Both AJAX calls completed successfully
				appCommonFunctionality.hideLoader();
				supplierFunctionality.initProfile(countryResponse);
			}).fail(function() {
				// One or both AJAX calls failed
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
		case "logout.php":{
			supplierFunctionality.initLogout();
            break;
		}
		
    }
});

const supplierFunctionality = (function (window, $) {
    const parent = {};
	
	/*----------------------------------------Common Functions---------------------------------------------------*/
	const adjustBodySectionHeight = function(mainSectionId){
		var winH = $(window).height();
		var mainSectionH = winH - 52 - 62 - 16; /* Header  :: 52px ; Footer :: 62px; bottom 16px*/
		$("#" + mainSectionId).css("min-height", mainSectionH + "px");
	};
	
	const setLangToLangDDL = function(){
		$('#languageDDL').val(appCommonFunctionality.getLang());
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
	
	const getPurchaseOrderStatus = function(purchaseOrderStatusId) {
		if (typeof ORDERPURCHASESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA !== null && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA.length > 0) {
			const status = ORDERPURCHASESTATUSPRECOMPILEDDATA.find(item => item.purchaseOrderStatusId === purchaseOrderStatusId);
			return status ? `<b style="color:${status.color}">${status.purchaseOrderStatus}</b>` : "";
		}
		return "";
	};
	
	const getPurchaseOrderStatusId = function (purchaseOrderStatus) {
		if (typeof ORDERPURCHASESTATUSPRECOMPILEDDATA !== 'undefined' && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA !== null && 
			ORDERPURCHASESTATUSPRECOMPILEDDATA.length > 0) {
				const status = ORDERPURCHASESTATUSPRECOMPILEDDATA.find(item => item.purchaseOrderStatus === purchaseOrderStatus);
				return status ? status.purchaseOrderStatusId : 0;
		}
		return 0;
    };
	
	const getPPrice = function(productId, productCombinationId) {
		const product = PURCHASEORDEROBJ.find(item => 
			item.productId === productId && 
			item.productCombinationId === productCombinationId
		);
		if (!product) return null;
		const price = Number(product.PPrice);
		return price.toFixed(2);
	};
	/*----------------------------------------Common Functions---------------------------------------------------*/

	/*----------------------------------------Login Functionality------------------------------------------------*/
    parent.initLogin = function () {
		if ($("#CMSDATA").val().length > 0) {
			CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
		}
		if(appCommonFunctionality.isMobile()){
			$('#otpForm').addClass('spaceBetweenSection').removeClass('text-center');
		}
    };

    parent.checkSupplierEmail = function(){
        const supplierEmail = $('#supplierEmail').val();
		if (supplierEmail === "") {
			appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(591), true);
			$("#supplierEmail").focus();
		}else if(supplierEmail !== ""){
			var regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
			if (!regex.test(supplierEmail)){
				appCommonFunctionality.raiseValidation("supplierEmail", appCommonFunctionality.getCmsString(591), true);
				$("#supplierEmail").focus();
			}else{
				appCommonFunctionality.removeValidation("supplierEmail", "supplierEmail", true);
				appCommonFunctionality.ajaxCall('CHECKSUPPLIEREMAILEXISTS&supplierEmail=' + supplierEmail, responseCheckEmailAvilable, "POST", "", true, true);
			}
		}
    };
	
	const responseCheckEmailAvilable = function(response){
		response = JSON.parse(response);
		if(parseInt(response.responseCode) === 2){
			activateOTPScreen();
		}
	};
	
	const activateOTPScreen = function(){
		$('#supplierEmailSection').addClass('hide');
		$('#otpSection').removeClass('hide');
		const otpInputs = $('.otp-input');
		otpInputs.on('input', function() {
            if (this.value.length > 1) {
                this.value = this.value.slice(0, 1);
            }
            const nextInput = $(this).next('.otp-input');
            if (this.value.length === 1 && nextInput.length) {
                nextInput.focus();
				appCommonFunctionality.removeValidation(this.id, this.id, false);
            }
        });
        otpInputs.on('keydown', function(event) {
            if (event.key === 'Backspace' && this.value.length === 0) {
                const prevInput = $(this).prev('.otp-input');
                if (prevInput.length) {
                    prevInput.focus();
                }
            }
        });
        otpInputs.on('keyup', function(event) {
            if (event.key === 'Enter') {
                $('#otpBtn').click();
            }
        });
	};

    parent.checkSupplierOtp = function(){
        const supplierEmail = $('#supplierEmail').val();
        let otp = '';
        let allFilled = true;
        let lastEmptyInputId = '';
        $('.otp-input').each(function () {
            if ($(this).val() === '') {
                allFilled = false;
                lastEmptyInputId = $(this).attr('id');
            }else{
				appCommonFunctionality.removeValidation($(this).attr('id'), $(this).attr('id'), false);
			}
            otp += $(this).val();
        });
        if (!allFilled) {
            appCommonFunctionality.raiseValidation(lastEmptyInputId, '', false);
            $("#" + lastEmptyInputId).focus();
            return;
        }
        appCommonFunctionality.ajaxCall('VALIDATESUPPLIEROTP&supplierEmail=' + supplierEmail + "&otp=" + otp, responseSupplierOTPValidation, "POST", "", true, true);
    };
	
	const responseSupplierOTPValidation = function(response){
		response = JSON.parse(response);
		if(parseInt(response.responseCode) === 1){
			window.location = `index.php`;
		}else{
			$('#errorMsg').html(response.msg);
		}
	};
	/*----------------------------------------Login Functionality------------------------------------------------*/
	
	/*----------------------------------------Supplier Orders Functionality--------------------------------------*/
	parent.initIndex = async function (orderPurchaseStatusResponse) {
		if ($("#CMSDATA").val().length > 0) {
			CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
		}
		adjustBodySectionHeight('dashboardSection');
		setLangToLangDDL();
		if (orderPurchaseStatusResponse.length > 0) {
            ORDERPURCHASESTATUSPRECOMPILEDDATA = JSON.parse(orderPurchaseStatusResponse);
        }
		appCommonFunctionality.ajaxCall("PURCHASEORDERS", receivePurchaseOrdersResponse);
    };
	
	const receivePurchaseOrdersResponse = function(purchaseOrderResponse){
		PURCHASEORDEROBJ = JSON.parse(purchaseOrderResponse)?.msg || [];
		populatePurchaseOrderTable(PURCHASEORDEROBJ);
	};
	
	const populatePurchaseOrderTable = function (parsedData) {
		if (!parsedData.length) {
			$('#purchaseOrderTableHolder').html('<p>No Data.</p>');
			return;
		}
		const getSortIcon = (field, cmsId) => `
			<i class="fa fa-sort-amount-asc hover marRig5" onclick="supplierFunctionality.sortOrderTable('ASC', '${field}')"></i>
			<strong id="cms_${cmsId}">${appCommonFunctionality.getCmsString(cmsId)}</strong>
			<i class="fa fa-sort-amount-desc hover marleft5" onclick="supplierFunctionality.sortOrderTable('DESC', '${field}')"></i>
		`;
		const getActionIcons = (purchaseOrderId, orderStatus) => {
			return `
				<div class="spaceBetweenSection">
					<i class="fa fa-tv marleft5 blueText hover" onclick="supplierFunctionality.gotoPurchaseOrderDetails(${purchaseOrderId})"></i>
					<i class="fa fa-archive marleft5 greenText hover" onclick="supplierFunctionality.gotoPurchaseOrderPackingDetails(${purchaseOrderId})"></i>
				</div>
			`;
		};
		const purchaseOrderStatusId = getPurchaseOrderStatusId('APPROVED');
		const filteredData = parsedData.filter(purchaseOrder => purchaseOrder.status >= purchaseOrderStatusId);
		if (!filteredData.length) {
			$('#purchaseOrderTableHolder').html('<p>No Data.</p>');
			return;
		}
		const rows = filteredData.map(purchaseOrder => `
			<tr>
				<td>
					<a href="orderDetails.php?orderId=${purchaseOrder.purchaseOrderId}" class="blueText">${purchaseOrder.purchaseOrderCode}</a><br>
					<span class="f12">${appCommonFunctionality.getDefaultCurrency()} ${Number(purchaseOrder.totalPrice).toFixed(2)} </span>
				</td>
				<td>${purchaseOrder.supplierName} [${purchaseOrder.supplierContactPerson}]</td>
				<td>${getPurchaseOrderStatus(purchaseOrder.status)}</td>
				<td>${purchaseOrder.purchaseOrderCreateDate}</td>
				<td>${purchaseOrder.purchaseOrderDeliveryDate}</td>
				<td>${getActionIcons(purchaseOrder.purchaseOrderId, purchaseOrder.status)}</td>
			</tr>
		`).join('');
		const table = `
			<table class="table table-striped grayBorder minW1180">
				<tbody>
					<tr>
						<td width="10%">${getSortIcon('totalPrice', 602)}</td>
						<td width="40%"><strong id="cms_603">${appCommonFunctionality.getCmsString(603)}</strong></td>
						<td width="10%"><strong id="cms_604">${appCommonFunctionality.getCmsString(604)}</strong></td>
						<td width="15%">${getSortIcon('purchaseOrderCreateDate', 605)}</td>
						<td width="15%">${getSortIcon('purchaseOrderDeliveryDate', 606)}</td>
						<td width="10%" style="text-align:center;"><strong id="cms_607">${appCommonFunctionality.getCmsString(607)}</strong></td>
					</tr>
					${rows}
				</tbody>
			</table>
		`;
		$('#purchaseOrderTableHolder').html(table);
	};
	
	parent.sortOrderTable = function (purchaseOrder, field) {
        const orderData = PURCHASEORDEROBJ;
        orderData.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            if (!isNaN(valueA) && !isNaN(valueB)) {
                valueA = parseFloat(valueA);
                valueB = parseFloat(valueB);
            }
            if (purchaseOrder === "ASC") return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            if (purchaseOrder === "DESC") return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
        });
        populatePurchaseOrderTable(orderData);
    };
	
	parent.gotoPurchaseOrderDetails = function(orderId){
		window.location = `orderDetails.php?orderId=` + orderId;
	};
	
	parent.gotoPurchaseOrderPackingDetails = function(orderId){
		window.location = `orderPackingDetails.php?orderId=` + orderId;
	};
	/*----------------------------------------Supplier Orders Functionality--------------------------------------*/
	
	/*----------------------------------------Order Details Functionality----------------------------------------*/
	parent.initOrderDetails = async function (orderPurchaseStatusResponse) {
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		if(parseInt(purchaseOrderId) > 0){
			if ($("#CMSDATA").val().length > 0) {
				CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
				appCommonFunctionality.cmsImplementationThroughID();
				appCommonFunctionality.cmsImplementationThroughRel();
			}
			adjustBodySectionHeight('orderDetailSection');
			setLangToLangDDL();
			if (orderPurchaseStatusResponse.length > 0) {
				ORDERPURCHASESTATUSPRECOMPILEDDATA = JSON.parse(orderPurchaseStatusResponse);
			}
			appCommonFunctionality.ajaxCall("PURCHASEORDERDETAILS&purchaseOrderId=" + purchaseOrderId, receivePurchaseOrderDetailResponse);
		}
    };
	
	const receivePurchaseOrderDetailResponse = function(purchaseOrderDetailResponse){
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		PURCHASEORDER = JSON.parse(purchaseOrderDetailResponse)?.msg?.[0] || {};
		PURCHASEORDERGUID = PURCHASEORDER?.GUID;
		let str = '';
		
		/*---------------------------------------Populate Order Section 1-----------------------------------------*/
		str = str + '<div class="pull-left">';
			str = str + '<div class="f20">' + PURCHASEORDER?.purchaseOrderCode + ' - ' + getPurchaseOrderStatus(PURCHASEORDER?.status) + ' </div>';
			str = str + '<div id="totalPriceHeader"></div>';
			str = str + '<div class="f14"><b id="cms_610">' + appCommonFunctionality.getCmsString(610) + '</b>: ' + PURCHASEORDER?.purchaseOrderCreateDate + '</div>';
			str = str + '<div class="f14"><b id="cms_611">' + appCommonFunctionality.getCmsString(611) + '</b>: ' + PURCHASEORDER?.purchaseOrderDeliveryDate + '</div>';
			str = str + '<div><button id="markAsShippedBtn" type="button" class="btn-xs btn-success marTop5" onClick="supplierFunctionality.markedAsShipped()" rel="cms_682">' + appCommonFunctionality.getCmsString(682) + '</button></div>';
		str = str + '</div>';
		$('#orderSection1').html(str);
		const shippedStatusId = getPurchaseOrderStatusId('SHIPPED');
		if(parseInt(PURCHASEORDER?.status) >= parseInt(shippedStatusId)){
			$("#markAsShippedBtn").remove();
			$("#purchaseOrderPackingDetailsTab a").removeAttr("href");
		}
		/*---------------------------------------Populate Order Section 1-----------------------------------------*/
		
		/*---------------------------------------Populate Order Section 2-----------------------------------------*/
		const projectInformationData = JSON.parse($('#projectInformationData').val());
		const deliveryInformation = projectInformationData?.deliveryInformation;
		str = '';
		str = str + '<h4 id="cms_612">' + appCommonFunctionality.getCmsString(612) + '</h4>';
		str = str + '<div class="f14">' + deliveryInformation?.[0].store + ' [' + deliveryInformation?.[0].contactPerson + ']</div>';
		str = str + '<div class="f14"><i class="fa fa-phone blueText"></i> ' + deliveryInformation?.[0].phone + ' | <i class="fa fa-envelope blueText"></i> ' + deliveryInformation?.[0].email + '</div>';
		str = str + '<div class="f14"><b id="cms_613">' + appCommonFunctionality.getCmsString(613) + '</b>: ' + deliveryInformation?.[0].address + ' | <b id="cms_614">' + appCommonFunctionality.getCmsString(614) + '</b>: ' + deliveryInformation?.[0].town + '</div>';
		str = str + '<div class="f14"><b>Postcode</b>: ' + deliveryInformation?.[0].postCode + ' | <b id="cms_615">' + appCommonFunctionality.getCmsString(615) + '</b>: ' + deliveryInformation?.[0].country + '</div>';
		$('#orderSection2').html(str);
		/*---------------------------------------Populate Order Section 2-----------------------------------------*/
		
		/*---------------------------------------Populate Order Cart Table----------------------------------------*/
		if (PURCHASEORDER?.purchasePackingObj) {
			const decodedPurchaseOrderPackingObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER.purchasePackingObj)));
			if (Array.isArray(decodedPurchaseOrderPackingObj) && decodedPurchaseOrderPackingObj.length) {
				PURCHASEORDERPACKINGOBJ = decodedPurchaseOrderPackingObj;
			}
		}
		
		if (PURCHASEORDER?.purchaseOrderObj) {
			const decodedPurchaseOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchaseOrderObj)));
			const finalPurchaseOrderObj = JSON.parse(decodedPurchaseOrderObj?.purchaseOrderObj || "[]");
			if (Array.isArray(finalPurchaseOrderObj) && finalPurchaseOrderObj.length) {
				PURCHASEORDEROBJ = finalPurchaseOrderObj;
				supplierFunctionality.populateCart();
				supplierFunctionality.populatePaymentInformations();
			}
		}
		/*---------------------------------------Populate Order Cart Table----------------------------------------*/
		
		/*---------------------------------------Populate Order Clause & TnC--------------------------------------*/
		if (PURCHASEORDER?.additionalData) {
			const decodedPurchaseOrderAdditionalData = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.additionalData)));
			const finalPurchaseOrderClausesObj = decodedPurchaseOrderAdditionalData?.clauses || "[]";
			if (Array.isArray(finalPurchaseOrderClausesObj) && finalPurchaseOrderClausesObj.length) {
				PURCHASEORDERCLAUSES = finalPurchaseOrderClausesObj;
				supplierFunctionality.populateClauses();
			}
			PURCHASEORDERTNC = decodedPurchaseOrderAdditionalData?.tnc || "";
			supplierFunctionality.populateTnC();
		}
		/*---------------------------------------Populate Order Clause & TnC--------------------------------------*/
		
		if(appCommonFunctionality.isMobile()){
			$('#orderSection3').addClass('nopaddingOnly').removeClass('noLeftPaddingOnly');
		}
	};
	
	const getPurchaseOrderSummary = function() {
		const summaryMap = {};
		let hasDebitNote = false;

		// Helper function to initialize a product entry
		const initializeProductEntry = (item, isDebitNote = false) => ({
			productId: item.productId,
			productTitle: item.productTitle,
			productCode: item.productCode,
			PPrice: item.PPrice,
			productCombinationId: item.productCombinationId,
			productCombinationQR: item.productCombinationQR,
			qty: 0,
			...(isDebitNote && { debitNote: true })
		});

		// Populate the summary map
		PURCHASEORDEROBJ.forEach(item => {
			const baseKey = `${item.productId}-${item.productCombinationId}`;
			const normalKey = `${baseKey}-normal`;
			const debitKey = `${baseKey}-debitNote`;

			if (item.debitNote) {
				hasDebitNote = true;
			}

			// Aggregate all items first (regardless of debitNote status)
			if (!summaryMap[normalKey]) {
				summaryMap[normalKey] = initializeProductEntry(item);
			}
			summaryMap[normalKey].qty += 1;

			// Separate debitNote items
			if (item.debitNote) {
				if (!summaryMap[debitKey]) {
					summaryMap[debitKey] = initializeProductEntry(item, true);
				}
				summaryMap[debitKey].qty += 1;
			}
		});

		// Convert the summary map to an array
		const purchaseOrderCartData = Object.values(summaryMap);

		// Calculate total before tax
		const totalBeforeTax = purchaseOrderCartData.reduce((total, item) => {
			return total + (item.PPrice * item.qty * (item.debitNote ? -1 : 1));
		}, 0);

		// Calculate packing cost
		const packingCost = PURCHASEORDERPACKINGOBJ.reduce((total, packet) => total + packet.price, 0);

		// Calculate total
		const total = totalBeforeTax + packingCost;
		const totalWithTax = total + (total * DEFAULTTAX / 100);

		return {
			purchaseOrderCartData,
			totalBeforeTax,
			packingCost,
			tax: DEFAULTTAX,
			total: totalWithTax,
			hasDebitNote
		};
	};
	
	parent.populateCart = function () {
		let displayOrderArr = [];
		const purchaseOrderData = getPurchaseOrderSummary();
		displayOrderArr = purchaseOrderData.purchaseOrderCartData;
		let str = `<table class="table table-striped grayBorder"><tbody><tr><td width="75%" class="text-left"><b id="cms_624">${appCommonFunctionality.getCmsString(624)}</b></td><td width="10%" class="text-right"><b>Qty</b></td><td width="15%" class="text-right"><b id="cms_625">${appCommonFunctionality.getCmsString(625)}</b></td></tr>`;
        if (displayOrderArr.length > 0) {
            displayOrderArr.forEach(item => {
				let rowBgClass = '';
				if(item.debitNote){
					rowBgClass = 'bgLightRed';
				}
				const effectivePrice = item.PPrice;
				const offerText = appCommonFunctionality.getDefaultCurrency() + effectivePrice.toFixed(2);;
				let QRTextHtml = getQRTextHtml(item.productCombinationQR, item.productCode);
				let qtyInputHTML = ``;
				if(item.debitNote){
					qtyInputHTML = `-${item.qty}`;
				}else{
					qtyInputHTML = `${item.qty}`;
				}
				if(item.debitNote){
					str += `<tr class="${rowBgClass}">
								<td class="text-left">
									<div class="pull-left f12">
										<span>${item.productTitle} [${item.productCode}] ${offerText}</span><i class="fa fa-edit hover greetText marLeft5" onclick="supplierFunctionality.editPPriceModal(${item.productId},${item.productCombinationId})"></i><br>
										<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
									</div>
								</td>
								<td class="text-right">${qtyInputHTML}</td>
								<td class="text-right">
									<span> - ${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
								</td>
							</tr>`;
					totalBeforeTax = totalBeforeTax - (effectivePrice * item.qty);
				}else{
					str += `<tr class="${rowBgClass}">
								<td class="text-left">
									<div class="pull-left f12">
										<span>${item.productTitle} [${item.productCode}] ${offerText}</span><i class="fa fa-edit hover greetText marLeft5" onclick="supplierFunctionality.editPPriceModal(${item.productId},${item.productCombinationId})"></i><br>
										<span>[${item.productCombinationId}] - ${QRTextHtml}</span>
									</div>
								</td>
								<td class="text-right">${qtyInputHTML}</td>
								<td class="text-right">
									<span>${appCommonFunctionality.getDefaultCurrency()}${(effectivePrice * item.qty).toFixed(2)}</span>
								</td>
							</tr>`;
					totalBeforeTax += effectivePrice * item.qty;
				}
            });
        } else {
            str += '<tr><td colspan="3">No Data</td></tr>';
        }
        str += '</tbody></table>';
        $("#cartTableHolder").html(str).addClass('scrollX');
		if (displayOrderArr.length > 0) {
			$("#totalCalcSection, #clauseSection, #tncSection, #signSection").removeClass('hide');
			$("#totalBeforeTax").html(appCommonFunctionality.getDefaultCurrency() + purchaseOrderData.totalBeforeTax.toFixed(2));
			$("#packingCost").html(appCommonFunctionality.getDefaultCurrency() + purchaseOrderData.packingCost.toFixed(2));
			$("#taxP").html(purchaseOrderData.tax.toFixed(2));
			$("#totalPrice, #totalPriceHeader").html(appCommonFunctionality.getDefaultCurrency() + purchaseOrderData.total.toFixed(2));
			if(purchaseOrderData.hasDebitNote){
				$('#debitNote').html('<span id="cms_626">' + appCommonFunctionality.getCmsString(626) + '</span> : <a href="' + PROJECTPATH + 'debitNote/' + PURCHASEORDER?.GUID + '" target="_blank"><i class="fa fa-file-text redText"></i></a>');
			}
		}else{
			$("#totalCalcSection, #clauseSection, #tncSection, #signSection").addClass('hide');
			$("#totalBeforeTax").html('');
			$("#packingCost").html('');
			$("#taxP").html('');
			$("#totalPrice, #totalPricef14").html('');
		}
	};
	
	parent.editPPriceModal = function(productId, productCombinationId){
		$('#productId').val(productId);
		$('#productCombinationId').val(productCombinationId);
		$('#alteredProductPrice').val(getPPrice(productId, productCombinationId));
		$('#editPPriceModal').modal('show');
	};
	
	parent.saveAlteredProductPrice = function() {
		const productId = Number($('#productId').val());
		const productCombinationId = Number($('#productCombinationId').val());
		const newPrice = Number($('#alteredProductPrice').val());
		if (!productId || !productCombinationId || isNaN(newPrice) || newPrice <= 0) {
			return;
		}
		let updated = false;
		PURCHASEORDEROBJ = PURCHASEORDEROBJ.map(item => {
			if (item.productId === productId && item.productCombinationId === productCombinationId) {
				updated = true;
				return { ...item, PPrice: newPrice };
			}
			return item;
		});
		$('#editPPriceModal').modal('hide');
		parent.populateCart();
		updateAlteredPPrice();
	};
	
	parent.populatePaymentInformations = function(){
		if (PURCHASEORDER?.paymentInformation) {
			try {
				PAYMENTOBJ = PURCHASEORDER?.paymentInformation;
				let partlyPaidTotalAmount = 0.00;
				let str = '';
				for(let i = 0; i < PAYMENTOBJ.length; i++){
					str = str + PAYMENTOBJ[i].financeDate + ' : ' + appCommonFunctionality.getDefaultCurrency() + PAYMENTOBJ[i].amount + ' [' + PAYMENTOBJ[i].paymentMode + ']<br/>';
					partlyPaidTotalAmount = partlyPaidTotalAmount + parseFloat(PAYMENTOBJ[i].amount);
				}
				$("#purchaseOrderPaymentInfo").html(str);
			} catch (error) {
				console.error("Failed to parse order object:", error);
			}
		}else{
			$("#purchaseOrderPaymentInfo").html('N/A');
		}
	};
	
	parent.populateClauses = function () {
		const clausesHtml = PURCHASEORDERCLAUSES.map((clause, i) => `
			<div class="clauseItem">
				<span class="f12"><i class="fa fa-star marRight5"></i>${clause}</span>
			</div>
		`).join('');
		$('#clauseHolder').html(clausesHtml);
	};
	
	parent.populateTnC = function () {
		$('#tncHTML').html(PURCHASEORDERTNC);
	};
	
	const updateAlteredPPrice = function(){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') || 0;
		const qryStr = 'PLACEPURCHASEORDER';
		const purchaseOrderData = getPurchaseOrderSummary();
		const totalPrice = purchaseOrderData.total;
		const purchaseOrderObj = {
			purchaseOrderObj: JSON.stringify(PURCHASEORDEROBJ),
			tax: DEFAULTTAX
		};
		const callData = {
			purchaseOrderId: purchaseOrderId,
			parentPurchaseOrderId: 0,
			supplierId: parseInt(PURCHASEORDER?.supplierId),
			purchaseOrderObj: window.btoa(encodeURI(JSON.stringify(purchaseOrderObj))),
			communicationObj : PURCHASEORDER?.communicationObj,
			purchasePackingObj : PURCHASEORDER?.purchasePackingObj,
			totalPrice: totalPrice,
			additionalData : PURCHASEORDER?.additionalData,
			purchaseOrderDeliveryDate: PURCHASEORDER.purchaseOrderDeliveryDate
		};
		appCommonFunctionality.ajaxCallLargeData(qryStr, callData, function(response){appCommonFunctionality.reloadPage();});
	};
	/*----------------------------------------Order Details Functionality----------------------------------------*/
	
	/*----------------------------------------Order Packing Functionality----------------------------------------*/
	parent.initOrderPackingDetails = async function (packageResponse, orderPurchaseStatusResponse){
		PACKAGEPRECOMPILEDDATA = JSON.parse(packageResponse);
		ORDERPURCHASESTATUSPRECOMPILEDDATA = JSON.parse(orderPurchaseStatusResponse);
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		if(parseInt(purchaseOrderId) > 0){
			if ($("#CMSDATA").val().length > 0) {
				CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
				appCommonFunctionality.cmsImplementationThroughID();
				appCommonFunctionality.cmsImplementationThroughRel();
			}
			adjustBodySectionHeight('orderPackingDetailSection');
			setLangToLangDDL();
			appCommonFunctionality.ajaxCall("PURCHASEORDERDETAILS&purchaseOrderId=" + purchaseOrderId, receivePurchaseOrderPackingDetailResponse);
			populatePackageList();
		}
	};
	
	const receivePurchaseOrderPackingDetailResponse = function(purchaseOrderDetailResponse){
		DEFAULTTAX = appCommonFunctionality.getDefaultData('TAX');
		PURCHASEORDER = JSON.parse(purchaseOrderDetailResponse)?.msg?.[0] || {};
		PURCHASEORDERGUID = PURCHASEORDER?.GUID;
		
		const decodedPurchaseOrderObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchaseOrderObj)));
		const finalPurchaseOrderObj = JSON.parse(decodedPurchaseOrderObj?.purchaseOrderObj || "[]");
		if (Array.isArray(finalPurchaseOrderObj) && finalPurchaseOrderObj.length) {
			PURCHASEORDEROBJ = finalPurchaseOrderObj;
			populateProductItemCarton();
		}
		
		if (PURCHASEORDER?.purchasePackingObj) {
			const decodedPurchaseOrderPackingObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER.purchasePackingObj)));
			if (Array.isArray(decodedPurchaseOrderPackingObj) && decodedPurchaseOrderPackingObj.length) {
				PURCHASEORDERPACKINGOBJ = decodedPurchaseOrderPackingObj;
				supplierFunctionality.populatePackages();
			}
		}
		
	};
	
	const populatePackageList = function () {
		let str = '<option value="0" id="cms_658">-Select Package-</option>';
		PACKAGEPRECOMPILEDDATA.forEach(package => {
			str += `<option value="${package.packetId}">${package.packetNumber}-${package.packetName}</option>`;
		});
		$('#packageList').html(str);
	};
	
	parent.changePackageList = function () {
		const selectedPacket = parseInt($('#packageList').val());
		let str = '<option value="" id="cms_659">-Select Package Dimension-</option>';
		if (selectedPacket > 0) {
			const selectedPackage = PACKAGEPRECOMPILEDDATA.find(package => package.packetId === selectedPacket);
			if (selectedPackage && selectedPackage.dimention) {
				selectedPackage.dimention.forEach(dimension => {
					str += `<option value="${dimension.width}x${dimension.height}x${dimension.length}">${dimension.width}cm x ${dimension.height}cm x ${dimension.length}cm</option>`;
				});
			}
		}
		$('#packageDimention').html(str);
	};

	parent.changePackageDimention = function () {
		const packageList = parseInt($('#packageList').val());
		const packageDimention = $('#packageDimention').val();
		if (packageList > 0 && packageDimention) {
			const [width, height, length] = packageDimention.split('x').map(Number);
			const selectedPackage = PACKAGEPRECOMPILEDDATA.find(package => parseInt(package.packetId) === packageList);
			const packetType = selectedPackage ? `${selectedPackage.packetNumber}-${selectedPackage.packetName}` : '';
			const packet = {
				packetNumber: PURCHASEORDERPACKINGOBJ.length + 1,
				packetType: packetType,
				width: width,
				height: height,
				length: length,
				weight: 0,
				weightUnit: '',
				price: 0.00,
				trackingNo: '',
				items : []
			};
			PURCHASEORDERPACKINGOBJ.push(packet);
			$('#populatePackageBtn').removeAttr('disabled');
		}
	};
	
	parent.populatePackages = function () {
		let str = '';
		if (PURCHASEORDERPACKINGOBJ.length > 0) {
			PURCHASEORDERPACKINGOBJ.forEach(packet => {
				str += `
					<div class="col-lg-2 col-md-6 col-sm-6 col-xs-6 noLeftPaddingOnly marTop5">
						<div class="cartonDiv3 marBot5">
							<span class="glyphicon glyphicon-remove removeCartonBtn redText hover" onclick="supplierFunctionality.removePackage(${packet.packetNumber});"></span>
							<h4 class="text-center"><b id="cms_663">Packet</b> <b>${packet.packetNumber}</b></h4>
							<div class="text-center f12">${packet.packetType}</div>
							<div class="text-center"><img src="${PROJECTPATH}assets/images/carton.png"></div>
							<div class="text-center blueText hover" onclick="supplierFunctionality.openPackagesWithInModal(${packet.packetNumber});">
								<span class="glyphicon glyphicon-search"></span>
								<span id="cms_664">View inside</span>
							</div>
							<div class="text-center marTop5">
								<span id="cms_665">Dimension in: </span> cm
							</div>
							<div class="input-group marTop5">
								<span id="Width_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_666">Width :</span> 
								</span>
								<input id="width_${packet.packetNumber}" name="width_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Width" rel="cms_669" autocomplete="off" value="${packet.width}" onfocusout="supplierFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="height_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_667">Height: </span>
								</span>
								<input id="height_${packet.packetNumber}" name="height_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Height" rel="cms_670" autocomplete="off" value="${packet.height}" onfocusout="supplierFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="length_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_668">Length :</span>
								</span>
								<input id="length_${packet.packetNumber}" name="length_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Length" rel="cms_671" autocomplete="off" value="${packet.length}" onfocusout="supplierFunctionality.savePackageData()">
							</div>
							<div class="text-center marTop5">
								<span id="cms_672">Weight in : </span>
								<select name="weightUnit_${packet.packetNumber}" id="weightUnit_${packet.packetNumber}" onchange="supplierFunctionality.savePackageData()">
									<option value="Gram" ${packet.weightUnit === 'Gram' ? 'selected' : ''}>Grams</option>
									<option value="KG" ${packet.weightUnit === 'KG' ? 'selected' : ''}>KGs</option>
									<option value="Pound" ${packet.weightUnit === 'Pound' ? 'selected' : ''}>Pounds</option>
								</select>
							</div>
							<div class="input-group marTop5">
								<span id="weight_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_673">Weight :</span>
								</span>
								<input id="weight_${packet.packetNumber}" name="weight_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Weight" rel="cms_674" autocomplete="off" value="${packet.weight}" onfocusout="supplierFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="price_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_675">Price : </span> <span>${appCommonFunctionality.getDefaultCurrency()}</span>
								</span>
								<input id="price_${packet.packetNumber}" name="price_${packet.packetNumber}" type="number" class="form-control" placeholder="Enter Price" rel="cms_676" autocomplete="off" value="${packet.price}" onfocusout="supplierFunctionality.savePackageData()">
							</div>
							<div class="input-group marTop5">
								<span id="trackingNumber_${packet.packetNumber}_Span" class="input-group-addon">
									<span id="cms_677">Tracking :</span>
								</span>
								<input id="trackingNumber_${packet.packetNumber}" name="trackingNumber_${packet.packetNumber}" type="text" class="form-control" placeholder="Tracking No" rel="cms_678" autocomplete="off" value="${packet.trackingNo}" onfocusout="supplierFunctionality.savePackageData()">
							</div>
						</div>
					</div>
				`;
			});
		}
		$('#packageDetailsHolder').html(str);
		$('#packageList, #packageDimention').prop('selectedIndex', 0);
		$('#populatePackageBtn').attr("disabled", "true");
		populateProductItemCarton();
		appCommonFunctionality.cmsImplementationThroughID();
		appCommonFunctionality.cmsImplementationThroughRel();
	};
	
	parent.removePackage = function (packetNumber) {
		PURCHASEORDERPACKINGOBJ = PURCHASEORDERPACKINGOBJ.filter(packet => packet.packetNumber !== packetNumber);
		parent.populatePackages();
	};

	parent.openPackagesWithInModal = function (packetNumber) {
		const packageObject = PURCHASEORDERPACKINGOBJ.find(packet => packet.packetNumber === packetNumber);
		$('#saleOrderPacketHeader').html(`<span id="cms_663">Packet</span>${packetNumber} [${packageObject.packetType}]`);
		const displayOrderArr = getDisplayOrderArr(packageObject.items);
		let str = `
			<table class="table table-striped grayBorder">
				<tbody>
					<tr>
						<td width="100%" class="text-center"><b id="cms_624">${appCommonFunctionality.getCmsString(624)}</b></td>
					</tr>
					${displayOrderArr.map(item => `
					<tr>
						<td class="text-left">
							<div class="pull-left">
								<span>[${item.productCombinationId}] ${item.productTitle} [${item.productId}]</span><br>
							</div>
							<div class="pull-right">X ${item.qty} <i class="fa fa-trash-o redText marleft5 hover" onclick="supplierFunctionality.removeFromCarton(${packetNumber}, ${item.productCombinationId})"></i></div>
						</td>
					</tr>`).join('')}
				</tbody>
			</table>`;
		$('#saleOrderPacketTableHolder').html(str);
		$("#saleOrderPacketModal").modal('show');
	};
	
	parent.removeFromCarton = function(packetNumber, productCombinationId){
		if (PURCHASEORDERPACKINGOBJ || Array.isArray(PURCHASEORDERPACKINGOBJ)) {
			const packet = PURCHASEORDERPACKINGOBJ.find(p => p.packetNumber === packetNumber);
			if (packet) {
				const originalLength = packet.items.length;
				packet.items = packet.items.filter(item => item.productCombinationId !== productCombinationId);
			}
		}
		$("#saleOrderPacketModal").modal('hide');
		parent.populatePackages();
	};

	parent.savePackageData = function () {
		function updatePurchaseOrderPacking(selector, property, parseFunc) {
			$(selector).each(function () {
				let idArr = this.id.split('_');
				let packetNumber = parseInt(idArr[1]);
				const packet = PURCHASEORDERPACKINGOBJ.find(packet => packet.packetNumber === packetNumber);
				if (packet) {
					packet[property] = parseFunc(this.value);
				}
			});
		}

		updatePurchaseOrderPacking('input[id^="width_"]', 'width', parseFloat);
		updatePurchaseOrderPacking('input[id^="height_"]', 'height', parseFloat);
		updatePurchaseOrderPacking('input[id^="length_"]', 'length', parseFloat);
		updatePurchaseOrderPacking('select[id^="weightUnit_"]', 'weightUnit', String);
		updatePurchaseOrderPacking('input[id^="weight_"]', 'weight', parseFloat);
		updatePurchaseOrderPacking('input[id^="price_"]', 'price', parseFloat);
		updatePurchaseOrderPacking('input[id^="trackingNumber_"]', 'trackingNo', String);
	};

	const populateProductItemCarton = function () {
		const displayOrderArr = filterOrderItems();
		if (displayOrderArr.length > 0) {
			let str = '';
			if (displayOrderArr.length > 0) {
				str += `
					<table class="table table-striped grayBorder minW1180">
						<tbody>
							<tr>
								<td width="75%" class="text-left"><b id="cms_624">${appCommonFunctionality.getCmsString(624)}</b></td>
								<td width="10%" class="text-center"><b id="cms_679">${appCommonFunctionality.getCmsString(679)}</b></td>
								<td width="15%" class="text-right"><b id="cms_680">${appCommonFunctionality.getCmsString(680)}</b></td>
							</tr>`;
				displayOrderArr.forEach(order => {
					str += `
						<tr>
							<td class="text-left">
								<div class="pull-left f16">
									<span>[${order.productCombinationId}] ${order.productTitle} [${order.productCode}]</span>
									<span>X ${order.qty}</span>
								</div>
							</td>
							<td class="text-center">
								<input type="number" id="assignQty_${order.productCombinationId}" name="assignQty_${order.productCombinationId}" value="${order.qty}" class="orderPackingAsignInput f20" min="1" max="${order.qty}">
							</td>
							<td class="text-right">
								${bindCartonList(order.productCombinationId)}
							</td>
						</tr>`;
				});
				str += `
						</tbody>
					</table>`;
			}
			$('#orderItemsHolder').html(str);
			$("#markAsShippedBtn").attr("disabled", "disabled");
		}else{
			$('#orderItemsHolder').html('<div class="text-center greenText" id="cms_683">' + appCommonFunctionality.getCmsString(683) + '</div>');
			$('#markAsShippedBtn').removeAttr("disabled");
		}
	};
	
	const filterOrderItems = function(){
		let displayOrderArr = [];
		let packingItems = [];
		PURCHASEORDERPACKINGOBJ.forEach(packet => {
			packingItems = packingItems.concat(packet.items);
		});
		let packingItemsCount = {};
		packingItems.forEach(item => {
			if (packingItemsCount[item.productCombinationId]) {
				packingItemsCount[item.productCombinationId]++;
			} else {
				packingItemsCount[item.productCombinationId] = 1;
			}
		});
		displayOrderArr = PURCHASEORDEROBJ.filter(orderItem => {
			if (orderItem.creditNote === true) {
				return false;
			}
			if (packingItemsCount[orderItem.productCombinationId]) {
				packingItemsCount[orderItem.productCombinationId]--;
				if (packingItemsCount[orderItem.productCombinationId] < 0) {
					return true;
				}
				return false;
			}
			return true;
		});
		displayOrderArr = getDisplayOrderArr(displayOrderArr);
		return displayOrderArr;
	};
	
	const getDisplayOrderArr = function(filteredOrderItems) {
		const displayOrderArr = [];
		const orderMap = new Map();
		filteredOrderItems.forEach(order => {
			const productId = parseInt(order.productId);
			const productCombinationId = parseInt(order.productCombinationId);
			const key = `${productId}-${productCombinationId}`;
			
			if (orderMap.has(key)) {
				const existingOrder = orderMap.get(key);
				if (!order.creditNote) {
					existingOrder.qty += 1;
				}
			} else {
				if (!order.creditNote) {
					orderMap.set(key, { ...order, qty: 1 });
				}
			}
		});
		displayOrderArr.push(...orderMap.values());
		return displayOrderArr;
	};

	const bindCartonList = function (productCombinationId) {
		let str = '<select id="cartonList_' + productCombinationId + '" name="cartonList_' + productCombinationId + '" class="ddlStyle pull-right" onchange="supplierFunctionality.savePackageData()">';
		str += '<option value="0" id="cms_681">' + appCommonFunctionality.getCmsString(681) + '</option>';
		PURCHASEORDERPACKINGOBJ.forEach(packet => {
			str += `<option value="${packet.packetNumber}">Packet ${packet.packetNumber} [${packet.packetType}]</option>`;
		});
		str += '</select>';
		return str;
	};
	
	parent.savePackingDetails = function(){
		if(packingDetailsValidation()){
			const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') || 0;
			
			$('select[id^="cartonList_"]').each(function () {
				const packetNumber = parseInt(this.value);
				if(packetNumber > 0){
					let idArr = this.id.split('_');
					const productCombinationId = parseInt(idArr[1]);
					const assignQty = parseInt($('#assignQty_' + productCombinationId).val());
					const orderItems = PURCHASEORDEROBJ.filter(item => item.productCombinationId === productCombinationId && item.creditNote !== true).slice(0, assignQty);
					for (let i = 0; i < PURCHASEORDERPACKINGOBJ.length; i++) {
						if (parseInt(PURCHASEORDERPACKINGOBJ[i].packetNumber) === parseInt(packetNumber)) {
							// Merge all orderItems arrays and push them to PURCHASEORDERPACKINGOBJ[i].items
							PURCHASEORDERPACKINGOBJ[i].items = PURCHASEORDERPACKINGOBJ[i].items.concat(orderItems);
						}
					}
				}
			});
			
			/*--------------------------------------Saving Purchase Order Status 'PACKING'-------------------------*/
			const purchaseOrderStatusId = getPurchaseOrderStatusId('PACKING');
			const queryString = `CHANGEPURCHASEORDERSTATUS&purchaseOrderId=${purchaseOrderId}&purchaseOrderStatusId=${purchaseOrderStatusId}`;
			appCommonFunctionality.ajaxCall(queryString, function(response){});
			/*--------------------------------------Saving Purchase Order Status 'PACKING'-------------------------*/
			
			/*--------------------------------------Saving Purchase Order------------------------------------------*/
			const qryStr = 'PLACEPURCHASEORDER';
			const purchaseOrderData = getPurchaseOrderSummary();
			let totalPrice = purchaseOrderData.total;
			const callData = {
				purchaseOrderId: purchaseOrderId,
				parentPurchaseOrderId: 0,
				supplierId: parseInt(PURCHASEORDER?.supplierId),
				purchaseOrderObj: PURCHASEORDER?.purchaseOrderObj,
				communicationObj : PURCHASEORDER?.communicationObj,
				purchasePackingObj : window.btoa(encodeURI(JSON.stringify(PURCHASEORDERPACKINGOBJ))),
				totalPrice: totalPrice,
				additionalData : PURCHASEORDER?.additionalData,
				purchaseOrderDeliveryDate: PURCHASEORDER.purchaseOrderDeliveryDate
			};
			appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receiveOrderPackingResponse);
			/*--------------------------------------Saving Purchase Order------------------------------------------*/
		}
	};
	
	parent.markedAsShipped = function(){
		appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(684), appCommonFunctionality.getLang());
		if (confirm(appCommonFunctionality.getCmsString(684)) == true) {
			const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
			const purchaseOrderStatusId = getPurchaseOrderStatusId('SHIPPED');
			const queryString = `CHANGEPURCHASEORDERSTATUS&purchaseOrderId=${purchaseOrderId}&purchaseOrderStatusId=${purchaseOrderStatusId}`;
			appCommonFunctionality.ajaxCall(queryString, receiveOrderMarkedAsShippedResponse);
		}
	};
	
	const receiveOrderMarkedAsShippedResponse = function(response){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		supplierFunctionality.gotoPurchaseOrderDetails(purchaseOrderId);
	};
	
	const packingDetailsValidation = function(){
		var errorCount = 0;
		
		/*-------------------------------------Assign Quantity Validation-----------------------------------*/
		$('input[id^=assignQty_]').each(function() {
			if(this.value === ''){
				appCommonFunctionality.raiseValidation(this.id, "", false);
				errorCount++;
			}else if(parseInt(this.value) === 0){
				appCommonFunctionality.raiseValidation(this.id, "", false);
				errorCount++;
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*-------------------------------------Assign Quantity Validation-----------------------------------*/
		
		/*-------------------------------------Packet List Validation---------------------------------------*/
		$('select[id^=cartonList_]').each(function() {
			if(parseInt(this.value) === 0){
				appCommonFunctionality.raiseValidation(this.id, "", false);
				errorCount++;
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*-------------------------------------Packet List Validation---------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	const receiveOrderPackingResponse = function(response){
		response = JSON.parse(response);
		if(parseInt(response.responseCode) > 0){
			window.location = `orderPackingDetails.php?orderId=` + parseInt(response.responseCode);
		}
	};
	
	parent.openCartonTag = function(){
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		window.open(`orderCartonTag.php?orderId=` + parseInt(purchaseOrderId), '_blank');
	};
	
	parent.initOrderCatonTag = async function (countryResponse){
		COUNTRYPRECOMPILEDDATA = JSON.parse(countryResponse);
		const purchaseOrderId = appCommonFunctionality.getUrlParameter('orderId') ?? 0;
		if(parseInt(purchaseOrderId) > 0){
			adjustBodySectionHeight('orderPackingDetailSection');
			setLangToLangDDL();
			appCommonFunctionality.ajaxCall("PURCHASEORDERDETAILS&purchaseOrderId=" + purchaseOrderId, receivePurchaseOrderCartonTagResponse);
		}
	};
	
	const receivePurchaseOrderCartonTagResponse = function(purchaseOrderDetailResponse){
		PURCHASEORDER = JSON.parse(purchaseOrderDetailResponse)?.msg?.[0] || {};
		PURCHASEORDERGUID = PURCHASEORDER?.GUID;
		
		const decodedPurchaseOrderPackingObj = JSON.parse(decodeURI(window.atob(PURCHASEORDER?.purchasePackingObj)));
		if (Array.isArray(decodedPurchaseOrderPackingObj) && decodedPurchaseOrderPackingObj.length) {
			PURCHASEORDERPACKINGOBJ = decodedPurchaseOrderPackingObj;
			supplierFunctionality.populateCartonTags();
		}
	};
	
	parent.populateCartonTags = function(){
		const createPackingHtml = (packet, order, displayOrderArr) => {
			const projectInformationData = JSON.parse($('#projectInformationData').val());
			DEFAULTADDRESS = projectInformationData?.billingInformation?.address + '<br>' + projectInformationData?.billingInformation?.town+ ' ' + projectInformationData?.billingInformation?.postCode;
			DEFAULTPHONE = projectInformationData?.billingInformation?.phone;
			VATNUMBER = projectInformationData?.paymentInformation?.vatNo;
			
			const itemsHtml = displayOrderArr.map(item => `
				<tr class="f12">
					<td class="text-left">
						<div class="pull-left">
							<span>[${item.productCombinationId}] ${item.productTitle} [${item.productCode}]</span><br>
						</div>
						<div class="pull-right">X ${item.qty}</div>
					</td>
				</tr>
			`).join('');

			return `
				<div class="cartonSticker pull-left">
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly marBot5">
						<h4 class="text-center">${projectInformationData?.billingInformation?.companyName}</h4>
						<div class="text-center">${DEFAULTADDRESS}</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
							<div class="pull-left"><i class="fa fa-phone marRig5"></i>${projectInformationData?.billingInformation?.phone}</div>
							<div class="pull-right"><i class="fa fa-envelope marRig5"></i>${projectInformationData?.billingInformation?.email}</div>
						</div>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<table class="table table-striped grayBorder">
							<tbody>
								<tr>
									<td width="100%" class="text-center">
										<b>Carton ${packet.packetNumber} [${packet.packetType}]</b>
									</td>
								</tr>
								${itemsHtml}
							</tbody>
						</table>
					</div>
					<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">
						<div class="text-center">${order.supplierName}</div>
						<div class="text-center"><b>${order.purchaseOrderCode} - ${order.purchaseOrderCreateDate}</b></div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly">
							<div class="text-left">${order.supplierAddress} ${order.supplierTown} ${order.supplierPostCode} ${appCommonFunctionality.getCountryName(order.supplierCountry)}</div>
							<div class="text-left">Tel: ${order.supplierContactNo}</div>
							<div class="text-left">FAX:${order.supplierFax}</div>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">
							<img src="${QRCODEAPIURL + order.purchaseOrderCode + '|' + order.totalPrice + '|' + order.purchaseOrderCreateDate + '|' + order.purchaseOrderDeliveryDate}" alt="${order.purchaseOrderCode}" class="cartonStickerQR" onerror="productFunctionality.onImgError(this);">
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly f12">
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-left">${packet.width} cm X ${packet.height} cm X ${packet.length} cm</div>
							<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 nopaddingOnly text-right">${packet.weight} ${packet.weightUnit}</div>
						</div>
					</div>
				</div>
				<br clear="all">
			`;
		};

		const printableHtml = PURCHASEORDERPACKINGOBJ.map(packet => {
			const displayOrderArr = getDisplayOrderArr(packet.items);
			return createPackingHtml(packet, PURCHASEORDER, displayOrderArr) + createPackingHtml(packet, PURCHASEORDER, displayOrderArr);
		}).join('');

		$('#printableCartonData').html(printableHtml);
	};
	/*----------------------------------------Order Packing Functionality----------------------------------------*/
	
	/*----------------------------------------Profile Functionality----------------------------------------------*/
	parent.initProfile = async function (countryResponse) {
		if ($("#CMSDATA").val().length > 0) {
			CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
		}
		adjustBodySectionHeight('profileSection');
		COUNTRYPRECOMPILEDDATA = JSON.parse(countryResponse);
		appCommonFunctionality.bindCountryDropdown('supplierCountry', 630);
		const supplierId = $('#supplierId').val();
		if(parseInt(supplierId) > 0){
			appCommonFunctionality.ajaxCall('GETSUPPLIERDATA&supplierId=' + supplierId, bindSupplierData, "POST", "", true, true);
		}
		if(appCommonFunctionality.isMobile()){
			$('#bankName, #SWIFT, #supplierVat, #IEC, #PAN, #REX').parent().parent().removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
			$('.customerSignatureBlock').addClass('customerSignatureBlock-mob').removeClass('customerSignatureBlock');
		}
	};
	
	const bindSupplierData = function(supplierData){
		appCommonFunctionality.hideLoader();
		SUPPLIERDATA = JSON.parse(supplierData)?.msg?.[0];
		const additionalDataObj = JSON.parse(decodeURI(window.atob(SUPPLIERDATA.additionalData)));
		const finalAdditionalDataObj = additionalDataObj?.paymentInformation || "[]";
		ADDITIONALDATA = finalAdditionalDataObj;
		let str = '';
		setTimeout(function() {
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(631) + ' </b>';
				str = str + '<span id="supplierName">' + SUPPLIERDATA?.supplierName + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(632) + ' </b>';
				str = str + '<span id="supplierContactPerson">' + SUPPLIERDATA?.supplierContactPerson + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(633) + ' </b>';
				str = str + '<span id="supplierAddress">' + SUPPLIERDATA?.supplierAddress + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(634) + ' </b>';
				str = str + '<span id="supplierTown">' + SUPPLIERDATA?.supplierTown + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(635) + ' </b>';
				str = str + '<span id="supplierPostCode">' + SUPPLIERDATA?.supplierPostCode + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(636) + ' </b>';
				str = str + '<input type="hidden" id="supplierCountry" name="supplierCountry" value="' + SUPPLIERDATA?.supplierCountry + '">';
				str = str + '<span>' + appCommonFunctionality.getCountryName(SUPPLIERDATA?.supplierCountry, false) + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>' + appCommonFunctionality.getCmsString(637) + ' </b>';
				str = str + '<span id="supplierContactNo">' + SUPPLIERDATA?.supplierContactNo + '</span>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>Email : </b>';
				str = str + '<a href="mailto:' + SUPPLIERDATA?.supplierEmail + '" id="supplierEmail">' + SUPPLIERDATA?.supplierEmail + '</a>';
			str = str + '</div>';
			str = str + '<div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
				str = str + '<b>FAX : </b>';
				str = str + '<span id="supplierFax">' + SUPPLIERDATA?.supplierFax + '</span>';
			str = str + '</div>';
			$('#supplierBasicData').html(str);
		}, LOADTIME);
		
		if (ADDITIONALDATA !== null) {
			$('#bankName').val(ADDITIONALDATA?.bankName);
			$('#accountNo').val(ADDITIONALDATA?.accountNo);
			$('#bankAddress').val(ADDITIONALDATA?.bankAddress);
			$('#SWIFT').val(ADDITIONALDATA?.SWIFT);
			$('#supplierVat').val(ADDITIONALDATA?.supplierVat);
			$('#GSTIN').val(ADDITIONALDATA?.GSTIN);
			$('#IEC').val(ADDITIONALDATA?.IEC);
			$('#PAN').val(ADDITIONALDATA?.PAN);
			$('#REX').val(ADDITIONALDATA?.REX);
			$('#ARN').val(ADDITIONALDATA?.ARN);
		}
	};
	
	parent.saveSupplier = function(){
		const paymentInformation = {
			bankName : $('#bankName').val(),
			accountNo : $('#accountNo').val(),
			bankAddress : $('#bankAddress').val(),
			SWIFT : $('#SWIFT').val(),
			supplierVat : $('#supplierVat').val(),
			GSTIN : $('#GSTIN').val(),
			IEC : $('#IEC').val(),
			PAN : $('#PAN').val(),
			REX : $('#REX').val(),
			ARN : $('#ARN').val()
		};
		const additionalData = {
			paymentInformation : paymentInformation
		};
		const supplierData = {
			supplierId: parseInt($("#supplierId").val()),
			supplierName: $("#supplierName").text(),
			supplierContactPerson: $("#supplierContactPerson").text(),
			supplierAddress: $("#supplierAddress").text(),
			supplierTown: $("#supplierTown").text(),
			supplierPostCode: $("#supplierPostCode").text(),
			supplierCountry: $("#supplierCountry").val(),
			supplierContactNo: $("#supplierContactNo").text(),
			supplierEmail: $("#supplierEmail").text(),
			supplierFax: $("#supplierFax").text(),
			additionalData: window.btoa(encodeURI(JSON.stringify(additionalData))),
			status : 1
		};
		appCommonFunctionality.ajaxCallLargeData('SAVESUPPLIER', supplierData, receiveResponseAfterSaveSupplierData);
	};
	
	const receiveResponseAfterSaveSupplierData = function(responseData){
		responseData = JSON.parse(responseData);
		if(parseInt(responseData.supplierId) > 0){
			window.location = `profile.php`;
		}
	};

	parent.openSupplierSignatureModal = function(){
		$('#signatureModal').modal('show');
        setTimeout(function() {
            if ($("#signatureModal").length > 0) {
                const signatureCanvasW = $('#signatureCanvas').width();
                const winH = screen.height;
                $("#signatureCanvas").html(`<canvas id='signature' width='${(signatureCanvasW * 98 / 100)}px' height='${(winH * 50 / 100)}px'></canvas>`);
                const canvas = document.getElementById("signature");
                const signaturePad = new SignaturePad(canvas);
            }
        }, LOADTIME);
	};
	
	parent.processSupplierSignature = function() {
		const supplierId = $('#supplierId').val();
        const canvas = document.getElementById("signature");
        $('#signatureModal').modal('hide');
		$("#supplierSignBase64").val(canvas.toDataURL());
		const supplierSignData = {
			supplierId: supplierId,
			supplierSignData: $("#supplierSignBase64").val()
		};
		appCommonFunctionality.ajaxCallLargeData('SUPPLIERSIGNATURE', supplierSignData, appCommonFunctionality.reloadPage);
    };
	
	parent.deleteSupplierSignature = function(){
		const supplierId = $('#supplierId').val();
		if(parseInt(supplierId) > 0){
			 appCommonFunctionality.ajaxCall('DELETESUPPLIERSIGNATURE&supplierId=' + supplierId, appCommonFunctionality.reloadPage);
		}
	};
	/*----------------------------------------Profile Functionality----------------------------------------------*/
	
	/*----------------------------------------Logout Functionality-----------------------------------------------*/
	parent.initLogout = function(){
		if ($("#CMSDATA").val().length > 0) {
			CMSDATA = JSON.parse($("#CMSDATA").val().replace(/'/g, '"'));
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
		}
	};
	
	parent.gotoLogin = function(){
		window.location = `login.php`;
	};
	/*----------------------------------------Logout Functionality-----------------------------------------------*/

    return parent;
})(window, jQuery);
