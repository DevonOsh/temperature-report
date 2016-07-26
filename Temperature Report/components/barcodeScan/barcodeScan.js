var scanResult = 'No results yet';

(function (temp, $) {
    var ScanViewModel,
        failViewModel,
        app = temp.app = temp.app || {};

    ScanViewModel = kendo.data.ObservableObject.extend({
        scan: function () {
            cordova.plugins.barcodeScanner.scan(
                // success callback function
                function (result) {
                    scanResult = result.text;
                    var validLoc = app.locJSDO.find(function (jsrecord) {
                        return (jsrecord.data.LOC_ID == scanResult);
                    });
                    if (validLoc == null) {
                        alert("Unable to find location on scan");
                        app.goToScanFail();
                    } else
                        app.goToTempInput();
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
        },
        failViewModel: failViewModel
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
                select: function(e){
                    var dataItem = this.dataItem(e.item.index());
                    var locID = dataItem.LOC_ID;
                    scanResult = locID;
                    app.goToTempInput();
                },
                template: "<h4>Location Name: #:LOC_NAME#</h4>" +
                    "<h4>Location Code: #:LOC_CODE#</h4>"
            });
        }
    }
})(window, jQuery);