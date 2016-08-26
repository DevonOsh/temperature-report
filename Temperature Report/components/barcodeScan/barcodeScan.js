var scanResult = 'No results yet';

(function (temp, $) {
    var ScanViewModel,
        failViewModel,
        locationID,
        app = temp.app = temp.app || {};

    var functionCallCount = 0;

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
            var date = app.getDate();
            app.JSDOSession.addCatalog(app.JSDOSettings.catalogURIs);
            app.locJSDO.fill();
            $("#list-button").unbind().click(function () {
                app.goToScanFail();
            });
            $("#reportDate").html(date);
            app.scanBarcode.getCurrentReport();
        },
        onHide: function () {
            var reportJSDO = app.reportJSDO,
                writeOutReport = app.scanBarcode.writeOutReport;
            reportJSDO.unsubscribe('afterFill', writeOutReport);
        },
        getCurrentReport: function () {
            var reportJSDO = app.reportJSDO,
                writeOutReport = app.scanBarcode.writeOutReport;

            //Fill the JSDO from db and call function to  display the data
            reportJSDO.subscribe('afterFill', writeOutReport);
            reportJSDO.fill();
        },
        writeOutReport: function (jsdo, success, request) {
            var date = app.getDate();
            jsdo.foreach(function (report) {
                var reportDate = report.data.STAMP_DT,
                    completed = "<span class='glyphicon glyphicon-ok'></span>",
                    notCompleted = " ",
                    span;
                if (reportDate == date) {
                    if (report.data.STAMP_TM !== null) {
                        span = completed;
                        $("#completed-list").append(
                            "<li class='list-group-item'>" +
                            span + " " +
                            report.data.LOCATION_ID +
                            ' ' +
                            report.data.LOCATION_NAME + ' ' +
                            report.data.STAMP_DT +
                            "</li>"
                        );
                    } else {
                        span = notCompleted;
                        //$("#uncompleted-list li").remove();
                        $("#uncompleted-list").append(
                            "<li class='list-group-item'>" +
                            span + " " +
                            report.data.LOCATION_ID +
                            ' ' +
                            report.data.LOCATION_NAME + ' ' +
                            report.data.STAMP_DT +                          
                            "</li>"
                        );
                    }
                }
            });
        }
    }

    app.scanFail = {
        onShow: function () {
			var date = app.getDate();
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
                    app.scanFail.initBarcodeModal();
                },
                popup: {
                    appendTo: body
                },
                template: "<p>#:LOC_ID#: #:LOC_NAME#</p>",
            });

            $("#back-to-scan").unbind().click(function () {
                app.goToScan();
            });

        },
        initBarcodeModal: function () {
            $("#new-barcode").kendoMobileModalView("open");
            $("#confirm-barcode-btn").unbind().click(function () {
                if ($("#scan-modal-yes").is(':checked')) {
                    app.scanFail.newBarcode();
                } else if ($("#scan-modal-no").is(':checked')) {
                    app.scanFail.noNewBarcode();
                }
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