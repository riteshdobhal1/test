function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("/apps/config/uiconfig.json", function(text){
    var data = JSON.parse(text);
        var umsDomain = data["umsDomain"].replace(/\/v1|\/v2/,"");
        window.location.href = umsDomain;
        });

