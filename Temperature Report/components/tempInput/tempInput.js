(function (temp, $) {
    var tempInput = null,
        app = temp.app = temp.app || {};

    var reportModel = {
        REPORT_ID: '',
        LOCATION_ID: '',
        LOCATION_NAME: '',
        TEMP: '',
        IN_RANGE: '',
        EMPLOYEE: '',
        STAMP_DT: '',
        STAMP_TM: ''
    }

    app.tempInput = {
        onShow: function () {
            var locDataSource = new kendo.data.DataSource({
                type: "jsdo",
                serverFiltering: false,
                serverSorting: false,
                transport: {
                    jsdo: app.locJSDO
                },
                error: function (e) {
                    console.log("Error: ", e)
                },
                filter: {
                    field: "LOC_ID",
                    operator: "eq",
                    value: scanResult
                }
            });
            
            app.reportJSDO.fill();
            
            //check status of checkbox
            app.tempInput.checkNegative();
            
            //Create a listview
            $("#resultListView").kendoListView({
                dataSource: locDataSource,
                template: "<li class='list-group-item'>Location ID: #:LOC_ID#</li>" +
                	"<li class='list-group-item'>Location Name: #:LOC_NAME#</li>" +
                    "<li class='list-group-item'>Location Code: #:LOC_CODE#</li>"
            });

            //Create the model and save the changes to the db
            $("#ok-button").unbind().click(function () {
                var view = locDataSource.view(),
                    minTemp = view[0].TEMP_MIN - 5,
                    highTemp = view[0].TEMP_MAX,
                    enteredTemp = $("#temp-input").val(),
                    inRange;

                try {
                    var isNumber = $.isNumeric(enteredTemp);
                    if (!isNumber)
                        throw new Error("Please enter a number.");
                    if (enteredTemp > 100)
                        throw new Error("Enter a valid temperature.");
                    if (enteredTemp < -70)
                        throw new Error("Enter a valid temperature.");
                    if ((enteredTemp <= highTemp) && (enteredTemp >= minTemp))
                        inRange = true;
                    else
                        inRange = false;

                    app.tempInput.buildModel(view, enteredTemp, inRange);
                    if (inRange) {
                        app.tempInput.updateReport();
                        app.goToSubmitSuccess();
                    } else
                        app.tempInput.initRangeModal();

                } catch (exception) {
                    alert(exception.message);
                }
            });
            $("#cancel-button").unbind().click(function(){
                app.goBack();
            });

        },
        checkNegative: function() {
            var checkbox = $("#neg-box"),
                isNegative = checkbox.is(":checked"),
                mask;
            
            if(isNegative) {
                mask = "###.##";
            }
            if(!isNegative){
               	mask = "##.##";  
            }
            
            app.tempInput.createTextBox(mask);
        },
        createTextBox: function(inputMask) {
           	$("#temp-input").kendoMaskedTextBox({
                mask: inputMask
            });
            $("#neg-box").change(function() {
                app.tempInput.checkNegative();
        	});
        },
        onHide: function() {
            $("#temp-input").val('');
        },
        //build the model to be sent to OE
        buildModel: function (data, temp, range) {
            var date = app.getDate();
            var time = app.getTime(),
                fName = app.userInfo.firstName,
                lName = app.userInfo.lastName,
                employee = fName + " " + lName;
            
			reportModel.LOCATION_ID = data[0].LOC_ID;
            reportModel.LOCATION_NAME = data[0].LOC_NAME;
            reportModel.TEMP = temp;
            reportModel.IN_RANGE = range;
            reportModel.EMPLOYEE = employee;
            reportModel.STAMP_DT = date;
            reportModel.STAMP_TM = time;
            
        },
        updateReport: function() {
            var jsdo = app.reportJSDO,
                report,
                date = app.getDate(),
                locationID = reportModel.LOCATION_ID,
                temp = Number(reportModel.TEMP).toFixed(2),
                updateData = {
                    EMPLOYEE: reportModel.EMPLOYEE,
                    IN_RANGE: reportModel.IN_RANGE,
                    STAMP_TM: reportModel.STAMP_TM,
                    TEMP: temp
                };
            report = jsdo.find(function (jsrecord) {
                return (jsrecord.data.LOCATION_ID == locationID && jsrecord.data.STAMP_DT == date);
            });
            jsdo.assign(updateData);
            jsdo.saveLocal();
            jsdo.saveChanges();
            jsdo.acceptChanges();
        },
        initRangeModal: function() {
            $("#range-warning").kendoMobileModalView("open");
            $("#confirm-temp-btn").unbind().click(function () {
                if ($("#temp-modal-yes").is(':checked')) {
                    app.tempInput.confirm();
                } else if ($("#temp-modal-no").is(':checked')) {
                    app.tempInput.cancel();
                }
            });
        },
        confirm: function () {
            app.tempInput.updateReport();
            app.goToSubmitSuccess();
            $("#range-warning").kendoMobileModalView("close");
        },
        cancel: function () {
            $("#range-warning").kendoMobileModalView("close");
            $("#temp-input").val('');
        }
    }

    app.successView = {
        onShow: function () {
            $("#submitListView").kendoListView({
                dataSource: [reportModel],
                template: "<li class='list-group-item'>Location ID: #:LOCATION_ID#</li>" +
                    "<li class='list-group-item'>Location Name: #:LOCATION_NAME#</li>" +
                    "<li class='list-group-item'>Recorded Temp: #:TEMP#</li>" +
                    "<li class='list-group-item'>Employee: #:EMPLOYEE#</li>" +
                    "<li class='list-group-item'>Date: #:STAMP_DT#</li>" +
                    "<li class='list-group-item'>Time: #:STAMP_TM#</li>"
            });

            $("#confirm-button").unbind().click(function () {
                app.goToScan();
            });
        }
    }

})(window, jQuery);