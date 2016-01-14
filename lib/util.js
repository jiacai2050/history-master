var moment = require('moment');
var fs = require("fs");
var sqlite3 = require("sqlite3");
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
exports.roundTimestampToDay = function(timestamp) {
    return Math.round(timestamp / 1000 / 3600) * 3600 * 1000;
}
exports.saveCSVFile = function(f, data) {
    console.log(`save to ${f} ...`);
    fs.open(f, "a", function(err, fd) {
        if (err) {
            new Error(`open ${f} error: ${err}`);
        } else {
            fs.write(fd, data, function(err, written, string) {
                console.log(`Good job ! Write ${written} bytes !`);
            })
        }
    });
}
var db = new sqlite3.Database(config["chrome_history_file"], sqlite3.OPEN_READONLY);

exports.executeSQL = function(sql, cb) {
    db.all(sql, function(err, rows) {
        if (err) {
            console.error(err)
            cb([]);
        } else {
            cb(rows);
        }
    });
}