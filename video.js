

var Video = require('./models/video.js');
var VideoCategory = require('./models/videoCategory.js');
var Channel = require('./models/channel.js');
var utils = require('./utils.js');
var log = require('./log.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var generateUniqueKey = utils.generateUniqueKey;
var allExistingIds = utils.allExistingIds;
var throwErrors = utils.throwErrors;
var retError = utils.retError;
var retOk = utils.retOk;
var retSendFile = utils.retSendFile;
var retErrorAndRemoveFiles = utils.retErrorAndRemoveFiles;
var moveFileAt = utils.moveFileAt;
var removeFile = utils.removeFile;
var validLanguageCode = utils.validLanguageCode;

function sendVideo(res, key) {
	Video.count({'content.key': key}, throwErrors(function(nb) {
		if (nb !== 1)
			return retError(res, 'invalid video key');
		retSendFile(res, 'content/videos/' + key, {root: __dirname});
	}));
}

function sendVideoThumbnail(res, key) {
	Video.count({'content.key': key}, throwErrors(function(nb) {
		if (nb !== 1)
			return retError(res, 'invalid video key');
		retSendFile(res, 'content/video_thumbnails/' + key, {root: __dirname});
	}));
}

function validAddVideoParams(params, cb) {
	allExistingIds(VideoCategory, params.categories, function(allExisting) {
		if (!allExisting)
			return cb(false, 'the id of a category sent is not valid');
		if (!validLanguageCode(params.lang))
			return cb(false, 'invalid language code : ' + params.lang);
		if (!('channel' in params))
			return cb(true, 'ok');
		Channel.findOne({_id: params.channel}, throwErrors(function(channel) {
			if (!channel)
				return cb(false, 'invalid channel');
			cb(true, 'ok');
		}));
	});
}

function videoFromParams(params) {
	var video = {};
	video.content = {};
	video.extra = {};
	video.content.name = params.name;
	video.content.author = params.author;
	video.content.description = params.description;
	video.content.categories = params.categories.map(function(cat) { return ObjectId(cat) });
	video.content.keywords = params.keywords;
	video.content.lang = params.lang;
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
	return video;
}

function saveVideoContentAndThumbail(res, video, key, files) {
	var video_dir = __dirname + '/content/videos';
	moveFileAt(files.video, video_dir, key, function(error, err) {
		if (error)
		{
			video.remove(throwErrors);
			return retBackErrorAndRemoveFiles(res, 'could not move video', files);
		}
		var thumbnail_dir = __dirname + '/content/video_thumbnails';
		moveFileAt(files.thumbnail, thumbnail_dir, key, function(error, err) {
			if (error)
			{
				removeFile(video_dir + '/' + key);
				video.remove(throwErrors);
				return retBackErrorAndRemoveFiles(res, 'could not move thumbnail', files);
			}
			retOk(res);
		});
	});
}

function addVideo(res, params, files) {
	validAddVideoParams(params, function(valid, msg) {
		if (!valid)
			return retErrorAndRemoveFiles(res, msg, files);
		var video = videoFromParams(params);
		generateUniqueKey(Video, 'content.key', function(key) {
			video.content.key = key;
			video = new Video(video);
			video.save(function(err) {
				if (err)
					return retErrorAndRemoveFiles(res, 'invalid parameters', files);
				saveVideoContentAndThumbail(res, video, key, files);
			})
		})
	});
}

function removeVideo(res, id) {
	Video.findOne({_id: id}, throwErrors(function(video) {
		if (!video)
			return retError(res, 'no such video');
		removeFile(__dirname + '/content/videos/' + video.content.key);
		removeFile(__dirname + '/content/video_thumbnails/' + video.content.key);
		video.remove(throwErrors);
		retOk(res);
	}))
}

module.exports = {
	sendVideo:			sendVideo,
	sendVideoThumbnail:	sendVideoThumbnail,
	addVideo:			addVideo,
	removeVideo:		removeVideo
}