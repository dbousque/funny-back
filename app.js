

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

// to prevent irrelevant depreciation warning
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/funnywhere');

// support for json post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.listen(3000, function () {
	console.log('listening on port 3000');
})

module.exports = app;