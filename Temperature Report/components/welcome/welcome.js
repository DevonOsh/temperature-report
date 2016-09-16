
(function (temp, $) {
    var welcome = null,
        app = temp.app = temp.app || {};

    app.welcome = {
        onShow: function () {
            var reportJSDO = app.reportJSDO;
            var onAfterFill = app.welcome.createButtons;
            
            reportJSDO.subscribe('afterFill', onAfterFill);
            reportJSDO.fill();                        
        },
        onHide: function () {
			var locationJSDO = app.locJSDO,
                reportJSDO = app.reportJSDO;
			var onAfterLocationFill = app.welcome.sendReportInfo,
                onAfterReportFill = app.welcome.createButtons;
            locationJSDO.unsubscribe('afterFill', onAfterLocationFill);
            reportJSDO.unsubscribe('afterFill', onAfterReportFill);
        },
        createButtons: function(jsdo, success, request) {
            var reportExists,
                report,
                date = app.getDate();
            
            report = jsdo.find(function(jsrecord){
                return (jsrecord.data.STAMP_DT == date);
            })
            
            if(report == null)
                reportExists = false;
            else
                reportExists = true;
            
            if(reportExists) {
                $("#create-report-btn").html('Continue Report');
                $("#create-report-btn").unbind().click(function(){
                    app.goToScan();
                });
            }
            else {
                $("#create-report-btn").html('Begin Report');
                $("#create-report-btn").unbind().click(function(){
                    app.welcome.createNewReport();
                    alert("New report created!");
                    app.goToScan();
                });
            }

            $("#view-reports-btn").unbind().click(function () {
                app.goToGrid();
            });
            
            $("#save-data-btn").unbind().click(function() {
                app.exportData.saveGridData();
            });
        },
        getReportID: function () {
            var min = 10000,
                max = 99999;

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        createNewReport: function () {
            var onAfterFill = app.welcome.sendReportInfo;
            var locationJSDO = app.locJSDO;

            locationJSDO.subscribe('afterFill', onAfterFill);
            locationJSDO.fill();
            alert("New report created!");
        },
        sendReportInfo: function(jsdo, success, request) {
            var date = app.getDate(),
                reportID;
                
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