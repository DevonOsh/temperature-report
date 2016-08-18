(function (temp, $) {
    var welcome = null,
        app = temp.app = temp.app || {};

    app.welcome = {
        onShow: function () {
            app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);
            $("#create-report-btn").unbind().click(function () {
                app.welcome.checkForReport();
            });
            $("#view-reports-btn").unbind().click(function () {
                app.goToGrid();
            });
                
        },
        onHide: function () {

        },
        getReportID: function () {
            var min = 10000,
                max = 99999;

            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        createNewReport: function () {
            var locationJSDO = app.locJSDO,
                reportJSDO = app.reportJSDO,
                date = app.getDate(),
                reportID = app.welcome.getReportID();

            function onAfterFill(jsdo, success, request) {                  
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
            locationJSDO.subscribe('afterFill', onAfterFill, this);
            locationJSDO.fill();
        },
        checkForReport: function () {
            var date = app.getDate(),
                jsdo = app.reportJSDO;
            var reportExists = jsdo.find(function(jsrecord){
                return (jsrecord.data.STAMP_DT == date);
            });
            
            if(reportExists == null)
                app.welcome.createNewReport();
            else {
                alert("Today's report has already been started");
                app.goToScan();
            }
        }
    }
})(window, jQuery);