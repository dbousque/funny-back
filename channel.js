

var Channel = require('./models/channel.js');
var Video = require('./models/video.js');
var utils = require('./utils.js');
var fs = require('fs');

var throwErrors = utils.throwErrors;
var retError = utils.retError;
var retOk = utils.retOk;

function sendChannelCover(res, channel_id) {
	var file = 'content/channels/' + channel_id;
	fs.stat(file, function(err, stat) {
		if (err)
			file = 'content/std_channel_cover';
		res.sendFile(file, {root: __dirname});
	});
}

function addChannel(res, req, name, hasCover) {
	var channel = new Channel({name: name});
	channel.save(throwErrors(function(channel) {
		if (!hasCover)
			return retOk(res);
		saveFileAt(req, '/content/channels', channel._id, function(error, err) {
			retOk(res);
		});
	}));
}

function removeChannelFromVideos(channel_id) {
	Video.update(
		{'extra.channel': channel_id},
		{$unset: {'extra.channel': 1 }},
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
				videos.remove(throwErrors);
			}));
		}
		else
			removeChannelFromVideos(id)
		channel.remove(throwErrors);
		retOk(res);
	}));
}

module.exports = {
	sendChannelCover:	sendChannelCover,
	addChannel:			addChannel,
	removeChannel:		removeChannel
}