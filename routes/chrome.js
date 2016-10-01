var express = require("express");
var _  = require("underscore");
var moment = require("moment");
var chrome = require("../lib/chrome");
var util = require("../lib/util");
var router = module.exports = express.Router();

var browser = "Chrome";
var date_format = "YYYY/MM/DD";
router.get("/range", function(req, res) {
    chrome.getHistoryRange(function(range) {
        res.json(range);
    })
})
function fetch_stats(start, end, cb) {
    chrome.countDailyVisits(start, end, function(dailyVisits) {
        chrome.countURLsFrequence(start, end, function(urlsFreq) {
            cb({
                dailyVisits: JSON.stringify(dailyVisits),
                urlsFreq:  JSON.stringify(urlsFreq),
                browser: browser
            });
        });
    });
}
router.get("/", function(req, res) {
    if(req.query.hasOwnProperty("start") && req.query.hasOwnProperty("end")) {
        var start = moment(req.query.start, date_format);
        var end = moment(req.query.end, date_format);
        start = util.toWebkitTimestamp(start.valueOf());
        end = util.toWebkitTimestamp(end.valueOf());
        fetch_stats(start, end, function(stats) {
            stats["start"] = req.query.start;
            stats["end"] = req.query.end;
            res.render("index", stats);
        })
    } else {
        chrome.getHistoryRange(function(range) {
            var start = range.min_visit_time;
            var end = range.max_visit_time;
            fetch_stats(start, end, function(stats) {
                stats["start"] = moment(util.fromWebkitTimestamp(start)).format(date_format);
                stats["end"] = moment(util.fromWebkitTimestamp(end)).format(date_format);
                res.render("index", stats);
            });
        });
    }
});
router.get("/details/:currentDay", function(req, res) {
    var currentDay = parseInt(req.params.currentDay);
    var nextDay = currentDay + 3600 * 24 * 1000;
    var start = util.toWebkitTimestamp(currentDay);
    var end = util.toWebkitTimestamp(nextDay);
    currentDay = moment(currentDay).format(date_format);

    chrome.getVisitDetails(start, end, function(visitDetails) {
        res.render("details", {
            currentDay: currentDay,
            visitDetails: JSON.stringify(visitDetails),
            browser: browser
        })
    });
});
