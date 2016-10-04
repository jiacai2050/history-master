var SHOW_FORMAT = "YYYY/MM/DD";
var SHOW_FORMAT_SEC = "YYYY/MM/DD HH:mm:ss";
var MAX_RESULTS = Math.pow(2, 31) - 1;

function parseQueryString() {
    var queryDict = {}
    window.location.search.substr(1).split("&").forEach((item) => {
        queryDict[item.split("=")[0]] = item.split("=")[1];
    });
    return queryDict;
}
