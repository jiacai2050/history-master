var path = require("path");
var os = require("os");
var glob = require("glob");
var fs = require("fs-extra");
var _ = require("underscore");
var sqlite3 = require("sqlite3");
var colors = require("colors");
var config = require("../config");

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
function findChromeHistoryFile() {
    var historyFile = null;
    if(fs.existsSync(config.chrome_history_file)) {
        historyFile = config.chrome_history_file;
        console.log(`找到 Chrome 历史浏览文件：${historyFile}`.green);
    } else {
        if (profileLocations.chrome.hasOwnProperty(platform)) {
            if(fs.existsSync(profileLocations.chrome[platform])) {
                historyFile = profileLocations.chrome[platform];
                console.log(`找到 Chrome 历史浏览文件：${historyFile}`.green);
            } else {
                console.log("无法找到 Chrome 历史浏览文件，请在 config.json 中配置 chrome_history_file 参数指明要分析的文件".red);
            }    
        } else {
            console.log("无法获取系统具体信息，请配置 config.json 中的 chrome_history_file 指明要分析的文件".red);
        }
    }
    return historyFile;
}
function findFirefoxHistoryFile() {
    var historyFile = null;
    if(fs.existsSync(config.firefox_history_file)) {
        historyFile = config.firefox_history_file;
        console.log(`找到 Firefox 历史浏览文件：${historyFile}`.green);
    } else {
        if (profileLocations.firefox.hasOwnProperty(platform)) {
            var historyFiles = null;
            if ("win32" === platform) {
                historyFiles = glob.sync(profileLocations.firefox[platform][0]);
                if (historyFiles.length == 0) {
                    historyFiles = glob.sync(profileLocations.firefox[platform][1]);
                }
            } else {
                historyFiles = glob.sync(profileLocations.firefox[platform]);
            }
            if (historyFiles.length == 0) {
                console.log("无法找到 Firefox 历史浏览文件，请在 config.json 中配置 firefox_history_file 参数指明要分析的文件".red);
            } else if (historyFiles.length == 1) {
                historyFile = historyFiles[0];
                console.log(`找到 Firefox 历史浏览文件：${historyFile}`.green);
            } else if (historyFiles.length > 1) {
                console.log("找到多个 Firefox 历史浏览文件，请在 config.json 中配置 firefox_history_file 参数指明要分析的文件".yellow);
                console.log(historyFiles.join("\n"));
            }    
               
        } else {
            console.log("无法获取系统具体信息，请配置 config.json 中的 firefox_history_file 指明要分析的文件".red);
        }
    }
    return historyFile;
}
var chromeHistoryFile = findChromeHistoryFile()
var firefoxHistoryFile = findFirefoxHistoryFile();
var chromeDB = null;
var firefoxDB = null;
if (chromeHistoryFile) {
    var localHistoryFile = path.join(home, path.basename(chromeHistoryFile));
    fs.copySync(chromeHistoryFile, localHistoryFile);
    chromeDB = new sqlite3.Database(localHistoryFile, sqlite3.OPEN_READONLY);
    console.log(`Chrome 数据库初始化成功... 请访问 http://localhost:${config.port}/chrome`.green);
}
if (firefoxHistoryFile) {
    var localHistoryFile = path.join(home, path.basename(firefoxHistoryFile));
    fs.copySync(firefoxHistoryFile, localHistoryFile);
    firefoxDB = new sqlite3.Database(localHistoryFile, sqlite3.OPEN_READONLY);
    console.log(`Firefox 数据库初始化成功... 请访问 http://localhost:${config.port}/firefox`.green);
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
        console.log(`${dbType} 历史浏览文件没有在 config.json 中配置 ！！`.red)
        cb([]);
    }   
}