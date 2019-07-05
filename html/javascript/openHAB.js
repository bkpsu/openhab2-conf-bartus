// ***
// * Required definitions:
// *  - var baseURL = "../";
// *
// ***
// * Required API
// * - Google jQuery: https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// * - jQuery CSV:    https://github.com/evanplaice/jquery-csv
// * - date.js:       http://www.datejs.com/
// ***

function GetGroupItemNames(groupItem) {
    var groupUrl = baseURL.concat("rest/items/").concat(groupItem);
    var groupData = GetData(groupUrl);
    var items = [];

    groupData.members.forEach(function (item) {
        items.push(item.name);
    });

    return items;
}

function GetOpenHABHistory(item, hours, serviceId) {
    var csv = GetOpenItemHABHistoryCSV(item, hours, serviceId);
    var arrayData = $.csv.toArrays(csv, {
        onParseValue: $.csv.hooks.castToScalar
    });

    return arrayData;
}

function GetData(itemUrl) {
    var itemValue = null;
    $.ajax({
        contentType: 'text/plain',
        url: itemUrl,
        data: {},
        async: false,
        success: function (data) {
            if (data != "NULL") {
                itemValue = data;
            }
        }
    });

    return itemValue;
}

// JSON to CSV Converter
function ConvertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.data.length; i++) {
        var line = '';
        for (var index in array.data[i]) {
            if (line !== '') line += ',';

            line += array.data[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function GetOpenHABItemState(item) {
    var itemUrl = baseURL.concat("rest/items/").concat(item).concat("/state/");
    return GetData(itemUrl);
}

function GetOpenHABItem(item) {
    var itemUrl = baseURL.concat("rest/items/").concat(item);
    return GetData(itemUrl);
}

function GetOpenHABItemIntValue(item) {
    return Math.round(GetOpenHabItemState(item));
}

function GetOpenHABItemHistoryJSON(item, hours, service = "rrd4j") {
    var jsonData = null;
    // var numberOfMilliseconds = 86400 * 1000 * days;

    var startTimeObject = (new Date()).addHours(hours * -1);
    // var endTimeObject = new Date();
    var _month = startTimeObject.getMonth() + 1;
    var _starttime = startTimeObject.getFullYear() + "-" + ("0" + _month).slice(-2) + "-" + ("0" + startTimeObject.getDate()).slice(-2) + "T" + ("0" + startTimeObject.getHours()).slice(-2) + ":" + ("0" + startTimeObject.getMinutes()).slice(-2) + ":" + ("0" + startTimeObject.getSeconds()).slice(-2);
    // var _endtime = endTimeObject.getFullYear() + "-" + endTimeObject.getMonth() + "-" + endTimeObject.getDate() + "T" + endTimeObject.getHours() + ":" + endTimeObject.getMinutes() + ":" + endTimeObject.getSeconds();

	var itemUrl = baseURL.concat("rest/persistence/items/").concat(item);
    itemUrl = itemUrl.concat("?serviceId=" + service + "&boundary=true");

    if (hours != 24) {
        itemUrl = itemUrl.concat("&starttime=" + _starttime);
    }
    // itemUrl = itemUrl.concat("&endtime="   + _endtime);

    jsonData = GetData(encodeURI(itemUrl));
    return jsonData;
}

function GetOpenItemHABHistoryCSV(item, hours = 24, service = "rrd4j") {
    var jsonData = GetOpenHABItemHistoryJSON(item, hours, service);
    return ConvertToCSV(jsonData);
}

function GetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search.substr(1).split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) {
                result = decodeURIComponent(tmp[1]);
            }
        });
    return result;
}

function DOMSetElementHeight(elementId, height) {
    var pageElement = document.getElementById(elementId);
    pageElement.style.height = height + "px";
}

function DOMSetElementWidth(elementId, width) {
    var pageElement = document.getElementById(elementId);
    pageElement.style.width = width + "px";
}