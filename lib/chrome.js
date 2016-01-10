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

exports.countDailyVisits = function(cb) {
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
            cb([]);
        } else {
            var dailyVisits = _.map(rows, function(row) {
                return [util.fromWebkitTimestamp(row.visit_day), row.count];
            });
            cb(dailyVisits);
        }
    })
}
exports.countURLsFrequence = function(cb) {
    var sql = [
        `select title, sum(urls.visit_count) as visit_count`,
        `from urls`,
        `where id in (`,
        `    select distinct(url) `,
        `    from visits`,
        `    where visit_time between`,
        `    ${start} and ${end}`,
        `)`,
        `and title != ''`,
        `group by title`,
        `order by visit_count desc`,
        `limit 100`
    ].join(" ");
    db.all(sql, function(err, rows) {
        if (err) {
            console.log(err);
            cb([]);
        } else {
            var URLsFrequence = _.map(rows, function(row) {
                return [row.title, row.visit_count];
            });
            cb(URLsFrequence);
        }
    });
}
