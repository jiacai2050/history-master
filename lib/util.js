var moment = require('moment');
var fs = require("fs");
var sqlite3 = require("sqlite3");
var fs = require("fs");
var config = require("../config");

// https://digital-forensics.sans.org/blog/2010/01/21/google-chrome-forensics/
var webkitEpoch = moment("1601-01-01 00:00:00 +0000", "YYYY-MM-DD HH:mm:ss Z");
var unixEpoch = moment("1970-01-01 00:00:00 +0000", "YYYY-MM-DD HH:mm:ss Z");

var diff = unixEpoch.diff(webkitEpoch);

exports.toWebkitTimestamp = function(unixTimestamp) {
    // return microseconds
    return (unixTimestamp + diff) * 1000;
}
exports.fromWebkitTimestamp = function(webkitTimestamp) {
    return Math.round(webkitTimestamp/1000-diff);
}
// Mozilla Firefox places.sqlite use PRTime
// https://developer.mozilla.org/en-US/docs/Mozilla/Projects/NSPR/Reference/PRTime
exports.toPRTimestamp = function(unixTimestamp) {
    // return microseconds
    return unixTimestamp * 1000;
}
exports.fromPRTimestamp = function(PRTimestamp) {
    return Math.round(PRTimestamp/1000);
}
exports.roundTimestampToDay = function(timestamp) {
    return Math.round(timestamp / 1000 / 3600) * 3600 * 1000;
}
exports.saveCSVFile = function(f, data) {
    console.log(`start writing ${f} ...`);
    fs.open(f, "a", function(err, fd) {
        if (err) {
            new Error(`open ${f} error: ${err}`);
        } else {
            fs.write(fd, data, function(err, written, string) {
                console.log(`Good job ! Write ${written} bytes to ${f}`);
            })
        }
    });
}

var chromeDB = null;
if (fs.existsSync(config["chrome_history_file"])) {
    console.log(`init chrome db successfully... visit http://localhost:${config.port}/chrome`);
    chromeDB = new sqlite3.Database(config["chrome_history_file"], sqlite3.OPEN_READONLY);    
} else {
    console.log(`chrome_history_file isn't set properly`);
}
var firefoxDB = null;
if (fs.existsSync(config["firefox_history_file"])) {
    console.log(`init firefox db successfully... visit http://localhost:${config.port}/firefox`);
    firefoxDB = new sqlite3.Database(config["firefox_history_file"], sqlite3.OPEN_READONLY);
} else {
    console.log(`firefox_history_file isn't set properly`);
}

exports.executeSQL = function(dbType, sql, cb) {    
    var db = {
        "Chrome": chromeDB,
        "Firefox": firefoxDB
    }[dbType];
    if (db) {
        db.all(sql, function(err, rows) {
            if (err) {
                console.error(err)
                cb([]);
            } else {
                cb(rows);
            }
        })
    } else {
        console.log(`${dbType} hisotry file isn't set.`)
        cb([]);
    }
    
}