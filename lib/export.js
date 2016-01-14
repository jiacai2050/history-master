#!/usr/bin/env node

var moment = require("moment");
var _ = require("underscore");
var util = require("./util");
var config = require("../config");

var script = process.argv[1];
var args = process.argv.slice(2);
var cmd = args.length == 0 ? "help" : args[0];

var chrome = require("./chrome");

var start = moment(config["count_range"].start, "YYYY/MM/DD");
var end = moment(config["count_range"].end, "YYYY/MM/DD");
start = util.toWebkitTimestamp(start.valueOf());
end = util.toWebkitTimestamp(end.valueOf());

switch(cmd) {
    case "day": 
        chrome.countDailyVisits(start, end, function(dailyVisits) {
            dailyVisits = _.map(dailyVisits, function(visit) {
                return [moment(visit[0]).format("YYYY/MM/DD"), visit[1]].join(",");
            }).join("\n");
            util.saveCSVFile(config.export_file.countDailyVisits, dailyVisits);
        });
        break;
    case "mfv": 
        chrome.countURLsFrequence(start, end, function(URLsFreq) {
            URLsFreq = _.map(URLsFreq, function(urlFreq) {
                return [urlFreq[0], urlFreq[1]].join(",");
            }).join("\n");
            util.saveCSVFile(config.export_file.countURLsFrequence, URLsFreq);
        });
        break;
    case "help": 
        var helpArr = [
            "Usage: " + script + " <option>",
            "",
            "<option> can be:",
            "day: count daily usage in chrome browsing history",
            "mfv: count Most Frequent Visited(mfv) URLs in chrome browsing history",
            "help: print help message. It's me ^_^"
        ];
        console.log(helpArr.join("\n"));
        break;
}
