var citiResponsive = {};

citiResponsive.utils = (function(window, $) {
	
	function clearFieldErrorValidation() {
		jQuery(".validation-input-danger").off('.validation').removeClass("validation-input-danger");
		jQuery(".validation-message-danger").remove();
		return true;
	};
	
	function	displayPageLevelFieldsError(invalidFields, options) {
		var defaultOptions, $errorDiv, $firstInvalidField;
		// Get first invalid field
		$firstInvalidField = jQuery(".validation-input-danger:visible").first();
		if($firstInvalidField.length !== 0 && $firstInvalidField[0].tagName === 'FIELDSET') {
			$firstInvalidField = $firstInvalidField.find(':radio, :checkbox').first();
		}
		// Make sure invalid field list is non-empty array, and first invalid
		// field exists
		if (Object.prototype.toString.call(invalidFields) === "[object Array]" && invalidFields.length !== 0 && $firstInvalidField && $firstInvalidField.length !== 0) {
			// Function options -- arguments overwrite defaults
			defaultOptions = {
				id: null,
				singleError: citiResponsive.contentModule.Single_Field_Error,
				multiError: citiResponsive.contentModule.Multiple_Field_Error,
				insertAfter: null,
				insertBefore: 'div.cbolui-show-error-above',
				errorTemplate: '<div class="row cbolui-approval" role="alert" tabindex="-1"><div class="col-md-12"><span class="icon icon-alert-info pull-left iconMargin">Error</span><p class="contains-icon"></p></div></div>'
			};
			options = (typeof options === "object") ? jQuery.extend(defaultOptions, options) : defaultOptions;
			// Create new error DIV (with optional ID) from template and set
			// error text based on error count
			$errorDiv = jQuery(options.errorTemplate);
			if (options.id) {
				$errorDiv.attr("id", options.id);
			}
			$errorDiv.find("p.contains-icon").html((invalidFields.length > 1) ? options.multiError : options.singleError);
			$errorDiv.find("span.cbolui-form-pgLvlNumErrs").text(invalidFields.length);
			// Set up error link based on first invalid field
			$errorDiv.find("a.cbolui-form-pgLvlFirstErr").on('click', function() {
				$firstInvalidField.focus();				
			});
			// Remove the previous error if any
			$('#commonPageLevelError.cbolui-approval').remove();
			// Append to DOM, before/after specified element
			if (options.insertAfter) {
				$errorDiv.insertAfter($(options.insertAfter).first());
			} else {
				$errorDiv.insertBefore($(options.insertBefore).first());
			}
			$('#commonPageLevelError div.col-md-12').addClass('col-xs-12');
			// Common.scrollToTop();
			$('html, body').animate({scrollTop: '0px'},300);
			$('#commonPageLevelError').trigger('focus');
		}
	};
				
	function displayFieldErrors(errors, options) {
		var errorMessage, ariaDescribedBy, 
			defaultOptions = {id: 'commonPageLevelError'};
		clearFieldErrorValidation(); 
		for(var i=0, len = errors.length; i < len; i++) {
			try {
				var errorFieldObj = errors[i],
					$field = $("#"+errorFieldObj.fieldId),
					errorValue = $field.val(),
					type = $field.attr('type');
				errorMessage = '<span id="'+errorFieldObj.fieldId+'-error-text" class="validation-message-danger"><span class="icon icon-clear-error pull-left">Error</span><p class="contains-icon">'+errorFieldObj.error+'</p></span>';
				
				 if($field.hasClass('cbolui-form-dob')) {
					 $eventTarget = $field.find('select,input');
					 $eventTarget.addClass("validation-input-danger");
					 $('#dateOfBirth').append(errorMessage);
					 $('#dateOfBirth').find('.validation-message-danger').css({'clear':'both', 'display':'inline-flex'});
					 $field = $eventTarget;
				 }else{
					if($field.parents('.cbolui-form-fieldset').length) {
						if(type === "radio")
							$field = $field.parents('.cbolui-form-fieldset').find('input[type="radio"]')
						else if(type === "checkbox") {
							$field = $field.parents('.cbolui-form-fieldset').find('input[type="checkbox"]')
						}
						$field.parents('.cbolui-form-fieldset').addClass("validation-input-danger").append(errorMessage);
					} else {
						$field.addClass("validation-input-danger").parents('.form-group').append(errorMessage);	
						$maskedfield = $('#'+$field.attr('id')+'Masked');
						if($field.attr('type') != 'password' && $maskedfield.length != 0 && $maskedfield.is(':visible')) {
							$maskedfield.addClass('validation-input-danger');
						}
					}
				 }
				 
				
				ariaDescribedBy = errorFieldObj.fieldId+'-error-text';	
				if(typeof($field.first().attr('aria-describedby')) == "undefined") {
					$field.first().attr('aria-describedby', jQuery.trim(ariaDescribedBy));
				} else if($field.first().attr('aria-describedby').indexOf(ariaDescribedBy) === -1) {
					ariaDescribedBy += ' '+$field.first().attr('aria-describedby');
					$field.first().attr('aria-describedby', jQuery.trim(ariaDescribedBy));
				}
				$field.off('.validation').on('change.validation', {value: errorValue}, function(e) {
					var $oldMessage,
						$this =  jQuery(this),
						isChoice = (this.type === 'radio' || this.type === 'checkbox') ? true : false;
					// Check if value of invalid field has changed
					if(e.data.value != $this.val() || isChoice) {
						// Remove listeners
						if(isChoice) {
							if(this.type === "radio")
								$this = $this.parents('.cbolui-form-fieldset').find('input[type="radio"]')
							else if(this.type === "checkbox") {
								$this = $this.parents('.cbolui-form-fieldset').find('input[type="checkbox"]')
							}
						}
						$this.off('.validation');
						/*
						 * Remove aria hook for tooltip text when the field is
						 * changed
						 */
						if(typeof($this.first().attr('aria-describedby')) !== 'undefined' && $this.first().attr('aria-describedby').indexOf(this.id+'-error-text') !== -1) {
							if($this.first().attr('aria-describedby').split(' ').length > 1) {
								$this.first().attr('aria-describedby', jQuery.trim($this.first().attr('aria-describedby').split(this.id+'-error-text').join('')));
							} else {
								$this.first().removeAttr('aria-describedby');
							}
						} 
						// Remove error style from field
						$oldMessage = $this.removeClass('validation-input-danger').parents('.form-group, .cbolui-form-fieldset').removeClass('validation-input-danger').find('.validation-message-danger');
						$('#'+$this.attr('id')+'Masked').removeClass('validation-input-danger');
						if($this.hasClass('dob-dd')){
							$this.closest('.cbolui-form-dob').find('select,input').removeClass('validation-input-danger');
						} 
						// Remove old error message. Delay is so that if error
						// reoccurs (change event happens on click of submit
						// cta) page does not jump up then down.
						setTimeout(function() {
							$oldMessage.remove();
						}, 200);
					}
				});
			}
			catch(err) {
				return false;
			}
		}
		options = (typeof options === "object") ? jQuery.extend(defaultOptions, options) : defaultOptions;
			displayPageLevelFieldsError(errors, options);
		return true;
	};
	/*Attach Tooltip function
	 *@param parenti and postion of tooltip
	 *@description:function will atttach tooltips on the icons 
	 * */
	 function attachTooltips(parentId, position) {
			var at, my, width, height, defaultConfig;
			// based on position assigning tooltip variable
			switch(position) {
				case 'bottom':
					my = 'top center';
					at = 'bottom center';
					width = 12;
					height = 8;
					break;
				case 'left':
					my = 'right center';
					at = 'left center';
					width = 8;
					height = 12;
					break;
				case 'right':
					my = 'left center';
					at = 'right center';
					width = 8;
					height = 12;
					break;
				default:
					my = 'bottom center';
					at = 'top center';
					width = 12;
					height = 8;
					viewport = false;
			}
			defaultConfig = {
				type : 'basic',
				content: {
					title: {
						button: true
					}
				},
				show : {
					solo : true,
					event : 'click'
				},
				events: {
					show: function() {
						var target = this.id.split('ui-tooltip-')[1];
						if(jQuery('#'+target).is('input')) {
							target = 'cbolui-iconDomID-'+target+'-iconChild';
						}
						jQuery('#'+target).addClass('cbolui-tooltip-opened');
					},
					hide: function() {
						var target = this.id.split('ui-tooltip-')[1];
						if(jQuery('#'+target).is('input')) {
							target = 'cbolui-iconDomID-'+target+'-iconChild';
						}
						jQuery('#'+target).removeClass('cbolui-tooltip-opened');
					}
				},
				position : {
					at : at,
					my : my
				},
				hide : {
					event : 'unfocus'
				},
				style : {
					classes : 'tooltip-static jfpw-tooltip ui-tooltip-shadow',
					tip : {
						border : 2,
						width : width,
						height : height
					}
				},
				keepFocus:false
			};
			// find tooltip help icon in child element then iterate loop and
			// attach event to display tooltip
			jQuery('#'+parentId).find('button.cbolui-responsive-tooltip-icon, .cbolui-responsive-tooltip-cta').not('.cbolui-pStrength-wrapper span.cbolui-icon-help2').each(function(index, element) {
				var $widgetTarget,
					$element = jQuery(element),
					elementID = $element.attr('id'),
					$input = $element.parents('.cbolui-input-box').find('input.form-control, div.cbolui-form-preemptive-help'),
					hasContent = true;
				if(typeof elementID === 'undefined') {
					$element.parent().detach();
				}
				else {
					// if there is no content text then remove the tooltip icon
					// image
					if( !$element.hasClass('cbolui-password-strength-icon') ){
					if(typeof $element.attr('data-tooltip-text') !== 'undefined' || typeof $element.attr('data-tooltip-title') !== 'undefined') {
						if($element.attr('data-tooltip-text') == '' || typeof $element.attr('data-tooltip-text') === 'undefined') {
							hasContent = false;
							if(!$element.hasClass('cbolui-tooltip-cta')){
								$element.detach();
					 		}
							else{
								$element.parent().detach();
							}
						}
				 	}
			 		else {
			 			if(jQuery('#'+elementID+'-info').length === 0  || 
			 				jQuery.trim(jQuery('#'+elementID+'-info').html()) == '' ) {
							hasContent = false;
				 			if(!$element.hasClass('cbolui-tooltip-cta')) {
				 				$element.detach();
					 		}
				 			else{
				 				$element.parent().detach();
				 			}
			 			}
					}
		 		}}
			 	if(hasContent) {
		 			$widgetTarget = $element;
			 		if($input.length && $input.hasClass('cbolui-form-preemptive-help')) {
						$element.off('.tooltip').on('focus.tooltip', {$widgetSelector: $input}, function(e) {							
							if(typeof e.data.$widgetSelector.jfpwidget() === 'undefined') {
								e.data.$widgetSelector.trigger('click.tooltip');
							}
							e.data.$widgetSelector.jfpwidget('show');							
						}).on('blur.tooltip', {$widgetSelector: $input}, function(e) {
							e.data.$widgetSelector.jfpwidget('hide');
						});
						$widgetTarget = $input;
					}
			 		// attach tooltip event
			 		$widgetTarget.off('.tooltip').on('click.tooltip keyup.tooltip',{$currentElement: $element}, function(e) {
			 			if (e.type == 'click' || (e.type == 'keyup' && e.which == '13')) {
							var wrapper, tooltipConfig,
								$currentWidgetTarget = jQuery(this);
							if(!$currentWidgetTarget.jfpwidget()) {
								tooltipConfig = jQuery.extend(true, {}, defaultConfig);
								/*
								 * It the tooltip content is in the data
								 * attribute set the content
								 */
								if(typeof e.data.$currentElement.attr('data-tooltip-text') !== 'undefined') {
									tooltipConfig.content.text = e.data.$currentElement.attr('data-tooltip-text');
									/*
									 * If title content is present in data
									 * element set it for tooltip
									 */
									if(typeof e.data.$currentElement.attr('data-tooltip-title') !== 'undefined') {
										tooltipConfig.content.title.text = e.data.$currentElement.attr('data-tooltip-title');
									}
									else {
										tooltipConfig.content.title.text = ' ';
										//tooltipConfig.metadata = { type: 'notitle' };
									}
								}
								else {
									if(jQuery('#'+e.data.$currentElement.attr('id')+'-title').length === 0 ||
										jQuery.trim(jQuery('#'+e.data.$currentElement.attr('id')+'-title').html()) === '') {
										tooltipConfig.content.title.text = ' ';
										//tooltipConfig.metadata = { type: 'notitle' };
									}
									if($currentWidgetTarget.hasClass('cbolui-responsive-tooltip-icon')|| $currentWidgetTarget.hasClass('cbolui-form-preemptive-help')) {
										tooltipConfig.position.target = e.data.$currentElement;
										tooltipConfig.content.text = jQuery('#'+e.data.$currentElement.attr('id')+'-info').html();
										if( !$currentWidgetTarget.hasClass('cbolui-password-strength-icon') ){
											var titleTxt = jQuery.trim( jQuery('#'+e.data.$currentElement.attr('id')+'-title').html() );
											tooltipConfig.content.title.text = (titleTxt === '') ? '  ' : titleTxt;
										}else{
											tooltipConfig.content.title.text = jQuery('#'+e.data.$currentElement.attr('id')+'-title').html();
										}
									}	
								}
								/*
								 * Override the postion if this is a table help
								 * tooltip
								 */
								if(e.data.$currentElement.parent('.cbolui-tables-tableTooltipWrapper').length != 0) {
									tooltipConfig.position = {
										my: 'bottom right',
										at: 'top right',
										adjust: {
											x: -20
										}
									};
									tooltipConfig.style.tip.offset = 20;
									tooltipConfig.style.tip.mimic = "center";
								}
								wrapper = '#'+$currentWidgetTarget.attr('id');
								$currentWidgetTarget.jfpwidget(new CJW.jfp.widget.Tooltip({
									wrapperSet : wrapper
								}, tooltipConfig, {
									"/topic/tooltip" : ["show", "hide"]
								}));
							}
							
							$currentWidgetTarget.jfpwidget('show');
							$currentWidgetTarget.jfpwidget('reposition');
							//------------------Tooltp Manipulation-----------------------
							if(citiResponsive.utils.responsiveBoolean()){
								var tooltipId = $currentWidgetTarget.get(0).id;
								var toolTipOvlyTopVal = $('#ui-tooltip-' + tooltipId).offset().top;
								var tooltipButtonTopVal = $currentWidgetTarget.offset().top;
								var manDigit = 0;
								if(window.screen.availHeight === 480){
									//This is only for small devices.
									var diff = (tooltipButtonTopVal - toolTipOvlyTopVal);
									if(diff > 85 && diff < 100){
										manDigit = 0;
									}else{
										manDigit = ($('#ui-tooltip-' + tooltipId).height() * 2) + 10;//10 Px for tooltip Arrow
									}
								}
								if(manDigit !== 0){
									tooltipButtonTopVal = (tooltipButtonTopVal - manDigit);
									$('#ui-tooltip-' + tooltipId).css("top",tooltipButtonTopVal + "px");
								}
							}
							//------------------Tooltp Manipulation-----------------------
			 			}
					});
				}				
			});
		};
		
		function renderFormTooltipErrors(formId, invalidFields) {
			var $firstInvalidField,
				invalidField,
				$invalidField,
				tooltipTargetID,
				errorTarget,
				$errorTarget,
				errorValue,
				isRadio,
				$radioTarget,
				ariaDescribedBy,
				$form = jQuery('#'+formId);
			/* Removes any left over event handlers from previous validations */
			$form.off('.validation').find('.cF-invalidField').off('.validation').removeClass('cF-InvalidInputBackground ui-tooltip-shown').find('input').off('.validation').removeClass('cF-InvalidInputBackground ui-tooltip-shown');
			/* Removes responsive tooltips */
			$form.find('.cM-responsiveTooltip').remove();
			/* This clears invalid field tooltips widgets from previous form submissions */
			$form.find('.cF-invalidField').each(function(){
				jQuery(this).removeClass('cF-invalidField').not('select, .cF-pStrength-input').jfpwidget('destroy');
			 });
			/* This clears any leftover error tooltip text divs from previous form submissions */
			jQuery('div.cF-frontEndErrorText[id]').remove();
			/* Attach extra on click event handler because otherwise in cases of masked fields when user selects an error field, 
			 * then selects it again "focus" events are not called, but the tooltip is hidden
			 * Also In IE7 & 8 "focus" events on error fields are not called correctly if the user already has another error field focused
			 * Second click event (non-delegated) is added because the datepicker widget stops propogation of click events
			 * which prevents the first (delegated) click event from firing on inputs with datepickers
			 */
			$form.on('click.validation', 'input',function(){
				jQuery(this).trigger('focus');
			}).find('input.hasDatepicker').on('click.validation', function() {
				jQuery(this).trigger('focus');
			});
			/* Set public variable so other functions can check if error has occured */
//citiGlobal.common.formUtilitiesModule.recoverableError = true;
			/*
			 * Attach event listeners to each invalid field, so when user corrects error
			 * tooltip no longer shows on click and background color is cleared
			 */	 
			for(var x=0; x < invalidFields.length;x++) {
				invalidField = invalidFields[x].fieldId;
				$invalidField = jQuery('#'+invalidField);
				if(!$invalidField.hasClass('cF-pStrength-input')) {
					/* If there is position specific information for this field, assign it to the position property */
					invalidFields[x].position = $invalidField.data('tooltip-position');
					isRadio = ($invalidField.attr('type') === 'radio' || $invalidField.attr('type') === 'checkbox') ? true: false;
					//Create tooltip content div if it doesn't exist because each tooltip created required a div in the DOM
					if($form.find('.cF-frontEndErrorText:not([id])').length == 0)
						$form.append('<div class="cF-frontEndErrorText cM-toolTipContent"></div>');
					/* Get Id of element to attach tooltip to. If the element is a select, set ID to the id of the select widget button "[selectID]-button"
						If the element is an input use the input ID */
					if(jQuery('select#'+invalidField).length) {
						/* If the widget has not been created then trigger its creation so we can attach the tooltip */
						if(jQuery('#'+invalidField+'-temp').length) {
							jQuery('#'+invalidField).jfpwidget()._create();
						}
						//Set ID of tooltip content div to be 
						$form.find('div.cF-frontEndErrorText:not([id])').attr('id', invalidField+'-button-info');
						errorTarget = '#'+invalidField+'-button';
						/* Error target (to which events are attached) is both widget and html select so tooltips
						 work in desktop and mobile (responsive) view */
						$errorTarget = jQuery(errorTarget+', #'+invalidField);
						//For selects tooltip target is the same as error target because there is no masking logic issue
						tooltipTargetID = errorTarget;
						//Save the value of invalid element to allow change tracking later
						errorValue = $errorTarget.find('.ui-selectmenu-item-header').text();
					}
					else if($invalidField.hasClass('cF-form-dob')) {
						var targetIndex,
							isMobileView = $invalidField.find('select:first').is(':visible');/*variable to check the mobile view*/
						/* If the error field is type day, need to find the first of month / day and attach tooltip to that */
						if(invalidFields[x].type == 'day') {	
							var dayIndex = $invalidField.data('fieldorder').indexOf('D'), 
								monthIndex = $invalidField.data('fieldorder').indexOf('M');
							targetIndex = (dayIndex < monthIndex) ? dayIndex : monthIndex;
							//handleDobError($invalidField, 'day', dayIndex, monthIndex, targetIndex);									
							if(isMobileView){										
								errorTarget = '#'+$invalidField.find("select").eq(dayIndex).attr("id")+', #'+$invalidField.find("select").eq(monthIndex).attr("id");
							}
							else{ 
								errorTarget = '#'+$invalidField.find('.ui-selectmenu.ui-widget').eq(dayIndex).attr('id')+', #'+$invalidField.find('.ui-selectmenu.ui-widget').eq(monthIndex).attr('id');
							}
						}
						/*If the error field is type full, all dob fields are highlighted and tooltip is attached to last select */
						else {									
							//handleDobError($invalidField, 'full');
							targetIndex = 2;
							if(isMobileView){										
								errorTarget = '#'+$invalidField.find("select").eq(0).attr("id")+', #'+$invalidField.find("select").eq(1).attr("id")+', #'+$invalidField.find("select").eq(2).attr("id");
								}
							else{
								errorTarget = '#'+$invalidField.find('.ui-selectmenu.ui-widget').eq(0).attr('id')+', #'+$invalidField.find('.ui-selectmenu.ui-widget').eq(1).attr('id')+', #'+$invalidField.find('.ui-selectmenu.ui-widget').eq(2).attr('id');
								}
							invalidFields[x].position = "right";
						}
						if(isMobileView){
							tooltipTargetID = $invalidField.find("select").eq(targetIndex).attr('id');									
							}
						else {
							tooltipTargetID = $invalidField.find('.ui-selectmenu.ui-widget').eq(targetIndex).attr('id');
							}

						//Set ID of tooltip content div to be 
						$form.find('div.cF-frontEndErrorText:not([id])').attr('id', tooltipTargetID+'-info');
						tooltipTargetID = '#'+ tooltipTargetID;
						
						$errorTarget = jQuery(errorTarget);
						errorValue = $invalidField.find('.ui-selectmenu-item-header').eq(0).text() +
									$invalidField.find('.ui-selectmenu-item-header').eq(1).text() +
									$invalidField.find('.ui-selectmenu-item-header').eq(2).text();
					}
					else {
						/* Next line gets the ID of the masked field wrapper if it exists
						 * tooltipTargetID will hold the ID of the field we attached the tooltip to.
						 * This is required because masking uses 2 inputs that are shown / hidden alternately. If tooltip is
						 * Attached to one of these it will not be positioned correctly.
						 */
						if($invalidField.attr('type') != 'password' && $invalidField.parent('div.maskedWrapper').length != 0) {
							tooltipTargetID = $invalidField.parent('div.maskedWrapper').attr('id');
							$form.find('div.cF-frontEndErrorText:not([id])').attr('id', tooltipTargetID+'-info');
							tooltipTargetID = '#'+tooltipTargetID;
						/*
        				 * If the target is the datepicker field, you have to add the tooltip to the wrapper div so that the
        				 * calendar widget will not be destroyed also
        				 */
						} else if($invalidField.parent('div.cM-dateWrapper').length != 0) {
            				tooltipTargetID = $invalidField.parent('div.cM-dateWrapper').attr('id');
            				$form.find('div.cF-frontEndErrorText:not([id])').attr('id', tooltipTargetID+'-info');
            				//Save wrapper of first invalid field so we can call its error tooltip after all invalid fields are looped through
            				tooltipTargetID = '#'+tooltipTargetID;
						} else if(isRadio) {
							$radioTarget = $invalidField.parents('div.cF-elementInputChoice').find('legend').first();
							if(typeof($radioTarget.attr('id')) === 'undefined') {
								$radioTarget.attr('id', invalidField+'-radioErrorTarget');
							}								
							$form.find('div.cF-frontEndErrorText:not([id])').attr('id', $radioTarget.attr('id')+'-info');
							tooltipTargetID = '#'+$radioTarget.attr('id');
						}
						else {
							$form.find('div.cF-frontEndErrorText:not([id])').attr('id', invalidField+'-info');
							tooltipTargetID = '#'+invalidField;
						}
						errorTarget = '#'+invalidField;
						$errorTarget = jQuery(errorTarget);
						//Save the value of invalid element to allow change tracking later
						errorValue = $errorTarget.val();
					}
					/* Add aria attribute for screen reader access to error tooltip text */
					ariaDescribedBy = tooltipTargetID.split('#')[1]+'-info';	
					if(typeof($errorTarget.first().attr('aria-describedby')) == "undefined") {
						$errorTarget.attr('aria-describedby', jQuery.trim(ariaDescribedBy)).next('.Mask').attr('aria-describedby', jQuery.trim(ariaDescribedBy));
					} else if($errorTarget.first().attr('aria-describedby').indexOf(ariaDescribedBy) === -1) {
						ariaDescribedBy += ' '+$errorTarget.first().attr('aria-describedby');
						$errorTarget.attr('aria-describedby', jQuery.trim(ariaDescribedBy)).next('.Mask').attr('aria-describedby', jQuery.trim(ariaDescribedBy));
					}									
					/*  - Add yellow background class to change background color
					 * 	- Add error target class to indicate a field has had validation event handlers attached. In case of multiple submissions with front-end validation
					 *	this class is used to search for previous invalid fields and remove any leftover event handleres from previous run
					 *	- Add invalid field class to indicate a field has had an error tooltip attached. In case of multiple submissions with front-end validation
					 *	this class is used to search for previous invalid fields and destroy any leftover tooltip widgets from previous run
					 */
					jQuery(errorTarget+', '+tooltipTargetID+' input').not(':checkbox, :radio').addClass('cF-InvalidInputBackground');
					/* Responsive tooltips require classes to be added to the html select as well as platform widget */
					if(errorTarget.split('-button').length > 1) {
						jQuery(errorTarget.split('-button')[0]).addClass('cF-invalidField').addClass('cF-InvalidInputBackground');
					}
					jQuery(tooltipTargetID).addClass('cF-invalidField');
					//Show error tooltip on this invalid element when clicked
					$errorTarget.on('focus.validation', {error: invalidFields[x].error, tooltipTarget: tooltipTargetID, isRadio: isRadio, position: invalidFields[x].position}, function(e) {
						if(!jQuery(e.data.tooltipTarget).hasClass('ui-tooltip-shown')) {
							//Reset tooltips that are shown (hide them)
							jQuery('.ui-tooltip.qtip, .ui-tooltip-shown').qtip('hide');
							jQuery('.ui-tooltip-shown').removeClass('ui-tooltip-shown');	
							//If field is a select, refresh the attached widget to include new event listener
							//Show error tooltip on this invalid element
							displayFrontEndErrorTooltip(e.data.tooltipTarget, e.data.error, e.data.isRadio, e.data.position);	
						}
					});	
					//Add an focusout listener so once focus is changed, old value is compared to new  value
					$errorTarget.on('change.validation', {wrapper: errorTarget, value: errorValue, tooltipTarget: tooltipTargetID, isRadio: isRadio}, function(e) {
						//save data variables because they  may become unavailable inside setTimeoout call
						var wrapper = e.data.wrapper,
							tooltipTarget = e.data.tooltipTarget,
							$wrapper = jQuery(wrapper),
							$responsiveSelect = $wrapper;
							if(tooltipTarget.split('-button').length > 1) {
								$responsiveSelect = jQuery(tooltipTarget.split('-button')[0]);
							}
						//Check if value of invalid field has changed, first check is for inputs while the second is for select widgets & html selects
						if((e.data.value != $wrapper.val() || e.data.isRadio) && 
						   (e.data.value != $wrapper.find('.ui-selectmenu-item-header').text() || ($responsiveSelect.is('select') && e.data.value != $.trim($responsiveSelect.find('option:selected').text())) || e.data.value == "")) {
							//IE7 fix - prevents collision of 'change' and 'focus' events by creating a new 'thread'
							setTimeout(function(){
								/* Reset error state */
		//citiGlobal.common.formUtilitiesModule.recoverableError = false;
								//Remove listeners so tooltip will no longer show for this field
								$wrapper.off('.validation');
								/* Remove aria hook for tooltip text when the field is changed */
								if(typeof($wrapper.attr('aria-describedby')) !== 'undefined' && $wrapper.attr('aria-describedby').indexOf(tooltipTarget.split('#')[1]+'-info') !== -1) {
									if($wrapper.attr('aria-describedby').split(' ').length > 1) {
										$wrapper.attr('aria-describedby', jQuery.trim($wrapper.attr('aria-describedby').split(tooltipTarget.split('#')[1]+'-info').join('')));
									} else {
										$wrapper.removeAttr('aria-describedby');
									}
								} 
								//Remove yellow background field
								jQuery(wrapper+', '+tooltipTarget+', '+tooltipTarget+' input').removeClass('cF-InvalidInputBackground');
								/* Responsive tooltips - must have html select background removed, plus remove validation event handlers as well as hide the tooltip  */
								if(tooltipTarget.split('-button').length > 1) {
									jQuery(tooltipTarget.split('-button')[0]).removeClass('cF-InvalidInputBackground').off('.validation').next('.cM-responsiveTooltip').addClass('cM-responsiveTooltip-hide');
								}
								/* Hide regular tooltips and responsive tooltips */
								jQuery(tooltipTarget).jfpwidget('hide');
								jQuery(tooltipTarget).next('.cM-responsiveTooltip').addClass('cM-responsiveTooltip-hide');
								if($wrapper.get(0).tagName != 'INPUT') $wrapper.focus();//When drop down item is switched by arrow key, can only get focus in first time.
								
							}, 0);
						}
					});
					/* Responsive tooltips - on blur hide tooltip */
					$errorTarget.not('.ui-selectmenu').on('blur.validation', {tooltipTarget: tooltipTargetID},  function(e) {
						jQuery(e.data.tooltipTarget.split('-button')[0]).next('.cM-responsiveTooltip').addClass('cM-responsiveTooltip-hide');
					});
				} else {
					//Password strength indicator exception (creates its own tooltip etc)
//citiGlobal.common.passwordStrengthModule.addExternalError($invalidField, invalidFields[x].error);
					$invalidField.addClass('cF-invalidField cF-InvalidInputBackground');
				}
			}
			//Show error tooltip on first invalid element		
			setTimeout(function(){
				$firstInvalidField = $form.find('.cF-invalidField:visible').first();
				//If field is a masked or date field, set invalidField to the visible input within
				if($firstInvalidField.hasClass('maskedWrapper') ||  $firstInvalidField.hasClass('cM-dateWrapper')) {
					$firstInvalidField = $firstInvalidField.find('input:visible');
				}
				//If legend, set to first radio button within the fieldset
				else if ($firstInvalidField.prop('tagName') == "LEGEND") {
					$firstInvalidField = $firstInvalidField.parents('fieldset').first().find('input:radio').first();
				}
				$firstInvalidField.trigger('focus');

				/* For radio buttons with input boxes associated, errors should clear if the radio button selection
				 * is changed by the user.
				 * This event handler is attached here to avoid it being triggered by the focus() event called above
				 */
				$('.cF-inputBoxChoiceList input:radio').on('change.validation', function(){
					jQuery(this).parents('div.cF-inputBoxChoiceList').find('.cF-invalidField').each(function(){
						var $this = jQuery(this);
						$this.jfpwidget('destroy');
						/* .find('input') is for when a field is masked. Then '$this' will represent the wrapper div around the masked fields
						 * so we need to remove the invalid background from the 2 inputs inside the wrapper
						 */
						$this.removeClass('cF-InvalidInputBackground cF-invalidField').find('input').removeClass('cF-InvalidInputBackground');
						$form.find('#'+$this.attr('id')+'-info.cF-frontEndErrorText').remove();
					});
				});
			}, 0);
			
			
		};
		
		/* This function is used by renderFormTooltipErrors to create the tooltip widgets for each invalid field */
		function displayFrontEndErrorTooltip(toolTipTarget, errorText, isRadio, position) {
			var at, my, x, width, height, $responsiveTarget;
			jQuery(toolTipTarget+'-info.cF-frontEndErrorText').html(errorText);
			/* For responsive tooltips, check if error target is a select, and if so set responsive tooltip
				target to the html select instead of the platform widget */
			if(jQuery(toolTipTarget).closest('.cF-select').length !== 0) {
				$responsiveTarget = jQuery(toolTipTarget).closest('.cF-select').find('select');
			} else {
				$responsiveTarget = jQuery(toolTipTarget);
			}
			//Create tooltip if it doesn't already exist
			if(typeof jQuery(toolTipTarget).jfpwidget() == 'undefined' || jQuery(toolTipTarget).jfpwidget().type != 'error')
			{
				switch(position) {
					case 'top':
						my = 'bottom center';
						at = 'top center';
						x = 0;
						width = 12;
						height = 8;
						break;
					case 'bottom':
						my = 'top center';
						at = 'bottom center';
						x = 0;
						width = 12;
						height = 8;
						break;
					case 'left':
						my = 'right center';
						at = 'left center';
						x = -9;
						width = 8;
						height = 12;
						break;
					case 'right':
						my = 'left center';
						at = 'right center';
						x = 9;
						width = 8;
						height = 12;
						break;
					default:
						if(isRadio) {
							my = 'right center';
							at = 'left center';
							x = -9;
							width = 8;
							height = 12;
						}
						else {
							my = 'left center';
							at = 'right center';
							x = 9;
							width = 8;
							height = 12;
						}
				}			
				//Create new tooltip for wrapper element passed in
				jQuery(toolTipTarget).jfpwidget(new CJW.jfp.widget.Tooltip(
					{
						wrapperSet: toolTipTarget
					},
					{
						show:
						{
							solo: true,
							event: false,
							ready: true
						},
						events: { 
							show: function(event, api) {
								jQuery(toolTipTarget).addClass('ui-tooltip-shown');
								api.reposition();
							},
							hide: function(event, api) {
								if(event.originalEvent && event.originalEvent.target && event.originalEvent.target.className.split('slider').length > 1) {
									event.preventDefault();
								} else {
									jQuery(toolTipTarget).removeClass('ui-tooltip-shown');
								}
							}
						},
						type: 'error',
						position: 
						{
							my: my,
							at: at,

							adjust: {
								method: 'shift none',
								x: x
							}
						},
						style: 
						{
							tip: {
								border: 1,
								corner: true,
								mimic: 'center',
								width: width,
								height: height
							}
						},
						hide: 
						{
							event: 'unfocus'
						}  
					}
				));
				//Responsive tooltip creation
				$responsiveTarget.after('<div id="'+$responsiveTarget.attr('id')+'-rtip" class="cM-responsiveTooltip"><span class="cM-responsiveTooltipTip"></span><span class="cM-responsiveTooltipText">'+errorText+'</span></div>');
			}
			//Responsive tooltip show
			jQuery('.cM-responsiveTooltip').addClass('cM-responsiveTooltip-hide');
			$responsiveTarget.next('.cM-responsiveTooltip').removeClass('cM-responsiveTooltip-hide').find('.cM-responsiveTooltipText').text(errorText);
			//Regular tooltip show
			jQuery(toolTipTarget).jfpwidget('show');

			
		};
	
	return{ 
		interdictionCompleted : false,
		renderFormTooltipErrors :renderFormTooltipErrors,
		attachTooltips:attachTooltips,
		renderFieldErrors : function(errors, options){ 
								displayFieldErrors(errors, options) 
							},
							
		responsiveBoolean: function(){
			if(window.screen.availWidth < 768 || 
					(window.screen.availWidth >= 980 && window.devicePixelRatio > 1.25) ){
				return true;
			}else{
				return false;
			}
		},
							
		PlaceHolderForIE : function(formId, placeHolderClass, submitBtnCss){
			if(typeof Modernizr !== "undefined" && !Modernizr.input.placeholder) {
				var $passInputs = $('#' + formId + ' input[type="password"]');
				passfields = [];
				for(var i = 0; i < $passInputs.length; i++){
					passfields.push($passInputs.get(i).id);
				}
				//Remove existing event handlers in case this is called after partial dynamic page load
				//Attach event handlers to show / hide placeholder text when appropriate
				jQuery('#' + formId).off('.cbolui-placeholder').on('focus.cbolui-placeholder', '[placeholder]', function() {
					var $focusedInput = jQuery(this);
					$focusedInput.removeClass(placeHolderClass);
					if (jQuery.trim($focusedInput.val()) == jQuery.trim($focusedInput.attr('placeholder'))) {
						if(passfields.indexOf($focusedInput.get(0).id) > -1){
							$focusedInput.get(0).type='password';
						}
						$focusedInput.val('');	
					}
				}).on('blur.cbolui-placeholder', '[placeholder]', function() {
					var $burredInput = jQuery(this);
					setTimeout(function() {
						if (jQuery.trim($burredInput.val()) == '' || jQuery.trim($burredInput.val()) == jQuery.trim($burredInput.attr('placeholder'))) {
							if($burredInput.attr('type') === 'password'){
								$burredInput.get(0).type='text';
							}
							$burredInput.addClass(placeHolderClass);
							$burredInput.val($burredInput.attr('placeholder'));
						}
					}, 0);
				}).find('.' + submitBtnCss).off('.cbolui-placeholder').on('click.cbolui-placeholder', function() {
					jQuery('[placeholder]').each(function() {
						var $submittedInput = jQuery(this);
						if (jQuery.trim($submittedInput.val()) == jQuery.trim($submittedInput.attr('placeholder'))) {
							$submittedInput.removeClass(placeHolderClass);
							$submittedInput.val('');
						}
					});	
				});
				/* Trigger blur on all placeholder fields so intial state of the field has the placeholder generated */
				jQuery('[placeholder]').trigger('blur.cbolui-placeholder'); 
			}
		},
							
		setUpJampinit: function (blockId, willScrollToTop, positionFromTop, recoverableError, customFn) {
			if (!recoverableError && (willScrollToTop === true || typeof willScrollToTop === 'undefined')) {
				window.scrollTo(0, 0);
			}
			var jampRequired, $spinner = jQuery('#CBOLSpinner'), jampDelay = 0;
			jQuery(document).off(".cbolui-jamp").on("ajaxStart.cbolui-jamp", function () {
				jampRequired = true;
				setTimeout(function () {
					if (jampRequired && (jQuery("#InterdictionOverlayContent-parent").index() == -1 || citiResponsive.utils.interdictionCompleted)) {
					  $spinner.jfpwidget('block', blockId);
					  jQuery('#CBOLSpinner_Text').removeClass('cbolui-hidden');
					  // $('.blockUI.blockMsg.blockElement').css('top','400px');
					  if (typeof positionFromTop === "undefined" || positionFromTop === "") {
						  positionFromTop = "400px";
					  }
					  //$("#formsection :input").attr("disabled", true);
					  $(blockId).addClass("heazyBg");
					  $('.blockUI.blockMsg.blockElement').css('top', positionFromTop);
					}
			   }, jampDelay);
			}).on("ajaxStop.cbolui-jamp", function () {
				$(blockId).removeClass("heazyBg");
				jampRequired = false;
				$spinner.jfpwidget('unblock');
				if(!willScrollToTop){
					customFn();
				}
			});
		},				
		
		initializeAccordion : function(accordionWrapperId) {
			var $wrapper = jQuery('#'+accordionWrapperId);
			$wrapper.on('click.cbolui-accordion', '.level1.parent .category', function() {
				var $this = jQuery(this);
				if($this.parent('.here').length) {
					$this.parent().removeClass('here').
					find('.accordion-down').attr('class', 'accordion-right').end().
					find('.accordionSubMenu.expanded').removeClass('expanded').attr('aria-expanded', 'false');
				}
				else {
					$this.parent().addClass('here').find('.accordion-right').attr('class', 'accordion-down').end().
					find('.accordionSubMenu').addClass('expanded').attr('aria-expanded', 'true');
				}
				/*Issue Tracker-91 - To change the expandall/collapseall text while expanding/collapsing all the accordions*/
                if($wrapper.find('.accordionSubMenu:visible').length===0){
                       $wrapper.find('.toggle-accordion').attr('aria-expanded', 'false').text($wrapper.find('.toggle-accordion').data('expandtext'));
                } else if($wrapper.find('.accordionSubMenu:visible').length === $wrapper.find('.accordionSubMenu').length){
                       $wrapper.find('.toggle-accordion').attr('aria-expanded', 'true').text($wrapper.find('.toggle-accordion').data('collapsetext'));
                }      
				
			}).on('hover.cbolui-accordion', '.level1.parent .category', function() {
				var $this = jQuery(this);
				if($this.parent('.here').length === 0){
					var svgel = $this.find('svg');
					if($.trim($this.context.children[0].outerHTML) === '<svg class="accordion-right"></svg>'){
						svgel.attr('class','accordion-down');
					}
				}
			}).on('mouseleave.cbolui-accordion', '.level1.parent .category', function() {
				var $this = jQuery(this);
				if($this.parent('.here').length === 0){
					var svgel = $this.find('svg');
					if($.trim($this.context.children[0].outerHTML) === '<svg class="accordion-down"></svg>'){
						svgel.attr('class','accordion-right');
					}
				}
			});
			
			$wrapper.find('.toggle-accordion').on('click.cbolui-accordion', function() {
				var $this = jQuery(this), 
					$menu = $this.parents('.accordion.menu');
				if($this.attr('aria-expanded') === "true") {
					$menu.find('.level1.here').removeClass('here').
					find('.accordion-down').attr('class', 'accordion-right').end().
					find('.accordionSubMenu.expanded').removeClass('expanded').attr('aria-expanded', 'false');
					$this.attr('aria-expanded', "false").text($this.data('expandtext'));
				}
				else {
					$menu.find('.level1').addClass('here').find('.accordion-right').attr('class', 'accordion-down').end().
					find('.accordionSubMenu').addClass('expanded').attr('aria-expanded', 'true');
					$this.attr('aria-expanded', "true").text($this.data('collapsetext'));
				}	
			});
		},
		
		handleRBAResponse : function (resData, xhr, hrtUrl) {
			if (typeof rbaAjax != 'undefined') {
				rbaAjax.abort();
			}
			if (xhr.getResponseHeader("content-type") != null &&
					xhr.getResponseHeader("content-type").indexOf('json') > -1) {
				//return callHrtUrl(resData,hrtUrl);
				if (resData.response == 'ACCEPT' || resData.response == 'REVIEW' || resData.response == 'NONE' || resData.response == 'challenge' || (resData.response == 'challenge' && resData.isAjax == 'true')) {
					rbaAjax = jQuery.ajax({
						url : hrtUrl,
						type : 'POST',
						async : false,
						success : function (data) {
							resData = data;
						},
						error : function () {}
					});
					return resData;
				} else if (resData.response == 'DENY') {
					window.location = hrtUrl;
				} else {
					jQuery.post(hrtUrl, function (data) {
						jQuery('body').html(data);
					});
				}
			} else {
				return resData;
			}
		},

		/**
		 * @public
		 * @description This module provides client Side validation - Empty
		 *              check, Minimum and Maximum , Regular Expression testing
		 *              and displays the error tooltip
		 * @returns All publicly available modules.
		 * @branch 7.6
		 */
		clientValidationModule : (function () {
			// Private Medthods
			// Validating is Input Field Empty
			function validateEmpty(selector, mandatoryRule) {
				var selectorValue = selector.val();
				if (mandatoryRule.trim) { // trim Required
					selectorValue = jQuery.trim(selectorValue);
				}
				if (mandatoryRule.dateFormat) {
					if (selectorValue === mandatoryRule.dateFormat)
						return true;
				}
				return selectorValue == "";
			}

			// Restricting Maximum length of input value
			function validateMaxLength(selector, maxLength, trimRequired) {
				var selectorValue = selector.val(),
				selectorLength = selectorValue.length;
				if (trimRequired) {
					selectorLength = jQuery.trim(selectorValue).length;
				}
				return selectorLength > maxLength;
			}

			// Restricting Minimum length of input value
			function validateMinLength(selector, minLength, trimRequired) {
				var selectorValue = selector.val(),
				selectorLength = selectorValue.length;
				if (trimRequired) {
					selectorLength = jQuery.trim(selectorValue).length;
				}
				return selectorLength < minLength;
			}
			// Matching the Input value with given Regaular Expression
			function validateRegularExpression(selector, regexStr, trimRequired) {
				var selectorValue = selector,
				reg_Str = new RegExp(regexStr);
				if (trimRequired) {
					selectorValue = jQuery.trim(selectorValue);
				}
				return !reg_Str.test(selectorValue);
			}
			// Evaluate the each field
			function validateInputs(fieldList, clientValidationRule, inputErrorMessages, formName, autoRenderErrors) {
				var breakLoop = false,
				invalidInputs = new Array(),
				tempUpConversion = '';
				for (var i = 0; i < fieldList.length; i++) {
					var element = jQuery("#" + fieldList[i]), // Object of
																// Input Element
					elementName = fieldList[i], // Name of Input Element
					inputRule = clientValidationRule[elementName];

					// Checking is Validation Required for Specified Field
					if (inputRule.clientValidationRequired) {
						var isRadio = jQuery("input:radio[name='" + elementName + "']").length,
						isDropDown = jQuery("select[id='" + elementName + "']").length,
						isCheckBox = jQuery("input:checkbox[id='" + elementName + "']").length;
						var inputErrorMsg = '';
						for (var validatorType in inputRule) {
							breakLoop = false;
							if (inputRule[validatorType] != null) {
								switch (validatorType) {
								case "mandatoryValidation":
									if (inputRule[validatorType].clientValidation) {

										if (inputErrorMessages == null) { // Assigning
																			// error
																			// message
																			// for
																			// respective
																			// validator
																			// type.
											inputErrorMsg = inputRule[validatorType].errorMessage;
										} else {
											inputErrorMsg = inputErrorMessages[elementName + 'RequiredMsg'];
										}
										if (isDropDown != 0) {
											if (element.val() === "" || element.val() === "0" || element.val() === 0) {
												invalidInputs.push({
													fieldId : elementName,
													error : inputErrorMsg
												});
												breakLoop = true;
											}
										} else if (isRadio != 0) {
											if (typeof jQuery("input:radio[name='" + elementName + "']:checked").val() === "undefined") {
												radioID = jQuery("input:radio[name='" + elementName + "']")[0].id;
												invalidInputs.push({
													fieldId : radioID,
													error : inputErrorMsg
												});
												breakLoop = true;
											}
										} else if (isCheckBox != 0) {
											if (!$("#" + elementName).is(':checked')) {
												invalidInputs.push({
													fieldId : elementName,
													error : inputErrorMsg
												});
												breakLoop = true;
											}
										} else if (validateEmpty(element, inputRule[validatorType])) {
											invalidInputs.push({
												fieldId : elementName,
												error : inputErrorMsg
											});
											breakLoop = true;
										}
									}
									break;
								case "lengthValidation":
									if (inputRule[validatorType].clientValidation && jQuery.trim(element.val()).length != 0) {
										if (inputErrorMessages == null) {
											inputErrorMsg = inputRule[validatorType].errorMessage;
										} else {
											inputErrorMsg = inputErrorMessages[elementName + 'LengthMsg'];
										}
										var minLength = inputRule[validatorType].minLength,
										maxLength = inputRule[validatorType].maxLength;
										if (minLength != -1 && validateMinLength(element, minLength, inputRule[validatorType].trim)) {
											invalidInputs.push({
												fieldId : elementName,
												error : inputErrorMsg
											});
											breakLoop = true;
										} else if (maxLength != -1 && validateMaxLength(element, maxLength, inputRule[validatorType].trim)) {
											invalidInputs.push({
												fieldId : elementName,
												error : inputErrorMsg
											});
											breakLoop = true;
										}
									}
									break;
								case "regexValidation":
									if (inputRule[validatorType].clientValidation && jQuery.trim(element.val()).length != 0) {
										tempUpConversion = element.val();
										if (inputRule[validatorType].convertToUpperCase) {
											tempUpConversion = tempUpConversion.toUpperCase();
										}
										if (validateRegularExpression(tempUpConversion, inputRule[validatorType].regexValue, inputRule[validatorType].trim)) {
											if (inputErrorMessages == null) {
												inputErrorMsg = inputRule[validatorType].errorMessage;
											} else {
												inputErrorMsg = inputErrorMessages[elementName + 'RegularExpMsg'];
											}
											invalidInputs.push({
												fieldId : elementName,
												error : inputErrorMsg
											});
											breakLoop = true;
										}
									}
									break;
								}
							}
							if (breakLoop)
								break; // Breaking Validator For Loop
						}
					}
				}
				if (invalidInputs.length != 0 && autoRenderErrors) {
					citiResponsive.utils.renderFieldErrors(invalidInputs);
				}
				return invalidInputs;
			}
			
			return {

				/**
				 * @public
				 * @description This is a public function within the
				 *              clientValidation which is used to invoke from
				 *              the application.
				 * @param {JSON
				 *            Obj} validationRule - Contains list of validation
				 *            Rule respective to input fields
				 * @param {boolean}
				 *        	autoRenderErrors - It can be set to false explicitely to prevetn default error 
				 *        	rendering. It can be used when user wants to modify list of errors and render it afterwards.
				 * @param {JSON
				 *            Obj} errorMessages - This is related error message
				 *            to display in the error tooltip on respective
				 *            invalid fields.
				 * @param {String}
				 *            formName - Contains form Id of the input page.
				 * @returns JQuery Object or String
				 * @branch 7.6
				 */
				validate : function (validationRule, autoRenderErrors, errorMessages, formName) {
					var fieldList = new Array();
					// Getting Field Name from Json Data
					if (validationRule == null || validationRule == "") {
						return fieldList;
					}
					for (var fieldName in validationRule) {
						fieldList[fieldList.length] = fieldName;
					}
					if(autoRenderErrors === undefined || autoRenderErrors === null){
						autoRenderErrors = true;
					}
					return validateInputs(fieldList, validationRule, errorMessages, formName, autoRenderErrors);
				}
			}
		}()),
		
		/* *********************** Site Catalyst common implementation s ******************************** */
		
		siteCatalystModule : (function() {
			function callSiteCalayst(scServDetail){
				if(!(typeof s === 'undefined') ){
					s.contextData = [];
					if (s.selfServeType != null && s.selfServeType != undefined){
						s.contextData['SELF_SERV_TYPE']=s.selfServeType;
					}
					s.contextData['SELF_SERV_DETAIL']=scServDetail;
					s.t();
				}
			}
			
			function getServeType(element){
				if ($(element).attr("data-scServeType") != undefined){
					return $(element).attr("data-scServeType");
				} else{
					return $(element).attr("name");
				}
			}			
					
			function getServeDetailName(element, elementType){
				if(elementType === 'checkbox') {
                    if(element.checked)
                            return getServeType(element) + ' ' + elementType + ' checked';
                    else
                            return getServeType(element) + ' ' + elementType + ' unchecked';
				}else{
            		return getServeType(element) + ' ' + elementType + ' clicked';
				}
			}
			
			// Form tracking functions
			function trackClickEvent(element){
				if (element.tagName == "SELECT"){
					// Use change event for Select fields
					return;
				} 
				
				var serveDetailName;
				if (element.tagName == "INPUT"){
					serveDetailName = getServeDetailName(element, element.type);
				} else if ($(element).hasClass("cM-infoIcon") || $(element).hasClass("cbolui-icon-info")) {
					var elementType = "HELP BUBBLE";
					serveDetailName = getServeDetailName(element, elementType);
				} else {
					// normal case
					serveDetailName = getServeDetailName(element, element.tagName);
				}
				callSiteCalayst(serveDetailName);
			}
			
            return {
            	
				isSCTurnedOnFlag : false,
				linkZones : {},

				/**
				* @public
				* @description This is a public function within the siteCatalystModule which is used to
				* bind Site Catalyst tracking to javascript events (click, change).
				* @returns N/A. (the reason that it does not matter is that)
				* @branch 7.6
				*/
				bindUserEventsForSiteCatalyst : function() {
					if(citiResponsive.utils.siteCatalystModule.isSCTurnedOnFlag) {
					 /* Call Site Catalyst for click of trackable element*/
						jQuery('#appBody').on('click', 'input[data-scServeType],span[data-scServeType]', function() {
							trackClickEvent(this);
					 	});
					 
					 /* Call Site Catalyst for select element change*/
                	  	jQuery('#appBody').on('change', 'select[data-scServeType] + div.jfpw-select15-wrapper > div', function() {
                	  		var select = jQuery(this).parent().prev()[0];
							serveDetailName = getServeDetailName(select, select.tagName);
							callSiteCalayst(serveDetailName); 
						 });
					 /* Call Site Catalyst for left navigation button */
                	  	jQuery('#side-left-nav-menu').on('click scClick.siteCatalyst', 'a', function(){
 							if(!(typeof s === 'undefined') ){
	 							s.contextData = [];
	 							s.linkTrackVars='eVar47,eVar23';
	 							s.linkTrackEvents='event16';
	 							s.eVar47= leftNavSCName + '_' + jQuery(this).text();
	 							s.eVar23=s.pageName;
	 							s.events='event16';
	 							s.tl(this,'o',s.eVar23 + ':' + s.eVar47);
 							}
 						});
						//This listener is for key navigation links. Like links that create a new work flow or redirects to new functionalities or SSO etc..
                	  	jQuery(document).on('click', 'a.cbolui-modules-sitecatalyst-key-link-trackable,button.cbolui-modules-sitecatalyst-key-link-trackable,.cbolui-icon-wrapper.cbolui-modules-sitecatalyst-key-link-trackable', function(){
 							if(!(typeof s === 'undefined') ){
 								s.contextData = [];
 								if(jQuery(this).hasClass('cbolui-modules-sitecatalyst-key-link-zone1')) {
	 								zoneName = citiResponsive.utils.siteCatalystModule.linkZones['zone1'] + "_";
	 							}else if(jQuery(this).hasClass('cbolui-modules-sitecatalyst-key-link-zone2')) {
	 								zoneName = citiResponsive.utils.siteCatalystModule.linkZones['zone2'] + "_";
	 							}else if(jQuery(this).hasClass('cbolui-modules-sitecatalyst-key-link-zone3')) {
	 								zoneName = citiResponsive.utils.siteCatalystModule.linkZones['zone3'] + "_";
	 							}else if(jQuery(this).hasClass('cbolui-modules-sitecatalyst-key-link-zone4')) {
	 								zoneName = citiResponsive.utils.siteCatalystModule.linkZones['zone4'] + "_";
	 							}else{
	 								zoneName ="";
	 							}
 								s.linkTrackVars='eVar47,eVar23';
	 							s.linkTrackEvents='event16';
	 							s.eVar47= zoneName + jQuery(this).text();
	 							s.eVar23=s.pageName;
	 							s.events='event16';
	 							s.tl(this,'o',s.eVar23 + ':' + s.eVar47);
 							}
                	  	});
						
						//This listener is for ordinary links. say submit, cancel, print, save, email, etc..
						jQuery(document).on('click', 'a.cbolui-modules-sitecatalyst-link-trackable,button.cbolui-modules-sitecatalyst-link-trackable,.cbolui-icon-wrapper.cbolui-modules-sitecatalyst-link-trackable', function(){
 							if(!(typeof s === 'undefined') ){
	 							s.contextData = [];
	 							s.linkTrackVars='eVar25,events'; 
	 							s.linkTrackEvents='event30';
	 							s.eVar25= jQuery(this).text();
	 							s.events='event30';
	 							s.tl(this,'o',s.eVar25);
 							}
 						});
					}
				},
                  
				/**
				* @public
				* @description This is a public function within the siteCatalystModule which is used to set Site Catalyst variable to track an error
				* (Recoverable and Non recoverable pages). This JavaScript method should be used whenever a page loads.
				* set Site Catalyst variable before an error page is tracked.
				* @param {String} evar12Value - Recoverable Error +  Error Code / Action code sent by host 
				* @param {boolean} isRecoverable - Boolean value will tell u whether the error is recoverable or non recoverable.
				* @returns N/A
				* @branch 7.6
				*/
				setSiteCatalystValuesForErrorPages: function(evar12Value,isRecoverable) {
					/* Assign site catalyst error values */
					if(!(typeof s === 'undefined') && citiResponsive.utils.siteCatalystModule.isSCTurnedOnFlag) {
						if(isRecoverable !=null && !(typeof isRecoverable === 'undefined')) {
								if(isRecoverable && !(typeof recoverableLbl === 'undefined')) {
								evar12Value = recoverableLbl + evar12Value;
								}else {
									if(!(typeof non_recoverableLbl === 'undefined')){
										evar12Value = non_recoverableLbl + evar12Value;
									}
								}
						}
					 	s.contextData = [];
						if (typeof _citidata !== 'undefined') {
							_citidata.errorCode = evar12Value;
							_citidata.eventList = 'custError';
						}
					}
				},
				/**
				* @public
				* @description This is a public function within the siteCatalystModule which is used to set Site Catalyst variable to track an error 
				* (Recoverable and Non recoverable pages). This JavaScript method should be used for non full page load calls 
				* (Only AJAX calls that refreshed portions of the app body)
				* @param {Srting} error - Recoverable Error +  Error Code / Action code sent by host 
				* @param {boolean} isRecoverable - Boolean value will tell u whether the error is recoverable or non recoverable. 
				* @returns N/A
				* @branch 7.6
				*/
				writeSiteCatalystForAJAXError: function(error,isRecoverable) {
					if(!(typeof s === 'undefined') && citiResponsive.utils.siteCatalystModule.isSCTurnedOnFlag) {
						s.contextData = [];
						if(isRecoverable !=null && !(typeof isRecoverable === 'undefined') && isRecoverable){
							s.linkTrackVars='contextData.recoverable_error,events';
							s.contextData['recoverable_error'] = error;
						}
						else {
							s.linkTrackVars='contextData.nonRecoverable_error,events';
							s.contextData['nonRecoverable_error'] = error;
						}
						s.linkTrackEvents='event9';
						_citidata.eventList = 'custError';
						s.tl(this,'o',error);
					}
				}	
            }
    	}()),
    	
    	/* *********************** Site Catalyst common implementation ends ******************************** */
		
		makeMaskedInputsReadable : function(){
			setTimeout(function(){
				$('input[id$="Masked"]').each(function(){
					var eid = $(this).attr('id');
					eid = eid.substring(0,eid.indexOf('Masked'));
					var el_label = $('label[for="'+eid+'"]');
					if(el_label){
						el_label.attr('for',eid+'Masked');
					}
				});
			},0);
		}
	}
}(window, window.jQuery));	

