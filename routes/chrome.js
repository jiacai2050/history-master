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

    chrome.getHistoryRange(function(range) {
        var minDate = range.min_visit_time;
        var maxDate = range.max_visit_time;

        if(req.query.hasOwnProperty("start") && req.query.hasOwnProperty("end")) {
            var start = moment(req.query.start, date_format).valueOf();
            var end = moment(req.query.end, date_format).valueOf();
        } else {
            var end = moment().valueOf();
            var start = moment().subtract(30, "days").valueOf();
        }

        start = util.toWebkitTimestamp(start);
        end = util.toWebkitTimestamp(end);
        if (start < minDate) {
            start = minDate;
        }
        if (end > maxDate) {
            end = maxDate;
        }
        fetch_stats(start, end, function(stats) {
            stats["start"] = moment(util.fromWebkitTimestamp(start)).format(date_format);
            stats["end"] = moment(util.fromWebkitTimestamp(end)).format(date_format);
            stats["minDate"] = moment(util.fromWebkitTimestamp(minDate)).valueOf();
            stats["maxDate"] = moment(util.fromWebkitTimestamp(maxDate)).valueOf();
            res.render("index", stats);
        });
    });
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
