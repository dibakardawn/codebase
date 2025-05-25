const MENUSELECTIONITEM = "brands.php";
let HTMLEDITOR = false;
let BRANDPRECOMPILEDDATA = [];
const PAGEDOCNAME = appCommonFunctionality.getPageName();

$(document).ready(function () {
	
	/*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
    switch (PAGEDOCNAME) {
        case "brands.php":{
			$.when(
				appCommonFunctionality.ajaxPreCompiledDataCall('PRECOMPILEDDATA&type=BRAND')
			).done(function(response) {
				appCommonFunctionality.hideLoader();
				brandFunctionality.initBrands(response);
			}).fail(function() {
				appCommonFunctionality.hideLoader();
				console.error('Error in one or both AJAX calls');
			});
            break;
		}
		
        case "brandEntry.php":{
			appCommonFunctionality.showLoader();
            brandFunctionality.initBrandsEntryPage();
            break;
		}
		
        case "brandDetail.php":{
			appCommonFunctionality.showLoader();
            brandFunctionality.initBrandsDetail();
            break;
		}
    }
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const brandFunctionality = (function (window, $) {
    const parent = {};

    parent.initBrands = async function (response) {
		try { 
			appCommonFunctionality.adjustMainContainerHight('brandSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			BRANDPRECOMPILEDDATA = JSON.parse(response);
			populateBrandTree();
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
			appCommonFunctionality.hideLoader();
        } catch (error) { 
			console.error('Error during initBrands:', error); 
			appCommonFunctionality.hideLoader();
		}
    };

    const populateBrandTree = function () {
        const str = makeBrandTreeItem(0);
        $("#treeview").html(str).hummingbird();
        $('.fa-plus').click();
    };

    const makeBrandTreeItem = function (parentBrandId) {
        let str = '';
        BRANDPRECOMPILEDDATA.forEach(item => {
            if (parseInt(item.parentId) === parseInt(parentBrandId)) {
                str += `<li data-id="${item.brandId}">`;
                const getChildItems = makeBrandTreeItem(parseInt(item.brandId));
                str += getChildItems !== '' ? '<i class="fa fa-plus"></i>' : '<i class="fa fa-plus lightGreyText"></i>';
                str += `<label class="marleft5">
                            <span class="marleft5">
                                <img src="${item.brandImage ? PROJECTPATH + 'uploads/brand/' + item.brandImage : PROJECTPATH + 'assets/images/noImages.png'}" alt="${item.brandImage || 'No Image'}" class="productImage hover" onclick="brandFunctionality.brandDetail(${item.brandId});">
                            </span>
                            <span onclick="brandFunctionality.brandDetail(${item.brandId});" class="marleft5 hover">${item.brandName}</span>
                            <span onclick="brandFunctionality.editBrand(${item.brandId});" class="marleft5 fa fa-pencil-square-o blueText hover" title="Edit"></span>
                            <span onclick="brandFunctionality.addBrand(${item.brandId});" class="marleft5 fa fa-plus-square greenText hover" title="Add Child Brand"></span>`;
                if (parseInt(item.products) > 0) {
                    str += `<span onclick="brandFunctionality.gotoProductsWithBrandFilter(${item.brandId});" class="marleft5 hover">[${item.products} Products]</span>
                            <span onclick="brandFunctionality.arrangeProducts(${item.brandId});" class="marleft5 blueText hover">[Arrange Product Sequence]</span>`;
                }
                str += `</label>${getChildItems}</li>`;
            }
        });
        return parentBrandId > 0 && str.length > 0 ? `<ul>${str}</ul>` : str;
    };

    parent.addBrand = function (brandId) {
        window.location.replace(`brandEntry.php${brandId ? `?parentId=${brandId}` : ''}`);
    };

    parent.editBrand = function (brandId) {
        window.location.replace(`brandEntry.php?brandId=${brandId}`);
    };

    parent.brandDetail = function (brandId) {
        window.location.replace(`brandDetail.php?brandId=${brandId}`);
    };

    parent.deleteBrand = function (brandId) {
        if (confirm("Are you sure to delete this Brand?")) {
            window.location.replace(`brands.php?ACTION=DELETE&brandId=${brandId}`);
        }
    };

    parent.initBrandsEntryPage = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('brandSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			const refreshIntervalId = window.setInterval(() => {
				if ($(".ql-toolbar").length === 0 && $('#brandDescBody').not('ql-container') && !HTMLEDITOR) {
					parent.initBrandsEntry();
				} else {
					if ($("#brandDesc").val() !== '') {
						const delta = quill.clipboard.convert(decodeURI(window.atob($("#brandDesc").val())));
						quill.setContents(delta, 'silent');
					}
					HTMLEDITOR = true;
					appCommonFunctionality.cmsImplementationThroughID();
					appCommonFunctionality.cmsImplementationThroughRel();
					clearInterval(refreshIntervalId);
					appCommonFunctionality.hideLoader();
				}
			}, LOADTIME);
        } catch (error) { 
			console.error('Error during initBrandsEntryPage:', error); 
			appCommonFunctionality.hideLoader();
		}
    };

    parent.initBrandsEntry = function () {
        if ($("#brandDescBody").length) {
            /*--------------------------------quill-------------------------------------------------------*/
            const toolbarOptions = [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }]
            ];

            quill = new Quill('#brandDescBody', {
                modules: {
                    toolbar: toolbarOptions
                },
                theme: 'snow'
            });

            $('#brandDescBody').addClass('bgWhite maxH350');
            /*--------------------------------quill-------------------------------------------------------*/
        }
    };

    parent.validateBrandEntry = function () {
        let errorCount = 0;

        /*----------------------------------------------------Product brand Name Validation----------------------------------------*/
        const brandName = $("#brandName").val();
        if (!brandName) {
            appCommonFunctionality.raiseValidation("brandName", "Please Enter Product brand Name", true);
            $("#brandName").focus();
            errorCount++;
        } else {
            appCommonFunctionality.removeValidation("brandName", "brandName", true);
        }
        /*----------------------------------------------------Product brand Title Validation----------------------------------------*/

        /*----------------------------------------------------Product brand Description Validation----------------------------------*/
        const brandDesc = window.btoa(encodeURI(quill.root.innerHTML));
        if (!brandDesc) {
            appCommonFunctionality.raiseValidation("brandsDescErrHolder", "Please Enter Product brand Description", false);
            $("#brandDesc").focus();
            errorCount++;
        } else {
            $("#brandDesc").val(brandDesc);
            appCommonFunctionality.removeValidation("brandsDescErrHolder", "brandsDescErrHolder", false);
        }
        /*----------------------------------------------------Product brand Description Validation----------------------------------*/

        return errorCount === 0;
    };

    parent.initBrandsDetail = async function () {
		try { 
			appCommonFunctionality.adjustMainContainerHight('brandSectionHolder');
			await appCommonFunctionality.adminCommonActivity();
			$("#brandDescActual").html(decodeURI(window.atob($("#brandDesc").val())));
			appCommonFunctionality.cmsImplementationThroughID();
			appCommonFunctionality.cmsImplementationThroughRel();
			appCommonFunctionality.hideLoader();
        } catch (error) { 
			console.error('Error during initBrands:', error); 
			appCommonFunctionality.hideLoader();
		}
    };

    parent.goToBrands = function () {
        window.location.replace('brands.php');
    };

    parent.arrangeProducts = function (brandId) {
        window.location.replace(`arrangeProducts.php?brandId=${brandId}`);
    };

    parent.gotoProductsWithBrandFilter = function (brandId) {
        window.location.replace(`product.php?brandId=${brandId}`);
    };

    return parent;
})(window, jQuery);