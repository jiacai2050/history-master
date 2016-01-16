var express = require('express');
var path = require('path');

var app = express();
var config = require('./config');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));
app.use(require('./routes'));
app.get("/", function(req, res) {
    res.redirect("/chrome");
});

var server = app.listen(config.port, function() {
    console.log('Listening on port %d...', server.address().port);
});
