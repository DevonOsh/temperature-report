(function (temp) {
    var application,
        app = temp.app = temp.app || {};

    document.addEventListener("deviceready", function () {
        navigator.splashscreen.hide();
        application = new kendo.mobile.Application(
            document.body, {
                initial: "components/login/loginView.html",
                transition: "",
                layout: "",
                skin: "flat"
            }
        );
    });

    app.JSDOSettings = {
        "serviceURI": "http://10.0.1.239:8810/Temp_Report",
        "catalogURIs": "http://10.0.1.239:8810/Temp_Report/static/Temp_ReportService.json",
        "authenticationModel": "anonymous"
    };

    app.JSDOSession = new progress.data.Session();
    app.JSDOSession.login(app.JSDOSettings.serviceURI);
    app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);

    app.locJSDO = new progress.data.JSDO({
        name: "Temp_Loc"
    });

    app.loginJSDO = new progress.data.JSDO({
        name: "Mobile_User"
    });

    app.reportJSDO = new progress.data.JSDO({
        name: "Temp_Report"
    });

    app.goToLogin = function() {application.navigate("components/login/loginView.html");}

    app.sendReport = function (reportModel) {
        app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);

        app.reportJSDO.create(reportModel);
        app.reportJSDO.saveChanges();
    }

    app.goToTempInput = function () {
        application.navigate("components/tempInput/tempInputView.html", "slide");
    }
    app.goToScan = function () {
        application.navigate("components/barcodeScan/barcodeScanView.html", "slide");
    }
    app.goToScanFail = function() {
        application.navigate("components/barcodeScan/scanFailView.html", "slide");
    }
})(window);