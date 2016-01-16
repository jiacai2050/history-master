var express = require("express");
var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var app = module.exports = express();

var files = fs.readdirSync(__dirname);

_.map(files, function(file) {
    if(/js$/.test(file) && ! /index/.test(file)) {
        var file = path.join(__dirname, file),
            router = "/" + path.basename(file, ".js");
        //console.log("add router: " + router);
        app.use(router, require(file));
    }
});