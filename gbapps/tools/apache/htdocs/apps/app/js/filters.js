/* Filters */

angular.module('gbApp.filters', [])

// Custom Filter to splice url to extract the bundle name in the last part of the input
    .filter('bundleName', [
        function () {
            return function (input) {
                if (input === undefined || input === null || input === 'NA') {
                    return "";
                }
                return input.split('/')[input.split('/').length - 1].replace(/\.gz$/, '');
            };
        }])

    .filter('bundleNameWithTimeStamp', [
        function () {
            return function (input) {
                if (input === undefined || input === null || input === 'NA') {
                    return "";
                }
                var bundleName = input.split('/')[input.split('/').length - 1].replace(/\.gz$/, '');
                bundleName = bundleName.split("_");
                bundleName.reverse();
                bundleName.pop();
                bundleName.reverse();
                bundleName = bundleName.join("");

                return bundleName;
            };
        }])

    .filter('filterRules', [
        function () {
            return function (data, filter) {
                if (Object.keys(filter).length === 0) {
                    return data;
                }
                var newData = [];
                var filterKeys = Object.keys(filter);
                for (var i in data) {
                    var found = true;
                    for (var j in filterKeys) {
                        if (filterKeys[j] === 'label_display' || filterKeys[j] === 'description' || filterKeys[j] === 'author' || filterKeys[j] === 'rule_name') {
                            var re = new RegExp(filter[filterKeys[j]], "i");
                            if (data[i][filterKeys[j]].search(re) === -1) {
                                found = false;
                                break;
                            }
                        } 
                        else if (filterKeys[j] === 'created_ts' || filterKeys[j] === 'modified_ts') {
                            var timeFilterObj = filter[filterKeys[j]][0];
                            // BG-7052
                            // var st = new Date(timeFilterObj.startTime);
                            // var et = new Date(timeFilterObj.endTime);
                            // var currentDataTimeStr = new Date(data[i][filterKeys[j]]);
                            var st = moment(timeFilterObj.startTime, "YYYY-MM-DD HH:mm:ss").toDate();
                            var et = moment(timeFilterObj.endTime, "YYYY-MM-DD HH:mm:ss").toDate();
                            var currentDataTimeStr = moment(data[i][filterKeys[j]], "YYYY-MM-DD HH:mm:ss").toDate();
                            var range = moment(currentDataTimeStr).isBetween(st, et);
                            if (!range) {
                                found = false;
                                break;
                            }
                        } 
                        else if(filterKeys[j] === 'tags'){
                            var foundOne = false;
                            for (var k in filter[filterKeys[j]]) {
                                if (data[i][filterKeys[j]] && data[i][filterKeys[j]].map(function(cur){ return cur.tag_name}).indexOf(filter[filterKeys[j]][k]) != -1 ) {
                                    foundOne = true;
                                    break;
                                }
                            }
                            if (!foundOne) {
                                found = false;
                                break;
                            }
                        }                    
                        
                        else {
                            var foundOne = false;
                            for (var k in filter[filterKeys[j]]) {
                                if (data[i][filterKeys[j]] && data[i][filterKeys[j]] === filter[filterKeys[j]][k]) {
                                    foundOne = true;
                                    break;
                                }
                            }
                            if (!foundOne) {
                                found = false;
                                break;
                            }
                        }                                             
                    }
                    if (found) {
                        newData.push(data[i]);
                    }
                }
                return newData;
            };
        }])
    .filter('filterSavedView', [
        function () {
            return function (data, filter) {
                if (!filter) {
                    return data;
                }
                filter = filter.toLowerCase();
                var newData = [];

                for (var i =0;i<data.length;i++) {
                    if(((unescape(data[i]['view_name']).toLowerCase()).indexOf(filter) != -1) || ((unescape(data[i]['desc']).toLowerCase()).indexOf(filter) != -1) || ((data[i]['created_by'].toLowerCase()).indexOf(filter) != -1)){
                        newData.push(data[i]);
                    }
                }
                return newData;
            };
        }])
    .filter('filterTemplates', [
        function () {
            return function (data, filter) {
                if (Object.keys(filter).length === 0) {
                    return data;
                }
                var newData = [];
                var filterKeys = Object.keys(filter);
                for (var i in data) {
                    var found = true;
                    for (var j in filterKeys) {
                        var re = new RegExp(filter[filterKeys[j]], "i");
                        if (data[i][filterKeys[j]].search(re) === -1) {
                            found = false;
                            break;
                        }
                    }
                    if (found) {
                        newData.push(data[i]);
                    }
                }
                return newData;
            };
        }])
    
    .filter('filterBooks', [
        function() {
            return function(data, filter) {
                if(!filter) {
                    return data;
                }
                var newData = [];
                for(var i in data) {
                    var found = false;
                    //data[i].expand = false;
                    if(data[i].name && data[i].name.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                        found = true;
                    }else if(data[i].dname && data[i].dname.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                         found = true;
                    }

                    if(!found && data[i].tags) {
                        for(var j in data[i].tags) {
                            if(data[i].tags[j].toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                                found = true;
                                break;
                            }
                        }
                    }
                    if(!found && data[i].tag) {
                        for(var j in data[i].tag) {
                            if(data[i].tag[j].toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                                found = true;
                                break;
                            }
                        }
                    }
                    //search for sub-report
                    if(!found && data[i].reports && data[i].reports.length > 0){
                        for(var j in data[i].reports) {                            
                            if(data[i].reports[j]["rname"].toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                                found = true;
                                data[i].expand = true;
                                break;
                            }
                        }
                    }
                    if(!found && data[i].f_views && data[i].f_views.length > 0){
                        for(var j in data[i].f_views) {                            
                            if(data[i].f_views[j]["name"].toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                                found = true;
                                data[i].expand = true;
                                break;
                            }
                        }
                    }

                    if(found) {
                        newData.push(data[i]);
                    }
                }
                return newData;
            };
        }])
        
     .filter('filterDashboards', [
        function() {
            return function(data, filter) {
                if(!filter) {
                    return data;
                }
                var newData = [];
                
                for(var i in data) {
                    if(data[i].rdesc.toLowerCase().indexOf(filter.toLowerCase()) > -1 || data[i].rname.toLowerCase().indexOf(filter.toLowerCase()) > -1) {
                        newData.push(data[i]);
                    }
                }
                return newData;
            };
        }])

    .filter('filterMultiples', [
        function () {
            return function (data, filter) {
                if (Object.keys(filter).length === 0) {
                    return data;
                }
                var newData = [];
                var filterKeys = Object.keys(filter);
                for (var i in data) {
                    var found = true;
                    var foundOne = false;
                    for (var j in filterKeys) {
                        for (var k in filter[filterKeys[j]]) {
                            if (data[i][filterKeys[j]] === filter[filterKeys[j]][k]) {
                                foundOne = true;
                                break;
                            }
                        }
                        if (!foundOne) {
                            found = false;
                            break;
                        }
                    }

                    if (found) {
                        newData.push(data[i]);
                    }
                }
                return newData;
            };
        }])

