var express = require("express");
var _  = require("underscore");
var chrome = require("../lib/chrome");
var router = module.exports = express.Router();

router.get("/", function(req, res) {
    chrome.countDailyVisits(function(dailyVisits) {
        chrome.countURLsFrequence(function(urlsFreq) {
            res.render("index", {
                dailyVisits: JSON.stringify(dailyVisits),
                urlsFreq:  JSON.stringify(urlsFreq)
            }); 
        });
    });
});