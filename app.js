var express = require("express");
var path = require("path");
var util = require("./lib/util");
var db = require("./lib/db");


exports.start_server = function(firefox_history, chrome_history, port) {
    var app = express();

    app.use(express.static("./assets"));
    app.set("view engine", "ejs");
    app.set('views', path.join(__dirname, 'views'));

    app.use(require("./routes"));
    app.get("/", function(req, res) {
        res.redirect("/chrome");
    });

    util.initConf();
    db.initDB(firefox_history, chrome_history);
    app.listen(port, function() {
        console.log("Listening on port %d...", port);
    });
}

if (require.main === module) {  // called directly
    exports.start_server(null, null, 4455);
}
