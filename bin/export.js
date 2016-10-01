#!/usr/bin/env node

var program = require("commander");
var exporter = require("../lib/exporter");
var db = require("../lib/db");
var os = require("os");

program
    .option("-f, --firefox <history file>", "The browsing history file for Firefox")
    .option("-c, --chrome <history file>", "The browsing history file for Chrome")
    .option("-o, --output <output dir>", "The output dir for csv files", os.homedir())
    .parse(process.argv);

db.initDB(program.firefox, program.chrome);
exporter.firefoxExport(program.output);
exporter.chromeExport(program.output);
