

var Video = require('./models/video.js');
var VideoCategory = require('./models/videoCategory.js');
var Channel = require('./models/channel.js');
var utils = require('./utils.js');
var formidable = require('formidable');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var generateUniqueKey = utils.generateUniqueKey;
var allExistingIds = utils.allExistingIds;
var throwErrors = utils.throwErrors;
var retError = utils.retError;
var retOk = utils.retOk;
var saveFileAt = utils.saveFileAt;

function validAddVideoParams(params, cb)
{
	allExistingIds(VideoCategory, params.categories, function(allExisting) {
		if (!allExisting)
			return cb(false, 'the id of a category sent is not valid');
		if (!('channel' in params))
			return cb(true, 'ok');
		Channel.findOne({_id: params.channel}, throwErrors(function(channel) {
			if (!channel)
				return cb(false, 'invalid channel');
			cb(true, 'ok');
		}));
	});
}

function addVideo(req, res, params)
{
	validAddVideoParams(params, function(valid, msg) {
		if (!valid)
			return retError(res, msg);
		var video = {};
		video.content = {};
		video.extra = {};
		video.content.name = params.name;
		video.content.author = params.author;
		video.content.description = params.description;
		video.content.categories = params.categories.map(function(cat) { return ObjectId(cat) });
		video.content.keywords = params.keywords;
		if ('releaseDate' in params)
			video.extra.releaseDate = params.releaseDate;
		if ('note' in params)
			video.extra.note = params.note;
		if ('director' in params)
			video.extra.director = params.director;
		if ('studio' in params)
			video.extra.studio = params.studio;
		if ('channel' in params)
			video.extra.channel = ObjectId(params.channel);
		generateUniqueKey(Video, 'content.key', function(key) {
			video.content.key = key;
			video = new Video(video);
			video.save(function(err) {
				if (err)
					return retError(res, 'invalid parameters');
				saveFileAt(req, '/content/videos', key, function() {
					retOk(res);
				});
			})
		})
	});
}

function removeVideo(res, id)
{
	Video.findOne({_id: id}, throwErrors(function(video) {
		if (!video)
			return retError(res, 'no such video');
		video.remove();
		retOk(res);
	}))
}

function findByCategory(res, category) {
	VideoCategory.count({_id: category}, throwErrors(function(count) {
		if (count != 1)
			return retError(res, 'unknown category');
		Video.find({'content.categories': category}, throwErrors(function(videos) {
			var toSend = videos.map(Video.toFrontFormat);
			res.send(JSON.stringify(toSend));
		}));
	}));
}

function findByChannel(res, channel) {
	Channel.count({_id: channel}, throwErrors(function(count) {
		if (count != 1)
			return retError(res, 'unknown channel');
		Video.find({'extra.channel': channel}, throwErrors(function(videos) {
			var toSend = videos.map(Video.toFrontFormat);
			res.send(JSON.stringify(toSend));
		}));
	}));
}

module.exports = {
	addVideo:		addVideo,
	removeVideo:	removeVideo,
	findByCategory:	findByCategory,
	findByChannel:	findByChannel
}