var express = require("express");
var _  = require("underscore");
var moment = require("moment");
var firefox = require("../lib/firefox");
var util = require("../lib/util");
var config = require("../config");
var router = module.exports = express.Router();

var browser = "Firefox";
router.get("/", function(req, res) {
    var start = moment(config["count_range"].start, "YYYY/MM/DD");
    var end = moment(config["count_range"].end, "YYYY/MM/DD");
    start = util.toPRTimestamp(start.valueOf());
    end = util.toPRTimestamp(end.valueOf());

    firefox.countDailyVisits(start, end, function(dailyVisits) {
        firefox.countURLsFrequence(start, end, function(urlsFreq) {
            res.render("index", {
                dailyVisits: JSON.stringify(dailyVisits),
                urlsFreq:  JSON.stringify(urlsFreq),
                browser: browser
            }); 
        });
    });
});
router.get("/details/:currentDay", function(req, res) {
    var currentDay = parseInt(req.params.currentDay);
    var nextDay = currentDay + 3600 * 24 * 1000;
    var start = util.toPRTimestamp(currentDay);
    var end = util.toPRTimestamp(nextDay);
    currentDay = moment(currentDay).format("YYYY-MM-DD");
    
    firefox.getVisitDetails(start, end, function(visitDetails) {
        res.render("details", {
            currentDay: currentDay,
            visitDetails: JSON.stringify(visitDetails),
            browser: browser
        })
    });
});