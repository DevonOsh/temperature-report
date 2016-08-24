(function (temp, $) {
    var tempGrid = null,
        app = temp.app = temp.app || {};

    var windowHeight = function () {
        return $(window).height();
    }

    app.tempGrid = {
        onShow: function () {
            $("#temp-grid").kendoGrid({
                dataSource: {
                    type: "jsdo",
                    transport: {
                        jsdo: app.reportJSDO
                    },
                    group: {
                        field: "STAMP_DT"
                    }
                },
                toolbar: kendo.template($("#toolbarTemplate").html()),
                height: windowHeight,
                mobile: true,
                sortable: true,
                resizable: true,
                scrollable: {
                    virtual: true
                },
                columns: [
                    {
                        field: "REPORT_ID",
                        title: "Report ID"
                    },
                    {
                        field: "STAMP_DT",
                        format: "{0: yyyy-MM-dd}",
                        title: "Date"
                        },
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
                        }
                    ]
            });
            var grid = $("#temp-grid").data("kendoGrid");
            grid.collapseGroup(".k-grouping-row:first");
        },
        emailGrid: function () {
            console.log("Email grid function fired");
            window.location.href = "mailto:devono@ulfoods.com?body=This is a test";
        },
        onHide: function () {
            //What should happen once the view is hidden.
            //Called from data-hide in HTML
        }
    }
})(window, jQuery);