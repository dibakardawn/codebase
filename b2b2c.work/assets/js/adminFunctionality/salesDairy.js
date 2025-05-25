const CALENDAR_DATA = [];
const MENUSELECTIONITEM = "salesDairy.php";

$(document).ready(function() {

    /*--------------------------Sidebar Menu Selection---------------------*/
    $('.w3-bar-block > a').each(function() {
        if ($(this).attr("href") === MENUSELECTIONITEM) {
            $(this).addClass("w3-blue");
        }
    });
	/*--------------------------Sidebar Menu Selection---------------------*/
	
    salesDairyFunctionality.initSalesDairy(true);
}).on('mousemove', function(e) {
    //console.log('Mouse is moving at:', e.pageX, e.pageY);
    appCommonFunctionality.resetInactivityTimer();
});

const salesDairyFunctionality = (function(window, $) {
    const parent = {};

    parent.initSalesDairy = async function (commonActivityFlag = false) {
        appCommonFunctionality.adjustMainContainerHight('salesDairyHolder');
		if(commonActivityFlag === true){
			await appCommonFunctionality.adminCommonActivity();
		}
        appCommonFunctionality.ajaxCall('GETSALESDAIRYEVENTS', parent.receiveCalendarData);
        if (appCommonFunctionality.isMobile()) {
            $("#calendarHolder").removeClass('noLeftPaddingOnly').addClass('nopaddingOnly');
        }
    };

    parent.receiveCalendarData = function(data) {
        const apiData = JSON.parse(data);
        if (apiData.length > 0) {
            apiData.forEach(event => {
                CALENDAR_DATA.push({
                    id: event.salesDairyId,
                    title: appCommonFunctionality.shapeString(`${event.eventTitle} [${event.eventCode}]`, 20),
                    start: event.startDateTime,
                    end: event.startDateTime
                });
            });
            populateFullCalendar();
        } else {
            parent.toggleRightPanel('open', 'createEvent', '');
        }
    };

    parent.toggleRightPanel = function(action, section, eventInfo) {
        const $calendarHolder = $("#calendarHolder");
        if (action === 'close') {
			$("#salesEventHolder").addClass('hide');
            $calendarHolder.removeClass('col-lg-9 col-md-9 col-sm-9').addClass('col-lg-12 col-md-12 col-sm-12');
            populateFullCalendar();
        } else {
            $calendarHolder.removeClass('col-lg-12 col-md-12 col-sm-12').addClass('col-lg-9 col-md-9 col-sm-9');
            if (section === 'createEvent') {
                $("#createSalesEventHolder").removeClass('hide');
                $("#salesEventHolder").addClass('hide');
            } else if (section === 'showEvent') {
                $("#createSalesEventHolder").addClass('hide');
                $("#salesEventHolder").removeClass('hide');
                if (eventInfo) {
                    eventInfo.el.style.borderColor = 'red'; // Change the border color just for fun
                    const salesDairyId = eventInfo.event.id;
                    appCommonFunctionality.ajaxCall('GETSALESEVENT&salesDairyId=' + salesDairyId, parent.bindSalesEventSection);
                }
            }
            populateFullCalendar();
        }
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
			initialView: 'dayGridWeek',
			navLinks: false,
			editable: false,
			dayMaxEvents: true,
			visibleRange: {
				start: salesDairyFunctionality.getCalculatedDate('START'),
				end: salesDairyFunctionality.getCalculatedDate('END'),
			},
			events: CALENDAR_DATA,
			eventClick: function(info) {
				salesDairyFunctionality.toggleRightPanel('open', 'showEvent', info);
			}
		});

		calendar.render();
		if (appCommonFunctionality.isMobile()) {
			$("#fc-dom-1").css('font-size', '1.1em');
			$(".fc-toolbar-title").html('');
		}
	};

    parent.bindSalesEventSection = function(data) {
        const eventData = JSON.parse(data)[0];
        $("#salesEventTitle").html(`${eventData.eventTitle} [${eventData.eventCode}]`);
        $("#startTimeSpan").html(eventData.startDateTime);
        $("#endTimeSpan").html(eventData.endDateTime);
        $("#eventMinutesSection").html(decodeURI(window.atob(eventData.eventMinutes)));
        $("#salesDairyId").val(parseInt(eventData.salesDairyId));
        $("#parentIdHdn").val(parseInt(eventData.parentId));
        $("#previousSalesEventBtn").toggle(parseInt(eventData.parentId) > 0);
    };

    parent.saveSalesDairyEvent = function() {
        if (validateSalesDairyEventInputs()) {
            const callData = {
                eventTitle: $("#eventTitle").val(),
                eventMinutes: window.btoa(encodeURI($('#eventMinutes').val())),
                startDateTime: $("#startDateTime").val(),
                endDateTime: $("#endDateTime").val(),
                parentId: $("#parentId").val()
            };
            appCommonFunctionality.ajaxCallLargeData('INSERTSALESDAIRYEVENT', callData, parent.receiveDataAfterSalesEventInsertion);
        }
    };
	
	const validateSalesDairyEventInputs = function() {
		let errorCount = 0;

		const validations = [
			{ id: "startDateTime", required: true },
			{ id: "endDateTime", required: true },
			{ id: "eventTitle", required: true }
		];

		validations.forEach(({ id, required }) => {
			const value = $("#" + id).val();
			if (required && value === "") {
				appCommonFunctionality.raiseValidation(id, "", true);
				$("#" + id).focus();
				errorCount++;
			} else {
				appCommonFunctionality.removeValidation(id, id, true);
			}
		});

		return errorCount === 0;
	};

    parent.receiveDataAfterSalesEventInsertion = async function (data) {
        parent.resetCreateSalesEventSection();
        parent.toggleRightPanel('open', 'showEvent', '');
        parent.bindSalesEventSection(data);
        CALENDAR_DATA.length = 0; // Clear previous data
        await parent.initSalesDairy(false);
    };

    parent.resetCreateSalesEventSection = function() {
        $("#startDateTime, #endDateTime, #eventTitle, #eventMinutes").val('');
        $("#parentId").val(0);
    };

    parent.deleteSalesDairyEvent = function() {
        const salesDairyId = parseInt($("#salesDairyId").val());
        if (salesDairyId > 0) {
            CALENDAR_DATA.length = 0; // Clear previous data
            parent.toggleRightPanel('close', '', '');
            appCommonFunctionality.ajaxCall('DELETESALESEVENT&salesDairyId=' + salesDairyId, parent.initSalesDairy);
        }
    };

    parent.createFollowupSalesEvent = function() {
        $("#parentId").val($("#salesDairyId").val());
        parent.toggleRightPanel('open', 'createEvent', '');
    };

    parent.gotoPreviousSalesEvent = function() {
        const salesDairyId = $("#parentIdHdn").val();
        appCommonFunctionality.ajaxCall('GETSALESEVENT&salesDairyId=' + salesDairyId, parent.bindSalesEventSection);
    };

    parent.getCalculatedDate = function(direction) {
        const today = moment();
        let calculatedDate = direction === 'START' ? today.subtract(6, 'months') : today.add(12, 'months');
        return calculatedDate.format('YYYY-MM-DD');
    };

    return parent;
}(window, window.$));