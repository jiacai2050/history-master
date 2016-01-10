#!/usr/bin/env node

var script = process.argv[1];
var args = process.argv.slice(2);
var cmd = args.length == 0 ? "help" : args[0];

var chrome = require("./lib/chrome");

switch(cmd) {
    case "day": 
        chrome.countDailyUsage();
        break;
    case "mfv": 
        chrome.countUrlsFrequence();
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