// Custom Filter to splice url to extract the bundle name with s3:// and extention /gzin the last part of the input
    .filter('svFileName', [
        function () {
            return function (input, filter) {
                if (input === undefined || input === null || input === 'NA') {
                    return "";
                }
                var fileName = input.split('/')[input.split('/').length - 1];
                var s3 = input.split('/')[0];
                if (s3 !== "s3:") {
                    var fileNameArr = fileName.split('.');
                    fileNameArr.pop();
                    fileName = fileNameArr.join('.');
                }
                return fileName;
            };
        }])
// Custom Filter to splice url to extract the bundle name without file extension in the last part of the input
    .filter('bundleLessExt', [function () {
        return function (input) {
            var x;
            if (input === undefined || input === null || input === 'NA') {
                return "";
            }
            x = input.split('/')[input.split('/').length - 1].split('.');
            x.pop();
            if (x.join('.').endsWith('tar')) {
                x.pop();
            }
            return x.join('.');
        };
    }])

// Custom Filter to display the given time in the desired format.
    .filter('toTimeStr', [
        function () {
            return function (input) {
                if (input) {
                    return input.replace(/T/g, ' ').replace(/Z/g, '');
                } else {
                    return '';
                }

            };
        }])

// Custom Filter to convert the bytes into KB, MB or B based on the value.
    .filter('fileSize', [
        function () {
            return function (input) {
                if (parseInt(input) >= 1024 * 1024) {
                    return (input / 1024 / 1024).toFixed(2) + ' MB (Approx.)';
                } else if (parseInt(input) < (1024 * 1024) && parseInt(input) > 1024) {
                    return (input / 1024).toFixed(2) + ' KB (Approx.)';
                } else {
                    return input + ' B';
                }
            };
        }])

// Custom filter to cut the string to a max limit
    .filter('cut', [
        function () {
            return function (value, wordwise, max, tail) {
                if (!value) return '';
                max = parseInt(max, 10);
                if (!max) return value;
                if (value.length <= max) return value;
                value = value.substr(0, max);
                if (wordwise) {
                    var lastspace = value.lastIndexOf(' ');
                    if (lastspace != -1) {
                        value = value.substr(0, lastspace);
                    }
                }
                return value + (tail || '…');
            };
        }])

