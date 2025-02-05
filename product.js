const 	MENUSELECTIONITEM = "product.php";
const 	CURRENTPAGE = window.location.pathname.split('/').pop();
let 	BRANDPRECOMPILEDDATA = [];
let 	CATEGORYPRECOMPILEDDATA = [];
let 	PRODUCTPRECOMPILEDDATA = [];
const 	PRODUCTDISPLAYLIMIT = 100;
let 	ENABLEPRODUCTSELECTION = false; //enableing check box
let 	SEARCHCRITERIA = {
			keyword : "",
			brand : 0,
			categories : "",
			stockVolIndicator : 0,
			havingOffer : 0
};
let 	SEARCHEDPRODUCTS = [];
let 	SEARCHFLAG = false;
let 	SELECTEDCATEGORYIDARR = [];
let 	PRODUCTFEATURES = [
								{
									"featureId" : 0, 
									"featureTitle" : "", 
									"featureType" : "text", 
									"featureValue" : "", 
									"featureUnit" : "", 
									"uniqueId" : ""
								}
						  ];
let 	PRODUCTPRICEMATRIX = [];
let 	PRODUCTSUPPLIERS = [];
let 	ARRANGEDORDER = [];
let 	STOCKSTORAGE = [];
let 	PRODUCTLIVESTOCKPRECOMPILEDDATA = [];
let 	PRODUCTSTOCKGROUPBYIDENTIFIRE = "";
let 	SYSTEMREF = []; //Stock item Bar / QR codes
let 	HTMLEDITOR = false;
let 	PRODUCTDESCOBJ = [];
const	productStockPage = "productStock.php";

$(document).ready(function(){
	
	if(CURRENTPAGE.indexOf(productStockPage) === -1){
		/*--------------------------Sidebar Menu Selection---------------------*/
		$('.w3-bar-block > a').each(function(){ 
			var Url = $(this).attr("href"); // Get current url
			if(Url === MENUSELECTIONITEM){
				$(this).addClass("w3-blue");
			}
		});
		/*--------------------------Sidebar Menu Selection---------------------*/
	}

	if(CURRENTPAGE === "product.php"){
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=PRODUCT'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=BRAND'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=CATEGORY')
		).done(function(productResponse, brandResponse, categoryResponse) {
			// Both AJAX calls completed successfully
			appCommonFunctionality.hideLoader();
			productFunctionality.initProduct(productResponse[0], brandResponse[0], categoryResponse[0]);
		}).fail(function() {
			// One or both AJAX calls failed
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});
	}else if(CURRENTPAGE === "productEntry.php"){
		appCommonFunctionality.showLoader();
		/*-------------------------------------Quill Activity--------------------------------------------*/
		var refreshIntervalId = window.setInterval(function() {
			if($(".ql-toolbar").length === 0 && $('#productDescBody').not('ql-container') && !HTMLEDITOR){
				productFunctionality.initProductEntry();
			}else{
				if($("#productDesc").val() !== ''){
					var delta = quill.clipboard.convert(decodeURI(window.atob($("#productDesc").val())));
					quill.setContents(delta, 'silent');
				}
				productFunctionality.mapProductDescAttributes();
				HTMLEDITOR = true;
				appCommonFunctionality.hideLoader();
				clearInterval(refreshIntervalId);
			}
		}, LOADTIME);
		/*-------------------------------------Quill Activity--------------------------------------------*/
		
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=BRAND'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=CATEGORY')
		).done(function(brandResponse, categoryResponse) {
			appCommonFunctionality.hideLoader();
			//productFunctionality.initProduct(productResponse[0], brandResponse[0], categoryResponse[0]);
			/*-------------------------------------Brand Activity--------------------------------------------*/
			BRANDPRECOMPILEDDATA = JSON.parse(brandResponse[0]);
			var selectedBrandId = parseInt($('#brandId').val());
			productFunctionality.populateSelectedBrand(selectedBrandId);
			/*-------------------------------------Brand Activity--------------------------------------------*/
			
			/*-------------------------------------Category Activity-----------------------------------------*/
			CATEGORYPRECOMPILEDDATA = JSON.parse(categoryResponse[0]);
			var selectedCategories = $('#categoryIds').val();
			if(selectedCategories !== ''){
				SELECTEDCATEGORYIDARR = selectedCategories.split(',').map(Number);
			}
			productFunctionality.populateSelectedCategories();
			/*-------------------------------------Category Activity-----------------------------------------*/
			
			/*-------------------------------------Product Description Helper Activity-----------------------*/
			PRODUCTDESCOBJ = JSON.parse($('#productDescriptionHelperData').val());
			productFunctionality.populateDescHelper();
			/*-------------------------------------Product Description Helper Activity-----------------------*/
		}).fail(function() {
			// One or both AJAX calls failed
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});

		if(appCommonFunctionality.isMobile()){
			$("#searchCatSection").addClass('nopaddingOnly').removeClass('noRightPaddingOnly');
		}
	}else if(CURRENTPAGE === "productImage.php"){
		productFunctionality.initProductImage();
	}else if(CURRENTPAGE === "productFeature.php"){
		productFunctionality.initProductFeature();
	}else if(CURRENTPAGE === "productPriceMatrix.php"){
		productFunctionality.initProductPriceMatrix();
	}else if(CURRENTPAGE === "productOffer.php"){
		productFunctionality.initProductOffer();
	}else if(CURRENTPAGE === "productSuppliers.php"){
		productFunctionality.initProductSuppliers();
	}else if(CURRENTPAGE === "productStock.php"){
		productFunctionality.initProductStock();
	}else if(CURRENTPAGE === "stockEntry.php"){
		productFunctionality.initProductStockEntry();
	}else if(CURRENTPAGE === "stockDetails.php"){
		productFunctionality.initProductStockDetails();
	}else if(CURRENTPAGE === "printProductCombinationStockQRBarCodes.php"){
		productFunctionality.initPrintProductCombinationStockQRBarCodes();
	}else if(CURRENTPAGE === "arrangeProducts.php"){
		productFunctionality.initArrangeProducts();
	}else if(CURRENTPAGE === "arrangeProductImages.php"){
		productFunctionality.initArrangeProductImage();
	}else if(CURRENTPAGE === "productDetail.php"){
		productFunctionality.initProductDetail();
	}
	appCommonFunctionality.cmsImplementationThroughID();
	appCommonFunctionality.cmsImplementationThroughRel();
	appCommonFunctionality.hideLoader();
});

