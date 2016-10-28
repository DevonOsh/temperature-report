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
        //This line is here to allow the modal to be called from any view
        kendo.mobile.init(application.element.children("[data-role=modalview]"));
    });

    app.getDate = function () {
        var currentDate = new Date();
        var dateString = kendo.toString(currentDate, "yyyy-MM-dd");
        alert(dateString);
        return dateString;
    }

    app.getFilterDate = function() {
        var currentDate = new Date();
        var dateString = kendo.toString(currentDate, "MM/dd/yy");
        alert(dateString);
        return dateString;
    }

    app.getTime = function () {
        var currentDate = new Date(),
            dateString = currentDate.toString();
        var currentTime = dateString.substring(16, 21);

        return currentTime;
    }

    //Settings for the service
    app.JSDOSettings = {
        "serviceURI": "http://10.0.1.239:8810/Temperature_Report",
        "catalogURIs": "http://10.0.1.239:8810/Temperature_Report/static/Temperature_ReportService.json",
        "authenticationModel": "anonymous"
    };

    //Create the session
    app.JSDOSession = new progress.data.Session();
    app.JSDOSession.login(app.JSDOSettings.serviceURI);
    app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);

    //Create all the JSDOs
    app.locJSDO = new progress.data.JSDO({
        name: "Temperature_Loc"
    });

    app.loginJSDO = new progress.data.JSDO({
        name: "Mobile_User"
    });

    app.reportJSDO = new progress.data.JSDO({
        name: "Temperature_Report"
    });
    app.reportJSDO.autoSort = true;

    //send report back to database
    app.sendReport = function (reportModel) {
        //app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);     FIXME remove if ok

        app.reportJSDO.create(reportModel);
        app.reportJSDO.saveChanges();
    }

    //All navigation functions
    app.goToLogin = function () {
        application.navigate("components/login/loginView.html");
    }
	app.goToWelcome = function() {
        application.navigate("components/welcome/welcomeView.html");
    }
    app.goToTempInput = function () {
        application.navigate("components/tempInput/tempInputView.html");
    }
    app.goToScan = function () {
        application.navigate("components/barcodeScan/barcodeScanView.html");
    }
    app.goToScanFail = function () {
        application.navigate("components/barcodeScan/scanFailView.html");
    }
    app.goToSubmitSuccess = function () {
        application.navigate("components/tempInput/successView.html");
    }
    app.goToGrid = function() {
        application.navigate("components/dataGrid/dataGridView.html");
    }
    app.goToEdit = function() {
        application.navigate("componenets/completed/completedView.html");
    }
    app.goBack = function() {
        application.navigate("#:back");
    }
})(window);