document.domain = location.host.split(/\.(.+)?/)[1];

document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementsByTagName('body')[0].onclick = function() {
    	var parent = getParent(window);
    	if(parent != undefined) {
    		parent.updateLogiTracking();
    	}
	}
});

var getParent = function(source) {
	if(!!source.updateLogiTracking && typeof source.updateLogiTracking === "function") {
		return source;
	}
	if(source.self === source.top) {
		return;		
	} else {
		return getParent(source.parent);
	}
};
