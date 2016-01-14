var express = require("express");
var _  = require("underscore");
var moment = require("moment");
var chrome = require("../lib/chrome");
var util = require("../lib/util");
var config = require("../config");
var router = module.exports = express.Router();

router.get("/", function(req, res) {
    var start = moment(config["count_range"].start, "YYYY/MM/DD");
    var end = moment(config["count_range"].end, "YYYY/MM/DD");
    start = util.toWebkitTimestamp(start.valueOf());
    end = util.toWebkitTimestamp(end.valueOf());

    chrome.countDailyVisits(start, end, function(dailyVisits) {
        chrome.countURLsFrequence(start, end, function(urlsFreq) {
            res.render("chrome/index", {
                dailyVisits: JSON.stringify(dailyVisits),
                urlsFreq:  JSON.stringify(urlsFreq)
            }); 
        });
    });
});
router.get("/details/:currentDay", function(req, res) {
    var currentDay = parseInt(req.params.currentDay);
    var nextDay = currentDay + 3600 * 24 * 1000;
    var start = util.toWebkitTimestamp(currentDay);
    var end = util.toWebkitTimestamp(nextDay);
    var title = moment(currentDay).format("YYYY-MM-DD");
    
    chrome.getVisitDetails(start, end, function(visitDetails) {
        res.render("chrome/details", {
            title: title,
            visitDetails: JSON.stringify(visitDetails)
        })
    });
});