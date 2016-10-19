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

        function getMonth(date) {
            var month = date.getMonth() + 1;
            return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
        }

        var currentDate = new Date(),
            yyyy = currentDate.getFullYear(),
            mm = getMonth(currentDate),
            dd = currentDate.getDate();
        if (dd <= 9)
            dd = '0'+dd;
            
        var formatDate = yyyy + "-" + mm + "-" + dd;
        return formatDate;
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
        name: "Temperature_Report",
        autoApplyChanges: false
    });
    app.reportJSDO.autoSort = true;

    //send report back to database
    app.sendReport = function (reportModel) {
        //app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);     FIXME remove if ok

        app.reportJSDO.create(reportModel);
        app.reportJSDO.saveChanges();
        app.reportJSDO.acceptChanges();
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