(function(temp,$){
    var tempExport = null,
        app = temp.app = temp.app || {};
    
    app.tempExport = {
        exportData: function(){
            alert("Begin attempt to save and send.");
	
            //Create kendo dataSource from reportJSDO
			var ds = new kendo.data.DataSource({
                type: "jsdo",
                transport: {
                    jsdo: app.reportJSDO
                },
                error: function(e) {
                    alert("Error with DataSource: " + e);
                }
            });
			
			var tempWBURL; //to be assigned in ds.fetch function
			//Create an array to hold the data from the dataSource for sending to the workbook object
			var rows = [{
				cells: [
					{value: "LOCATION_ID"},
					{value: "LOCATION_NAME"},
					{value: "IN_RANGE"},
					{value: "EMPLOYEE"},
					{value: "STAMP_DT"},
					{value: "STAMP_TM"},
					{value: "REPORT_ID"},
					{value: "TEMP"},
				]
			}];
            
            ds.fetch(function(){
                var data = this.data();
				//push dataSoruce data into the array
				for (var i=0; i < data.length; i++){
					rows.push({
						cells: [
						{value: data[i].LOCATION_ID},
						{value: data[i].LOCATION_NAME},
						{value: data[i].IN_RANGE},
						{value: data[i].EMPLOYEE},
						{value: data[i].STAMP_DT},
						{value: data[i].STAMP_TM},
						{value: data[i].REPORT_ID},
						{value: data[i].TEMP}
						]
					});
				}
                //create workbook
                var tempWB = new kendo.ooxml.Workbook({
					sheets: [{
						columns: [
						{autowidth: true},
						{autowidth: true},
						{autowidth: true},
						{autowidth: true},
						{autowidth: true},
						{autowidth: true},
						{autowidth: true},
						{autowidth: true}
						],
						title: "TemperatureReport",
						rows: rows //data from the rows array
					}]
				});
                
                //convert to DataURL by attind .toDataURL(), removed for testing
                tempWBURL = tempWB.toDataURL();
                
            });
            
            //Handle file system access error
            function onErrorLoadFs() {
                alert("Error accessing the file system.");
            }
            
            //request the app's sandbox temporary cache directory
            
            window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function(fileSys){
                alert("File system open: " + fileSys.name);
                alert("File dataURL: " + tempWBURL);
                //last steps, handle email callbacks
                function onEmailSuccess(result) {
					alert("Email Result: " + result);
				}
				function onEmailError(result) {
					alert("Error: " + result);
				}
                //fourth step, email the file
                function sendEmail(reportFile) {
                    var file = reportFile.toURL(),
                        fileString = reportFile.toString();
                   
					window.plugins.socialsharing.shareViaEmail(
						'Sent from Temperature Report App',
						'Temperature Report',
						['devono@ulfoods.com'],
						null,
						null,
						[fileString],
						onEmailSuccess,
						onEmailError
					);
				}
                //handle file read error
                function onErrorReadFile(result) {
                    alert("Error reading the file: " + result);
                }
                //third step, read the file and send to emailing function
                function readFile(inFile) {
                    var fileSrc = inFile.toURL(),
                        fileSrcString = fileSrc.toString();
					inFile.file(function(file){
						var reader = new FileReader();				
						reader.onloadend = function(e) {
                            alert("Successful file read: " + this.result);
                            alert("File location?: " + fileSrcString);
							var blob = new Blob([new Uint8Array(this.result)],{type: "application/vnd.ms-excel"});
                            alert("Blob: " + blob);
							sendEmail(blob);
						};
						reader.readAsArrayBuffer(file);
					}, onErrorReadFile);
				}
                //second step, write to the file
                function writeFile(inFile, dataObj) {
					inFile.createWriter(function(fileWriter){
						fileWriter.onwriteend = function() {
							alert("Successful file write!");
							readFile(inFile);
                            //sendEmail(inFile);
						};
						fileWriter.onerror = function(e){
							alert("File write failed: "+ e.toString());
						};
						fileWriter.write(dataObj);
					});
				}
                //handle file save error
                function onErrorCreateFile() {
                    alert("Error creating the file.");
                }
                //first step, create the file
                function createFile(dir, fileData, fileName) {
					dir.getFile(fileName, {create: true, exclusive: false}, function (inFile) {
						writeFile(inFile, fileData);
					}, onErrorCreateFile);
				}
                
                var tempBlob = new Blob([tempWBURL], {type: "application/vnd.ms-excel"});
                var date = app.getDate();
                var fileName = "Temperature_Report_"+ date + ".xlsx";
                
                var tempData = tempBlob;
                
                createFile(fileSys.root, tempData, fileName);
            }, onErrorLoadFs); 
        }
    }
        
})(window,jQuery);