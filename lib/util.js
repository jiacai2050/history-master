var moment = require("moment");
var fs = require("fs");
var os = require("os");
var path = require("path");
var _ = require("underscore");
var isThere = require("is-there");


// https://digital-forensics.sans.org/blog/2010/01/21/google-chrome-forensics/
var webkitEpoch = moment("1601-01-01 00:00:00 +0000", "YYYY-MM-DD HH:mm:ss Z");
var unixEpoch = moment("1970-01-01 00:00:00 +0000", "YYYY-MM-DD HH:mm:ss Z");

var diff = unixEpoch.diff(webkitEpoch);

exports.toWebkitTimestamp = function(unixTimestamp) {
    // return in microseconds (μs)
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
                console.log(`Good job! Write ${written} bytes to ${f}`);
            })
        }
    });
}

exports.purify_title = function(title) {
    return _.escape(title).replace(/'/g, "");
}
exports.get_conf_dir = function() {
    return path.join(os.homedir(), ".better_history");
}
exports.initConf = function() {
    var conf_dir = exports.get_conf_dir();
    if(! isThere(conf_dir) ) {
        fs.mkdirSync(conf_dir);
    }
}
