
function callbackDMSOnLoadStart(event) {
	showMessage('Reading Slim Line DMS temperature file...', '#ffffff');
}

function callbackDMSOnLoad(event) {
	//console.log('callbackDMSOnLoad start');
	var fileAsString = event.target.result;
	//console.log(fileAsString);
	try {
		dmsTempData = dmsTempParser.parse(fileAsString, filename);
		//console.log(dmsTempData);
		showMessage('Finished reading Slim Line DMS temperature file.', '#ffffff');
	}
	catch(err) {
		//console.log(err);
		showMessage('Error reading measurements: ' + err, '#ffff00');
	}
	updateChart();
}

function callbackDMSOnError(event) {
	showMessage('Error loading file', '#ffff00');
}

function callbackDMSFileinput(event) {
	//console.log('callbackDMSFileinput start');
	var fileObj = event.target.files[0];

	if (fileObj) {
		filename = fileObj.name;
		var fileReader = new FileReader();
		fileReader.onloadstart = callbackDMSOnLoadStart;
		fileReader.onload = callbackDMSOnLoad;
		fileReader.onerror = callbackDMSOnError;
		fileReader.readAsText(fileObj);
	} else {
		showMessage('Error opening file', '#ffff00');
	}
}
