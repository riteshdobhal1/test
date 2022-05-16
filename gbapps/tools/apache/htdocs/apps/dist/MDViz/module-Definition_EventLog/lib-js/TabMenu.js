
function tabMenu() {
}

tabMenu.isInitialized = false;

tabMenu.initialize = function() {
	if (tabMenu.isInitialized) return;
}

tabMenu.reset = function() {
	tabMenu.isInitialized = false;
}

var listTabs = {
	// idDiv			idMenuItem				label
	menubar			: ['menubar',				'menubar' ],
	tabMain			: ['menuItemMain',			'Main menu' ],
	tabLoad			: ['menuItemLoad',			'Load files' ],
	tabSystemInfo	: ['menuItemSystemInfo',	'System info &amp; status' ],
	// tabWorkflow		: ['menuItemWorkflow',		'Workflow' ],
	tabFirmware		: ['menuItemFirmware',		'Firmware' ],
	tabMeasurements	: ['menuItemMeasurements',	'Measurements' ]
};

var listItemsMainMenu = [
	"mainLoad",
	"mainSystemInfo",
	"mainFirmware",
	"mainMeasurements",
	// "mainWorkflow"
];

var listTabObjects = {
	// idDiv			tab object
	tabLoad			:	tabLoad,
	//tabWorkflow		:	tabSummary,
	tabFirmware		:	tabFirmware,
	tabMeasurements	:	tabMeasurements,
	tabSystemInfo	:	tabSystemInfo,
};

function hideTabsAll() {
	for (var idTab in listTabs) {
		// console.log("idTab=",idTab);
		document.getElementById(idTab).style.display = 'none';
	}
}

function menuActivate(idMenuItem) {
	for (var idTab in listTabs) {
		var id = listTabs[idTab];
		document.getElementById(id).style.backgroundColor = '#fff';
		document.getElementById(id).style.color = '#000';
	}
	document.getElementById(idMenuItem).style.backgroundColor = '#000';
	document.getElementById(idMenuItem).style.color = '#fff';
}

function callbackMenu(idTab) {
	// hideTabsAll();
	// menuActivate(listTabs[idTab]);
	// document.getElementById(idTab).style.display = 'inline-block';
	// console.log(idTab);
	showTab("tabLoad");
	//console.log(window.event.target.innerText);
}

function hideTab(idTab) {
	// document.getElementById(idTab).style.visibility = 'hidden';
	document.getElementById(idTab).style.display = 'none';
}

function showTab(idTab) {
	// console.log("showTab: idTab=", idTab);
	hideTabsAll();
	// document.getElementById(idTab).style.visibility = 'visible';
	document.getElementById(idTab).style.display = 'inline-block';
	if (idTab !== "tabMain") {
		// show menubar
		var idMenubar = "menubar";
		document.getElementById(idMenubar).style.display = 'block';
		// set label
		var label = listTabs[idTab][1];
		document.getElementById("menubarTabName").innerHTML = label;
		// show tab
		document.getElementById(idTab).style.display = "inline-block";
		// initialize tab
		listTabObjects[idTab].initialize();
		// show tab
		document.getElementById(idTab).style.display = "inline-block";
	}
}

function setCallbacksMainTab() {
	for (var i=0; i<listItemsMainMenu.length; i++) {
		var idMenuItem = listItemsMainMenu[i];
		// console.log("idMenuItem=", idMenuItem);
		document.getElementById(idMenuItem).onclick = callbackMainMenuEntry;
	}
}

function callbackMainMenuEntry(event) {
	// console.log("event=", event);
	var id = event.target.id;
	// console.log("id=", id);
	var idTab = id.replace("main", "tab");
	// console.log("idTab=", idTab);
	showTab(idTab);
}

function setCallbacksMenubar() {
	for (var i=0; i<listItemsMainMenu.length; i++) {
		var idMenuItem = listItemsMainMenu[i];
		// console.log("idMenuItem=", idMenuItem);
		var idMenubarItem = idMenuItem.replace("main", "menuItem");
		// console.log("idMenubarItem=", idMenubarItem);
		document.getElementById(idMenubarItem).onclick = callbackMenubarEntry;
	}
	document.getElementById("menuItemMain").onclick = callbackMenubarEntry;
}

function callbackMenubarEntry(event) {
	// console.log("event=", event);
	var id = event.target.id;
	// console.log("id=", id);
	var idTab = id.replace("menuItem", "tab");
	// console.log("idTab=", idTab);
	showTab(idTab);
}

function showMenubarInfoText(text, bgcolor) {
	var id = "menubarInfoText";
	document.getElementById(id).innerHTML = text;
	document.getElementById(id).style.backgroundColor = bgcolor;
}

