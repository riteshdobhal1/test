document.addEventListener("click", function(){
    parent.postMessage("gb_click_event_from_scratchpad", "*")
});

var sess = getCookie("username");
if(sess == undefined)
{

location.href = window.location.protocol + "//" + window.location.hostname + "/login/index.html";
}
function getCookie(c_name)
{
var i,x,y,ARRcookies=document.cookie.split(";");
for (i=0;i<ARRcookies.length;i++)
{
x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
x=x.replace(/^\s+|\s+$/g,"");
if (x==c_name)
{
return (y);
}
}
}

var setScrollToTop = function(){
    parent.postMessage("gb_click_event_from_scratchpad_product_list", "*")
}

