

var Channel = require('./models/channel.js');
var Video = require('./models/video.js');
var VideoCategory = require('./models/videoCategory.js');
var utils = require('./utils.js');
var log = require('./log.js');
var fs = require('fs');

var throwErrors = utils.throwErrors;
var retError = utils.retError;
var retOk = utils.retOk;
var retSendFile = utils.retSendFile;
var allExistingIds = utils.allExistingIds;
var generateUniqueKey = utils.generateUniqueKey;
var moveFileAt = utils.moveFileAt;
var retBackErrorAndRemoveFiles = utils.retBackErrorAndRemoveFiles;

function sendChannelThumbnail(res, key) {
	var file = 'content/channel_thumbnails/' + key;
	fs.stat(file, function(err, stat) {
		if (err)
			file = 'content/std_channel_thumbnail';
		retSendFile(res, file, {root: __dirname});
	});
}

function addChannel(res, name, categories, files) {
	allExistingIds(VideoCategory, categories, function(allExisting) {
		if (!allExisting)
			return retError(res, 'the id of a category sent is not valid');
		generateUniqueKey(Channel, 'key', function(key) {
			var channel = {
				name:		name,
				categories:	categories,
				key:		key
			};
			channel = new Channel(channel);
			channel.save(throwErrors(function(channel) {
				if (files.thumbnail === undefined)
					return retOk(res);
				var channel_thumbnail_dir = __dirname + '/content/channel_thumbnails';
				moveFileAt(files.thumbnail, channel_thumbnail_dir, key, function(error, err) {
					if (error)
					{
						channel.remove(throwErrors);
						return retBackErrorAndRemoveFiles(res, 'could not move thumbnail', files);
					}
					retOk(res);
				});
			}));
		});
	});
}

function removeChannelFromVideos(channel_id) {
	Video.update(
		{'extra.channel': channel_id},
		{$unset: {'extra.channel': 1 }},
		{multi: true},
		throwErrors
	);
}

function removeChannel(res, id, removeOwnedVideos) {
	Channel.findOne({_id: id}, throwErrors(function(channel) {
		if (!channel)
			return retError(res, 'no such channel');
		if (removeOwnedVideos)
		{
			Video.find({'extra.channel': id}, throwErrors(function(videos) {
				videos.forEach(function(video) {
					log.error('SHOULD USE A COLLECTION .REMOVE FUNCTION (for videos, need to remove the files', 'dodoerror');
					video.remove(throwErrors);
				});
			}));
		}
		else
			removeChannelFromVideos(id)
		channel.remove(throwErrors);
		retOk(res);
	}));
}

module.exports = {
	sendChannelThumbnail:	sendChannelThumbnail,
	addChannel:			addChannel,
	removeChannel:		removeChannel
}