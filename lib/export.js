#!/usr/bin/env node

var moment = require("moment");
var _ = require("underscore");
var util = require("./util");
var config = require("../config");
var path = require("path");
var fs = require("fs");
var os = require("os");

var script = process.argv[1];
var args = process.argv.slice(2);
var cmd = args.length == 0 ? "help" : args[0];

var start = moment(config["count_range"].start, "YYYY/MM/DD");
var end = moment(config["count_range"].end, "YYYY/MM/DD");

var exportDir = config.export_dir;
if (! fs.existsSync(exportDir) ) {
    exportDir = os.homedir();
}
function printHelp() {
    var helpArr = [
        `Usage: ` + script + ` <option>`,
        ``,
        `<option> can be:`,
        `chrome: export statistics of chrome to dir ${exportDir}`,
        `firefox: export statistics of firefox to dir ${exportDir}`
    ];
    console.log(helpArr.join("\n"));        
}
if (cmd === "help") {
    printHelp();
} else {
    if (cmd == "firefox") {
        start = util.toPRTimestamp(start.valueOf());
        end = util.toPRTimestamp(end.valueOf());
    } else if (cmd == "chrome") {
        start = util.toWebkitTimestamp(start.valueOf());
        end = util.toWebkitTimestamp(end.valueOf());
    } else {
        console.error(`Error option ${cmd} !`);
        printHelp();
        process.exit(1);
    }
    var tool = require(`./${cmd}`);
    tool.countDailyVisits(start, end, function(dailyVisits) {
        dailyVisits = _.map(dailyVisits, function(visit) {
            return [moment(visit[0]).format("YYYY/MM/DD"), visit[1]].join(",");
        }).join("\n");
        util.saveCSVFile(path.join(exportDir, `${cmd}_DailyVisits.csv`), dailyVisits);
    });
    tool.countURLsFrequence(start, end, function(URLsFreq) {
        URLsFreq = _.map(URLsFreq, function(urlFreq) {
            return [urlFreq[0], urlFreq[1]].join(",");
        }).join("\n");
        util.saveCSVFile(path.join(exportDir, `${cmd}_URLsFrequence.csv`), URLsFreq);
    });
}