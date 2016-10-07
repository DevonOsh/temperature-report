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
        afterShow: function(){
            //var grid = $("#temp-grid").data("kendoGrid");
            //grid.dataSource.read();
            //grid.refresh();

            $("#temp-grid").data("kendoGrid").dataSource.read();
        },
        onShow: function () { 
            $("#temp-grid").kendoGrid({
                dataSource: gridDataSource,
                height: windowHeight,
                mobile: true,
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
            
            $('#printGrid').click(function () {
        		app.tempGrid.print();
    		});
        },
        onHide: function () {
      		var grid = $("#temp-grid").data("kendoGrid");
            grid.dataSource.sync();
            grid.refresh();
        },
        print: function() {
            var printableContent = document.getElementById("temp-grid");
            cordova.plugins.printer.print(
                printableContent,
                {
                    name: "Temperature Report"
                },
                function(success) {console.log('OK: ' + success)},
                function(error) {console.log('Error: ' + error)}
            );
        }
    }
})(window, jQuery);