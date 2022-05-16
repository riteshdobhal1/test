var sess = getCookie("username");
    if(sess == undefined)
    {
        //var url = window.location.protocol + "//" + window.location.hostname + "/login/index.html";
        //window.open(url, "_parent");
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
    
function hnd_ut(a){
a.TRANSLATIONS['Search term too short'] = "Search term too short";
a.TRANSLATIONS['No results'] = "No results";
a.TRANSLATIONS['Please enter more characters'] = "Please enter more characters";
a.TRANSLATIONS['Word list not ready yet. Please wait until the word list is fully downloaded'] = "Word list not ready yet. Please wait until the word list is fully downloaded";
a.TRANSLATIONS['Incorrect or corrupt search data. Please check your HelpNDoc template'] = "Incorrect or corrupt search data. Please check your HelpNDoc template";
a.TRANSLATIONS['Related topics...'] = "Related topics...";
a.TRANSLATIONS['Loading...'] = "Loading...";
a.TRANSLATIONS['Close'] = "Close";
}
