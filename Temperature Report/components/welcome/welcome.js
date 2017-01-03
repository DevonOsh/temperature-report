(function (temp, $) {
    var welcome = null,
        app = temp.app = temp.app || {},
        locationJSDO = app.locJSDO,
        reportJSDO = app.reportJSDO;

    app.welcome = {
        onInit: function () {
            //Fill the data from the reportJSDO and when done, call createButtons
            var onAfterReportFill = app.welcome.createButtons;
            reportJSDO.subscribe('afterFill', onAfterReportFill);
            reportJSDO.fill();
        },
        onHide: function () {
            var onAfterReportFill = app.welcome.createButtons,
                onAfterLocationFill = app.welcome.sendReportInfo;
            locationJSDO.unsubscribe('afterFill', onAfterLocationFill);
            reportJSDO.unsubscribe('afterFill', onAfterReportFill);
        },
        createButtons: function (jsdo, success, request) {
            var reportExists,
                reportCompleted,
                report,
                date = app.getDate();    

            //Next, check to see if there are records that exist for today. If so, the report has been started
            report = jsdo.find(function (jsrecord) {
                return (jsrecord.data.STAMP_DT == date);
            });
            if (report == null) {
                reportExists = false;
            }
            else {
                reportExists = true;
            }
            
			//Check to see if the report has been completed
            function checkReportCompletion() {
                var completed;
                report = jsdo.find(function (jsrecord) {
                    return (jsrecord.data.STAMP_DT == date && jsrecord.data.TEMP == null);
                });

                if (report == null) {
                    completed = true;
                }
                else {
                    completed = false;
                }
                console.log("Reported completed?: " + completed);
                return completed;
            }

            //If the report exists, create continue report btn
            if (reportExists) { 
                reportCompleted = checkReportCompletion();
                $("#create-report-btn").html('Continue Temperature Report');
                
                //If report completed, disable button and display alert
                if (reportCompleted) { 
                    alert("Today's report has been completed.");
                    $("#create-report-btn").prop("disabled",true);
                //If not completed, button enabled and brins user to scan screen
                } else { 
                    $("#create-report-btn").unbind().click(function () {
                        app.goToScan();
                    });
                }
            } else { //If report does not exists, create begin report btn and bind to create report function
                $("#create-report-btn").html('Begin Report');
                $("#create-report-btn").unbind().click(function () {
                    app.welcome.createNewReport();
                    app.goToScan();
                });
            }

            //Goes to data grid
            $("#view-reports-btn").unbind().click(function () {
                app.goToGrid();
            });
			
            //Does not work
            $("#save-data-btn").unbind().click(function () {
                app.tempExport.exportData();
            });
        },
        getNextReportId: function () { //Use an invoke on JSDO to get the next report
            var reportJSDO = app.reportJSDO,
                currentReportId = "";

            reportJSDO.invoke("GetNextReportId").done(
                function(jsdo, success, request) {
                    console.log(request.response.sReportId);
                    currentReportId = request.response.sReportId;
                }
            ).fail(
                function(jsdo, success, request){
                    console.log(request.response);
            });

            return currentReportId;
        },
        createNewReport: function () {
            var onAfterLocationFill = app.welcome.sendReportInfo;
            locationJSDO.subscribe('afterFill', onAfterLocationFill);
            locationJSDO.fill();
            alert("New report created!");
        },
        sendReportInfo: function (jsdo, success, request) {
            var date = app.getDate(),
                reportId,
                onAfterFill = app.welcome.sendReportInfo;
            
            jsdo.unsubscribe('afterFill', onAfterFill);

            //Use report JSDO invoke to get the reportID
            reportId = app.welcome.getNextReportId();

            jsdo.foreach(function (location) {
                var model = {
                    LOCATION_ID: location.data.LOC_ID,
                    LOCATION_NAME: location.data.LOC_NAME,
                    TEMP: null,
                    IN_RANGE: null,
                    EMPLOYEE: null,
                    STAMP_DT: date,
                    STAMP_TM: null,
                    REPORT_ID: reportId
                }
                app.sendReport(model);
            });
        }
    }
})(window, jQuery);