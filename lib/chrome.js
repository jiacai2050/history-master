var moment = require("moment");
var _ = require("underscore");
var util = require("./util");
var config = require("../config");

exports.countDailyVisits = function(start, end, cb) {
    var sql = [
        `select visit_day, count(1) as count`,
        `from (`,
        `    select round(visit_time/1000000/3600/24)*1000000*3600*24 as visit_day from visits`,
        `    where visits.visit_time between`,
        `    ${start} and ${end}`,
        `) group by visit_day`,
        `order by visit_day`
    ].join(" ");
    util.executeSQL(sql, function(rows) {
        var dailyVisits = _.map(rows, function(row) {
            return [util.fromWebkitTimestamp(row.visit_day), row.count];
        });
        cb(dailyVisits);
    });
}
exports.getVisitDetails = function(start, end, cb) {
    var sql = [
        `select visits.visit_time,urls.url,urls.title`,
        `from visits, urls`,
        `on visits.url = urls.id`,
        `where visits.visit_time between`,
        `${start} and ${end}`,
        `order by visit_time`
    ].join(" ");
    util.executeSQL(sql, function(rows) {
        var visitDetails = _.map(rows, function(row) {
            if (row.title.trim() == "") {
                if (row.url.length > 50) {
                    row.title = row.url.substring(0, 50);
                } else {
                    row.title = row.url;
                }
            }
            var visitTime = moment(util.fromWebkitTimestamp(row.visit_time)).format("YYYY-MM-DD HH:mm:ss");
            return [visitTime, row.url, row.title];
        });
        cb(visitDetails);
    });
}
exports.countURLsFrequence = function(start, end, cb) {
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
    util.executeSQL(sql, function(rows) {
        var URLsFrequence = _.map(rows, function(row) {
            return [_.escape(row.title), row.visit_count];
        });
        cb(URLsFrequence);
    });
}
