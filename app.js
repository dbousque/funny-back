

var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var express = require('express');
var log = require('./log.js');
var app = express();
var session = require('express-session');

// to prevent irrelevant depreciation warning
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/funnywhere');

// support for json post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// authorize cros
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(session({
	secret: '2C44-4D44-WppQ38S',
	resave: true,
	saveUninitialized: true
}));

var server = app.listen(3000, function () {
	log.log('listening on port 3000');
});

module.exports = {
	app:	app,
	server:	server
}