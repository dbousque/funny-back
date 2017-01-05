

var Channel = require('./models/channel.js');
var Video = require('./models/video.js');
var utils = require('./utils.js');

var throwErrors = utils.throwErrors;
var retError = utils.retError;
var retOk = utils.retOk;

function addChannel(res, name) {
	var channel = new Channel({name: name});
	channel.save(throwErrors);
	retOk(res);
}

function removeChannel(res, id, removeOwnedVideos) {
	Channel.findOne({_id: id}, throwErrors(function(channel) {
		if (!channel)
			return retError(res, 'no such channel');
		if (removeOwnedVideos === 'true')
			Video.find({'extra.channel': id}, throwErrors).remove(throwErrors);
		channel.remove();
		retOk(res);
	}));
}

module.exports = {
	addChannel:		addChannel,
	removeChannel:	removeChannel
}