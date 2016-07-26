(function (temp, $) {
    var tempGrid = null,
        app = temp.app = temp.app || {};

    app.tempGrid = {
        onShow: function () {
            $("#temp-grid").kendoGrid({
                dataSource: {
                    type: "jsdo",
                    transport: {
                        jsdo: app.reportJSDO
                    }
                },
                pageSize: 10,
                groupable: true,
                mobile: true,
                sortable: true,
                 resizable: true,
                columns: [
                    {
                        field: "LOCATION_NAME",
                        title: "Location Name"
                        },
                    {
                        field: "TEMP",
                        title: "Recorded Temperature"
                        },
                    {
                        field: "IN_RANGE",
                        title: "In Range?"
                        },
                    {
                        field: "EMPLOYEE",
                        title: "Employee"
                        },
                    {
                        field: "STAMP_DT",
                        title: "Date"
                        },
                    {
                        field: "STAMP_TM",
                        title: "Time"
                        }
                    ]
            });
        },
        onHide: function () {
            //What should happen once the view is hidden.
            //Called from data-hide in HTML
        }
    }
})(window, jQuery);