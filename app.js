

var mongoose = require('mongoose');
var express = require('express');
var app = express();

// to prevent irrelevant depreciation warning
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/funnywhere');

app.listen(3000, function () {
	console.log('listening on port 3000');
})

module.exports = app;