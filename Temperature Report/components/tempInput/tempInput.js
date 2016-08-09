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
        "STAMP_TM": ""
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
                template: "<li class='list-group-item'>Location ID: #:LOC_ID#</li>" +
                	"<li class='list-group-item'>Location Name: #:LOC_NAME#</li>" +
                    "<li class='list-group-item'>Location Code: #:LOC_CODE#</li>"
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
                    } else
                        $("#range-warning").kendoMobileModalView("open");

                } catch (exception) {
                    alert(exception.message);
                }
            });

        },
        onHide: function() {
            $("#tempInput").val('');
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
        },
        confirm: function () {
            app.sendReport(reportModel);
            app.goToSubmitSuccess();
            $("#range-warning").kendoMobileModalView("close");
        },
        cancel: function () {
            $("#range-warning").kendoMobileModalView("close");
            $("#tempInput").val('');
        }
    }

    app.successView = {
        onShow: function () {

            console.log(reportModel);

            $("#submitListView").kendoListView({
                dataSource: [reportModel],
                template: "<li class='list-group-item'>Location ID: #:LOCATION_ID#</li>" +
                    "<li class='list-group-item'>Location Name: #:LOCATION_NAME#</li>" +
                    "<li class='list-group-item'>Recorded Temp: #:TEMP#</li>" +
                    "<li class='list-group-item'>Employee: #:EMPLOYEE#</li>" +
                    "<li class='list-group-item'>Date: #:STAMP_DT#</li>" +
                    "<li class='list-group-item'>Time: #:STAMP_TM#</li>"
            });

            $("#confirm-button").unbind().click(function () {
                app.goToScan();
            });
        }
    }

})(window, jQuery);