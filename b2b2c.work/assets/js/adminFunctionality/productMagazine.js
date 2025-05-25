const MENUSELECTIONITEM = "productMagazine.php";
let   PRODUCTPRECOMPILEDDATA = [];
let   BRANDPRECOMPILEDDATA = [];
const PAGEDOCNAME = appCommonFunctionality.getPageName();
	
$(document).ready(function() {
    /*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/

    if (PAGEDOCNAME === "productMagazine.php") {
        productMagazineFunctionality.initProductMagazine();
    } else if (PAGEDOCNAME === "createProductMagazine.php") {
		$.when(
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=PRODUCT'),
			appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=BRAND')
		).done(function(productResponse, brandResponse) {
			// Both AJAX calls completed successfully
			appCommonFunctionality.hideLoader();
			productMagazineFunctionality.createProductMagazine(productResponse[0], brandResponse[0]);
		}).fail(function() {
			// One or both AJAX calls failed
			appCommonFunctionality.hideLoader();
			console.error('Error in one or both AJAX calls');
		});
    } else if (PAGEDOCNAME === "shareProductMagazine.php") {
        productMagazineFunctionality.shareProductMagazineInit();
    }
	
	appCommonFunctionality.cmsImplementationThroughID();
    appCommonFunctionality.cmsImplementationThroughRel();
	appCommonFunctionality.hideLoader();
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const productMagazineFunctionality = (function(window, $) {
    const parent = {};

    parent.initProductMagazine = async function () {
		await appCommonFunctionality.adminCommonActivity();
        appCommonFunctionality.adjustMainContainerHight('productMagazineSectionHolder');
    };

    parent.gotoCreateProductMagazine = function() {
        window.location.replace('createProductMagazine.php');
    };

    parent.copyMagazine = function(magazineId) {
        window.location.replace(`productMagazine.php?ACTION=COPYMAGAZINE&magazineId=${magazineId}`);
    };
	
	parent.gotoMails = function(magCode) {
		window.open('mail.php?search=' + magCode, '_blank');
    };

    parent.deleteMagazine = function(magazineId) {
        window.location.replace(`productMagazine.php?ACTION=DELETE&magazineId=${magazineId}`);
    };

    parent.editMagazine = function(magazineId) {
        window.location.replace(`createProductMagazine.php?magazineId=${magazineId}`);
    };

    parent.createProductMagazine = async function (productResponse, brandResponse) {
        appCommonFunctionality.adjustMainContainerHight('productMagazineSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		PRODUCTPRECOMPILEDDATA = JSON.parse(productResponse);
        BRANDPRECOMPILEDDATA = JSON.parse(brandResponse);
        
        const makeBrandTreeItem = (parentBrandId) => {
            const str = BRANDPRECOMPILEDDATA.filter(brand => parseInt(brand.parentId) === parseInt(parentBrandId) && parseInt(brand.products) > 0)
                .map(brand => {
                    const childItems = makeBrandTreeItem(brand.brandId);
                    const productItems = listProductItems(brand.brandId);
                    return `
                        <li data-id="${brand.brandId}">
                            <i class="fa fa-plus${childItems ? '' : ' lightGreyText'}"></i>
                            <label class="marleft5">
                                <input id="bnode-${brand.brandId}" data-id="custom-${brand.brandId}" type="checkbox" value="${brand.brandId}">
                                <span class="marleft5 hover">${brand.brandName}</span>
                                ${brand.products > 0 ? `<span class="marleft5 hover">[${brand.products} <span id="cms_37">Products</span>]</span>` : ''}
                            </label>
                            ${childItems}
                            ${brand.products > 0 ? productItems : ''}
                        </li>`;
                }).join('');

            return parentBrandId > 0 && str ? `<ul>${str}</ul>` : str;
        };

        const listProductItems = (brandId) => {
            const filteredProduct = PRODUCTPRECOMPILEDDATA.filter(product => parseInt(product.brandId) === parseInt(brandId));
            const str = filteredProduct.map(product => `
                <li data-id="${product.productId}">
                    <label>
                        <input id="pnode-${brandId}-${product.productId}" data-id="custom-${brandId}-${product.productId}" type="checkbox" value="${product.productId}">
                        <span><img src="${PROJECTPATH}${PRODUCTIMAGEURL}64x64/${product.productImage}" alt="${product.productImage}" class="productImage marleft5" onerror="this.src='defaultImage.png'"></span>
                        <span class="marleft5 blueText">${product.productTitle} [${product.productCode}]</span>
                    </label>
                </li>`).join('');

            return brandId > 0 && str ? `<ul>${str}</ul>` : str;
        };

        $("#treeview").html(makeBrandTreeItem(0));
        $("#treeview").hummingbird();

        if (appCommonFunctionality.getUrlParameter("magazineId")) {
            const MAGAZINEPRODUCTS = JSON.parse($("#products").val().replace(/'/g, '"'));
            if (MAGAZINEPRODUCTS.productIds.length > 0) {
                const { brandIds, productIds } = MAGAZINEPRODUCTS;
                $("input:checkbox[id^=bnode-]").each(function() {
                    if (brandIds.includes(parseInt($(this).val()))) {
                        $(this).prop('checked', true).parent().parent().children(':first-child').click();
                    }
                });
                $("input:checkbox[id^=pnode-]").each(function() {
                    productIds.forEach(product => {
                        if (parseInt(product.productId) === parseInt($(this).val())) {
                            $(this).prop('checked', true);
                            const productPriceInputId = this.id.replace("pnode", "productPrice");
                            $(`#${productPriceInputId}`).val(product.productPrice);

                            if ($(this).parents().eq(3).children(":first").hasClass('fa-plus')) {
                                $(this).parents().eq(3).children(":first").removeClass('fa-plus').addClass('fa-minus');
                                $(this).parents().eq(2).css('display', 'block');
                            }
                        }
                    });
                });
            }
        }
		
		$('.fa-plus').click();
    };

    parent.validateProductMagazineEntry = function() {
        let errorCount = 0;

        const magazine = $("#magazine").val();
        if (!magazine) {
            appCommonFunctionality.raiseValidation("magazine", appCommonFunctionality.getCmsString(184), true);
            $("#magazine").focus();
            errorCount++;
        } else {
            appCommonFunctionality.removeValidation("magazine", "magazine", true);
        }

        if ($('[id^=pnode-]').is(':checked')) {
            $("#productsErr").text('');
            const brandArray = $("input:checkbox[id^=bnode-]:checked").map((_, el) => parseInt($(el).val())).get();
            const productArray = $("input:checkbox[id^=pnode-]:checked").map((_, el) => {
                const productPriceInputId = el.id.replace("pnode", "productPrice");
                return { productId: parseInt($(el).val()), productPrice: $(`#${productPriceInputId}`).val() };
            }).get();

            const MAGAZINEPRODUCTS = { brandIds: brandArray, productIds: productArray };
            if (productArray.length > 0) {
                $("#products").val(JSON.stringify(MAGAZINEPRODUCTS));
            }
        } else {
            $("#productsErr").text(appCommonFunctionality.getCmsString(185));
        }

        return errorCount === 0;
    };

    parent.shareProductMagazineInit = async function () {
        appCommonFunctionality.adjustMainContainerHight('productMagazineSectionHolder');
		await appCommonFunctionality.adminCommonActivity();
		if (appCommonFunctionality.isMobile()) {
            $("#customerSelectionSection").removeClass('noLeftPaddingOnly').addClass('nopaddingOnly f12');
        }
        $("#selectAll").on('click', () => {
            $("[id^='customer_']").prop('checked', $('#selectAll').is(":checked"));
        });
    };

    parent.validateProductMagazineCustomer = function() {
        if (!$('[id^="customer_"]').is(":checked")) {
            alert(appCommonFunctionality.getCmsString(186));
            return false;
        }
		$('#selectedLang').val($('#languageDDL').val());
        return true;
    };

    return parent;
}(window, window.$));