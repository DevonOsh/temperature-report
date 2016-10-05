(function (temp, $) {
    var welcome = null,
        app = temp.app = temp.app || {},
        locationJSDO = app.locJSDO,
        reportJSDO = app.reportJSDO,
        lastReportID;

    app.welcome = {
        onInit: function () {
            //Fill the data from the reportJSDO and when done, call createButtons
            var onAfterReportFill = app.welcome.createButtons;
            reportJSDO.subscribe('afterFill', onAfterReportFill);
            reportJSDO.autoSort = true;
            reportJSDO.setSortFields(["STAMP_DT:DESCENDING","LOCATION_ID:ASCENDING"]);
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
            
            //First, assign ID of the most recently created record to lastReportID
            lastReportID = jsdo.record.data.REPORT_ID;
            console.log("Last report ID: " + lastReportID);
            
            //if there are no reports, start at 10000
            if(lastReportID === 1) {
                reportExists = false;
                lastReportID = 10000;
            }
            //If there are reports, is there one for today?
            else {
                report = jsdo.find(function (jsrecord) {
                    return (jsrecord.data.STAMP_DT == date);
                });

                if (report == null)
                    reportExists = false;
                else
                    reportExists = true;
            }
            console.log("Report Exists: " + reportExists); //FIXME Remove
            
			//Check to see if the report has been completed
            function checkReportCompletion() {
                var completed;
                report = jsdo.find(function (jsrecord) {
                    return (jsrecord.data.STAMP_DT == date && jsrecord.data.TEMP == null);
                });

                if (report == null)
                    completed = true;
                else
                    completed = false;
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
                    alert("New report created!");
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
        getReportID: function () { //Creates a random ID for the current report
            //var min = 10000,
            //    max = 99999;
            //return Math.floor(Math.random() * (max - min + 1)) + min;
            
            var currentReportID = lastReportID + 1;
            return currentReportID;
        },
        createNewReport: function () {
            var onAfterLocationFill = app.welcome.sendReportInfo;
            locationJSDO.subscribe('afterFill', onAfterLocationFill);
            locationJSDO.fill();
            alert("New report created!");
        },
        sendReportInfo: function (jsdo, success, request) {
            var date = app.getDate(),
                reportID,
                onAfterFill = app.welcome.sendReportInfo;
            
            jsdo.unsubscribe('afterFill', onAfterFill);

            reportID = app.welcome.getReportID();

            jsdo.foreach(function (location) {
                var model = {
                    LOCATION_ID: location.data.LOC_ID,
                    LOCATION_NAME: location.data.LOC_NAME,
                    TEMP: null,
                    IN_RANGE: null,
                    EMPLOYEE: null,
                    STAMP_DT: date,
                    STAMP_TM: null,
                    REPORT_ID: reportID
                }
                app.sendReport(model);
            });
        }
    }
})(window, jQuery);