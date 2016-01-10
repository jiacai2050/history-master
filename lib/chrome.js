var sqlite3 = require("sqlite3");
var moment = require("moment");
var _ = require("underscore");
var util = require("./util");
var config = require("../config");

var db = new sqlite3.Database(config["chrome_history_file"], sqlite3.OPEN_READONLY);

var start = moment(config["count_range"].start, "YYYY/MM/DD");
var end = moment(config["count_range"].end, "YYYY/MM/DD");
start = util.toWebkitTimestamp(start.valueOf());
end = util.toWebkitTimestamp(end.valueOf());

exports.countDailyUsage = function() {
    var sql = [
        `select visit_day, count(1) as count`,
        `from (`,
        `    select round(visit_time/1000000/3600/24)*1000000*3600*24 as visit_day from visits`,
        `    where visits.visit_time between`,
        `    ${start} and ${end}`,
        `) group by visit_day`,
        `order by visit_day`
    ].join(" ");
    db.all(sql, function(err, rows) {
        if (err) {
            console.error(err)
        } else {
            var dailyUsage = _.map(rows, function(row) {
                return [moment(util.fromWebkitTimestamp(row.visit_day)).format("YYYY/MM/DD"),
                        row.count].join(",");
            }).join("\n");
            util.saveCSVFile(config.export_file.countDailyUsage, dailyUsage);
        }
        db.close();
    })
}
exports.countUrlsFrequence = function() {
    var sql = [
        `select urls.url, urls.title, urls.visit_count`,
        `from urls`,
        `where urls.id in (`,
        `select distinct(url) from visits`,
        `where visits.visit_time between `,
        `${start} and ${end}`,
        `) order by urls.visit_count desc `,
    ].join(" ");
    db.all(sql, function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            var URLsFrequence = _.map(rows, function(row) {
                return [row.url, row.title, row.visit_count].join(",")
            }).join("\n");
            util.saveCSVFile(config.export_file.countURLsFrequence, URLsFrequence);
        }
        db.close();
    });
}
