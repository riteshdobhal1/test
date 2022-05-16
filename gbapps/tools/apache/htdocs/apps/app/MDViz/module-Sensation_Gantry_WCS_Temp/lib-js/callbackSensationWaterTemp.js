
function callbackWaterOnLoadStart(event) {
	showMessage('Reading Sensation water temperature file...', '#ffffff');
}

function callbackWaterOnLoad(event) {
	//console.log('callbackWaterOnLoad start');
	var fileAsString = event.target.result;
	//console.log(fileAsString);
	try {
		waterTempData = waterTempParser.parse(fileAsString, filename);
		//console.log(waterTempData);
		showMessage('Finished reading Sensation water temperature file.', '#ffffff');
	}
	catch(err) {
		//console.log(err);
		showMessage('Error reading measurements: ' + err, '#ffff00');
	}
	updateChart();
}

function callbackWaterOnError(event) {
	showMessage('Error loading file', '#ffff00');
}

function callbackWaterFileinput(event) {
	//console.log('callbackWaterFileinput start');
	var fileObj = event.target.files[0];

	if (fileObj) {
		filename = fileObj.name;
		var fileReader = new FileReader();
		fileReader.onloadstart = callbackWaterOnLoadStart;
		fileReader.onload = callbackWaterOnLoad;
		fileReader.onerror = callbackWaterOnError;
		fileReader.readAsText(fileObj);
	} else {
		showMessage('Error opening file', '#ffff00');
	}
}
