(function (temp, $) {
    var tempGrid = null,
        app = temp.app = temp.app || {};

    var windowHeight = function () {
        return $(window).height();
    }
    
    var gridDataSource = new kendo.data.DataSource({
        type: "jsdo",
        transport: {
            jsdo: app.reportJSDO
        }
    });

    app.tempGrid = {
        onShow: function () { 
            $("#temp-grid").kendoGrid({
                dataSource: gridDataSource,
                height: windowHeight,
                mobile: true,
                filterable: true,
                groupable: true,
                sortable: true,
                resizable: true,
                scrollable: {
                    virtual: true
                },
                columns: [
                    {
                        field: "LOCATION_ID",
                        title: "Location ID"
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
        filterMenu: function (e) {
            if (e.field == "STAMP_DT") {
                var beginOperator = e.container.find("[data-role=dropdownlist]:eq(0)").data("kendoDropDownList");

                beginOperator.value("gte");
                beginOperator.trigger("change");

                var endOperator = e.container.find("[data-role=dropdownlist].eq(2)").data("kendoDropDownList");

                endOperator.value("lte");
                endOperator.trigger("change");
                debugger;
                e.container.find(".k-dropdown").hide();
            }
        },
        onHide: function () {
      
        }
    }
})(window, jQuery);