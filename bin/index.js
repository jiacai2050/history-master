#!/usr/bin/env node

var program = require("commander");

program
    .command("server", "start a server for browsing statistics of history file", {isDefault: true})
    .command("export", "export statistics of history file to csv documents")
    .parse(process.argv);