citiResponsive.leaveConfirmation = (function (window, $) {
	
	formChanged = false;
	parent.leaveConfirmationMsg = '';
		
	parent.leaveConfirmationinit = function(msg, forceFullBind) {
		leaveConfirmationMsg = msg;
		$("input[type=text]").on("change input", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$("input[type=tel]").on("change input", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$("input[type=password]").on("change input", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$("select").on("change", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$("input[type='radio']").on("click change", function() { 
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$("input[type='checkbox']").on("click change", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$("input[type='checkbox']").on("click change", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		//----------------------------Toggle Button leave confirmation bind---------------------------------
		$(".toggle-label").on("click", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		$(".toggle-handle").on("click", function() {
			setFormChanged(true);
			//bindLeaveConfirmation(true, leaveConfirmationMsg);
			attachLeaveConfirmation(leaveConfirmationMsg);
		});
		//----------------------------Toggle Button leave confirmation bind---------------------------------
		//----------------------------forceFull Bind of leave confirmation----------------------------------
		if(typeof forceFullBind !== "undefined" && forceFullBind === true){
			attachLeaveConfirmation(leaveConfirmationMsg);
		}
		//----------------------------forceFull Bind of leave confirmation----------------------------------
	}
	
	/**
	 * @public
	 * @description This is a public function within formUtilitiesModule to
	 *              manually set the form changed status.
	 * @param {Boolean}
	 *            changed - Value to set manually whether the form has had
	 *            modifications to it or not
	 * @returns N/A
	 * @branch 7.7
	 */
	parent.setFormChanged = function(changed) {
		formChanged = changed;
	}

	/**
	 * @public
	 * @description This is a public function within formUtilitiesModule binds
	 *              the beforeunload event to display a confirmation message to
	 *              the user before they leave the page.
	 * @param {Boolean}
	 *            requiresChange - Whether or not the leave confirmation should
	 *            be shown only after the page has been changed
	 * @param {String}
	 *            message - The message that will be displayed in the
	 *            confirmation dialog box when the user tries to navigate away.
	 * @returns N/A
	 * @branch 7.7
	 */
	parent.bindLeaveConfirmation = function(requiresChange, message) {
		// reset incase of multiple calls
		jQuery('#appBody').off('change.leaveConf');
		if(requiresChange)
		{
			jQuery('#appBody').one('change.leaveConf', 'input, select:not(#SelectCardInfoHeader), div.jfpw-select15-wrapper > div:not(#SelectCardInfoHeader-button)', function() {
				attachLeaveConfirmation(message);
			});
		}
		else
		{
			attachLeaveConfirmation(message);	
		}
	}
	
	/**
	 * @public
	 * @description This is a public function within formUtilitiesModule unbinds
	 *              the beforeunload event to display a confirmation message to
	 *              the user before they leave the page.
	 * @returns N/A
	 * @branch 7.7
	 */
	parent.unbindLeaveConfirmation = function() {
		jQuery('#appBody').off('change.leaveConf');
		jQuery('#pageWrapper').off('.leaveConf');
		jQuery(window).removeData('leaveConf').off('.leaveConf');
		jQuery('#rightSubApp').removeData('leaveConf').off('.leaveConf');
		jQuery('#appLeft').removeData('leaveConf').find('li a').off('click.leaveConf');
	}
	
	function attachLeaveConfirmation(message) {
		/*
		 * Sets showUnload message true by default which can be temporarilty
		 * modified by save print record for form submit
		 */
		jQuery(window).data('showUnloadMessage',true);
		/*
		 * Cannot use onbeforeunload event in Opera browsers using the Presto
		 * engine or iPad, so this alternate code is used
		 */
		if (navigator.userAgent.indexOf("iPad") != -1 || navigator.userAgent.indexOf("Presto") != -1) {
			if(!jQuery(window).data('leaveConf')) {
				jQuery('#pageWrapper').on('click.leaveConf', 'a[href]:not(#appLeft a, .cbolui-onboard-container form a, .cbolui-onboard-container .centerAlign_mobileButton a, .cbolui-container form a, [href=#], ul.cbolui-modules-headerPrintLinks a)', function(e) {
					// Skip return message in case of form submit for
					// savePrintRecord function
					if(jQuery(window).data('showUnloadMessage')) {
		                if(!confirm(message)) {
		                	e.preventDefault();
				    		e.stopImmediatePropagation();
		                } else {
							jQuery('#pageWrapper').off('.leaveConf');
							jQuery(window).removeData('leaveConf');
							jQuery('#appLeft').removeData('leaveConf').find('li a').off('.leaveConf');
						}
					}
				});
				jQuery(window).data('leaveConf', true);
			}
			if(!jQuery('#appLeft').data('leaveConf')) {
				// Attach leave confirmation to left nav
				jQuery('#appLeft').find('li a').on('click.leaveConf', function(e) {
					if(jQuery(this).attr('href') !== '#') {
						e.preventDefault();
					    e.stopImmediatePropagation();
					    if(confirm(message)) {
							jQuery('#pageWrapper').off('.leaveConf');
							jQuery(window).removeData('leaveConf');
							jQuery('#appLeft').removeData('leaveConf').find('li a').off('click.leaveConf');
							jQuery("#" + jQuery(this).parents("ul[role=menubar]").attr("id")).jfpwidget()._select(jQuery(this));
							// Since we stop bubbling with
							// stopImmediatePropagation() we create a custom
							// event for SC tracking to listen for.
							jQuery(this).trigger('scClick.siteCatalyst');
					 		if(typeof(jQuery(this).attr('href')) !== 'undefined') {
					 			window.location = jQuery(this).attr('href');
					 		}
						}
					}
				}).data('leaveConf', true);
			}
			
		} else {
			if(!jQuery('#appLeft').data('leaveConf') && !jQuery('#rightSubApp').data('leaveConf')) {
				// Attach leave confirmation to quick links
				jQuery('#rightSubApp').on('click.leaveConf', 'a', function(event) {
					if(!confirm(message)) {
						event.stopImmediatePropagation();
						event.preventDefault();
					}
					else {
						jQuery(window).off('.leaveConf').removeData('leaveConf');
						jQuery('#rightSubApp').off('click.leaveConf').removeData('leaveConf');
						jQuery('#appLeft').removeData('leaveConf').find('li a').off('click.leaveConf');
					}

				});
				// Attach leave confirmation to left nav
				jQuery('#appLeft').find('li a').on('click.leaveConf', function(e) {
					if(jQuery(this).attr('href') !== '#') {
						e.preventDefault();
					    e.stopImmediatePropagation();
					    if(confirm(message)){
							jQuery(window).off('.leaveConf').removeData('leaveConf');
							jQuery('#rightSubApp').off('click.leaveConf').removeData('leaveConf');
							jQuery('#appLeft').removeData('leaveConf').find('li a').off('click.leaveConf');
							jQuery("#" + jQuery(this).parents("ul[role=menubar]").attr("id")).jfpwidget()._select(jQuery(this));
							// Since we stop bubbling with
							// stopImmediatePropagation() we create a custom
							// event for SC tracking to listen for.
							jQuery(this).trigger('scClick.siteCatalyst');
					 		if(typeof(jQuery(this).attr('href')) !== 'undefined') {
					 			window.location = jQuery(this).attr('href');
					 		}
						}
					}
				});
				// Add tracking variable
				jQuery('#appLeft, #rightSubApp').data('leaveConf', true);
			}
			if(!jQuery(window).data('leaveConf')) {
				// Save Existing handler
				if(typeof(jQuery(window).data('onbeforeunload')) === 'undefined') {
					jQuery(window).data('onbeforeunload', window.onbeforeunload);
				}
				// Rebind Existing handler
				jQuery(window).on('beforeunload', function() {
					if(typeof(jQuery(window).data('onbeforeunload')) !== 'undefined') {
						jQuery(window).data('onbeforeunload')();
					}
				}).on('beforeunload.leaveConf', function() {
					// Skip return message in case of form submit for
					// savePrintRecord function
					if(jQuery(window).data('showUnloadMessage')) {
		                return message;
					}
				}).data('leaveConf', true);
			}
		}
	}

	
	
	return parent;
}(window, window.jQuery));

citiResponsive.passwordRuleMeter = (function(window, $) {
	//-------------------------Declarations---------------------------------
	parent.passwordField = '';
	parent.passwordValue = '';
	parent.userIdField = '';
	parent.userIdValue = '';
	parent.toolTipId = '';
	parent.outerMsgHolderDiv = '';
	parent.errorText = '';
	parent.validStatusText = '';
	parent.invalidStatusText = '';
	parent.initialStatusText = '';
	parent.rulesHeaderText = '';
	parent.deleteKeycodes = [8, //BackSpace Key
							46  //Delete Key
							];
	parent.derivedkeyCode = 0;
	parent.jsonUpdateFailAtValidation = false;
	
	//--------------------------Classes-------------------------------
	parent.outerContainerClass = 'pull-left passwordRuleMeterToolTipBox';
	parent.innerContainerClass = 'col-md-12';
	parent.initialStatusTextCssClass = 'passwordRuleMeterToolTip-initialStatusText';
	parent.rulesHeaderTextCssClass = 'passwordRuleMeterToolTip-rulesHeaderText';
	parent.passwordRuleMeterToolTipMesseges = 'ToolTipMesseges';
	parent.passwordRuleMeterToolTipErrorMesseges = 'ToolTipErrorMesseges';
	parent.passwordRuleMeterToolTipCorrectMesseges = 'ToolTipCorrectMesseges';
	parent.passwordRuleMeterMessegesMarginClass = 'marUpDown5';
	parent.passwordRuleMeterEnableClass = 'passwordRuleMeterEnable';
	//-------------------------Declarations---------------------------------
	
	parent.init = function() {

        $("." + passwordRuleMeterEnableClass).on("keyup input", function(){
        	if (typeof(event) !== 'undefined'){
        		derivedkeyCode = event.keyCode;
        	}
			populatePasswordRuleMeter();
			jsonUpdateFailAtValidation = false;
			//---------------------------PasswordRuleMeter For Ie------------------
			var isIE= navigator.msMaxTouchPoints !== void 0
			if(isIE){ $('.ToolTipMesseges').css("text-indent","-16px"); }
			//---------------------------PasswordRuleMeter For Ie------------------
		});
		
        $("." + passwordRuleMeterEnableClass).on('input focus click', function() {
			populatePasswordRuleMeter();
			$("#" + toolTipId).trigger('click.tooltip');
			//---------------------------PasswordRuleMeter For Ie------------------
			var isIE= navigator.msMaxTouchPoints !== void 0
			if(isIE){ $('.ToolTipMesseges').css("text-indent","-16px"); }
			//---------------------------PasswordRuleMeter For Ie------------------
			if($('#errorPassMsgDiv').length > 0){
				$('#errorPassMsgDiv').remove();
			}
			if($(this).hasClass('redBorder')){
				$(this).removeClass('redBorder');
			}
			$('#correctMsgDiv').addClass('cbolui-hidden');
		});
		
		$("." + passwordRuleMeterEnableClass).focusout(function() {
			removePasswordRuleMeter();
			if(errorText !== ''){
				var focusOutHTML = "<div id=\"errorPassMsgDiv\" class=\"validation-message-danger\">";
				focusOutHTML = focusOutHTML + "<span class=\"icon icon-clear-error pull-left\"></span>";
				focusOutHTML = focusOutHTML + "<span class=\"contains-icon\">" + errorText + "</span>";
				focusOutHTML = focusOutHTML + "</div>"
				if($(this).parent().hasClass('input-group')){
					if($('#errorPassMsgDiv').length > 0){
						$('#errorPassMsgDiv').remove();
					}
					var tempHtml = $('#correctMsgDiv').html();
					if(tempHtml.length === 0 && $('.passwordRuleMeterEnable').val() !== ''){
						$(this).addClass('redBorder');
						$(this).parent().after(focusOutHTML);
					}
				}
			}
			$('#correctMsgDiv').removeClass('cbolui-hidden');
		});
		
		$("#" + toolTipId).on('click.password',function(){
		  
			populatePasswordRuleMeter();
			setTimeout(function(){$("#" + toolTipId).trigger('click.tooltip')},500);
			//---------------------------PasswordRuleMeter For Ie------------------
			var isIE= navigator.msMaxTouchPoints !== void 0
			if(isIE){ $('.ToolTipMesseges').css("text-indent","-16px"); }
			//---------------------------PasswordRuleMeter For Ie------------------
		});
    };
	
    parent.populatePasswordRuleMeter = function() {
		passwordValue = $("." + passwordRuleMeterEnableClass).val();
		userIdValue = $("#" + userIdField).val();
		if(passwordValue !== ''){
			updateJsonbyValidation(validationRules);
		}else{
			if (!jsonUpdateFailAtValidation) {
				updateJsonbyIsvalidBlanck();
			}
		}
		if((deleteKeycodes.indexOf(derivedkeyCode) !== -1) && passwordValue === ''){
			updateJsonbyIsvalidBlanck(validationRules);
		}
        var genHTML = generateHTML(validationRules);
			//---------------------This is for Mobile View------------------
			if($('#passwordRuleMeterHolder').length === 0){
				$($('.passwordRuleMeterEnable').closest(".input-group")).after("<div id='passwordRuleMeterHolder' class='pwrmhStyle arrow_box'></div>");
			}else{
				$('#passwordRuleMeterHolder').addClass('pwrmhStyle arrow_box');
			}
			$('#passwordRuleMeterHolder').html(genHTML);
			var passRMTBHeight = $('.passwordRuleMeterToolTipBox').height();
			$('#passwordRuleMeterHolder').height(passRMTBHeight);
			$('.passwordRuleMeterEnable').on('focusout', function(){
				$('#passwordRuleMeterHolder').removeClass('pwrmhStyle arrow_box').html('');
				$('#passwordRuleMeterHolder').height(0);
			});
			//---------------------This is for Mobile View------------------

			//---------------------This is for Desktop View------------------
			$("#" +toolTipId+"-info").html('');
			if(typeof $("#" +toolTipId).jfpwidget()==='undefined'){
				$("#" +toolTipId+"-info").html(genHTML);
				citiResponsive.utils.attachTooltips('passwordWrapper','right');
			}else{
				$('#ui-tooltip-'+toolTipId+'-content').html(genHTML);
			}
			//---------------------This is for Desktop View------------------
    }
	
	
	function removePasswordRuleMeter(){
		$("#" + toolTipId+"info").html('');
	}
	
	function updateJsonbyValidation(){
		for(var i = 0; i<validationRules.length; i++){
			validateByCase(i, validationRules[i].validationCase);
		}
	}
	
	parent.updateJsonbyIsvalidBlanck = function() {
		for(var i = 0; i<validationRules.length; i++){
			validationRules[i].isValid = '';
		}
	}
	
	parent.generateHTML = function() {
		var correct = 0;
		var notInited = 0;
		
		var HTMLDivSrt = "";
		var HTMLStxt = "";
		var HTMLHdtxt = "";
		var HTMLmsg = "";
		var HTMLDivEnd = "";
		var HTML = "";
		
		HTMLDivSrt = "<div class='" + outerContainerClass + "'>";
		HTMLDivSrt = HTMLDivSrt + "<div class='" + innerContainerClass + "'>";
		
		if(rulesHeaderText !== ''){
			HTMLHdtxt = "<div class='" + rulesHeaderTextCssClass + "'>" + rulesHeaderText + "</div>";
		}

		for(var i = 0; i<validationRules.length; i++){
			if(validationRules[i].isValid === "TRUE"){
				HTMLmsg=HTMLmsg+"<div class='" + passwordRuleMeterMessegesMarginClass + "'><span class='" + passwordRuleMeterToolTipCorrectMesseges + "'></span>"
				HTMLmsg = HTMLmsg + "<span class='passwordRuleText'>" + validationRules[i].message + "</span></div>";
				correct++;
			}else if(validationRules[i].isValid === "FALSE"){
			
				HTMLmsg=HTMLmsg+"<div class='" + passwordRuleMeterMessegesMarginClass + "'><span class='" + passwordRuleMeterToolTipErrorMesseges + "'></span>"
				HTMLmsg = HTMLmsg + "<span class='passwordRuleText'>" + validationRules[i].message + "</span></div>";
			}else{
			
				HTMLmsg = HTMLmsg + "<div class='"+passwordRuleMeterToolTipMesseges+"'>" + validationRules[i].message + "</div>";
				notInited++;
			}
		}
		
		$('#' + outerMsgHolderDiv).html('');
		if(correct === validationRules.length){
			if(validStatusText !== ''){
				HTMLStxt=HTMLStxt+"<div class='" + passwordRuleMeterMessegesMarginClass + " bordBot'><span class='" + passwordRuleMeterToolTipCorrectMesseges + "' style='margin-bottom:10px;'></span>"
				HTMLStxt = HTMLStxt + "<span>" + validStatusText + "</span></div>";
				
				var HTMLStxtTemp = HTMLStxt.replace("bordBot", "");
				$('#' + outerMsgHolderDiv).html(HTMLStxtTemp);
			}
		}else if(notInited === validationRules.length){
			if(initialStatusText !== ''){
				HTMLStxt = "<div class='" + initialStatusTextCssClass + "'>" + initialStatusText + "</div>";
			}
			
		}else{
			if(invalidStatusText !== ''){
				HTMLStxt = "<div class='" + initialStatusTextCssClass + "'>" + citiResponsive.passwordRuleMeter.initialStatusText + "</div>";
			}
		}
		
		HTMLDivEnd = HTMLDivEnd + "</div>";//End of Internal Div
		HTMLDivEnd = HTMLDivEnd + "</div>";//End of External Div
		
		HTML = HTMLDivSrt + HTMLStxt + HTMLHdtxt + HTMLmsg + HTMLDivEnd;
		
		return HTML;
	}
	
	function validateByCase(i, caseSt){
		switch (caseSt) {
			case "OTHUSERID": //Is not the same as your User ID 1
				if(passwordValue !== '' || passwordValue !== null){
					if(passwordValue === userIdValue){
						validationRules[i].isValid = 'FALSE';
					}else{
						validationRules[i].isValid = 'TRUE';
					}
				}
				break;
			case "OTHUSERIDCASE": //Is not the same as your User ID 1
				if(passwordValue !== '' || passwordValue !== null){
					if(passwordValue.toUpperCase() === userIdValue.toUpperCase()){
						validationRules[i].isValid = 'FALSE';
					}else{
						validationRules[i].isValid = 'TRUE';
					}
				}
				break;
			case "SPACENOTALLOW": //Does not contain any spaces
				if(passwordValue !== '' || passwordValue !== null){
					if(passwordValue.indexOf(' ') === -1){
						validationRules[i].isValid = 'TRUE';
					}else{
						validationRules[i].isValid = 'FALSE';
					}
				}
				break;
			case "ONECHARONEDIGIT": //Contains 1 letter & 1 Digit
				if(passwordValue !== '' || passwordValue !== null){
					if (/\d/.test(passwordValue) && /[a-zA-Z]/.test(passwordValue)) {
						validationRules[i].isValid = 'TRUE';
					}else{
						validationRules[i].isValid = 'FALSE';
					}
				}
				break;
			case "ONECHARONEDIGITONESPLCHAR": //Contains 1 letter, 1 Digit & 1 Special Char
				if(passwordValue !== '' || passwordValue !== null){
					if (/\d/.test(passwordValue) && /[a-zA-Z]/.test(passwordValue)) {
						validationRules[i].isValid = 'TRUE';
					}else{
						validationRules[i].isValid = 'FALSE';
					}
				}
				break;
			case "NOCONCCHARMRTHN2": //not more than 2 identical consecutive characters
				if(passwordValue !== '' || passwordValue !== null){
					if(/(.)\1\1/gi.test(passwordValue)){
						validationRules[i].isValid = 'FALSE';
					}else{
						validationRules[i].isValid = 'TRUE';
					}
				}
				break;
			case "CUSTOMREGEX": //Custome Regex
				if(passwordValue !== '' || passwordValue !== null){
					var regExpRep = validationRules[i].Signature;
					if(passwordValue.match(regExpRep.source)){
						validationRules[i].isValid = 'TRUE';
					}else{
						validationRules[i].isValid = 'FALSE';
					}
				}
				break;
			case "MAXMINLIMIT": //Length between Min-Max Characters
				if(passwordValue !== '' || passwordValue !== null){
					if(passwordValue.length >= validationRules[i].minLength && passwordValue.length <= validationRules[i].maxLength){
						validationRules[i].isValid = 'TRUE';
					}else{
						validationRules[i].isValid = 'FALSE';
					}
				}
				break;
		}
	}
	
	return parent;
}(window, window.jQuery));