const productFunctionality = (function(window, $) {
	const parent = {};
	
	parent.initProduct = async function (productPreCompileData, productBrandSerializedData, productCatSerializedData) {
        appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		
        if (productPreCompileData.length > 0) {
            PRODUCTPRECOMPILEDDATA = JSON.parse(productPreCompileData);
            PRODUCTPRECOMPILEDDATA.sort((a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate)); // Default DESC date sort
        }

        if (productBrandSerializedData.length > 0) {
            BRANDPRECOMPILEDDATA = JSON.parse(productBrandSerializedData);
        }

        if (productCatSerializedData.length > 0) {
            CATEGORYPRECOMPILEDDATA = JSON.parse(productCatSerializedData);
        }

        // Check URL parameters
        const brandId = appCommonFunctionality.getUrlParameter('brandId');
        const categoryId = appCommonFunctionality.getUrlParameter('categoryId');

        if (brandId) {
            productFunctionality.onBrandSelection(parseInt(brandId));
            $("#brandId").val(brandId);
            productSearch();
        } else if (categoryId) {
            productFunctionality.onCatSelection(parseInt(categoryId), null);
            $("#categoryIds").val(categoryId);
            productSearch();
        } else {
            populateProductTable();
        }

        // Adjust padding for mobile
        if (appCommonFunctionality.isMobile()) {
            $("#retailOfferSection").removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
        }
    };
	
	const populateProductTable = function() {
		let str = `
			<table class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white minW720">
				<tbody>
					<tr>
						<td width="5%"><strong id="cms_134">Image</strong></td>
						<td width="70%"><strong id="cms_135">Name</strong></td>
						<td width="5%"><strong id="cms_136">Stock</strong></td>
						<td width="15%">
							<i class="fa fa-sort-amount-asc hover marRig5" onClick="productFunctionality.sortProductTable('ASC')"></i>
							<strong id="cms_137">Date</strong>
							<i class="fa fa-sort-amount-desc hover marleft5" onClick="productFunctionality.sortProductTable('DESC')"></i>
						</td>
						<td width="5%"><strong id="cms_138">Action</strong></td>
					</tr>
		`;

		const displayProductItems = SEARCHFLAG ? SEARCHEDPRODUCTS : PRODUCTPRECOMPILEDDATA;
		if (displayProductItems.length > 0) {
			const productDisplaylimit = Math.min(displayProductItems.length, PRODUCTDISPLAYLIMIT);
			for (let i = 0; i < productDisplaylimit; i++) {
				const product = displayProductItems[i];
				const stockVolClass = product.productStock < product.minStockVol ? "redText" :
									  (product.minStockVol + (product.minStockVol / 2)) > product.productStock ? "yellowText" :
									  "greenText";

				str += `
					<tr>
						<td>
							<a href="productDetail.php?productId=${product.productId}" class="blueText">
								<img src="${PROJECTPATH + PRODUCTIMAGEURL}64x64/${product.productImage}" alt="${product.productImage}" class="productImage" onerror="appCommonFunctionality.onImgError(this)">
							</a>
						</td>
						<td>
							${ENABLEPRODUCTSELECTION ? `<input type="checkbox" id="productCheck_${product.productId}" name="productCheck_${product.productId}" checked="checked" value="${product.productId}" class="marRig5" onclick="productFunctionality.collectSelectedProductIds()">` : ''}
							<a href="productDetail.php?productId=${product.productId}" class="blueText">${product.productTitle} [${product.productCode}]</a>
							${product.productOffer > 0 ? `<span><img src="${PROJECTPATH}assets/images/offerTag.png" alt="offer" class="offerLogo2"></span>` : ''}
							<br><span class="f12 ${product.productCombinations > 0 ? 'greenText' : 'redText'}">${product.productCombinations > 0 ? '[Ok]' : '[Incomplete]'}</span>
							<span class="f12 marleft5" id="cms_96"> Brand : </span>
							<span class="f12"><a href="brandDetail.php?brandId=${product.brandId}" class="blueText" target="_blank">${getBrandName(product.brandId)}</a></span>
						</td>
						<td>
							<b class="${stockVolClass} f20">${product.productStock}</b> / <span class="f12">${product.minStockVol}</span>
						</td>
						<td class="f12">
							<span id="cms_101">Created Date : </span>${product.createdDate}
							<br><span id="cms_102">Last Modified Date : </span>${product.lastModifiedDate}
						</td>
						<td>
							<div class="spaceBetweenSection">
								<i class="fa fa-pencil-square-o marleft5 greenText hover" onclick="productFunctionality.editProduct(${product.productId})"></i>
								<i class="fa fa-tv marleft5 blueText hover" onclick="productFunctionality.productDetail(${product.productId})"></i>
							</div>
						</td>
					</tr>
				`;
			}
		} else {
			str += '<tr><td colspan="6" id="cms_100">No Data</td></tr>';
		}

		str += `
				</tbody>
			</table>
		`;

		$("#productTableHolder").html(str);
	};
	
	parent.setStockVolIndicator = function(indicator){
		SEARCHCRITERIA.stockVolIndicator = indicator;
		populateStockVolIndicator();
	};
	
	const populateStockVolIndicator = function() {
		const indicatorTexts = [
			appCommonFunctionality.getCmsString(54),
			appCommonFunctionality.getCmsString(53),
			appCommonFunctionality.getCmsString(52),
			appCommonFunctionality.getCmsString(51)
		];
		const stockVolIndicator = parseInt(SEARCHCRITERIA.stockVolIndicator);
		for (let i = 0; i < indicatorTexts.length; i++) {
			let btnHtml = indicatorTexts[i];
			if (i === stockVolIndicator) {
				btnHtml = `<i class="fa fa-check"></i> ${btnHtml}`;
			}
			$(`#stockVolIndicatorBtn_${i}`).html(btnHtml);
		}
	};
	
	parent.setHavingOffer = function(indicator){
		SEARCHCRITERIA.havingOffer = indicator;
		populateHavingOfferIndicator();
	};
	
	const populateHavingOfferIndicator = function() {
		const indicatorTexts = [
			appCommonFunctionality.getCmsString(54),
			appCommonFunctionality.getCmsString(57),
			appCommonFunctionality.getCmsString(56)
		];

		const havingOffer = parseInt(SEARCHCRITERIA.havingOffer);
		
		for (let i = 0; i < indicatorTexts.length; i++) {
			let btnHtml = indicatorTexts[i];
			if (i === havingOffer) {
				btnHtml = `<i class="fa fa-check"></i> ${btnHtml}`;
			}
			$(`#havingOfferBtn_${i}`).html(btnHtml);
		}
	};
	
	parent.sortProductTable = function(sortDirection) {
		const sortOrder = sortDirection === 'ASC' ? 1 : -1;
		const sortFunction = (a, b) => sortOrder * (new Date(a.lastModifiedDate) - new Date(b.lastModifiedDate));
		if (SEARCHFLAG && SEARCHEDPRODUCTS.length > 0) {
			SEARCHEDPRODUCTS.sort(sortFunction);
		} else if (PRODUCTPRECOMPILEDDATA.length > 0) {
			PRODUCTPRECOMPILEDDATA.sort(sortFunction);
		}
		populateProductTable();
	};
	
	parent.searchFormReset = function() {
		SEARCHFLAG = false;
		$("#productKeyword").val("");
		$("#searchBrand").val("").trigger('keyup');
		productFunctionality.removeBrandSelection();
		$("#searchCat").val("").trigger('keyup');
		const categoryIds = $("#categoryIds").val().split(",");
		categoryIds.forEach(id => productFunctionality.removeCatSelection(parseInt(id)));
		SEARCHCRITERIA.stockVolIndicator = 0;
		SEARCHCRITERIA.havingOffer = 0;
		populateStockVolIndicator();
		populateHavingOfferIndicator();
	};
	
	parent.productSearch = function(){
		SEARCHFLAG = true;
		SEARCHCRITERIA.keyword = $("#productKeyword").val();
		SEARCHCRITERIA.brand = parseInt($("#brandId").val());
		SEARCHCRITERIA.categories = $("#categoryIds").val();
		//console.log("SEARCHCRITERIA : ", SEARCHCRITERIA);
		
		/*----------------------Search products belongs to the selected brand-------------------------------*/
		SEARCHEDPRODUCTS = PRODUCTPRECOMPILEDDATA.filter(product => (
														brandMatching(parseInt(product.brandId)) &&
														catMatching(product.categoryIds) &&
														keywordMatching(product.metaKeyWords + ' ' + product.productTitle) &&
														stockVolMatching(parseInt(product.productStock), parseInt(product.minStockVol)) &&
														offerMatching(parseInt(product.productOffer))
													  )
										  );
		//console.log("Searched Products after Brand search : ", SEARCHEDPRODUCTS);
		/*----------------------Search products belongs to the selected brand-------------------------------*/
		$('#productSearchModal').modal('hide');
		populateProductTable();
	};
	
	const brandMatching = function(productBrandId){
		if(parseInt(SEARCHCRITERIA.brand) > 0){
			if(productBrandId === parseInt(SEARCHCRITERIA.brand)){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	};
	
	const catMatching = function(productCategoryIds){
		if(SEARCHCRITERIA.categories.length > 0){
			var searchCriteriaCategoryArray = SEARCHCRITERIA.categories.split(',').map(Number);
			if(searchCriteriaCategoryArray.length > 0){
				var productCategoryIdArray = productCategoryIds.split(',').map(Number);
				var intersection = productCategoryIdArray.filter(value => searchCriteriaCategoryArray.includes(value));
				if (intersection.length > 0) {
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
		}else{
			return true;
		}
	};
	
	const keywordMatching = function(productKeywordStr){
		if(SEARCHCRITERIA.keyword.length > 0){
			var searchCriteriaKeywordArray = SEARCHCRITERIA.keyword.toLowerCase().split(/[\s,+-]+/);
			var productKeywordArray = productKeywordStr.toLowerCase().split(/[\s,+-]+/);
			const intersection = productKeywordArray.filter(productKeyword =>
				searchCriteriaKeywordArray.some(searchKeyword =>
					productKeyword.includes(searchKeyword) || searchKeyword.includes(productKeyword)
				)
			);
			if (intersection.length > 0) {
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	};
	
	const stockVolMatching = function(productStockVol, productMinStockVol){
		if(parseInt(SEARCHCRITERIA.stockVolIndicator) > 0){
			var productStockVolIndicator = 3
			if(productStockVol < productMinStockVol){
				productStockVolIndicator = 1;
			}else if((productMinStockVol + (productMinStockVol/2)) > productStockVol){
				productStockVolIndicator = 2;
			}
			
			if(parseInt(SEARCHCRITERIA.stockVolIndicator) === productStockVolIndicator){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	};
	
	const offerMatching = function(productOffers){
		if(parseInt(SEARCHCRITERIA.havingOffer) > 0){
			var productOfferIndicator = 0;
			if(productOffers > 0){
				productOfferIndicator = 2
			}else{
				productOfferIndicator = 1
			}
			
			if(parseInt(SEARCHCRITERIA.havingOffer) === productOfferIndicator){
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	};
	
	parent.enableProductSelection = function() {
		ENABLEPRODUCTSELECTION = !ENABLEPRODUCTSELECTION;
		const enableProductSelectionBtn = $("#enableProductSelectionBtn");
		const bulkOfferBtn = $('#bulkOfferBtn');
		const createMagBtn = $('#CreateMagBtn');

		if (ENABLEPRODUCTSELECTION) {
			enableProductSelectionBtn.html('<i class="fa fa-check-square-o greenText"></i>');
			bulkOfferBtn.removeClass('disabled');
			createMagBtn.removeClass('disabled');
		} else {
			enableProductSelectionBtn.html('<i class="fa fa-check-square-o"></i>');
			bulkOfferBtn.addClass('disabled');
			createMagBtn.addClass('disabled');
			$("#selectedProductIds").val('');
		}

		populateProductTable();
		collectSelectedProductIds();
	};
	
	parent.collectSelectedProductIds = function(){
		var selectedProductIds = $("input[id^='productCheck_']:checked")
        .map(function() {
            return $(this).val();
        })
        .get()
        .join(",");
		$("#selectedProductIds").val(selectedProductIds);
	};
	
	parent.validateBulkOfferModalForm = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------ProductId Selection Validation----------------------------------*/
		var selectedProductIds = $("#selectedProductIds").val();
		var selectedProductIdArr = selectedProductIds.split(",");
		if (selectedProductIdArr.length === 0) {
			errorCount++;
			alert(appCommonFunctionality.getCmsString(169));
		}
		/*----------------------------------------------------ProductId Selection Validation----------------------------------*/
		
		/*----------------------------------------------------Retail Offer / Wholesale Offer Percentage Validation------------*/
		var errorOfferCount = 0;
		var retailOfferOfferPercent = $("#retailOfferOfferPercent").val();
		var wholeSaleOfferPercent = $("#wholeSaleOfferPercent").val();
		if(parseFloat(retailOfferOfferPercent) === 0){
			errorOfferCount++;
		}
		if(parseFloat(wholeSaleOfferPercent) === 0){
			errorOfferCount++;
		}
		if(errorOfferCount === 2){
			errorCount++;
			alert(appCommonFunctionality.getCmsString(170));
		}
		/*----------------------------------------------------Retail Offer / Wholesale Offer Percentage Validation------------*/
		
		/*----------------------------------------------------Retail Offer Start Date Validation------------------------------*/
		if($("#retailOfferStartDate").val() === '' && parseFloat(retailOfferOfferPercent) > 0){
			appCommonFunctionality.raiseValidation("retailOfferStartDate", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("retailOfferStartDate", "retailOfferStartDate", true);
		}
		/*----------------------------------------------------Retail Offer Start Date Validation------------------------------*/
		
		/*----------------------------------------------------Retail Offer End Date Validation--------------------------------*/
		if($("#retailOfferEndDate").val() === '' && parseFloat(retailOfferOfferPercent) > 0){
			appCommonFunctionality.raiseValidation("retailOfferEndDate", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("retailOfferEndDate", "retailOfferEndDate", true);
		}
		/*----------------------------------------------------Retail Offer End Date Validation--------------------------------*/
		
		/*----------------------------------------------------WholeSale Offer Start Date Validation---------------------------*/
		if($("#wholeSaleOfferStartDate").val() === '' && parseFloat(wholeSaleOfferPercent) > 0){
			appCommonFunctionality.raiseValidation("wholeSaleOfferStartDate", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("wholeSaleOfferStartDate", "wholeSaleOfferStartDate", true);
		}
		/*----------------------------------------------------WholeSale Offer Start Date Validation---------------------------*/
		
		/*----------------------------------------------------WholeSale Offer End Date Validation-----------------------------*/
		if($("#wholeSaleOfferEndDate").val() === '' && parseFloat(wholeSaleOfferPercent) > 0){
			appCommonFunctionality.raiseValidation("wholeSaleOfferEndDate", "", true);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("wholeSaleOfferEndDate", "wholeSaleOfferEndDate", true);
		}
		/*----------------------------------------------------WholeSale Offer End Date Validation-----------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.bulkOfferModalFormReset = function(){
		$("#retailOfferOfferPercent, #retailOfferStartDate, #retailOfferEndDate, #wholeSaleOfferPercent, #wholeSaleOfferStartDate, #wholeSaleOfferEndDate").val('');
	};
	
	parent.bulkOfferModalFormSubmit = function(){
		if(validateBulkOfferModalForm()){
			$("#bulkOfferModalForm").submit();
		}
	};
	
	parent.addProduct = function(){
		window.location.replace('productEntry.php');
	};

	parent.editProduct = function(productId){
		window.location.replace('productEntry.php?productId=' + productId);
	};
	
	parent.productDetail = function(productId){
		window.location.replace('productDetail.php?productId=' + productId);
	};
	
	parent.deleteProduct = function(productId){
		appCommonFunctionality.textToAudio(appCommonFunctionality.getCmsString(395), appCommonFunctionality.getLang());
		if(confirm(appCommonFunctionality.getCmsString(395))){
			window.location.replace('product.php?ACTION=DELETE&productId=' + productId);
		}
	};
	
	parent.initProductEntry = async function () {
		await appCommonFunctionality.adminCommonActivity();
		const productDescBody = $("#productDescBody");
		if (productDescBody.length) {
			/*--------------------------------quill-------------------------------------------------------*/
			const toolbarOptions = [
				['bold', 'underline', 'strike'],        // toggled buttons
				['blockquote', 'code-block'],
				[{ 'header': 1 }],                      // custom button values
				[{ 'list': 'ordered' }, { 'list': 'bullet' }],
				[{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
				[{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
				[{ 'direction': 'rtl' }],                         // text direction
				[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
				[{ 'field5': [] }, { 'background': [] }],          // dropdown with defaults from theme
				[{ 'font': [] }],
				[{ 'align': [] }]
			];
			const quill = new Quill('#productDescBody', {
				modules: {
					toolbar: toolbarOptions
				},
				theme: 'snow'
			});
			const productDescBodyHeight = $("#descHelper").height() - 75;
			productDescBody.addClass('bgWhite').css('height', `${productDescBodyHeight}px`);
			/*--------------------------------quill-------------------------------------------------------*/
		}
		if (appCommonFunctionality.isMobile()) {
			const elementsToAdjust = [
				"#productPrice", 
				"#productPriceW", 
				"#productDescHolder"
			];
			elementsToAdjust.forEach(selector => {
				$(selector).parent().parent().removeClass('noRightPaddingOnly').addClass('nopaddingOnly');
			});
			const elementsToRemove = [
				"#productPriceDescSpan", 
				"#productPriceADescSpan", 
				"#productPriceWDescSpan", 
				"#minStockVolDescSpan"
			];
			elementsToRemove.forEach(selector => $(selector).remove());
		}
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
	};
	
	parent.generateProductDesc = function(inputId){
		var str = '';
		var inputVal = $("#" + inputId).val();
		for(var i = 0; i < PRODUCTDESCOBJ.length; i++){
			if(PRODUCTDESCOBJ[i].hasOwnProperty('groupInputs')){
				var groupInputArray = PRODUCTDESCOBJ[i].groupInputs;
				for(var j = 0; j < groupInputArray.length; j++){
					if(groupInputArray[j].fieldName === inputId && inputVal !== ''){
						groupInputArray[j].value = inputVal;
						if(groupInputArray.length === 3 && groupInputArray[0].fieldSpan2 === 'X'){
							if($(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").length > 0){
								$(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").next('em').html(groupInputArray[0].value + ' ' + groupInputArray[0].fieldSpan2 + ' ' + groupInputArray[1].value + ' ' + groupInputArray[1].fieldSpan2 + ' ' + groupInputArray[2].value + ' ' + groupInputArray[2].fieldSpan2);
							}else{
								str = '<div><b>* ' + groupInputArray[0].fieldSpan1 + ' : </b><em>' + groupInputArray[0].value + ' ' + groupInputArray[0].fieldSpan2 + ' ' + groupInputArray[1].value + ' ' + groupInputArray[1].fieldSpan2 + ' ' + groupInputArray[2].value + ' ' + groupInputArray[2].fieldSpan2 + '</em></div>';
								addQuillContent(str);
							}
						}else if(groupInputArray.length === 2 && groupInputArray[0].fieldSpan2 === 'X'){
							if($(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").length > 0){
								$(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").next('em').html(groupInputArray[0].value + ' ' + groupInputArray[0].fieldSpan2 + ' ' + groupInputArray[1].value + ' ' + groupInputArray[1].fieldSpan2);
							}else{
								str = '<div><b>* ' + groupInputArray[0].fieldSpan1 + ' : </b><em>' + groupInputArray[0].value + ' ' + groupInputArray[0].fieldSpan2 + ' ' + groupInputArray[1].value + ' ' + groupInputArray[1].fieldSpan2 + '</em></div>';
								addQuillContent(str);
							}
						}else if(groupInputArray.length === 2 && groupInputArray[0].fieldSpan2 === ''){
							if($(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").length > 0){
								$(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").next('em').html(groupInputArray[0].value + ' ' + groupInputArray[0].fieldSpan2);
							}else{
								str = '<div><b>* ' + groupInputArray[0].fieldSpan1 + ' : </b><em>' + groupInputArray[0].value + ' ' + groupInputArray[0].fieldSpan2 + '</em></div>';
								addQuillContent(str);
							}
							if($(".ql-editor strong:contains(" + groupInputArray[1].fieldSpan1 + ")").length > 0){
								$(".ql-editor strong:contains(" + groupInputArray[1].fieldSpan1 + ")").next('em').html(groupInputArray[1].value + ' ' + groupInputArray[1].fieldSpan2);
							}else{
								str = '<div><b>* ' + groupInputArray[1].fieldSpan1 + ' : </b><em>' + groupInputArray[1].value + ' ' + groupInputArray[1].fieldSpan2 + '</em></div>';
								addQuillContent(str);
							}
						}
					}
				}
			}else{
				if(PRODUCTDESCOBJ[i].fieldName === inputId && inputVal !== ''){
					PRODUCTDESCOBJ[i].value = inputVal;
					if($(".ql-editor strong:contains(" + PRODUCTDESCOBJ[i].fieldSpan1 + ")").length > 0){
						$(".ql-editor strong:contains(" + PRODUCTDESCOBJ[i].fieldSpan1 + ")").next('em').html(inputVal);
					}else{
						str = str + '<div><b>* ' + PRODUCTDESCOBJ[i].fieldSpan1 + ' : </b><em>' + inputVal + '</em></div>';
						addQuillContent(str);
					}
				}
			}
		}
		//console.log("PRODUCTDESCOBJ : ", PRODUCTDESCOBJ);
	};
	
	const addQuillContent = function(str){
		var delta = quill.clipboard.convert($(".ql-editor").html() + str);
		quill.setContents(delta, 'silent');
	};
	
	parent.mapProductDescAttributes = function(){
		for(var i = 0; i < PRODUCTDESCOBJ.length; i++){
			if(PRODUCTDESCOBJ[i].hasOwnProperty('groupInputs')){
				var groupInputArray = PRODUCTDESCOBJ[i].groupInputs;
				for(var j = 0; j < groupInputArray.length; j++){
					if(groupInputArray.length === 3 && groupInputArray[0].fieldSpan2 === 'X'){
						if($(".ql-editor strong:contains(" + groupInputArray[j].fieldSpan1 + ")").length > 0){
							var fieldVal = $(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").next('em').html();
							var fieldValArr = fieldVal.split('X');
							$('#' + groupInputArray[0].fieldName).val(fieldValArr[0].replace(/[^0-9]/gi, ''));
							$('#' + groupInputArray[1].fieldName).val(fieldValArr[1].replace(/[^0-9]/gi, ''));
							$('#' + groupInputArray[2].fieldName).val(fieldValArr[2].replace(/[^0-9]/gi, ''));
						}
					}else if(groupInputArray.length === 2 && groupInputArray[0].fieldSpan2 === 'X'){
						if($(".ql-editor strong:contains(" + groupInputArray[j].fieldSpan1 + ")").length > 0){
							var fieldVal = $(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").next('em').html();
							var fieldValArr = fieldVal.split('X');
							$('#' + groupInputArray[0].fieldName).val(fieldValArr[0].replace(/[^0-9]/gi, ''));
							$('#' + groupInputArray[1].fieldName).val(fieldValArr[1].replace(/[^0-9]/gi, ''));
						}
					}else if(groupInputArray.length === 2 && groupInputArray[0].fieldSpan2 === ''){
						if($(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").length > 0){
							var fieldVal = $(".ql-editor strong:contains(" + groupInputArray[0].fieldSpan1 + ")").next('em').html();
							if(groupInputArray[0].type === 'toggle'){
								$('#' + groupInputArray[0].fieldName).prop('checked', true);
							}else if(groupInputArray[0].type === 'number'){
								$('#' + groupInputArray[0].fieldName).val(fieldVal.replace(/[^0-9]/gi, ''));
							}else{
								$('#' + groupInputArray[0].fieldName).val(fieldVal);
							}
						}
						if($(".ql-editor strong:contains(" + groupInputArray[1].fieldSpan1 + ")").length > 0){
							var fieldVal = $(".ql-editor strong:contains(" + groupInputArray[1].fieldSpan1 + ")").next('em').html();
							if(groupInputArray[1].type === 'toggle'){
								$('#' + groupInputArray[1].fieldName).prop('checked', true);
							}else if(groupInputArray[1].type === 'number'){
								$('#' + groupInputArray[1].fieldName).val(fieldVal.replace(/[^0-9]/gi, ''));
							}else{
								$('#' + groupInputArray[1].fieldName).val(fieldVal);
							}
						}
					}
				}
			}else{
				if($(".ql-editor strong:contains(" + PRODUCTDESCOBJ[i].fieldSpan1 + ")").length > 0){
					var fieldVal = $(".ql-editor strong:contains(" + PRODUCTDESCOBJ[i].fieldSpan1 + ")").next('em').html();
					$('#' + PRODUCTDESCOBJ[i].fieldName).val(fieldVal);
				}
			}
		}
	};

	parent.populateDescHelper = function(){
		var str = '';
		if(PRODUCTDESCOBJ.length > 0){
			for(var i = 0; i < PRODUCTDESCOBJ.length; i++){
				if(PRODUCTDESCOBJ[i].hasOwnProperty('groupInputs')){
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
					var groupInputArray = PRODUCTDESCOBJ[i].groupInputs;
					if(groupInputArray.length === 3 && groupInputArray[0].fieldSpan2 === 'X'){
						str = str + populateDescHelperGroup3(groupInputArray);
					}else if(groupInputArray.length === 2 && groupInputArray[0].fieldSpan2 === 'X'){
						str = str + populateDescHelperGroup2(groupInputArray);
					}else if(groupInputArray.length === 2 && groupInputArray[0].fieldSpan2 === ''){
						str = str + populateDescHelperGroup1(groupInputArray);
					}
					str = str + '</div>';
				}else{
					str = str + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
						str = str + '<div class="input-group marBot5">';
							if(PRODUCTDESCOBJ[i].fieldSpan1 !== ""){
								str = str + '<span id="' + PRODUCTDESCOBJ[i].fieldName + 'Span" class="input-group-addon">';
									str = str + '<span>' + PRODUCTDESCOBJ[i].fieldSpan1 + ' :</span>';
								str = str + '</span>';
							}
							str = str + '<input id="' + PRODUCTDESCOBJ[i].fieldName + '" name="' + PRODUCTDESCOBJ[i].fieldName + '" type="' + PRODUCTDESCOBJ[i].type + '" class="form-control" placeholder="' + PRODUCTDESCOBJ[i].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
							if(PRODUCTDESCOBJ[i].fieldSpan2 !== ""){
								str = str + '<span id="' + PRODUCTDESCOBJ[i].fieldName + 'Span" class="input-group-addon">';
									str = str + '<span>' + PRODUCTDESCOBJ[i].fieldSpan2 + ' :</span>';
								str = str + '</span>';
							}
						str = str + '</div>';
					str = str + '</div>';
				}
			}
		}
		$("#descHelper").html(str);
	};
	
	populateDescHelperGroup1 = function(groupInputArray){ /*Field 1 : -- | Field 2 : --*/
		var str = '';
		if(groupInputArray.length > 0){
			for(var i = 0; i < groupInputArray.length; i++){
				if(groupInputArray[i].type === 'text' || groupInputArray[i].type === 'number'){
					str = str + '<div class="col-lg-' + groupInputArray[i].size + ' col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
						str = str + '<div class="input-group marBot5">';
							str = str + '<span id="' + groupInputArray[i].fieldName + 'Span" class="input-group-addon">';
								str = str + '<span>' + groupInputArray[i].fieldSpan1 + ' :</span> ';
							str = str + '</span>';
							str = str + '<input id="' + groupInputArray[i].fieldName + '" name="' + groupInputArray[i].fieldName + '" type="' + groupInputArray[i].type + '" class="form-control" placeholder="' + groupInputArray[i].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
						str = str + '</div>';
					str = str + '</div>';
				}else if(groupInputArray[i].type === 'toggle'){
					str = str + '<div class="col-lg-' + groupInputArray[i].size + ' col-md-12 col-sm-12 col-xs-12 nopaddingOnly">';
						str = str + '<label class="pull-left marTop5">' + groupInputArray[i].fieldSpan1 + ':</label>';
						str = str + '<label id="' + groupInputArray[i].fieldName + '_switch" class="switch pull-left marleft5" onchange="productFunctionality.onSwitchChange(this.id, event)">';
							str = str + '<input id="' + groupInputArray[i].fieldName + '" name="' + groupInputArray[i].fieldName + '" type="checkbox" value="">';
							str = str + '<span id="' + groupInputArray[i].fieldName + 'Slider" class="slider"></span>';
						str = str + '</label>';
					str = str + '</div>';
				}
			}
		}
		return str;
	};
	
	populateDescHelperGroup2 = function(groupInputArray){ /*Field : -- X --*/
		var str = '';
		str = str + '<div class="input-group marBot5">';
			str = str + '<span id="' + groupInputArray[0].fieldName + 'Span" class="input-group-addon">' + groupInputArray[0].fieldSpan1 + ' : </span>';
			str = str + '<input id="' + groupInputArray[0].fieldName + '" name="' + groupInputArray[0].fieldName + '" type="' + groupInputArray[0].type + '" class="form-control" placeholder="' + groupInputArray[0].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
			str = str + '<span class="input-group-addon"> ' + groupInputArray[0].fieldSpan2 + ' </span>';
			str = str + '<input id="' + groupInputArray[1].fieldName + '" name="' + groupInputArray[1].fieldName + '" type="' + groupInputArray[0].type + '" class="form-control" placeholder="' + groupInputArray[1].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
			str = str + '<span class="input-group-addon"> ' + groupInputArray[1].fieldSpan2 + ' </span>';
		str = str + '</div>';
		return str;
	};
	
	populateDescHelperGroup3 = function(groupInputArray){ /*Field : -- X -- X --*/
		var str = '';
		str = str + '<div class="input-group marBot5">';
			str = str + '<span class="input-group-addon"> ' + groupInputArray[0].fieldSpan1 + ' : </span>';
			str = str + '<input id="' + groupInputArray[0].fieldName + '" name="' + groupInputArray[0].fieldName + '" type="' + groupInputArray[0].type + '" class="form-control" placeholder="' + groupInputArray[0].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
			str = str + '<span class="input-group-addon"> ' + groupInputArray[0].fieldSpan2 + ' </span>';
			str = str + '<input id="' + groupInputArray[1].fieldName + '" name="' + groupInputArray[1].fieldName + '" type="' + groupInputArray[1].type + '" class="form-control" placeholder="' + groupInputArray[1].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
			str = str + '<span class="input-group-addon"> ' + groupInputArray[1].fieldSpan2 + ' </span>';
			str = str + '<input id="' + groupInputArray[2].fieldName + '" name="' + groupInputArray[2].fieldName + '" type="' + groupInputArray[2].type + '" class="form-control" placeholder="' + groupInputArray[1].placeHolder + '" autocomplete="off" value="" onkeyup="productFunctionality.generateProductDesc(this.id)" >';
		str = str + '</div>';
		return str;
	};
	
	parent.onSwitchChange = function(switchId, e) {
		const inputId = switchId.replace("_switch", "");
		const inputElement = $("#" + inputId);
		const newValue = parseInt(inputElement.val()) ? 0 : 1;
		inputElement.val(newValue).prop('checked', !!newValue);
		generateProductDesc(inputId);
	};
	
	parent.brandPredictiveSearch = function(searchedText) {
		const searchBrandIconSpan = $('#searchBrandIconSpan');
		const searchedBrands = $('#searchedBrands');
		searchBrandIconSpan.html('<span class="fa fa-spinner fa-spin hover"></span>');
		if (BRANDPRECOMPILEDDATA.length > 0 && searchedText.length > 2) {
			const searchedBrandObjArray = BRANDPRECOMPILEDDATA.filter(brand => 
				brand.brandName.toLowerCase().includes(searchedText.toLowerCase())
			);
			const str = searchedBrandObjArray.map(brand => `
				<div class="searchedItem hover" onclick="productFunctionality.onBrandSelection(${brand.brandId})">
					<span><img src="${PROJECTPATH}uploads/brand/${brand.brandImage}" class="field5Circle" alt="${brand.brandName}"></span>
					<span>${brand.brandName}</span>
				</div>
			`).join('');
			searchedBrands.html(str).removeClass('hide');
		} else {
			searchedBrands.html('').addClass('hide');
		}
		searchBrandIconSpan.html('<span class="fa fa-search hover"></span>');
	};
	
	parent.onBrandSelection = function(brandId) {
		const brandIdInput = $('#brandId');
		const searchedBrands = $('#searchedBrands');
		const searchBrand = $('#searchBrand');
		brandIdInput.val(brandId);
		searchedBrands.empty().addClass('hide');
		searchBrand.val('');
		productFunctionality.populateSelectedBrand(brandId);
	};
	
	parent.populateSelectedBrand = function(brandId) {
		if (brandId > 0) {
			const selectedBrand = BRANDPRECOMPILEDDATA.find(brand => parseInt(brand.brandId) === parseInt(brandId));
			if (selectedBrand) {
				const str = `
					<div id="cms_45">Selected Brand : </div>
					<div class="selectedBrandItem">
						<div>
							<span><img src="${PROJECTPATH}uploads/brand/${selectedBrand.brandImage}" alt="${selectedBrand.brandName}" class="productImage"></span>
							<span class="marleft5"><b>${selectedBrand.brandName}</b></span>
						</div>
						<div>
							<span class="pull-right fa fa-remove redText hover" onclick="productFunctionality.removeBrandSelection();"></span>
						</div>
					</div>
				`;
				$('#selectedBrandItem').html(str);
			}
		}
	};
	
	parent.removeBrandSelection = function() {
		const brandId = appCommonFunctionality.getUrlParameter('brandId');
		if (brandId) {
			productFunctionality.goToProducts();
		} else {
			$('#brandId').val(0);
			$('#selectedBrandItem').empty();
			$('#searchBrand').focus();
		}
	};
	
	parent.categoryPredictiveSearch = function(searchedText) {
		const searchCatIconSpan = $('#searchCatIconSpan');
		const searchedCats = $('#searchedCats');
		const searchCatInput = $('#searchCat');
		searchCatIconSpan.html('<span class="fa fa-spinner fa-spin hover"></span>');
		if (CATEGORYPRECOMPILEDDATA.length > 0 && searchedText.length > 2) {
			const searchedCatObjArray = CATEGORYPRECOMPILEDDATA.filter(cat => 
				cat.category.toLowerCase().includes(searchedText.toLowerCase())
			);
			const str = searchedCatObjArray.map(cat => `
				<div class="searchedItem hover" onclick="productFunctionality.onCatSelection(${cat.categoryId}, this)">
					<span class="padLeft4">${cat.category}</span>
				</div>
			`).join('');
			searchedCats.html(str).removeClass('hide');
			searchCatIconSpan.html('<span class="fa fa-close redText hover" onClick="productFunctionality.resetSearchCatField();"></span><span class="fa fa-search marleft5 hover"></span>');
		} else if (searchedText.length === 0) {
			searchedCats.empty().addClass('hide');
			searchCatInput.val('');
			searchCatIconSpan.html('<span class="fa fa-search hover"></span>');
		}
	};

	parent.resetSearchCatField = function() {
		const searchCatInput = $('#searchCat');
		const searchedCats = $('#searchedCats');
		searchCatInput.val('');
		searchedCats.empty().addClass('hide');
	};

	parent.onCatSelection = function(catId, selfObj) {
		if (catId > 0 && !SELECTEDCATEGORYIDARR.includes(catId)) {
			SELECTEDCATEGORYIDARR.push(catId);
			$("#categoryIds").val(SELECTEDCATEGORYIDARR.toString());
			if (selfObj) {
				$(selfObj).hide();
			}
			productFunctionality.populateSelectedCategories();
		}
	};

	parent.populateSelectedCategories = function() {
		const selectedCatItem = $('#selectedCatItem');
		const str = CATEGORYPRECOMPILEDDATA.filter(cat => 
			SELECTEDCATEGORYIDARR.includes(cat.categoryId)
		).map(cat => `
			<div class="selectedCatItem">
				<span class="fa fa-tags darkGreyText"></span>
				<span class="marleft5">${cat.category}</span>
				<span class="fa fa-remove redText hover marleft5" onclick="productFunctionality.removeCatSelection(${cat.categoryId});"></span>
			</div>
		`).join('');
		selectedCatItem.html(str);
	};
	
	parent.removeCatSelection = function(categoryId) {
		if (appCommonFunctionality.getUrlParameter('categoryId')) {
			productFunctionality.goToProducts();
		} else {
			const index = SELECTEDCATEGORYIDARR.indexOf(categoryId);
			if (index > -1) {
				SELECTEDCATEGORYIDARR.splice(index, 1);
				$("#categoryIds").val(SELECTEDCATEGORYIDARR.join(',')); // Using join instead of toString for clarity
			}
			productFunctionality.populateSelectedCategories();
		}
	};
	
	parent.validateProductEntry = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product Title Validation----------------------------------------*/
		var productTitle = $("#productTitle").val();
		if (productTitle === "") {
			appCommonFunctionality.raiseValidation("productTitle", appCommonFunctionality.getCmsString(315), true);
			$("#productTitle").focus();
			errorCount++;
		} else {
			if(parseInt(appCommonFunctionality.getUrlParameter('duplicateProductId')) > 0){
				var productTitleHdn = $("#productTitleHdn").val();
				if(productTitleHdn === productTitle){
					appCommonFunctionality.raiseValidation("productTitle", appCommonFunctionality.getCmsString(410), true);
					$("#productTitle").focus();
					errorCount++;
				}else{
					appCommonFunctionality.removeValidation("productTitle", "productTitle", true);
				}
			}else{
				appCommonFunctionality.removeValidation("productTitle", "productTitle", true);
			}
		}
		/*----------------------------------------------------Product Title Validation----------------------------------------*/
		
		/*----------------------------------------------------Product Brand Validation----------------------------------------*/
		var brandId = $("#brandId").val();
		if (brandId === '0') {
			appCommonFunctionality.raiseValidation("brandId", appCommonFunctionality.getCmsString(412), true);
			$("#brandId").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("brandId", "brandId", true);
		}
		/*----------------------------------------------------Product Brand Validation----------------------------------------*/
		
		/*----------------------------------------------------Product Price Validation----------------------------------------*/
		var productPriceR = $("#productPrice").val();
		if (productPriceR === "") {
			appCommonFunctionality.raiseValidation("productPrice", appCommonFunctionality.getCmsString(318), true);
			$("#productPrice").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("productPrice", "productPrice", true);
		}
		
		var productPriceA = $("#productPriceA").val();
		if (productPriceA === "") {
			appCommonFunctionality.raiseValidation("productPriceA", appCommonFunctionality.getCmsString(321), true);
			$("#productPriceA").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("productPriceA", "productPriceA", true);
		}
		
		var productPriceW = $("#productPriceW").val();
		if (productPriceW === "") {
			appCommonFunctionality.raiseValidation("productPriceW", appCommonFunctionality.getCmsString(324), true);
			$("#productPriceW").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("productPriceW", "productPriceW", true);
		}
		/*----------------------------------------------------Product Price Validation----------------------------------------*/
		
		/*----------------------------------------------------Product Description Validation----------------------------------*/
		var productDesc = window.btoa(encodeURI(quill.root.innerHTML));
		if (productDesc === "") {
			appCommonFunctionality.raiseValidation("productDescErrHolder", appCommonFunctionality.getCmsString(411), false);
			$("#productDesc").focus();
			errorCount++;
		} else {
			$("#productDesc").val(productDesc);
			appCommonFunctionality.removeValidation("productDescErrHolder", "productDescErrHolder", false);
		}
		/*----------------------------------------------------Product Description Validation----------------------------------*/
		
		/*----------------------------------------------------Product Category Validation-------------------------------------*/
		var categoryIdCount = 0;
		$('input[id^=cat_]:checkbox:checked').each(function() {
			categoryIdCount++;
		});
		var prepolulatedCategories = $("#categoryIds").val();
		if(categoryIdCount === 0 && prepolulatedCategories.length === 0){
			alert(appCommonFunctionality.getCmsString(409));
		}
		/*----------------------------------------------------Product Category Validation-------------------------------------*/

		/*----------------------------------------------------Product Meta Keyword Validation---------------------------------*/
		var metaKeyWords = $("#metaKeyWords").val();
		if (metaKeyWords === "") {
			appCommonFunctionality.raiseValidation("metaKeyWords", appCommonFunctionality.getCmsString(360), true);
			$("#metaKeyWords").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("metaKeyWords", "metaKeyWords", true);
		}
		/*----------------------------------------------------Product Meta Keyword Validation---------------------------------*/
		
		/*----------------------------------------------------Product Meta Description Validation-----------------------------*/
		var metaDesc = $("#metaDesc").val();
		if (metaDesc === "") {
			appCommonFunctionality.raiseValidation("metaDesc", appCommonFunctionality.getCmsString(367), true);
			$("#metaDesc").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("metaDesc", "metaDesc", true);
		}
		/*----------------------------------------------------Product Meta Description Validation-----------------------------*/

		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};

	parent.gotoProductImage = function(productId){
		window.location.replace('productImage.php?productId=' + productId);
	};

	parent.initProductImage = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		checkImageMetaInfo();
		const productPreCompileData = JSON.parse($("#productPreCompileData").val());
		const productPriceMatrixData = productPreCompileData.productCombinations;
		if (productPriceMatrixData && productPriceMatrixData.length > 0) {
			PRODUCTPRICEMATRIX = productPriceMatrixData;
			populateProductPriceMatrixTable("PRODUCTIMAGEPAGE");
		}
	};
	
	const checkImageMetaInfo = function() {
		const _URL = window.URL || window.webkitURL;
		const productMainImage = $("#productMainImage");
		productMainImage.change(function(e) {
			const file = this.files[0];
			if (file) {
				const img = new Image();
				const objectUrl = _URL.createObjectURL(file);
				img.onload = function() {
					const ratio = this.width / this.height;
					if (ratio < 0.95 || ratio > 1.05) {
						productMainImage.val('');
						alert("Warning !!! This Image is not appropriate for the product. Please follow the mentioned image ratio.");
					}
					_URL.revokeObjectURL(objectUrl);
				};
				img.src = objectUrl;
			}
		});
	};
	
	parent.validateProductImage = function(){
		var errorCount = 0;
		/*----------------------------------------------------Image Validation-----------------------------------------*/
		if($("#productMainImage").val() === ''){
			appCommonFunctionality.raiseValidation("productMainImage", "Please select image with proper resolution", false);
			errorCount++;
		} else { 
			appCommonFunctionality.removeValidation("productMainImage", "productMainImage", false);
		}
		/*----------------------------------------------------Image Validation-----------------------------------------*/
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};

	parent.openCombinationImageModal = function(productCombinationId) {
		const productPreCompileData = JSON.parse($("#productPreCompileData").val());
		const productCombinationObject = productPreCompileData.productCombinations.find(obj => 
			parseInt(obj.productCombinationId) === parseInt(productCombinationId)
		);
		const productImages = productPreCompileData.productImages.split(',');
		const combinationAssociatedImages = productCombinationObject.images;
		let str = '';
		productImages.forEach(image => {
			const isSelected = combinationAssociatedImages && combinationAssociatedImages.includes(image);
			const imageHolderClass = isSelected ? 'productImage3SelectedHolder' : '';
			const imageClass = isSelected ? 'productImage3Selected' : 'productImage3';
			str += `
				<div class="productImageBlock3 pull-left marRig5 ${imageHolderClass}">
					<img src="${PROJECTPATH}/${PRODUCTIMAGEURL}${image}" alt="${image}" class="${imageClass}" onerror="appCommonFunctionality.onImgError(this)" onclick="productFunctionality.selectThisImage(this)">
				</div>
			`;
		});
		if (productImages.length > 0) {
			str += '<br clear="all">';
		}
		$("#combinationImageModalBody").html(str);
		$("#productCombinationId").val(productCombinationId);
	};
	
	parent.selectThisImage = function(obj) {
		const $obj = $(obj);
		const isSelected = $obj.hasClass('productImage3Selected');
		$obj.toggleClass('productImage3Selected', !isSelected)
			.toggleClass('productImage3', isSelected)
			.parent().toggleClass('productImage3SelectedHolder', !isSelected);
	};
	
	parent.saveCombinationImage = function() {
		const imageNames = $('.productImage3SelectedHolder img').map((i, img) => {
			const imgSrcArr = $(img).attr('src').split('/');
			return imgSrcArr[imgSrcArr.length - 1];
		}).get().join(',');
		const productCombinationId = $("#productCombinationId").val();
		const productId = appCommonFunctionality.getUrlParameter('productId');
		window.location.replace(`productImage.php?ACTION=UPDATEASSOCIATEDIMAGES&productId=${productId}&productCombinationId=${productCombinationId}&associatedImages=${imageNames}`);
	};
	
	parent.goToProductCategory = function(productId){
		window.location.replace('productCategory.php?productId=' + productId);
	};
	
	parent.validateProductCategory = function(){
		var errorCount = 0;
		/*----------------------------------------------------Category Validation-----------------------------------------*/
		if($("input[id^=cat_]:checkbox:checked").length === 0){
			appCommonFunctionality.raiseValidation("categoryErrHolder", "Please Select atleast one Category", false);
			errorCount++;
		} else { 
			var categoryStr = "";
			$('input[id^=cat_]:checkbox:checked').each(function() {
			   categoryStr = categoryStr + this.value + ",";
			});
			categoryStr = categoryStr.slice(0, -1);
			$("#categoryIds").val(categoryStr);
			appCommonFunctionality.removeValidation("categoryErrHolder", "categoryErrHolder", false);
		}
		/*----------------------------------------------------Category Validation-----------------------------------------*/
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.gotoProductFeature = function(productId){
		window.location.replace('productFeature.php?productId=' + productId);
	}; 
	
	parent.initProductFeature = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const featureData = $('#featureData').val();
		let productFeatures = JSON.parse(featureData);
		if (productFeatures.length === 0) {
			productFeatures = [{
				featureId: 0,
				featureTitle: "",
				featureType: "text",
				featureValue: "",
				featureUnit: "",
				uniqueId: ""
			}];
		}
		PRODUCTFEATURES = productFeatures;
		populateFeatureInputTable();
	};
	
	const populateFeatureInputTable = function() {
		const productFeatureSerializedData = JSON.parse($('#productFeatureSerializedData').val());
		let str = '';
		if (productFeatureSerializedData.length > 0 && PRODUCTFEATURES.length > 0) {
			str += `
				<table id="featureInputTable" class="table table-bordered table-striped minW720">
					<thead>
						<tr>
							<th width="35%" id="cms_66">Product Feature</th>
							<th width="35%" id="cms_140">Unit</th>
							<th width="20%" id="cms_141">Value</th>
							<th width="10%" id="cms_138">Action</th>
						</tr>
					</thead>
					<tbody>
			`;
			PRODUCTFEATURES.forEach((feature, i) => {
				const featureId = parseInt(feature.featureId);
				const featureOptions = productFeatureSerializedData.map(data => `
					<option value="${data.featureId}" ${data.featureId === featureId ? 'selected' : ''}>
						${data.featureTitle}
					</option>
				`).join('');
				str += `
					<tr>
						<td>
							<select id="featureRow_${i + 1}" onchange="productFunctionality.populateProductFeatureUnitDDL(${i + 1}, this.value)">
								<option value="0" id="cms_142">-Select Feature-</option>
								${featureOptions}
							</select>
						</td>
						<td>${featureId > 0 ? getFeatureUnitDDL(i + 1, featureId, feature.featureUnit) : ''}</td>
						<td>${featureId > 0 ? `<input type="${feature.featureType}" id="featureInput_${i + 1}" name="featureInput_${i + 1}" value="${feature.featureValue}">` : ''}</td>
						<td>
							<i class="fa fa-plus greenText hover" onclick="productFunctionality.addDeleteRowProductFeatureTable(${i + 1}, true)"></i>
							<i class="fa fa-trash redText hover marleft10" onclick="productFunctionality.addDeleteRowProductFeatureTable(${i + 1}, false)"></i>
						</td>
					</tr>
				`;
			});
			str += `
					</tbody>
				</table>
			`;
		}
		$('#featureInputTableHolder').html(str);
	};
	
	const populateProductFeatureUnitDDL = function(row, featureId) {
		const productFeatureSerializedData = JSON.parse($('#productFeatureSerializedData').val());
		let featureUnitDDlStr = '';
		let featureInputStr = '<input type="text" id="featureInput_' + row + '" name="featureInput_' + row + '" value="">';
		if (productFeatureSerializedData.length > 0) {
			const feature = productFeatureSerializedData.find(data => parseInt(data.featureId) === parseInt(featureId));
			if (feature) {
				if (feature.featureUnit) {
					const selectedFeatureUnits = feature.featureUnit.split(",");
					featureUnitDDlStr = `
						<select id="featureUnitRow_${row}">
							<option value="" id="cms_143">-Select Unit-</option>
							${selectedFeatureUnits.map(unit => `<option value="${unit}">${unit}</option>`).join('')}
						</select>
					`;
				}
				featureInputStr = `<input type="${feature.featureType}" id="featureInput_${row}" name="featureInput_${row}" value="">`;
			}
		}
		$(`#featureInputTable>tbody>tr:nth-child(${row})>td:nth-child(2)`).html(featureUnitDDlStr);
		$(`#featureInputTable>tbody>tr:nth-child(${row})>td:nth-child(3)`).html(featureInputStr);
	};
	
	const addDeleteRowProductFeatureTable = function(row, action) {
		updateProductFeatureGlobalVar();
		if (action) {
			PRODUCTFEATURES.push({
				featureId: 0,
				featureTitle: "",
				featureType: "text",
				featureValue: "",
				featureUnit: "",
				uniqueId: ""
			});
		} else {
			PRODUCTFEATURES.splice(row - 1, 1);
		}
		populateFeatureInputTable();
	};
	
	const updateProductFeatureGlobalVar = function() {
		const rows = $('#featureInputTable>tbody>tr');
		rows.each(function(index) {
			const row = index + 1;
			const featureId = parseInt($(`#featureRow_${row}`).val());
			const featureTitle = $(`#featureRow_${row} option:selected`).text();
			const featureUnit = $(`#featureUnitRow_${row}`).val() || "";
			const featureType = $(`#featureInput_${row}`).prop('type');
			const featureValue = $(`#featureInput_${row}`).val();
			PRODUCTFEATURES[index] = {
				featureId,
				featureTitle,
				featureType,
				featureValue,
				featureUnit,
				uniqueId: `${featureId}-${row}`
			};
		});
	};
	
	const productFeatureFormValidation = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product Feature Validation----------------------------------------*/
		$('select[id^="featureRow_"]').each(function () {
			if(parseInt(this.value) === 0){
				errorCount++;
				appCommonFunctionality.raiseValidation(this.id, '', false);
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*----------------------------------------------------Product Feature Validation----------------------------------------*/
		
		/*----------------------------------------------------Product Feature Unit Validation-----------------------------------*/
		$('select[id^="featureUnitRow_"]').each(function () {
			if(this.value === ''){
				errorCount++;
				appCommonFunctionality.raiseValidation(this.id, '', false);
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*----------------------------------------------------Product Feature Unit Validation-----------------------------------*/
		
		/*----------------------------------------------------Product Feature Value Validation----------------------------------*/
		$('input[id^="featureInput_"]').each(function () {
			if((this.value).length === 0){
				errorCount++;
				appCommonFunctionality.raiseValidation(this.id, '', false);
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*----------------------------------------------------Product Feature Value Validation----------------------------------*/
		
		if (errorCount === 0) {
			updateProductFeatureGlobalVar();
			$('#featureData').val(JSON.stringify(PRODUCTFEATURES));
			if (confirm(appCommonFunctionality.getCmsString(144)) == true) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	};
	
	parent.gotoProductPriceMatrix = function(productId){
		window.location.replace('productPriceMatrix.php?productId=' + productId);
	};
	
	const getFeatureUnitDDL = function(row, featureId, selectedValue) {
		const productFeatureSerializedData = JSON.parse($('#productFeatureSerializedData').val());
		const feature = productFeatureSerializedData.find(data => parseInt(data.featureId) === parseInt(featureId));
		if (!feature || !feature.featureUnit) return '';
		const featureUnitArr = feature.featureUnit.split(',');
		const options = featureUnitArr.map(unit => `
			<option value="${unit}" ${unit === selectedValue ? 'selected' : ''}>${unit}</option>
		`).join('');
		return `
			<select id="featureUnitRow_${row}">
				<option id="cms_143">-Select Unit-</option>
				${options}
			</select>
		`;
	};
	
	parent.initProductPriceMatrix = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const productPreCompileData = JSON.parse($("#productPreCompileData").val());
		let productFeatures = productPreCompileData.productFeature || [];
		if (productFeatures.length > 0) {
			PRODUCTFEATURES = productFeatures;
		}
		const featureIdArr = [...new Set(PRODUCTFEATURES.map(feature => feature.featureId))];
		//console.log(featureIdArr);
		const arrayOfFeatureUniqueIdArray = featureIdArr.map(featureId => 
			PRODUCTFEATURES.filter(feature => feature.featureId === featureId).map(feature => feature.uniqueId)
		);
		//console.log(arrayOfFeatureUniqueIdArray);
		let combinationUniqueIdArray = [];
		if (featureIdArr.length > 1) {
			for (let i = 1; i < arrayOfFeatureUniqueIdArray.length; i++) {
				if (i === 1) {
					combinationUniqueIdArray = makeCombinationOfArray(arrayOfFeatureUniqueIdArray[0], arrayOfFeatureUniqueIdArray[1]);
				} else {
					combinationUniqueIdArray = makeCombinationOfArray(combinationUniqueIdArray, arrayOfFeatureUniqueIdArray[i]);
				}
			}
		} else {
			combinationUniqueIdArray = arrayOfFeatureUniqueIdArray.flat();
		}
		updateProductPriceMatrix(combinationUniqueIdArray);
		//console.log(PRODUCTPRICEMATRIX);
		populateProductPriceMatrixTable("PRODUCTPRICEMATRIXPAGE");
	};
	
	const makeCombinationOfArray = function(array1, array2){
		return array1.flatMap(d => array2.map(v => d + 'X' + v));
	};
	
	const updateProductPriceMatrix = function(combinationUniqueIdArray) {
		const productPreCompileData = JSON.parse($("#productPreCompileData").val());
		
		if (productPreCompileData.productCombinations && productPreCompileData.productCombinations.length > 0) {
			PRODUCTPRICEMATRIX = productPreCompileData.productCombinations;
		} else {
			const productCode = $('#productCode').val();
			combinationUniqueIdArray.forEach(combinationUniqueId => {
				const combination = combinationUniqueId.split('X').map(uniqueId => 
					PRODUCTFEATURES.find(feature => feature.uniqueId === uniqueId)
				);

				PRODUCTPRICEMATRIX.push({
					combination,
					RPrice: 0.00,
					WPrice: 0.00,
					QRText: getCombinationText(combinationUniqueId, productCode, false)
				});
			});
		}
	};
	
	const populateProductPriceMatrixTable = function(identifire){
		var productCode = $('#productCode').val();
		str = '';
		switch(identifire) {
			
			case "PRODUCTIMAGEPAGE":{
				str = str + '<table id="productPriceMatrixTable" class="table table-bordered table-striped minW720">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th width="5%">QR</th>';
							str = str + '<th width="70%" id="cms_145">Combinations </th>';
							str = str + '<th width="25%" id="cms_65">Product Images</th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						for(var i = 0; i < PRODUCTPRICEMATRIX.length; i++){
							var QRText = PRODUCTPRICEMATRIX[i].QRText;
							var QRTextParts = QRText.split('_');
							var guid = QRTextParts[1];
							str = str + '<tr>';
								str = str + '<td class="text-center">';
									str = str + '<img src="' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '" alt="' + PRODUCTPRICEMATRIX[i].QRText + '" class="productQRCode magnifire" data-toggle="modal" data-target="#QRModal" onclick="productFunctionality.openQRModal(\'' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '.png\')" onerror="productFunctionality.onImgError(this);">';
									str = str + '<br><span class="f10">' + PRODUCTPRICEMATRIX[i].productCombinationId + '</span>';
								str = str + '</td>';
								str = str + '<td>';
									str = str + getQRTextHtml(PRODUCTPRICEMATRIX[i].QRText, productCode);
								str = str + '</td>';
								str = str + '<td>';
									str = str + getCombinationImageHtml(PRODUCTPRICEMATRIX[i].productCombinationId);
									str = str + '<button id="addCombinationImage-' + PRODUCTPRICEMATRIX[i].productCombinationId + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" data-toggle="modal" data-target="#combinationImageModal" onclick="productFunctionality.openCombinationImageModal(' + PRODUCTPRICEMATRIX[i].productCombinationId + ')" rel="cms_146">Associated Images</button>';
									str = str + '<button id="addCombinationImageArrangement-' + PRODUCTPRICEMATRIX[i].productCombinationId + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" onclick="productFunctionality.combinationImageArrangement(' + PRODUCTPRICEMATRIX[i].productCombinationId + ', ' + appCommonFunctionality.getUrlParameter('productId') + ')" rel="cms_147">Arrange Associated Images</button>';
								str = str + '</td>';
							str = str + '</tr>';
						}
					str = str + '</tbody>';
				str = str + '</table>';
				break;
			}
			
			case "PRODUCTPRICEMATRIXPAGE":{
				str = str + '<table id="productPriceMatrixTable" class="table table-bordered table-striped minW720">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th width="5%">QR</th>';
							str = str + '<th width="50%" id="cms_145">Combinations </th>';
							str = str + '<th width="15%"><span id="cms_148">Purchase Price</span> (' + appCommonFunctionality.getDefaultCurrency() + ')</th>';
							str = str + '<th width="15%"><span id="cms_149">Retail Price</span> (' + appCommonFunctionality.getDefaultCurrency() + ')</th>';
							str = str + '<th width="15%"><span id="cms_150">Wholesale Price</span> (' + appCommonFunctionality.getDefaultCurrency() + ')</th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						for(var i = 0; i < PRODUCTPRICEMATRIX.length; i++){
							var QRText = PRODUCTPRICEMATRIX[i].QRText;
							var QRTextParts = QRText.split('_');
							var guid = QRTextParts[1];
							str = str + '<tr>';
								str = str + '<td class="text-center">';
									str = str + '<img src="' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '" alt="' + PRODUCTPRICEMATRIX[i].QRText + '" class="productQRCode magnifire" data-toggle="modal" data-target="#QRModal" onclick="productFunctionality.openQRModal(\'' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '.png\')" onerror="productFunctionality.onImgError(this);">';
									if (typeof PRODUCTPRICEMATRIX[i].productCombinationId  !== "undefined"){
										str = str + '<br><span class="f10">' + PRODUCTPRICEMATRIX[i].productCombinationId + '</span>';
									}
								str = str + '</td>';
								str = str + '<td>' + getQRTextHtml(PRODUCTPRICEMATRIX[i].QRText, productCode) + '</td>';
								str = str + '<td>';
									str = str + '<input type="number" id="PPrice_' + i + '_' + guid + '" name="PPrice_' + i + '_' + guid + '" value="' + PRODUCTPRICEMATRIX[i].PPrice + '" step="0.01" class="w80p">';
									str = str + '<br><button id="copyDown-RPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" onclick="productFunctionality.copyPriceToBelowFields(\'PPrice\', ' + i + ')"><i class="fa fa-copy marTop3"></i><i class="fa fa-angle-double-down marleft5 marTop3"></i></button>';
								str = str + '</td>';
								str = str + '<td>';
									str = str + '<input type="number" id="RPrice_' + i + '_' + guid + '" name="RPrice_' + i + '_' + guid + '" value="' + PRODUCTPRICEMATRIX[i].RPrice + '" step="0.01" class="w80p">';
									str = str + '<br><button id="copyDown-RPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" onclick="productFunctionality.copyPriceToBelowFields(\'RPrice\', ' + i + ')"><i class="fa fa-copy marTop3"></i><i class="fa fa-angle-double-down marleft5 marTop3"></i></button>';
								str = str + '</td>';
								str = str + '<td>';
									str = str + '<input type="number" id="WPrice_' + i + '_' + guid + '" name="WPrice_' + i + '_' + guid + '" value="' + PRODUCTPRICEMATRIX[i].WPrice + '" step="0.01" class="w80p">';
									str = str + '<br><button id="copyDown-RPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" onclick="productFunctionality.copyPriceToBelowFields(\'WPrice\', ' + i + ')"><i class="fa fa-copy marTop3"></i><i class="fa fa-angle-double-down marleft5 marTop3"></i></button>';
								str = str + '</td>';
							str = str + '</tr>';
						}
					str = str + '</tbody>';
				str = str + '</table>';
				break;
			}
			
			case "PRODUCTOFFERPAGE":{
				str = str + '<table id="productPriceMatrixTable" class="table table-bordered table-striped minW720">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th width="5%">QR</th>';
							str = str + '<th width="55%" id="cms_145">Combinations </th>';
							str = str + '<th width="20%" id="cms_149">Retail Price</th>';
							str = str + '<th width="20%" id="cms_150">Wholesale Price</th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						for(var i = 0; i < PRODUCTPRICEMATRIX.length; i++){
							var QRText = PRODUCTPRICEMATRIX[i].QRText;
							var QRTextParts = QRText.split('_');
							var guid = QRTextParts[1];
							str = str + '<tr>';
								str = str + '<td class="text-center">';
									str = str + '<img src="' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '" alt="' + PRODUCTPRICEMATRIX[i].QRText + '" class="productQRCode magnifire" data-toggle="modal" data-target="#QRModal" onclick="productFunctionality.openQRModal(\'' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '.png\')" onerror="productFunctionality.onImgError(this);">';
									str = str + '<br><span class="f10">' + PRODUCTPRICEMATRIX[i].productCombinationId + '</span>';
								str = str + '</td>';
								str = str + '<td>';
									str = str + getQRTextHtml(PRODUCTPRICEMATRIX[i].QRText, productCode);
									str = str + '<br /><span class="f12"><span id="cms_148">Purchase Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].PPrice + '</span>';
								str = str + '</td>';
								str = str + '<td>';
									if(PRODUCTPRICEMATRIX[i].offers !== null &&
										typeof PRODUCTPRICEMATRIX[i].offers.RofferPercentage !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.RofferStartDate !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.RofferEndDate !== "undefined" &&
										parseFloat(PRODUCTPRICEMATRIX[i].offers.RofferPercentage) > 0){
										str = str + '<div class="f12">';
											str = str + '<span class="lineThrough">' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].RPrice + '</span>';
											str = str + '<span> of ' + PRODUCTPRICEMATRIX[i].offers.RofferPercentage + ' %</span>';
											str = str + '<span><img src="' + PROJECTPATH + 'assets/images/offerTag.png" alt="offer" class="offerLogo"></span>';
										str = str + '</div>';
										str = str + '<div class="f12">';
											str = str + '<span> <span id="cms_151">Effective Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + (PRODUCTPRICEMATRIX[i].RPrice - ((PRODUCTPRICEMATRIX[i].RPrice * PRODUCTPRICEMATRIX[i].offers.RofferPercentage)/100)) + ' </span>';
										str = str + '</div>';
										str = str + '<div class="f12">';
											str = str + '<span>[ ' + PRODUCTPRICEMATRIX[i].offers.RofferStartDate  + ' :: ' + PRODUCTPRICEMATRIX[i].offers.RofferEndDate + ' ]</span>';
										str = str + '</div>';
										str = str + '<div>';
											str = str + '<button id="removeOfferBtn-RPrice-' + i + '" type="button" class="btn btn-danger btn-xs marleft5 marTop3 f10" onclick="productFunctionality.removeOffer(1, ' + i + ')" rel="cms_152">Remove Offer</button>';
											str = str + '<button id="removeOfferBtn-RPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" onclick="productFunctionality.copyOfferDown(1, ' + i + ')"><i class="fa fa-copy marTop3"></i><i class="fa fa-angle-double-down marleft5 marTop3"></i></button>';
										str = str + '</div>';
									}else{
										str = str + '<div>';
											str = str + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].RPrice;
										str = str + '</div>';
										str = str + '<div>';
											str = str + '<button id="addOfferBtn-RPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" data-toggle="modal" data-target="#OfferModal" onclick="productFunctionality.openOfferModal(1, ' + i + ')" rel="cms_153">Add Offer</button>';
										str = str + '</div>';
									}
								str = str + '</td>';
								str = str + '<td>';
									if(PRODUCTPRICEMATRIX[i].offers !== null &&
										typeof PRODUCTPRICEMATRIX[i].offers.WofferPercentage !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.WofferStartDate !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.WofferEndDate !== "undefined" && 
										parseFloat(PRODUCTPRICEMATRIX[i].offers.WofferPercentage) > 0){
										str = str + '<div class="f12">';
											str = str + '<span class="lineThrough">' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].WPrice + '</span>';
											str = str + '<span> of ' + PRODUCTPRICEMATRIX[i].offers.WofferPercentage + ' %</span>';
											str = str + '<span><img src="' + PROJECTPATH + 'assets/images/offerTag.png" alt="offer" class="offerLogo"></span>';
										str = str + '</div>';
										str = str + '<div class="f12">';
											str = str + '<span> <span id="cms_151">Effective Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + (PRODUCTPRICEMATRIX[i].WPrice - ((PRODUCTPRICEMATRIX[i].WPrice * PRODUCTPRICEMATRIX[i].offers.WofferPercentage)/100)) + ' </span>';
										str = str + '</div>';
										str = str + '<div class="f12">';
											str = str + '<span>[ ' + PRODUCTPRICEMATRIX[i].offers.WofferStartDate  + ' :: ' + PRODUCTPRICEMATRIX[i].offers.WofferEndDate + ' ]</span>';
										str = str + '</div>';
										str = str + '<div>';
											str = str + '<button id="removeOfferBtn-RPrice-' + i + '" type="button" class="btn btn-danger btn-xs marleft5 marTop3 f10" onclick="productFunctionality.removeOffer(2, ' + i + ')" rel="cms_152">Remove Offer</button>';
											str = str + '<button id="removeOfferBtn-RPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" onclick="productFunctionality.copyOfferDown(2, ' + i + ')"><i class="fa fa-copy marTop3"></i><i class="fa fa-angle-double-down marleft5 marTop3"></i></button>';
										str = str + '</div>';
									}else{
										str = str + '<div>';
											str = str + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].WPrice;
										str = str + '</div>';
										str = str + '<div>';
											str = str + '<button id="addOfferBtn-WPrice-' + i + '" type="button" class="btn btn-success btn-xs marleft5 marTop3 f10" data-toggle="modal" data-target="#OfferModal" onclick="productFunctionality.openOfferModal(2, ' + i + ')" rel="cms_153">Add Offer</button>';
										str = str + '</div>';
									}
								str = str + '</td>';
							str = str + '</tr>';
						}
					str = str + '</tbody>';
				str = str + '</table>';
				break;
			}
			
			case "PRODUCTSTOCKPAGE":{
				var productId = parseInt($("#productId").val());
				str = str + '<table id="productPriceMatrixTable" class="table table-bordered table-striped">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th width="5%">QR</th>';
							str = str + '<th width="75%" id="cms_145">Combinations </th>';
							str = str + '<th width="20%" id="cms_50">Stock Volumn</th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						for(var i = 0; i < PRODUCTPRICEMATRIX.length; i++){
							var QRText = PRODUCTPRICEMATRIX[i].QRText;
							var QRTextParts = QRText.split('_');
							var guid = QRTextParts[1];
							str = str + '<tr>';
								str = str + '<td class="text-center">';
									str = str + '<img src="' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '" alt="' + PRODUCTPRICEMATRIX[i].QRText + '" class="productQRCode magnifire" data-toggle="modal" data-target="#QRModal" onclick="productFunctionality.openQRModal(\'' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '.png\')" onerror="productFunctionality.onImgError(this);">';
									str = str + '<br><span class="f10">' + PRODUCTPRICEMATRIX[i].productCombinationId + '</span>';
								str = str + '</td>';
								str = str + '<td>';
									str = str + getQRTextHtml(PRODUCTPRICEMATRIX[i].QRText, productCode);
								str = str + '</td>';
								str = str + "<td>";
									if(PRODUCTPRICEMATRIX[i].stockVolumn === 0){
										str = str + "<span class='f24 hover'>" + PRODUCTPRICEMATRIX[i].stockVolumn + "</span>";
									}else{
										str = str + "<span class='f24 hover' onclick='productFunctionality.gotoStockDetails(" + productId + ", " + PRODUCTPRICEMATRIX[i].productCombinationId + ")'>" + PRODUCTPRICEMATRIX[i].stockVolumn + "</span>";
										str = str + "<i class='fa fa-tv blueText hover marleft5' onclick='productFunctionality.gotoStockDetails(" + productId + ", " + PRODUCTPRICEMATRIX[i].productCombinationId + ")'></i>";
									}
									str = str + "<i class='fa fa-plus greenText hover marleft5' onclick='productFunctionality.addStocks(" + productId + ", " + PRODUCTPRICEMATRIX[i].productCombinationId + ")'></i>";
								str = str + "</td>";
							str = str + '</tr>';
						}
					str = str + '</tbody>';
				str = str + '</table>';
				break;
			}
			
			case "PRODUCTDETAILSPAGE":{
				var productId = parseInt($("#productId").val());
				str = str + '<table id="productPriceMatrixTable" class="table table-bordered table-striped minW720">';
					str = str + '<thead>';
						str = str + '<tr>';
							str = str + '<th width="5%">QR</th>';
							str = str + '<th width="35%" id="cms_145">Combinations </th>';
							str = str + '<th width="30%" id="cms_155">Prices & Offers</th>';
							str = str + '<th width="10%" id="cms_158">Stock</th>';
							str = str + '<th width="20%" id="cms_65">Images</th>';
						str = str + '</tr>';
					str = str + '</thead>';
					str = str + '<tbody>';
						for(var i = 0; i < PRODUCTPRICEMATRIX.length; i++){
							var QRText = PRODUCTPRICEMATRIX[i].QRText;
							var QRTextParts = QRText.split('_');
							var guid = QRTextParts[1];
							str = str + '<tr>';
								str = str + '<td class="text-center">';
									str = str + '<img src="' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '" alt="' + PRODUCTPRICEMATRIX[i].QRText + '" class="productQRCode magnifire" data-toggle="modal" data-target="#QRModal" onclick="productFunctionality.openQRModal(\'' + QRCODEAPIURL + PRODUCTPRICEMATRIX[i].QRText + '.png\')" onerror="productFunctionality.onImgError(this);">';
									str = str + '<br><span class="f10">' + PRODUCTPRICEMATRIX[i].productCombinationId + '</span>';
								str = str + '</td>';
								str = str + '<td>';
									str = str + getQRTextHtml(PRODUCTPRICEMATRIX[i].QRText, productCode);
								str = str + '</td>';
								str = str + '<td>';
									str = str + '<div class="f12"><span id="cms_148">Purchase Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].PPrice + '</div>';
									/*------------------------------------------Populate Retail Price------------------------------------------*/
									if(PRODUCTPRICEMATRIX[i].offers !== null &&
										typeof PRODUCTPRICEMATRIX[i].offers.RofferPercentage !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.RofferStartDate !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.RofferEndDate !== "undefined" &&
										parseFloat(PRODUCTPRICEMATRIX[i].offers.RofferPercentage) > 0){
										str = str + '<div class="f12">';
											str = str + '<span class="f12"><span id="cms_149">Retail Price</span> :</span>';
											str = str + '<span class="lineThrough">' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].RPrice + '</span>';
											str = str + '<span> of ' + PRODUCTPRICEMATRIX[i].offers.RofferPercentage + ' %</span>';
											str = str + '<span><img src="' + PROJECTPATH + 'assets/images/offerTag.png" alt="offer" class="offerLogo"></span>';
											str = str + '<span> <span id="cms_151">Effective Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + (PRODUCTPRICEMATRIX[i].RPrice - ((PRODUCTPRICEMATRIX[i].RPrice * PRODUCTPRICEMATRIX[i].offers.RofferPercentage)/100)).toFixed(2); + ' </span>';
											str = str + '<span>[ ' + PRODUCTPRICEMATRIX[i].offers.RofferStartDate  + ' :: ' + PRODUCTPRICEMATRIX[i].offers.RofferEndDate + ' ]</span>';
										str = str + '</div>';
									}else{
										str = str + '<div class="f12"> <span id="cms_149">Retail Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].RPrice + '</div>';
									}
									/*------------------------------------------Populate Retail Price------------------------------------------*/
									/*------------------------------------------Populate Wholesale Price---------------------------------------*/
									if(PRODUCTPRICEMATRIX[i].offers !== null &&
										typeof PRODUCTPRICEMATRIX[i].offers.WofferPercentage !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.WofferStartDate !== "undefined" && 
										typeof PRODUCTPRICEMATRIX[i].offers.WofferEndDate !== "undefined" && 
										parseFloat(PRODUCTPRICEMATRIX[i].offers.WofferPercentage) > 0){
										str = str + '<div class="f12">';
											str = str + '<span class="f12"><span id="cms_150">Wholesale Price</span> : </span>';
											str = str + '<span class="lineThrough">' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].WPrice + '</span>';
											str = str + '<span> of ' + PRODUCTPRICEMATRIX[i].offers.WofferPercentage + ' %</span>';
											str = str + '<span><img src="' + PROJECTPATH + 'assets/images/offerTag.png" alt="offer" class="offerLogo"></span>';
											str = str + '<span> <span id="cms_151">Effective Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + (PRODUCTPRICEMATRIX[i].WPrice - ((PRODUCTPRICEMATRIX[i].WPrice * PRODUCTPRICEMATRIX[i].offers.WofferPercentage)/100)).toFixed(2); + ' </span>';
											str = str + '<span>[ ' + PRODUCTPRICEMATRIX[i].offers.WofferStartDate  + ' :: ' + PRODUCTPRICEMATRIX[i].offers.WofferEndDate + ' ]</span>';
										str = str + '</div>';
									}else{
										str = str + '<div class="f12"><span id="cms_150">Wholesale Price</span> : ' + appCommonFunctionality.getDefaultCurrency() + PRODUCTPRICEMATRIX[i].WPrice + '</div>';
									}
									/*------------------------------------------Populate Wholesale Price---------------------------------------*/
								str = str + '</td>';
								str = str + "<td>";
									if(PRODUCTPRICEMATRIX[i].stockVolumn === 0){
										str = str + "<span class='f24 hover'>" + PRODUCTPRICEMATRIX[i].stockVolumn + "</span>";
									}else{
										str = str + "<span class='f24 hover' onclick='productFunctionality.gotoStockDetails(" + productId + ", " + PRODUCTPRICEMATRIX[i].productCombinationId + ")'>" + PRODUCTPRICEMATRIX[i].stockVolumn + "</span>";
										str = str + "<i class='fa fa-tv blueText hover marleft5' onclick='productFunctionality.gotoStockDetails(" + productId + ", " + PRODUCTPRICEMATRIX[i].productCombinationId + ")'></i>";
									}
								str = str + "</td>";
								str = str + '<td>';
									str = str + getCombinationImageHtml(PRODUCTPRICEMATRIX[i].productCombinationId);
								str = str + '</td>';
							str = str + '</tr>';
						}
					str = str + '</tbody>';
				str = str + '</table>';
				break;
			}
		}
		$('#productPriceMatrixTableHolder').html(str);
	};

	const getCombinationText = function(combination, productCode, withSpace){
		var combinationText = '';
		if(combination.indexOf('X') === -1){
			for(var j = 0; j < PRODUCTFEATURES.length; j++){
				if(PRODUCTFEATURES[j].uniqueId === combination){
					combinationText = combinationText + PRODUCTFEATURES[j].featureTitle + ' : ' + PRODUCTFEATURES[j].featureValue + ' ' + appCommonFunctionality.capitalizeFirstLetter(PRODUCTFEATURES[j].featureUnit) + ' X '
				}
			}
		}else{
			var combArr = combination.split('X');
			for(var i = 0; i < combArr.length; i++){
				for(var j = 0; j < PRODUCTFEATURES.length; j++){
					if(PRODUCTFEATURES[j].uniqueId === combArr[i]){
						combinationText = combinationText + PRODUCTFEATURES[j].featureTitle + ' : ' + PRODUCTFEATURES[j].featureValue + ' ' + appCommonFunctionality.capitalizeFirstLetter(PRODUCTFEATURES[j].featureUnit) + ' X '
					}
				}
			}
			combinationText = combinationText.slice(0, -3);
		}
		combinationText = productCode + '-' + combinationText + '_' + appCommonFunctionality.guid();
		if(!withSpace){
			combinationText = combinationText.replace(/ /g, "");
		}
		combinationText = combinationText.replace(/#/g, "");
		return combinationText;
	};
	
	const getCombinationImageHtml = function(productCombinationId) {
		let combinationImageStr = '';
		const productCombination = PRODUCTPRICEMATRIX.find(item => parseInt(item.productCombinationId) === parseInt(productCombinationId));
		if (productCombination && productCombination.images) {
			const combinationImageArray = productCombination.images.split(',');
			const imageCounter = Math.min(combinationImageArray.length, 3);
			for (let j = 0; j < imageCounter; j++) { // Show the first 3 selected images
				combinationImageStr += `
					<div class="productImageBlock4 pull-left marRig5 marBot3">
						<img src="${PROJECTPATH}/${PRODUCTIMAGEURL}${combinationImageArray[j]}" alt="${combinationImageArray[j]}" onerror="appCommonFunctionality.onImgError(this)">
					</div>`;
			}
			if (combinationImageArray.length > 3) { // Show the count after 3 images
				combinationImageStr += `
					<div class="productImageBlock4 pull-left marRig5 marBot3">
						<span class="f24">${combinationImageArray.length - 3}+</span>
					</div>`;
			}
		}
		return combinationImageStr;
	};
	
	parent.copyPriceToBelowFields = function(priceType, index) {
		const noOfRows = $('#productPriceMatrixTable > tbody > tr').length;
		const valToBeCopied = $(`[id^=${priceType}_${index}_]`).val();
		for (let i = index; i < noOfRows; i++) {
			$(`[id^=${priceType}_${i}_]`).val(valToBeCopied);
		}
	};
	
	parent.productPriceMatrixValidation = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product RPrice Value Validation----------------------------------*/
		$('input[id^="RPrice_"]').each(function () {
			if(parseInt(this.value) === 0){
				errorCount++;
				appCommonFunctionality.raiseValidation(this.id, '', false);
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*----------------------------------------------------Product RPrice Value Validation----------------------------------*/
		
		/*----------------------------------------------------Product WPrice Value Validation----------------------------------*/
		$('input[id^="WPrice_"]').each(function () {
			if(parseInt(this.value) === 0){
				errorCount++;
				appCommonFunctionality.raiseValidation(this.id, '', false);
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*----------------------------------------------------Product WPrice Value Validation----------------------------------*/
		
		/*----------------------------------------------------Product PPrice Value Validation----------------------------------*/
		$('input[id^="PPrice_"]').each(function () {
			if(parseInt(this.value) === 0){
				errorCount++;
				appCommonFunctionality.raiseValidation(this.id, '', false);
			}else{
				appCommonFunctionality.removeValidation(this.id, this.id, false);
			}
		});
		/*----------------------------------------------------Product PPrice Value Validation----------------------------------*/
		
		if (errorCount === 0) {
			updateProductPriceMatrixGlobalVar();
			$('#productPriceMatrixData').val(JSON.stringify(PRODUCTPRICEMATRIX));
			return true;
		} else {
			return false;
		}
	};
	
	const updateProductPriceMatrixGlobalVar = function() {
		const updatePrice = (priceType) => {
			$(`input[id^="${priceType}_"]`).each(function () {
				const [_, __, guid] = this.id.split('_');
				const price = this.value;
				PRODUCTPRICEMATRIX.forEach(item => {
					if (item.QRText.includes(guid)) {
						item[priceType] = price;
					}
				});
			});
		};

		updatePrice('RPrice');
		updatePrice('WPrice');
		updatePrice('PPrice');
	};
	
	parent.goToProductOffer = function(productId){
		window.location.replace('productOffer.php?productId=' + productId);
	};
	
	parent.initProductOffer = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const productPreCompileData = JSON.parse($("#productPreCompileData").val());
		const productPriceMatrixData = productPreCompileData.productCombinations;
		if (productPriceMatrixData && productPriceMatrixData.length > 0) {
			PRODUCTPRICEMATRIX = productPriceMatrixData;
			populateProductPriceMatrixTable("PRODUCTOFFERPAGE");
		}
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
	
	parent.openOfferModal = function(type, index){
		$('#OfferModalType').val(type);
		$('#OfferModalIndex').val(index);
	};
	
	parent.saveOfferPercentage = function() {
		if (offerPercentageValidation()) {
			const offerPercentage = $('#OfferPercent').val();
			const startDate = $('#startDate').val();
			const endDate = $('#endDate').val();
			const OfferModalType = parseInt($('#OfferModalType').val());
			const OfferModalIndex = parseInt($('#OfferModalIndex').val());
			PRODUCTPRICEMATRIX.forEach((item, index) => {
				let offerObj = {
					RofferPercentage: item.offers?.RofferPercentage || 0,
					RofferStartDate: item.offers?.RofferStartDate || '',
					RofferEndDate: item.offers?.RofferEndDate || '',
					WofferPercentage: item.offers?.WofferPercentage || 0,
					WofferStartDate: item.offers?.WofferStartDate || '',
					WofferEndDate: item.offers?.WofferEndDate || ''
				};
				if (OfferModalIndex === index) {
					if (OfferModalType === 1) {
						offerObj.RofferPercentage = offerPercentage;
						offerObj.RofferStartDate = startDate;
						offerObj.RofferEndDate = endDate;
					} else if (OfferModalType === 2) {
						offerObj.WofferPercentage = offerPercentage;
						offerObj.WofferStartDate = startDate;
						offerObj.WofferEndDate = endDate;
					}
				}
				item.offers = offerObj;
			});
			$('#OfferPercent, #startDate, #endDate, #OfferModalType, #OfferModalIndex').val('');
			//console.log(PRODUCTPRICEMATRIX);
			$("#productOfferMatrixData").val(JSON.stringify(PRODUCTPRICEMATRIX));
			populateProductPriceMatrixTable("PRODUCTOFFERPAGE");
			$("#OfferModal").modal('hide');
		}
	};
	
	parent.removeOffer = function(type, index) {
		const offerFields = type === 1
			? ['RofferPercentage', 'RofferStartDate', 'RofferEndDate']
			: ['WofferPercentage', 'WofferStartDate', 'WofferEndDate'];
		const product = PRODUCTPRICEMATRIX[index];
		if (product && product.offers) {
			offerFields.forEach(field => delete product.offers[field]);
		}
		//console.log(PRODUCTPRICEMATRIX);
		$("#productOfferMatrixData").val(JSON.stringify(PRODUCTPRICEMATRIX));
		populateProductPriceMatrixTable("PRODUCTOFFERPAGE");
	};
	
	parent.copyOfferDown = function(type, index) {
		const offerFields = type === 1
			? ['RofferPercentage', 'RofferStartDate', 'RofferEndDate']
			: ['WofferPercentage', 'WofferStartDate', 'WofferEndDate'];
		const offerValues = offerFields.map(field => PRODUCTPRICEMATRIX[index].offers[field]);
		for (let i = index + 1; i < PRODUCTPRICEMATRIX.length; i++) {
			offerFields.forEach((field, idx) => {
				$(`#${field}`).val(offerValues[idx]);
			});
			$('#OfferModalType').val(type);
			$('#OfferModalIndex').val(i);
			saveOfferPercentage();
		}
	};
	
	const offerPercentageValidation = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product Offer Percentage Validation--------------------------------*/
		var OfferPercent = $("#OfferPercent").val();
		if (OfferPercent === "") {
			appCommonFunctionality.raiseValidation("OfferPercent", '', true);
			$("#OfferPercent").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("OfferPercent", "OfferPercent", true);
		}
		/*----------------------------------------------------Product Offer Percentage Validation--------------------------------*/
		
		/*----------------------------------------------------Product Offer Start Date Validation--------------------------------*/
		var startDate = $("#startDate").val();
		if (startDate === "") {
			appCommonFunctionality.raiseValidation("startDate", '', true);
			$("#startDate").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("startDate", "startDate", true);
		}
		/*----------------------------------------------------Product Offer Start Date Validation--------------------------------*/
		
		/*----------------------------------------------------Product Offer End Date Validation--------------------------------*/
		var endDate = $("#endDate").val();
		if (endDate === "") {
			appCommonFunctionality.raiseValidation("endDate", '', true);
			$("#endDate").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("endDate", "endDate", true);
		}
		/*----------------------------------------------------Product End Start Date Validation--------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.productOfferValidation = function(){
		$('#productPriceMatrixData').val(JSON.stringify(PRODUCTPRICEMATRIX));
		return true;
	};
	
	parent.goToProductSuppliers = function(productId){
		window.location.replace('productSuppliers.php?productId=' + productId);
	};
	
	parent.initProductSuppliers = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const productPreCompileData = JSON.parse($("#productPreCompileData").val());
		PRODUCTSUPPLIERS = JSON.parse(productPreCompileData.suppliers);
		PRODUCTSUPPLIERS.forEach(supplier => {
			$(`#productSupplier_${supplier}`).prop('checked', true);
		});
		$('[id^=productSupplier_]').change(function() {
			const supplierId = parseInt(this.id.split('_')[1]);
			if (this.checked) {
				PRODUCTSUPPLIERS.push(supplierId);
			} else {
				PRODUCTSUPPLIERS = PRODUCTSUPPLIERS.filter(id => id !== supplierId);
			}
		});
	};
	
	parent.validateProductSuppliers = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Product Suppliers Validation--------------------------------*/
		if($('[id^=productSupplier_]:checked').length === 0){
			errorCount++;
			alert(appCommonFunctionality.getCmsString(156))
		}
		/*----------------------------------------------------Product Suppliers Validation--------------------------------*/
		
		if (errorCount === 0) {
			$("#hdnProductSuppliers").val(JSON.stringify(PRODUCTSUPPLIERS));
			return true;
		} else {
			return false;
		}
	};
	
	parent.initProductStock = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const productId = appCommonFunctionality.getUrlParameter('productId');
		if (!productId) { // for Product Stock Module
			BRANDPRECOMPILEDDATA = JSON.parse($('#productBrandSerializedData').val());
			const selectedBrandId = parseInt($('#brandId').val());
			productFunctionality.populateSelectedBrand(selectedBrandId);
			CATEGORYPRECOMPILEDDATA = JSON.parse($('#catSerializedData').val());
			const selectedCategories = $('#categoryIds').val();
			if (selectedCategories) {
				SELECTEDCATEGORYIDARR = selectedCategories.split(',').map(Number);
			}
			productFunctionality.populateSelectedCategories();
			productFunctionality.searchProductStocks();
		} else { // for Product Module having valid product Id
			const productPreCompileData = JSON.parse($("#productPreCompileData").val());
			const productPriceMatrixData = productPreCompileData.productCombinations;
			if (productPriceMatrixData && productPriceMatrixData.length > 0) {
				PRODUCTPRICEMATRIX = productPriceMatrixData;
				populateProductPriceMatrixTable("PRODUCTSTOCKPAGE");
			}
		}
	};
	
	parent.searchProductStocks = function() {
		const brandId = parseInt($("#brandId").val());
		const categoryIds = $("#categoryIds").val().split(',').filter(Boolean);
		const products = JSON.parse($("#productSerializedData").val());
		let searchedResults = products;
		if (brandId > 0) {
			searchedResults = searchedResults.filter(el => parseInt(el.brandId) === brandId);
		}
		if (categoryIds.length > 0) {
			const categorySet = new Set(categoryIds);
			searchedResults = searchedResults.filter(el => {
				const elCatArr = el.categoryIds.split(',');
				return elCatArr.some(item => categorySet.has(item));
			});
		}
		populateProductStockTable(searchedResults);
	};
	
	const populateProductStockTable = function(searchedResultsObj) {
		let str = `
			<h5 id='cms_157'>Searched Results : </h5>
			<table class='w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white'>
				<tbody>
					<tr>
						<td width='90%'><strong id='cms_77'>Description</strong></td>
						<td width='10%'><strong id='cms_158'>Stock Volume</strong></td>
					</tr>`;
		if (searchedResultsObj.length > 0) {
			searchedResultsObj.forEach(result => {
				const stockVolClass = result.productStock < result.minStockVol
					? "redText"
					: (result.minStockVol + (result.minStockVol / 2)) > result.productStock
					? "yellowText"
					: "greenText";
				str += `
					<tr>
						<td>
							<div class='pull-left'>
								<a href='productStock.php?productId=${result.productId}'>
									${result.productTitle} [${result.productCode}]
								</a>
							</div>
						</td>
						<td>
							<b class="${stockVolClass} f20">${result.productStock}</b> / 
							<span class="f12">${result.minStockVol}</span>
						</td>
					</tr>`;
			});
		} else {
			str += `
				<tr>
					<td id='cms_100'>No Data</td>
					<td><span class='f24'>0</span></td>
				</tr>`;
		}
		str += `
				</tbody>
			</table>`;
		$("#sarchedProductStockTableHolder").html(str);
	};
	
	parent.addStocks = function(productId, productCombinationId){
		window.location.replace('stockEntry.php?productId=' + productId + "&productCombinationId=" + productCombinationId);
	};
	
	parent.initProductStockEntry = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const productCombinationQR = $("#productCombinationQR").val();
		const productCode = $("#productCode").val();
		const combinationHTML = getQRTextHtml(productCombinationQR, productCode);
		$("#productCombination").html(combinationHTML);
		STOCKSTORAGE = JSON.parse($("#stockStoragePreCompiledData").val());
		$("#treeview").html(makeStockStorageTreeItem(0));
		$("#treeview").hummingbird();
		$('[id^="stockStorageItem_"]').click(function() { 
			const checkboxIdArr = this.id.split('_');
			$("#storageId").val(parseInt(checkboxIdArr[1]));
			$('input[type="checkbox"]').not(this).prop('checked', false);
		});
	};
	
	parent.populateInputs = function() {
		let stockVol = parseInt($("#stockVol").val());
		const additionalSlots = stockVol - SYSTEMREF.length;
		if (additionalSlots > 0) {
			SYSTEMREF = SYSTEMREF.concat(Array(additionalSlots).fill(""));
		}
		populateBarQrInputHTML();
	};
	
	const populateBarQrInputHTML = function() {
		let str = SYSTEMREF.map((ref, i) => `
			<div class="col-lg-4 col-md-12 col-sm-12 col-xs-12 noLeftPaddingOnly">
				<div class="input-group marBot5">
					<input id="sysRef_${i}" name="sysRef_${i}" type="text" class="form-control" autocomplete="off" value="${ref}">
					<span class="input-group-addon">
						<i class="fa fa-remove redText" onclick="productFunctionality.removeThisSystemRef(${i})"></i>
					</span>
				</div>
			</div>
		`).join('');
		$("#barQrInputHTMLHolder").html(str);
	};
	
	parent.autoGenerateBarQrCode = function() {
		const productCode = $("#productCode").val();
		const productCombinationId = $("#productCombinationId").val();
		const timestamp = Date.now(); // Get the current timestamp in milliseconds
		const seed = timestamp % 10000000; // Extract a 7-digit seed for better randomness
		SYSTEMREF = SYSTEMREF.map(ref => {
			if (ref === '') {
				const randomNum = Math.floor(Math.random() * seed); // Generate a random number based on the seed
				return `${productCode}-${productCombinationId}-${randomNum}`;
			}
			return ref;
		});
		populateBarQrInputHTML();
	};
	
	parent.removeLastSystemRef = function(){
		SYSTEMREF.splice((SYSTEMREF.length - 1), 1);
		$("#stockVol").val(SYSTEMREF.length);
		populateBarQrInputHTML();
	};
	
	parent.addOneMoreSystemRef = function(){
		SYSTEMREF.push("");
		$("#stockVol").val(SYSTEMREF.length);
		populateBarQrInputHTML();
	};
	
	parent.removeThisSystemRef = function(index){
		SYSTEMREF.splice(index, 1);
		$("#stockVol").val(SYSTEMREF.length);
		populateBarQrInputHTML();
	};
	
	const makeStockStorageTreeItem = function(parentId) {
		let str = '';
		STOCKSTORAGE.forEach(storage => {
			if (parseInt(storage.parentId) === parseInt(parentId)) {
				let childItems = makeStockStorageTreeItem(parseInt(storage.storageId));
				str += `
					<li data-id="${storage.storageId}">
						<i class="fa fa-plus ${childItems ? '' : 'lightGreyText'}"></i>
						<label class="marleft5">
							<input type="checkbox" id="stockStorageItem_${storage.storageId}" name="stockStorageItem_${storage.storageId}" value="${storage.storageId}">
							<span class="marleft5 hover">${storage.storageName}</span>
						</label>
						${childItems}
					</li>`;
			}
		});
		return parentId > 0 && str ? `<ul>${str}</ul>` : str;
	};
	
	parent.onBarQrSwitchChange = function() {
		const barQrInput = $("#barQr");
		const isBarQrChecked = parseInt(barQrInput.val());
		barQrInput.val(isBarQrChecked ? 0 : 1);
		barQrInput.prop('checked', !isBarQrChecked);
		$("#barCode").toggleClass('hide', isBarQrChecked);
		$("#qrCode").toggleClass('hide', !isBarQrChecked);
	};
	
	parent.openQrCodeScanner = function(){
		if(parseInt($("#barQr").val())){
			onBarQrSwitchChange();
		}
		//open scanning camera xxxx
	};
	
	parent.validateProductStockEntry = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Entry Reference Validation----------------------------------------*/
		var entryReference = $("#entryReference").val();
		if (entryReference === "") {
			appCommonFunctionality.raiseValidation("entryReference", appCommonFunctionality.getCmsString(159), true);
			$("#entryReference").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("entryReference", "entryReference", true);
		}
		/*----------------------------------------------------Entry Reference Validation----------------------------------------*/
		
		/*----------------------------------------------------Stock Volumn Validation-------------------------------------------*/
		var stockVol = $("#stockVol").val();
		if (stockVol === "") {
			appCommonFunctionality.raiseValidation("stockVol", appCommonFunctionality.getCmsString(160), true);
			$("#stockVol").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("stockVol", "stockVol", true);
		}
		/*----------------------------------------------------Stock Volumn Validation-------------------------------------------*/
		
		/*----------------------------------------------------System Reference Validation---------------------------------------*/
		var sysRefArray = [];
		$('input[id^="sysRef_"]').each(function () {
			if(this.value === ''){
				appCommonFunctionality.raiseValidation(this.id, "", true);
				$("#" + this.id).focus();
				errorCount++;
			} else {
				sysRefArray.push(this.value);
				appCommonFunctionality.removeValidation(this.id, this.id, true);
			}
		});
		$("#systemReferenceArray").val(sysRefArray.toString());
		/*----------------------------------------------------System Reference Validation---------------------------------------*/
		
		/*----------------------------------------------------Stock Position Validation-----------------------------------------*/
		var checkBoxCounter = 0;
		$('[id^="stockStorageItem_"]').each(function () {
			if($('#' + this.id).is(":checked")){
				checkBoxCounter++;
			}
		});
		if(checkBoxCounter === 0){
			alert("Atleast one position need to be selected ");
			errorCount++;
		}
		/*----------------------------------------------------Stock Position Validation-----------------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.gotoStockDetails = function(productId, productCombinationId){
		window.location.replace('stockDetails.php?productId=' + productId + '&productCombinationId=' + productCombinationId);
	};
	
	parent.initProductStockDetails = function() {
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		const productCombinationQR = $("#productCombinationQR").val();
		const productCode = $("#productCode").val();
		const combinationHTML = getQRTextHtml(productCombinationQR, productCode);
		$("#productCombination").html(combinationHTML);
		const productStockData = $("#productCombinationStockData").val();
		if (productStockData) {
			PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(productStockData);
			makeProductStockGroup("DATE");
		}
	};
	
	parent.makeProductStockGroup = function(identifier) {
		const groupByIdentifier = (key) => {
			const groups = PRODUCTLIVESTOCKPRECOMPILEDDATA.reduce((acc, stockObj) => {
				const groupKey = stockObj[key];
				if (!acc[groupKey]) {
					acc[groupKey] = [];
				}
				acc[groupKey].push(stockObj);
				return acc;
			}, {});

			return Object.keys(groups).map(groupKey => ({
				[key.toLowerCase()]: groupKey,
				stockObjects: groups[groupKey]
			}));
		};
		let groupArrays;
		switch (identifier) {
			case "DATE":
				PRODUCTSTOCKGROUPBYIDENTIFIRE = "DATE";
				groupArrays = groupByIdentifier('entryDate');
				break;
			case "ENTRYREF":
				PRODUCTSTOCKGROUPBYIDENTIFIRE = "ENTRYREF";
				groupArrays = groupByIdentifier('entryReference');
				break;
			case "STORAGELOCATION":
				PRODUCTSTOCKGROUPBYIDENTIFIRE = "STORAGELOCATION";
				groupArrays = groupByIdentifier('storageName');
				break;
		}
		const pageName = appCommonFunctionality.getPageName();
		if (pageName === "stockDetails.php") {
			populatePanelGroups(groupArrays);
		} else if (pageName === "printProductCombinationStockQRBarCodes.php") {
			populateStickers(groupArrays);
		}
	};
	
	parent.populatePanelGroups = function(panelGroupData) {
		let str = '';
		panelGroupData.forEach((group, i) => {
			const groupName = group.date || group.entryReference || group.storageName;
			const groupType = group.date ? 'Entry Date' : group.entryReference ? 'Entry Reference' : 'Storage Location';
			const stockVolume = group.stockObjects.length;
			str += `
				<button type="button" class="btn btn-primary btn-block marBot5" id="accordion_${i}">
					<b>${groupType} : ${groupName} | Stock Volume : ${stockVolume}</b>
				</button>
				<div class="bgWhite" id="panel_${i}" style="display: none;">
					<table class="table table-bordered">
						<thead>
							<tr>
								<th width="10%">
									QR / Bar
									<span>
										<i class="fa fa-print blueText hover" onclick="productFunctionality.goToPrintProductCombinationStockQRBarCodes('${groupName}')"></i>
									</span>
									<span>
										<i class="fa fa-trash-o redText hover marleft5" onclick="productFunctionality.deleteSelectedStock()"></i>
									</span>
								</th>
								<th width="${group.date ? '30%' : '60%'}">${group.entryReference ? 'Entry Date' : 'Entry Reference'}</th>
								<th width="${group.date ? '60%' : '30%'}">Storage Location</th>
							</tr>
						</thead>
						<tbody>
							${group.stockObjects.map(stock => `
								<tr>
									<td>
										<input type="checkbox" id="stock_${stock.stockId}" name="stock_${stock.stockId}" value="${stock.stockId}">
										<img src="${stock.systemReferenceType ? BARCODEAPIURL : QRCODEAPIURL}${stock.systemReference}" alt="${stock.systemReference}" width="${stock.systemReferenceType ? '214px' : ''}" class="marleft5 ${stock.systemReferenceType ? '' : 'productQRCode'}">
									</td>
									<td>${stock.entryReference || stock.entryDate}</td>
									<td>${stock.storageName}</td>
								</tr>
							`).join('')}
						</tbody>
					</table>
				</div>
			`;
		});
		$("#accordionPanelGroupHolder").html(str);
		/*--------------------------------------------------Binding accordion events------------------------*/
		$('button[id^="accordion_"]').on('click', function() {
			const panelId = this.id.split('_')[1];
			$(`#panel_${panelId}`).toggle();
		});
		/*--------------------------------------------------Binding accordion events------------------------*/
	};
	
	parent.deleteSelectedStock = function() {
		const selectedStockIds = $('input[id^="stock_"]:checked').map(function () {
			return parseInt(this.value);
		}).get();

		if (selectedStockIds.length > 0) {
			const selectedStockStr = selectedStockIds.join(',');
			$("#selectedStockIds").val(selectedStockStr);
			$('#stockDeleteModal').modal('show');
		} else {
			alert('Please select at least one checkbox');
		}
	};
	
	parent.validateStockDeleteForm = function(){
		var errorCount = 0;
		
		/*----------------------------------------------------Dispatch Reference Validation------------------------------*/
		var dispatchReference = $("#dispatchReference").val();
		if (dispatchReference === "") {
			appCommonFunctionality.raiseValidation("dispatchReference", '', true);
			$("#dispatchReference").focus();
			errorCount++;
		} else {
			appCommonFunctionality.removeValidation("dispatchReference", "dispatchReference", true);
		}
		/*----------------------------------------------------Dispatch Reference Validation------------------------------*/
		
		/*----------------------------------------------------Selected Stock Id Validation-------------------------------*/
		var selectedStockIds = $("#selectedStockIds").val();
		if (selectedStockIds === "") {
			alert('Please select atleast One Stock to delete');
			errorCount++;
		}
		/*----------------------------------------------------Selected Stock Id Validation-------------------------------*/
		
		if (errorCount === 0) {
			return true;
		} else {
			return false;
		}
	};
	
	parent.goToPrintProductCombinationStockQRBarCodes = function(groupingData) {
		const productId = appCommonFunctionality.getUrlParameter('productId');
		const productCombinationId = appCommonFunctionality.getUrlParameter('productCombinationId');
		const url = `printProductCombinationStockQRBarCodes.php?productId=${productId}&productCombinationId=${productCombinationId}&groupIdentifire=${PRODUCTSTOCKGROUPBYIDENTIFIRE}&groupingData=${groupingData}`;
		window.open(url, '_blank');
	};
	
	parent.initPrintProductCombinationStockQRBarCodes = function() {
		const productId = appCommonFunctionality.getUrlParameter('productId');
		const productCombinationId = appCommonFunctionality.getUrlParameter('productCombinationId');
		const groupIdentifire = appCommonFunctionality.getUrlParameter('groupIdentifire');
		const productStockData = $("#productCombinationStockData").val();
		if (productStockData) {
			PRODUCTLIVESTOCKPRECOMPILEDDATA = JSON.parse(productStockData);
			makeProductStockGroup(groupIdentifire);
		} else {
			console.error('Product combination stock data is missing or invalid.');
		}
	};
	
	const populateStickers = function(panelGroupData) {
		const groupIdentifire = appCommonFunctionality.getUrlParameter('groupIdentifire').toLowerCase();
		const groupingData = appCommonFunctionality.getUrlParameter('groupingData');
		const productTitle = $("#productTitle").val();
		const productCode = $("#productCode").val();
		const RPrice = $("#RPrice").val();
		const currency = appCommonFunctionality.getDefaultCurrency();
		let str = '';

		panelGroupData.forEach(group => {
			if (group[groupIdentifire] === groupingData) {
				group.stockObjects.forEach(stock => {
					const commonContent = `
						<div class="text-center">
							<img src="${SITECOMMONIMAGE}" alt="logo" class="w24 pull-right">
							<span>${SITETITLE}</span>
						</div>
						<div class="text-center">
							<span>${productTitle} [${productCode}]</span>
						</div>
					`;
					if (stock.systemReferenceType) { // Barcode Sticker
						str += `
							<div class="sticker">
								${commonContent}
								<div class="text-center">
									<img src="${BARCODEAPIURL}${stock.systemReference}" alt="${stock.systemReference}" width="214px">
								</div>
								<div class="text-center">
									<b>${currency}${RPrice}</b>
								</div>
							</div>
						`;
					} else { // QR code Sticker
						str += `
							<div class="sticker">
								${commonContent}
								<div class="stickerQrHolder">
									<img src="${QRCODEAPIURL}${stock.systemReference}" alt="${stock.systemReference}" class="productQRCode">
									<div>
										<div class="text-right"><b>${currency}${RPrice}</b></div>
										<div class="text-right">${SITETITLE}_${stock.systemReference}</div>
									</div>
								</div>
							</div>
						`;
					}
				});
			}
		});

		$("#stickerHolder").html(str);
	};
	
	parent.goToProductDetail = function(productId){
		window.location.replace('productDetail.php?productId=' + productId);
	};
	
	parent.initProductDetail = function(){
		var productPreCompileData = JSON.parse($("#productPreCompileData").val());
		if(productPreCompileData.productCombinations){
			if(productPreCompileData.productCombinations.length > 0){
				PRODUCTPRICEMATRIX = productPreCompileData.productCombinations;
			}
		}
		var str = '';
		/*----------------------------------------Populate Product Title---------------------------------------------*/
		$("#productTitle").html(productPreCompileData.productTitle + '[' + productPreCompileData.productCode + '] - ');
		/*----------------------------------------Populate Product Title---------------------------------------------*/
		/*----------------------------------------Populate Product Status--------------------------------------------*/
		if(PRODUCTPRICEMATRIX.length > 0){
			$("#productStatus").html('<b>Ok</b>').addClass('greenText');
		}else{
			$("#productStatus").html('<b>Incomplete</b>').addClass('redText');
		}
		/*----------------------------------------Populate Product Status--------------------------------------------*/
		/*----------------------------------------Populate Product Brand---------------------------------------------*/
		str = str + '<a href="brandDetail.php?brandId=' + productPreCompileData.brandId + '" class="blueText" target="_blank">';
			str = str + getBrandName(productPreCompileData.brandId);
		str = str + '</a>';
		$("#productBrand").html(str);
		/*----------------------------------------Populate Product Brand---------------------------------------------*/
		/*----------------------------------------Populate Production Link-------------------------------------------*/
		str = '';
		str = str + '<a href="' + PROJECTPATH + 'productDetails/' + productPreCompileData.productSlug + '" target="_blank" class="blueText wordWarp">';
			str = str + PROJECTPATH + 'productDetails/' + productPreCompileData.productSlug;
		str = str + '</a>';
		$("#productionLink").html(str);
		/*----------------------------------------Populate Production Link-------------------------------------------*/
		/*----------------------------------------Populate Product Description---------------------------------------*/
		if(productPreCompileData.productDesc !== ''){
			$("#productDescActual").html(decodeURI(window.atob(productPreCompileData.productDesc)));
			$("#productDescActual p").css('margin', '0px'); //removing unnessery margin after p tag
		}
		/*----------------------------------------Populate Product Description---------------------------------------*/
		/*----------------------------------------Populate Product Images--------------------------------------------*/
		str = '';
		if(productPreCompileData.productImages.length > 0){
			var productImageArr = productPreCompileData.productImages.split(',');
			for(var i = 0; i < productImageArr.length; i++){
				str = str + '<div class="productImageBlock5 pull-left marRig5 marBot5">';
					str = str + '<img src="' + PROJECTPATH + PRODUCTIMAGEURL + productImageArr[i] + '" alt="' + productImageArr[i] + '">';
					str = str + '<div>';
						str = str + '<a href="productImage.php?ACTION=DELETE&imageFile=' + productImageArr[i] + '&productId=' + productPreCompileData.productId + '">';
							str = str + '<i class="fa fa-trash-o pull-left redText hover f24"></i>';
						str = str + '</a>';
						str = str + '<a href="imageFilters.php?folder=products&imageFile=' + productImageArr[i] + '&productId=' + productPreCompileData.productId + '" target="_blank">';
							str = str + '<i class="fa fa-sliders pull-right greenText hover f24"></i>';
						str = str + '</a>';
						str = str + '<a href="imageManualCrop.php?folder=products&imageFile=' + productImageArr[i] + '&productId=' + productPreCompileData.productId + '" target="_blank">';
							str = str + '<i class="fa fa-crop pull-right greenText hover f24"></i>';
						str = str + '</a>';
					str = str + '</div>';
				str = str + '</div>';
			}
		}
		$("#productImageBlockHolder").html(str);
		/*----------------------------------------Populate Product Images--------------------------------------------*/
		/*----------------------------------------Populate Product QR code-------------------------------------------*/
		str = '';
		str = str + '<b>QR Code : </b>';
		str = str + '<a href="' + QRCODEAPIURL + productPreCompileData.productCode + '" download>';
			str = str + '<i class="fa fa-download greenText hover"></i>';
		str = str + '</a><br>';
		str = str + '<div class="productImageBlock5 pull-left hover" data-toggle="modal" data-target="#QRModal" onclick="productFunctionality.openQRModal(\'' + QRCODEAPIURL + productPreCompileData.productCode + '\')">';
			str = str + '<img src="' + QRCODEAPIURL + productPreCompileData.productCode + '" alt="' + productPreCompileData.productCode + '">';
		str = str + '</div>';
		$("#productQRCodeBlock").html(str);
		/*----------------------------------------Populate Product QR code-------------------------------------------*/
		/*----------------------------------------Populate Product Categories----------------------------------------*/
		str = '';
		if(productPreCompileData.categoryIds.length > 0){
			var productCategoryArr = productPreCompileData.categoryIds.split(',');
			for(var i = 0; i < productCategoryArr.length; i++){
				str = str + '<div class="pull-left marRig10">';
					str = str + '<span class="fa fa-tags darkGreyText marRig5"></span>';
					str = str + '<span>' + getCategoryName(productCategoryArr[i]) + '</span>';
				str = str + '</div>';
			}
		}
		$("#productCategoryHolder").html(str);
		/*----------------------------------------Populate Product Categories----------------------------------------*/
		/*----------------------------------------Populate Product Combination Data----------------------------------*/
		if(PRODUCTPRICEMATRIX.length > 0){
			populateProductPriceMatrixTable("PRODUCTDETAILSPAGE"); //I m here
		}
		/*----------------------------------------Populate Product Combination Data----------------------------------*/
		/*----------------------------------------Populate Product MetaKey Words-------------------------------------*/
		$("#productMetaKeyWords").html(productPreCompileData.metaKeyWords);
		/*----------------------------------------Populate Product MetaKey Words-------------------------------------*/
		/*----------------------------------------Populate Product MetaKey Words-------------------------------------*/
		$("#productMetaDesc").html(productPreCompileData.metaDesc);
		/*----------------------------------------Populate Product MetaKey Words-------------------------------------*/
		/*----------------------------------------Populate Product Min Stock Volumn----------------------------------*/
		$("#productMinStockVal").html(productPreCompileData.minStockVol);
		/*----------------------------------------Populate Product Min Stock Volumn----------------------------------*/
		/*----------------------------------------Populate Product Created Date--------------------------------------*/
		$("#productCreatedDate").html(productPreCompileData.createdDate);
		/*----------------------------------------Populate Product Created Date--------------------------------------*/
		/*----------------------------------------Populate Product Last Modified Date--------------------------------*/
		$("#productLastModifiedDate").html(productPreCompileData.lastModifiedDate);
		/*----------------------------------------Populate Product Last Modified Date--------------------------------*/
		/*----------------------------------------Populate Product Status--------------------------------------------*/
		if(parseInt(productPreCompileData.status)){
			$("#productStatusText").html("<b class='greenText hover' onclick='productFunctionality.changeProductStatus(" + productPreCompileData.productId + ")' id='cms_161'>Active</b>");
		}else{
			$("#productStatusText").html("<b class='redText hover' onclick='productFunctionality.changeProductStatus(" + productPreCompileData.productId + ")' id='cms_162'>Inactive</b>");
		}
		/*----------------------------------------Populate Product Status--------------------------------------------*/
	};
	
	parent.changeProductStatus = function(productId){
		window.location.replace('productDetail.php?productId=' + productId + "&ACTION=CHANGEPRODUCTSTATUS");
	};
	
	const getBrandName = function(brandId) {
		const brand = BRANDPRECOMPILEDDATA.find(item => parseInt(item.brandId) === parseInt(brandId));
		return brand ? brand.brandName : '';
	};
	
	const getCategoryName = function(categoryId) {
		const productCatSerializedData = JSON.parse($("#productCatSerializedData").val());
		const category = productCatSerializedData.find(item => parseInt(item.categoryId) === parseInt(categoryId));
		return category ? category.category : '';
	};
	
	parent.gotoAddSuppliers = function(){
		window.location.replace('supplierEntry.php');
	};
	
	parent.goToProducts = function(){
		window.location.replace('product.php');
	};
	
	parent.goToProductStock = function(productId){
		window.location.replace('productStock.php?productId=' + productId);
	};
	
	parent.featureDDLChange = function(productId, featureId){
		window.location.replace('productStock.php?productId=' + productId + '&featureId=' + featureId);
	};
	
	parent.deleteStock = function(stockId, productId){
		window.location.replace('productStock.php?ACTION=DELETE&productId=' + productId + '&stockId=' + stockId);
	};
	
	parent.openQRModal = function(QRCodeURL) {
		const qrModalHeader = $('#QRModalHeader');
		const qrCodeModalBody = $('#QRCodeModalBody');
		const downloadIconHTML = '<i class="fa fa-download greenText hover"></i>';
		
		qrModalHeader.html(`Scan the QR code <a href="${QRCodeURL}" download="">${downloadIconHTML}</a>`);
		qrCodeModalBody.html(`<div class="productQRBlock"><img src="${QRCodeURL}" alt="QR"></div>`);
	};
	
	parent.createDuplicateProduct = function(){
		var productId = parseInt(getUrlParameter('productId'));
		window.location.replace('productEntry.php?duplicateProductId=' + productId);
	};
	
	parent.initArrangeProducts = function(){
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		$("#productBrandFilter").change(function () {
			window.location.replace('arrangeProducts.php?brandId=' + this.value);
		});
		productFunctionality.populateArrangementTable();
		productFunctionality.placeArrangedOrders();
		if(!appCommonFunctionality.isMobile()){
			$("tbody").sortable({
				cursor: 'row-resize',
				placeholder: 'ui-state-highlight',
				opacity: '0.55',
				items: '.ui-sortable-handle',
				stop: function (event, ui) {  
					productFunctionality.placeArrangedOrders();
				}
			}).disableSelection();
		}
	};
	
	parent.populateArrangementTable = function() {
		let str = '';
		const productSerializedDataVal = $("#productSerializedData").val();

		if (productSerializedDataVal.length > 0) {
			const productSerializedData = JSON.parse(productSerializedDataVal);

			str += `
				<table id="productTable" class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
					<tbody>
						<tr>
							<td width="95%"><strong>Name</strong></td>
							<td width="5%"></td>
						</tr>`;

			productSerializedData.forEach((product, index) => {
				str += `
						<tr id="productId_${product.productId}" class="ui-sortable-handle dragable">
							<td>
								<div class="productArrangedOrder"></div>
								<span>${product.productTitle} [${product.productCode}]</span>
							</td>
							<td>
								<div class="spaceBetweenSection">`;
				if (index !== 0) {
					str += `<i class="fa fa-arrow-up hover" onclick="moveProductArrangment(${index}, 1)"></i>`;
				}
				if (index !== productSerializedData.length - 1) {
					str += `<i class="fa fa-arrow-down hover marleft10" onclick="moveProductArrangment(${index}, 0)"></i>`;
				}
				str += `
								</div>
							</td>
						</tr>`;
			});

			str += `
					</tbody>
				</table>`;
		}

		$("#productTableHolder").html(str);
	};
	
	parent.placeArrangedOrders = function() {
		ARRANGEDORDER = [];
		$('#productTable > tbody > tr').each(function(index, tr) { 
			const trId = $(tr).attr('id');
			if (trId) {
				$(tr).find('td:first-child div.productArrangedOrder').text(index);
				const productId = parseInt(trId.split("_")[1]);
				ARRANGEDORDER.push({ productId, index });
			}
		});
		//console.log(ARRANGEDORDER);
	};
	
	parent.moveProductArrangment = function(index, direction) {
		const productSerializedDataVal = $("#productSerializedData").val();
		if (productSerializedDataVal.length > 0) {
			const productSerializedData = JSON.parse(productSerializedDataVal);
			const selectedObj = productSerializedData[index];
			productSerializedData.splice(index, 1);
			const newIndex = direction === 1 ? index - 1 : index + 1;
			productSerializedData.splice(newIndex, 0, selectedObj);
			$("#productSerializedData").val(JSON.stringify(productSerializedData));
			productFunctionality.populateArrangementTable();
			productFunctionality.placeArrangedOrders();
		}
	};

	parent.saveArrangedOrder = function(){
		var qryStr = 'SAVEPRODUCTARRANGEMENTORDER';
		var callData = {"productArrangedOrder" : JSON.stringify(ARRANGEDORDER)};
		appCommonFunctionality.ajaxCallLargeData(qryStr, callData, receiveArrangedOrderResponse);
	};
	
	parent.receiveArrangedOrderResponse = function(data){
		window.location.reload();
	};
	
	parent.gotoArrangeProductImages = function(productId){
		window.open('arrangeProductImages.php?productId=' + productId, '_blank').focus();
	};
	
	parent.combinationImageArrangement = function(combinationId, productId){
		window.open('arrangeProductImages.php?productId=' + productId + '&combinationId=' + combinationId, '_blank').focus();
	};
	
	parent.initArrangeProductImage = function(){
		appCommonFunctionality.adjustMainContainerHight('productSectionHolder');
		productFunctionality.populateArrangementProductImageTable();
		productFunctionality.placeArrangedImages();
		if(!appCommonFunctionality.isMobile()){
			$("tbody").sortable({
				cursor: 'row-resize',
				placeholder: 'ui-state-highlight',
				opacity: '0.55',
				items: '.ui-sortable-handle',
				stop: function (event, ui) {  
					productFunctionality.placeArrangedImages();
				}
			}).disableSelection();
		}
	};
	
	parent.populateArrangementProductImageTable = function() {
		let str = '';
		const productImageSerializedDataVal = $("#productImageSerializedData").val();

		if (productImageSerializedDataVal.length > 0) {
			const productImageSerializedData = JSON.parse(productImageSerializedDataVal);

			str += `
				<table id="productImageTable" class="w3-table w3-striped w3-bordered w3-border w3-hoverable w3-white">
					<tbody>
						<tr>
							<td width="95%"><strong>Image</strong></td>
							<td width="5%"></td>
						</tr>`;

			productImageSerializedData.forEach((image, index) => {
				str += `
						<tr id="productImage_${index}" class="ui-sortable-handle dragable">
							<td>
								<div class="productArrangedOrder"></div>
								<img id="image_${index}" src="${PROJECTPATH}${PRODUCTIMAGEURL}${image}" alt="${image}" class="arrangebleImage">
							</td>
							<td>
								<div class="spaceBetweenSection">`;
				if (index !== 0) {
					str += `<i class="fa fa-arrow-up hover f60" onclick="moveImageArrangment(${index}, 1)"></i>`;
				}
				if (index !== productImageSerializedData.length - 1) {
					str += `<i class="fa fa-arrow-down hover f60 marleft10" onclick="moveImageArrangment(${index}, 0)"></i>`;
				}
				str += `
								</div>
							</td>
						</tr>`;
			});

			str += `
					</tbody>
				</table>`;
		}

		$("#productImageTableHolder").html(str);
	};
	
	parent.placeArrangedImages = function(){
		var ARRANGEDIMAGEORDER = [];
		$('#productImageTable > tbody  > tr').each(function(index, tr) { 
			if (typeof $(tr).attr('id') !== "undefined") {
				var trId = $(tr).attr('id');
				$('#' + trId + ' td:first-child div.productArrangedOrder').text(index);
				var productImage = $('#' + trId + ' td:first-child img.arrangebleImage').attr('alt');
				ARRANGEDIMAGEORDER.push(productImage);
			}
		});
		$("#productImageSerializedData").val(JSON.stringify(ARRANGEDIMAGEORDER));
		//console.log(ARRANGEDIMAGEORDER);
	};
	
	parent.moveImageArrangment = function(index, direction) {
		const productImageSerializedDataVal = $("#productImageSerializedData").val();
		if (productImageSerializedDataVal.length > 0) {
			const productImageSerializedData = JSON.parse(productImageSerializedDataVal);
			const selectedObj = productImageSerializedData[index];
			productImageSerializedData.splice(index, 1);
			
			const newIndex = direction === 1 ? index - 1 : index + 1;
			productImageSerializedData.splice(newIndex, 0, selectedObj);

			$("#productImageSerializedData").val(JSON.stringify(productImageSerializedData));
			productFunctionality.populateArrangementProductImageTable();
			productFunctionality.placeArrangedImages();
		}
	};
	
	parent.shareProductCatalogInit = function(){
		initSelectAllCustomer();
	};
	
	initSelectAllCustomer = function(){
		$("#selectAll").on('click', function(e){
			if($('#selectAll').is(":checked")){
				$("[id^='customer_']").prop('checked', true);
			}else{
				$("[id^='customer_']").prop('checked', false);
			}
		});
	};
	
	parent.validateProductCatalogCustomer = function(){
		if(!$('[id^="customer_"]').is(":checked")){
			alert('Please select atleast one customer');
			return false;
		}else{
			return true;
		}
	};
	
	parent.seeProductCatalogMails = function(){
		var productId = appCommonFunctionality.getUrlParameter('productId');
		window.open('mail.php?search=PRODUCTCATALOG_' + productId, '_blank');
	};

	return parent;
}(window, window.$));