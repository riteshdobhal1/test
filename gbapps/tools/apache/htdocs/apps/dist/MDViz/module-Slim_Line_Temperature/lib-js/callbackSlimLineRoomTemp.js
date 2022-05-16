
function callbackRoomOnLoadStart(event) {
	showMessage('Reading Slim Line room temperature file...', '#ffffff');
}

function callbackRoomOnLoad(event) {
	//console.log('callbackRoomOnLoad start');
	var fileAsString = event.target.result;
	//console.log(fileAsString);
	try {
		roomTempData = roomTempParser.parse(fileAsString, filename);
		//console.log(roomTempData);
		showMessage('Finished reading Slim Line room temperature file.', '#ffffff');
	}
	catch(err) {
		//console.log(err);
		showMessage('Error reading measurements: ' + err, '#ffff00');
	}
	updateChart();
}

function callbackRoomOnError(event) {
	showMessage('Error loading file', '#ffff00');
}

function callbackRoomFileinput(event) {
	//console.log('callbackRoomFileinput start');
	var fileObj = event.target.files[0];

	if (fileObj) {
		filename = fileObj.name;
		var fileReader = new FileReader();
		fileReader.onloadstart = callbackRoomOnLoadStart;
		fileReader.onload = callbackRoomOnLoad;
		fileReader.onerror = callbackRoomOnError;
		fileReader.readAsText(fileObj);
	} else {
		showMessage('Error opening file', '#ffff00');
	}
}
