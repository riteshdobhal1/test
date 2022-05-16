
function callbackGantryOnLoadStart(event) {
	showMessage('Reading Sensation gantry temperature file...', '#ffffff');
}

function callbackGantryOnLoad(event) {
	//console.log('callbackGantryOnLoad start');
	var fileAsString = event.target.result;
	//console.log(fileAsString);
	try {
		gantryTempData = gantryTempParser.parse(fileAsString, filename);
		//console.log(gantryTempData);
		showMessage('Finished reading Sensation gantry temperature file.', '#ffffff');
	}
	catch(err) {
		//console.log(err);
		showMessage('Error reading measurements: ' + err, '#ffff00');
	}
	updateChart();
}

function callbackGantryOnError(event) {
	showMessage('Error loading file', '#ffff00');
}

function callbackGantryFileinput(event) {
	//console.log('callbackGantryFileinput start');
	var fileObj = event.target.files[0];

	if (fileObj) {
		filename = fileObj.name;
		var fileReader = new FileReader();
		fileReader.onloadstart = callbackGantryOnLoadStart;
		fileReader.onload = callbackGantryOnLoad;
		fileReader.onerror = callbackGantryOnError;
		fileReader.readAsText(fileObj);
	} else {
		showMessage('Error opening file', '#ffff00');
	}
}
