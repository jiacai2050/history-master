var express = require("express");
var _  = require("underscore");
var moment = require("moment");
var firefox = require("../lib/firefox");
var util = require("../lib/util");
var router = module.exports = express.Router();

var browser = "Firefox";
var date_format = "YYYY/MM/DD";

router.get("/range", function(req, res) {
    firefox.getHistoryRange(function(range) {
        res.json(range);
    })
})
function fetch_stats(start, end, cb) {
    firefox.countDailyVisits(start, end, function(dailyVisits) {
        firefox.countURLsFrequence(start, end, function(urlsFreq) {
            cb({
                dailyVisits: JSON.stringify(dailyVisits),
                urlsFreq:  JSON.stringify(urlsFreq),
                browser: browser
            });
        });
    });
}
router.get("/", function(req, res) {

    firefox.getHistoryRange(function(range) {
        var minDate = range.min_visit_time;
        var maxDate = range.max_visit_time;

        if(req.query.hasOwnProperty("start") && req.query.hasOwnProperty("end")) {
            var start = moment(req.query.start, date_format).valueOf();
            var end = moment(req.query.end, date_format).valueOf();
        } else {
            var end = moment().valueOf();
            var start = moment().subtract(30, "days").valueOf();
        }
        start = util.toPRTimestamp(start);
        end = util.toPRTimestamp(end);

        if (start < minDate) {
            start = minDate;
        }
        if (end > maxDate) {
            end = maxDate;
        }
        fetch_stats(start, end, function(stats) {
            stats["start"] = moment(util.fromPRTimestamp(start)).format(date_format);
            stats["end"] = moment(util.fromPRTimestamp(end)).format(date_format);
            stats["minDate"] = moment(util.fromPRTimestamp(minDate)).valueOf();
            stats["maxDate"] = moment(util.fromPRTimestamp(maxDate)).valueOf();
            res.render("index", stats);
        });
    });

});
router.get("/details/:currentDay", function(req, res) {
    var currentDay = parseInt(req.params.currentDay);
    var nextDay = currentDay + 3600 * 24 * 1000;
    var start = util.toPRTimestamp(currentDay);
    var end = util.toPRTimestamp(nextDay);
    currentDay = moment(currentDay).format(date_format);

    firefox.getVisitDetails(start, end, function(visitDetails) {
        res.render("details", {
            currentDay: currentDay,
            visitDetails: JSON.stringify(visitDetails),
            browser: browser
        })
    });
});
