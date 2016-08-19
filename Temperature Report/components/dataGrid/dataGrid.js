(function (temp, $) {
    var tempGrid = null,
        app = temp.app = temp.app || {};

    var windowHeight = function () {
        return $(window).height();
    }

    app.tempGrid = {
        onShow: function () {
            var toolbarTemplate = "<button data-role='button' onclick='app.tempGrid.exportGrid'>Export to PDF</button>";
            $("#temp-grid").kendoGrid({
                toolbar: [{
                    template: toolbarTemplate
                }],
                dataSource: {
                    type: "jsdo",
                    transport: {
                        jsdo: app.reportJSDO
                    }
                },
                height: windowHeight,
                groupable: true,
                mobile: true,
                sortable: true,
                resizable: true,
                scrollable: {
                    virtual: true
                },
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
                        format: "{0: yyyy-MM-dd}",
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
        },
        exportGrid: function () {
            var $grid = $("#temp-grid"),
                gridPDF = "TempReport.pdf";
            alert("Export is starting");
            kendo.drawing.drawDOM($grid)
                .then(function (group) {
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: {
                            left: "1cm",
                            top: "1cm",
                            right: "1cm",
                            bottom: "1cm"
                        }
                    });
                })
                .done(function (data) {
                    //save the file locally
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                        function (fileSystem) {
                            var options = {
                                create: true,
                                exclusive: false
                            };
                            //create a file in device file system
                            fileSystem.root.getFile(gridPDF, options,
                                function (fileEntry) {
                                    fileEntry.createWriter(
                                        function (fileWriter) {
                                            var base64data = data.split(',')[1];
                                            //decode base64 data
                                            var binary = atob(base64data);
                                            var len = binary.length;
                                            //create a Uint8Array
                                            var bytes = new Uint8Array(len);
                                            for (var i = 0; 1 < len; i++) {
                                                bytes[i] = binary.charCodeAt(i);
                                            }
                                            //write the Uint8Array in the newly created image file
                                            fileWriter.write(bytes.buffer);

                                            setTimeout(function () {
                                                alert("opening file");
                                                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                                                    fileSystem.root.getFile(gridPDF, null,
                                                        function (fileEntry) {
                                                            //check to see if file already exists
                                                            var windowTarget = device.platform.toLowerCase() === "ios" ? "_blank" : "_system";
                                                            window.open(fileEntry.nativeURL, windowTarget);
                                                        },
                                                        function (error) {
                                                            error.message = "Unable to get file entry for reading.";
                                                            onError.call(that, error);
                                                        });
                                                }, function (error) {
                                                    error.message = "Request file system failed.";
                                                    alert(error);
                                                });
                                            }, 3000);
                                        },
                                        function (error) {
                                            error.message = "Unable to create file writer.";
                                            alert(error);
                                        });
                                },
                                function (error) {
                                    error.message = "Failed creating file.";
                                    alert(error);
                                });
                        },
                        function (error) {
                            error.message = "Request file system failed.";
                            alert(error);
                        });
                });
            return false;
        }
    }
})(window, jQuery);