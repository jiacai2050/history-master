#!/usr/bin/env node

var program = require("commander");

program
    .command("webserver", "start a webserver for browsing statistics of history file", {isDefault: true})
    .command("export", "export statistics of history file to csv documents")
    .parse(process.argv);
