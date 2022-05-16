
(function () {

function TabMenu(mainObj) {
	this.isInitialized = false;
	this.mainObj = mainObj;
}


TabMenu.prototype.initialize = function() {
	if (this.isInitialized) return;
}

TabMenu.prototype.reset = function() {
	this.isInitialized = false;
}

var listItemsMainMenu = [
	"mainLoad",
	"mainSystemInfo",
	"mainFirmware",
	"mainMeasurements",
	// "mainWorkflow"
];

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

TabMenu.prototype.setCallbacksMainTab = function() {
	for (var i=0; i<listItemsMainMenu.length; i++) {
		var idMenuItem = listItemsMainMenu[i];
		//~ console.log("idMenuItem=", idMenuItem);
		document.getElementById(idMenuItem).onclick = this.mainObj.callbackMainMenuEntry;
	}
	//~ console.log(this.mainObj.callbackMainMenuEntry)
	//~ console.log(this.mainObj)
}

TabMenu.prototype.setCallbacksMenubar = function() {
	for (var i=0; i<listItemsMainMenu.length; i++) {
		var idMenuItem = listItemsMainMenu[i];
		// console.log("idMenuItem=", idMenuItem);
		var idMenubarItem = idMenuItem.replace("main", "menuItem");
		// console.log("idMenubarItem=", idMenubarItem);
		document.getElementById(idMenubarItem).onclick = this.callbackMenubarEntry;
	}
	document.getElementById("menuItemMain").onclick = this.callbackMenubarEntry;
}

TabMenu.prototype.callbackMenubarEntry = function(event) {
	//~ console.log("event=", event);
	var id = event.target.id;
	console.log("id=", id);
	var idTab = id.replace("menuItem", "tab");
	// console.log("idTab=", idTab);
	console.log(3456345, this.mainObj);
	this.mainObj.showTab(idTab);
}

function showMenubarInfoText(text, bgcolor) {
	var id = "menubarInfoText";
	document.getElementById(id).innerHTML = text;
	document.getElementById(id).style.backgroundColor = bgcolor;
}

//~ window.TabMenu = TabMenu;

}())
