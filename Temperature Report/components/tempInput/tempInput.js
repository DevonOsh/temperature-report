(function (temp, $) {
    var tempInput = null,
        app = temp.app = temp.app || {};

    var reportModel = {
        "LOCATION_ID": "",
        "LOCATION_NAME": "",
        "TEMP": "",
        "IN_RANGE": "",
        "EMPLOYEE": "",
        "STAMP_DT": "",
        "STAMP_DT": ""
    }

    app.tempInput = {
        onShow: function () {
            var locDataSource = new kendo.data.DataSource({
                type: "jsdo",
                serverFiltering: false,
                serverSorting: false,
                transport: {
                    jsdo: app.locJSDO
                },
                error: function (e) {
                    console.log("Error: ", e)
                },
                filter: {
                    field: "LOC_ID",
                    operator: "eq",
                    value: scanResult
                }
            });

            //Create a listview
            $("#resultListView").kendoListView({
                dataSource: locDataSource,
                template: "<h4>Location Name: #:LOC_NAME#</h4>" +
                    "<h4>Location Code: #:LOC_CODE#</h4>"
            });

            //Create the model and save the changes to the db
            $("#ok-button").unbind().click(function () {
                var view = locDataSource.view(),
                    minTemp = view[0].TEMP_MIN - 5,
                    highTemp = view[0].TEMP_MAX,
                    enteredTemp = $("#tempInput").val(),
                    inRange;
                alert("High " + highTemp + " Low " + minTemp);

                try {
                    var isNumber = $.isNumeric(enteredTemp);
                    if (!isNumber)
                        throw new Error("Please enter a number.");
                    if (enteredTemp > 100)
                        throw new Error("Enter a valid temperature.");
                    if (enteredTemp < -70)
                        throw new Error("Enter a valid temperature.");
                    if ((enteredTemp <= highTemp) && (enteredTemp >= minTemp))
                        inRange = true;
                    else
                        inRange = false;

                    app.tempInput.buildModel(view, enteredTemp, inRange);
                    if (inRange) {
                        app.sendReport(reportModel);
                        app.goToSubmitSuccess();
                    }
                    else
                        alert("Temp out of range!");

                } catch (exception) {
                    alert(exception.message);
                }
            });

        },
        //build the model to be sent to OE
        buildModel: function (data, temp, range) {
            var currentDate = new Date(),
                yyyy = currentDate.getFullYear(),
                mm = currentDate.getMonth() + 1,
                dd = currentDate.getDate(),
                formatDate = yyyy + "-" + mm + "-" + dd,
                dateString = currentDate.toString(),
                currentTime = dateString.substring(16, 21);

            reportModel.LOCATION_ID = data[0].LOC_ID;
            reportModel.LOCATION_NAME = data[0].LOC_NAME;
            reportModel.TEMP = temp;
            reportModel.IN_RANGE = range;
            reportModel.EMPLOYEE = app.userInfo.userName;
            reportModel.STAMP_DT = formatDate;
            reportModel.STAMP_TM = currentTime;
        }
    }

    app.successView = {
        onShow: function () {
            
            console.log(reportModel);

            $("#submitListView").kendoListView({
                dataSource: [reportModel],
                template: "<h4>Location ID: #:LOCATION_ID#</h4>" +
                    "<h4>Location Name: #:LOCATION_NAME#</h4>" +
                    "<h4>Recorded Temp: #:TEMP#</h4>" +
                    "<h4>Employee: #:EMPLOYEE#</h4>" +
                    "<h4>Date: #:STAMP_DT#</h4>" +
                    "<h4>Time: #:STAMP_TM#</h4>"
            });

            $("#confirm-button").unbind().click(function () {
                app.goToScan();
            });
        }
    }

})(window, jQuery);