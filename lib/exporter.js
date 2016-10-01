#!/usr/bin/env node

var moment = require("moment");
var _ = require("underscore");
var util = require("./util");
var path = require("path");
var chrome = require("./chrome");
var firefox = require("./firefox");


function exportHelper(browser, exportDir, start, end) {
    var tool = require(`./${browser}`);
    tool.countDailyVisits(start, end, function(dailyVisits) {
        dailyVisits = _.map(dailyVisits, function(visit) {
            return [moment(visit[0]).format("YYYY/MM/DD"), visit[1]].join(",");
        }).join("\n");
        util.saveCSVFile(path.join(exportDir, `${browser}_DailyVisits.csv`), dailyVisits);
    });
    tool.countURLsFrequence(start, end, function(URLsFreq) {
        URLsFreq = _.map(URLsFreq, function(urlFreq) {
            return [urlFreq[0], urlFreq[1]].join(",");
        }).join("\n");
        util.saveCSVFile(path.join(exportDir, `${browser}_URLsFrequence.csv`), URLsFreq);
    });
}
exports.firefoxExport = function(outputDir) {
    firefox.getHistoryRange(function(range) {
        var start = range.min_visit_time;
        var end = range.max_visit_time;
        exportHelper("firefox", outputDir, start, end);
    });
}
exports.chromeExport = function(outputDir) {
    chrome.getHistoryRange(function(range) {
        var start = range.min_visit_time;
        var end = range.max_visit_time;
        exportHelper("chrome", outputDir, start, end);
    });
}