// Custom filter add support for greater than, less than for numeric filtering and boolean filtering
    .filter('numberFilter', ['$filter',
        function ($filter) {
            return function (input, filter) {
                if (input && filter) {
                    var i, j, k, t_keys, t_input, t_filter, keys = Object.keys(filter);
                    for (i = 0; i < keys.length; i++) {
                        if (filter[keys[i]].type == 'boolean') {
                            // console.info("Boolean Pending");
                        } else if (filter[keys[i]].type == 'number') {
                            if (filter[keys[i]].value != null && String(filter[keys[i]].value).length) {
                                t_input = [];
                                for (j in input) {
                                    t_keys = Object.keys(input[j]);
                                    for (k in t_keys) {
                                        if (t_keys[k] == filter[keys[i]].field) {
                                            switch (filter[keys[i]].operator) {
                                                case '>' :
                                                    if (input[j][t_keys[k]] > filter[keys[i]].value) {
                                                        t_input.push(input[j]);
                                                    }
                                                    break;
                                                case '<' :
                                                    if (input[j][t_keys[k]] < filter[keys[i]].value) {
                                                        t_input.push(input[j]);
                                                    }
                                                    break;
                                                case '=' :
                                                    if (input[j][t_keys[k]] == filter[keys[i]].value) {
                                                        t_input.push(input[j]);
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }
                                input = t_input;
                            }
                        } else {
                            t_filter = {};
                            t_filter[filter[keys[i]].field] = filter[keys[i]].value;
                            input = $filter('filter')(input, t_filter);
                        }
                    }
                    return input;
                } else {
                    return null;
                }
            };
        }])

// To display fixed precision for numbers
    .filter('numberFixedLen', function () {// 1e32 is enogh for working with 32-bit
        // 1e8 for 8-bit (100000000)
        // in your case 1e4 (aka 10000) should do it

        return function (a, b) {
            return (1e4 + a + "").slice(-b);
        };
    })
// To extract the substring on length x from the given string.
    .filter('subStringToX', function () {// substring to x charater
        return function (a, b) {
            if (a && a.length > b) {
                a = a.substring(0, b) + "...";
            }
            return a;
        };
    })
// format date
    .filter('utcDate', function () {// substring to x charater
        return function (myDate) {
            if (myDate) {
                myDate = new Date(myDate);
                myDate = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
            }
            return myDate;
        };
    })
// format date
    .filter('utcDateTZ', function () {// substring to x charater
        return function (myDate) {
            if (myDate) {
                myDate = new Date(myDate);
                myDate = myDate.getUTCFullYear() + "-" + parseInt(myDate.getUTCMonth() + 1) + "-" + myDate.getUTCDate() + "T" + myDate.getUTCHours() + ":" + myDate.getUTCMinutes() + ":" + myDate.getUTCSeconds() + "Z";

            }
            return myDate;
        };
    })

// Expects an array and returns the comma seperated string of tag labels
    .filter('tags', function () {
        return function (tagsArr) {
            if (tagsArr === undefined) {
                return "";
            }
            // console.info(tagsArr);
            var i, tagstr = "";
            if (Array.isArray(tagsArr)) {
                for (i in tagsArr) {
                    if (tagstr.length) {
                        tagstr += ", ";
                    }
                    tagstr += tagsArr[i]['_label'];
                }
                return tagstr;
            } else {
                return tagsArr['_label'];
            }
        };
    })

// 
    .filter('gbunescape', function () {
        return function (value) {
            return unescape(value);
        };
    })


// format date
    .filter('unixDateTime', function () {// substring to x charater
        return function (myDate) {
            var dt = new Date(myDate);
            var ts = Math.round(dt.getTime() / 1000);
            return ts;
        };
    })

    .filter('internalDashboards',function () {// substring to x charater
        return function (dashboards) {
	    var internalDashboards = [];
	    for (var i = 0; i < dashboards.length; i++) {
		if(dashboards[i]['d_type'] === "Internal" || (dashboards[i]['d_type'] === "Summary" && dashboards[i]['typ'] === "Internal")){
			internalDashboards.push(dashboards[i]);
		}	
		 	
	    }	    	
            return internalDashboards;

        };
    })

    .filter('removeDup', function () {
         return function (arr) {
		var newArr = [];
		angular.forEach(arr, function(value, key) {
		var exists = false;
		angular.forEach(newArr, function(val2, key) {
			if(angular.equals(value.rule_name, val2.rule_name)){ exists = true }; 
		});
		if(exists == false && value.rule_name != "") { newArr.push(value); }
	});

  		return newArr;
        };
    })
// remove duplicates with ng-repeat
    .filter('unique', function () {
        return function (collection, keyname) {
            var output = [],
                keys = [];
            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    })
    .filter('filterArrayItems', function () {
        return function (items, type, filterItem) {
          var filtered = [];
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (filterItem === item[type]) {
              filtered.push(item);
            }
          }
          return filtered;
        };
      });
