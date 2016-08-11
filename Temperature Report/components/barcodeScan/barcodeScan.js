var scanResult = 'No results yet';

(function (temp, $) {
    var ScanViewModel,
        failViewModel,
        locationID,
        app = temp.app = temp.app || {};

    ScanViewModel = kendo.data.ObservableObject.extend({
        scan: function () {
            cordova.plugins.barcodeScanner.scan(
                // success callback function
                function (result) {
                    if (result.cancelled > 0)
                        alert("Scan cancelled");
                    else {
                        scanResult = result.text;
                        var validLoc = app.locJSDO.find(function (jsrecord) {
                            return (jsrecord.data.LOC_ID == scanResult);
                        });
                        if (validLoc == null) {
                            alert("Unable to find location on scan");
                            app.goToScanFail();
                        } else
                            app.goToTempInput();
                    }
                },
                // error callback function
                function (error) {
                    alert("Scanning failed: " + error);
                },
                // options objects
                {
                    "preferFrontCamera": false, // default false
                    "showFlipCameraButton": false // default false
                }
            );
        }

    });

    app.scanBarcode = {
        viewModel: new ScanViewModel(),
        onShow: function () {
            app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);
            app.locJSDO.fill();
            $("#list-button").unbind().click(function () {
                app.goToScanFail();
            });
            //app.scanBarcode.showCurrentReport();
            console.log(app.userInfo);
        },
        showCurrentReport: function () {
            var date = app.getDate(),
                reportJSDO = app.reportJSDO;

            function onAfterFill(jsdo, success, request) {
                jsdo.foreach(function (report) {
                    var reportDate = report.data.STAMP_DT;
                    if (reportDate == date) {
                        //WHY DOES THIS NOT WORK?!
                        //$("#reportStatusList").append(
                        //    "<li class='list-group-item'>" +
                        //    location.data.LOC_ID +
                        //    ' ' +
                        //    location.data.LOC_NAME +
                        //    "</li>"
                        //);
                        console.log(report);
                    }
                });
            }
            reportJSDO.subscribe('afterFill', onAfterFill, this);
            reportJSDO.fill();
        }
    }

    app.scanFail = {
        onShow: function () {

            var dataSource = new kendo.data.DataSource({
                type: "jsdo",
                serverFiltering: false,
                serverSorting: false,
                transport: {
                    jsdo: app.locJSDO
                },
                error: function (e) {
                    console.log("Error: ", e)
                }
            });

            $("#locDropDown").kendoDropDownList({
                dataTextField: "LOC_ID",
                dataSource: dataSource,
                select: function (e) {
                    var dataItem = this.dataItem(e.item.index());
                    locationID = dataItem.LOC_ID;
                    scanResult = locationID;
                    $("#new-barcode").kendoMobileModalView("open");
                },
                popup: {
                    appendTo: body
                },
                template: "<p>#:LOC_ID#: #:LOC_NAME#</p>"
            });

            $("#back-to-scan").unbind().click(function () {
                app.goToScan();
            });

        },
        newBarcode: function () {
            var loc,
                jsdo = app.locJSDO;
            loc = jsdo.find(function (jsrecord) {
                return (jsrecord.data.LOC_ID == locationID);
            });
            console.log(loc);
            var updateData = {
                BARCODE_GOOD: false
            };
            jsdo.assign(updateData);
            jsdo.saveLocal();
            jsdo.saveChanges();
            jsdo.acceptChanges();

            app.goToTempInput();
        },
        noNewBarcode: function () {
            $("#new-barcode").kendoMobileModalView("close");
            app.goToTempInput();
        }
    }
})(window, jQuery);