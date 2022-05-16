
function callbackDmsOnLoadStart(event) {
	showMessage('Reading Sensation DMS temperature file...', '#ffffff');
}

function callbackDmsOnLoad(event) {
	//console.log('callbackDmsOnLoad start');
	var fileAsString = event.target.result;
	//console.log(fileAsString);
	try {
		dmsTempData = dmsTempParser.parse(fileAsString, filename);
		//console.log(dmsTempData);
		showMessage('Finished reading Sensation DMS temperature file.', '#ffffff');
	}
	catch(err) {
		//console.log(err);
		showMessage('Error reading measurements: ' + err, '#ffff00');
	}
	updateChart();
}

function callbackDmsOnError(event) {
	showMessage('Error loading file', '#ffff00');
}

function readFiles(listFiles) {
	var fileObj = listFiles[0];

	if (fileObj) {
		filename = fileObj.name;
		var fileReader = new FileReader();
		fileReader.onloadstart = callbackDmsOnLoadStart;
		fileReader.onload = callbackDmsOnLoad;
		fileReader.onerror = callbackDmsOnError;
		fileReader.readAsText(fileObj);
	} else {
		showMessage('Error opening file', '#ffff00');
	}
}

function callbackDmsFileinput(event) {
	//console.log('callbackDmsFileinput start');
	readFiles(event.target.files);
}

function callbackDmsOnDrop(event) {
	//console.log('callbackDmsOnDrop start');
	this.ondragend();
	event.preventDefault();
	readFiles(event.dataTransfer.files);
}