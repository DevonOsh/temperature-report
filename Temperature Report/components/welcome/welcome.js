(function (temp, $) {
    var welcome = null,
        app = temp.app = temp.app || {};

    app.welcome = {
        onShow: function () {
            app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);
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
                reportJSDO = app.reportJSDO;

            var date = app.getDate,
                reportID = 1000;

            function onAfterFill(jsdo, success, request) {
                jsdo.foreach(function (location) {
                    var model = {
                        LOCATION_ID: location.data.LOC_ID,
                        LOCATION_NAME: location.data.LOC_NAME,
                        TEMP: "",
                        IN_RANGE: "",
                        EMPLOYEE: "",
                        STAMP_DT: date,
                        STAMP_DT: "",
                        REPORT_ID: reportID
                    }
                    console.log(model);
                });
            }

            locationJSDO.subscribe('afterFill', onAfterFill, this);
            locationJSDO.fill();
        },
        checkForReport: function () {}
    }
})(window, jQuery);