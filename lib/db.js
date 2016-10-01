var path = require("path");
var os = require("os");
var glob = require("glob");
var fs = require("fs-extra");
var _ = require("underscore");
var sqlite3 = require("sqlite3");
var colors = require("colors");
var util = require("./util");
var isThere = require("is-there");

var chromeDB = null;
var firefoxDB = null;

var home = os.homedir();
var platform = os.platform();

var profileLocations = {
    "chrome": {
        "linux":  path.join(home, "/.config/google-chrome/Default/History"),
        "darwin": path.join(home, "/Library/Application Support/Google/Chrome/Default/History"),
        "win32": [path.join(home, "/Local Settings/Application Data/Google/Chrome/User Data/Default/History"),
                  path.join(home, "/AppData/Local/Google/Chrome/User Data/Default/History")]
    },
    "firefox": {
        "linux": path.join(home, ".mozilla/firefox/*.default/places.sqlite"),
        "darwin": path.join(home, "/Library/Application Support/Firefox/Profiles/*.default/places.sqlite"),
        "win32": [path.join(home, "/Application Data/Mozilla/Firefox/Profiles/*.default/places.sqlite"),
                  path.join(home, "/AppData/Roaming/Mozilla/Firefox/Profiles/*.default/places.sqlite")]
    }
}
function findChromeHistoryFile(historyFile) {
    if(isThere(historyFile)) {
        console.log(`Find Chrome browsing history file: ${historyFile}`.green);
    } else {
        if (profileLocations.chrome.hasOwnProperty(platform)) {
            if(fs.existsSync(profileLocations.chrome[platform])) {
                historyFile = profileLocations.chrome[platform];
                console.log(`Find Chrome browsing history file: ${historyFile}`.green);
            } else {
                console.log(`Ooops! Can't find Chrome browsing history file, please configure it manually`.red);
            }
        } else {
            console.log(`Ooops! Can't find Chrome browsing history file, please configure it manually`.red);
        }
    }
    return historyFile;
}
function findFirefoxHistoryFile(historyFile) {
    if(isThere(historyFile)) {
        console.log(`Find Firefox browsing history file: ${historyFile}`.green);
    } else {
        if (profileLocations.firefox.hasOwnProperty(platform)) {
            if ("win32" === platform) {
                historyFiles = glob.sync(profileLocations.firefox[platform][0]);
                if (historyFiles.length == 0) {
                    historyFiles = glob.sync(profileLocations.firefox[platform][1]);
                }
            } else {
                historyFiles = glob.sync(profileLocations.firefox[platform]);
            }
            if (historyFiles.length == 0) {
                console.log("Ooops! Can't find Firefox browsing history file, please configure it manually".red);
            } else if (historyFiles.length == 1) {
                historyFile = historyFiles[0];
                console.log(`Find Firefox browsing history file: ${historyFile}`.green);
            } else if (historyFiles.length > 1) {
                console.log("Find multiple Firefox browsing history file, Please configure it in manually".yellow);
                console.log(historyFiles.join("\n").green);
            }
        } else {
            console.log("Ooops! Can't find Firefox browsing history file, please configure it manually".red);
        }
    }
    return historyFile;
}

exports.initDB = function(firefoxHistoryFile, chromeHistoryFile) {
    var config_dir = util.get_conf_dir();
    chromeHistoryFile = findChromeHistoryFile(chromeHistoryFile);
    firefoxHistoryFile = findFirefoxHistoryFile(firefoxHistoryFile);
    if (chromeHistoryFile) {
        var localHistoryFile = path.join(config_dir, path.basename(chromeHistoryFile));
        fs.copySync(chromeHistoryFile, localHistoryFile);
        chromeDB = new sqlite3.Database(localHistoryFile, sqlite3.OPEN_READONLY);
        console.log("Load Chrome history successfully....".green);
    }
    if (firefoxHistoryFile) {
        var localHistoryFile = path.join(config_dir, path.basename(firefoxHistoryFile));
        fs.copySync(firefoxHistoryFile, localHistoryFile);
        firefoxDB = new sqlite3.Database(localHistoryFile, sqlite3.OPEN_READONLY);
        console.log("Load Firefox history successfully....".green);
    }
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
        console.log(`Ooops! Can't find ${dbType} browsing history file, please configure it in manually.`.red);
        cb([]);
    }
}
