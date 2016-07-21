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
            //Testing the Rollback functionality of Github

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
            
           //Also removed the cordova keyboard function to test rollback
            
            
            //Create the model and save the changes to the db
            $("#ok-button").click(function () {
                var view = locDataSource.view(),
                    locationID = view[0].LOC_ID,
                    locationName = view[0].LOC_NAME,
                    minTemp = view[0].TEMP_MIN,
                    highTemp = view[0].TEMP_MAX,
                    enteredTemp = $("#tempInput").val(),
                    inRange;

                if (enteredTemp <= highTemp)
                    inRange = true;
                else
                    inRange = false;

                app.tempInput.buildModel(locationID, locationName, enteredTemp, inRange);
                app.sendReport(reportModel);
            });
        },
        //build the model to be sent to OE
        buildModel: function (locationID, locationName, tempInput, inRange) {
            var currentDate = new Date(),
                yyyy = currentDate.getFullYear(),
                mm = currentDate.getMonth() + 1,
                dd = currentDate.getDate(),
                formatDate = yyyy + "-" + mm + "-" + dd,
                dateString = currentDate.toString(),
                currentTime = dateString.substring(16, 21);

            var locationID = locationID,
                locationName = locationName,
                temp = tempInput,
                inRange = inRange,
                employee = "Devon",
                date = formatDate,
                time = currentTime;

            reportModel.LOCATION_ID = locationID;
            reportModel.LOCATION_NAME = locationName;
            reportModel.TEMP = temp;
            reportModel.IN_RANGE = inRange;
            reportModel.EMPLOYEE = employee;
            reportModel.STAMP_DT = date;
            reportModel.STAMP_TM = time;

            alert(reportModel.LOCATION_ID + "\n" +
                reportModel.LOCATION_NAME + "\n" +
                reportModel.TEMP + "\n" +
                reportModel.IN_RANGE + "\n" +
                reportModel.EMPLOYEE + "\n" +
                reportModel.STAMP_DT + "\n" +
                reportModel.STAMP_TM);
        },
        openSubmitModal: function () {
            $("sentListView").kendoListView({
                dataSource: {
                    data: [
                        {
                            id: reportModel.LOCATION_ID,
                            name: reportModel.LOCATION_NAME,
                            temp: reportModel.TEMP,
                            inRange: reportModel.IN_RANGE,
                            emp: reportModel.EMPLOYEE,
                            date: reportModel.STAMP_DT,
                            time: reportModel.STAMP_TM
                        }
                    ]
                },
                template: 
                    "<p>Location ID: #:id#</p>" +
                    "<p>Location ID: #:id#</p>" +
                    "<p>Location Name: #:name#</p>" +
                    "<p>Temperature: #:temp#</p>" +
                    "<p>In Range?: #:inRange#</p>" +
                    "<p>Employee: #:emp#</p>" +
                    "<p>Date: #:date#</p>" +
                    "<p>Time: #:time#</p>"                
            });
            $("#infoSubmitted").data("kendoMobileModalView").open();
            $("#success-ok-btn").kendoButton({
                click: function () {
                    $("#infoSubmitted").data("kendoMobileModalView").close();
                }
            });
        }
    }
})(window, jQuery);