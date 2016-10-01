#!/usr/bin/env node

var program = require("commander");
var app = require("../app");
var path = require("path");
var fs = require("fs");


program
    .option("-f, --firefox <history file>", "The browsing history file for Firefox")
    .option("-c, --chrome <history file>", "The browsing history file for Chrome")
    .option("-p, --port <listen port>", "The port webserver listen on", 4455)
    .parse(process.argv);

// app.set('views', path.join(__dirname, 'views')); in app.js won't work without this chdir
// don't know why 
process.chdir(path.join(fs.realpathSync(__dirname), ".."));

app.start_server(program.firefox, program.chrome, program.port);
