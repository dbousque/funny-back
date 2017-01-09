

var VideoCategory = require('./models/videoCategory.js');
var ArticleCategory = require('./models/articleCategory.js');
var Video = require('./models/video.js');
var Article = require('./models/article.js');
var log = require('./log.js');

var contentTypes = {
	video:		{cat: VideoCategory, content: Video},
	article:	{cat: ArticleCategory, content: Article}
};

function recordErrorAndExit(err, type) {
	// ensure that we exit in all cases
	setTimeout(function() {
		process.exit(1);
	}, 3000);
	log.error(err, type, 2, function() {
		process.exit(1);
	});
}

function fatalError(err)
{
	recordErrorAndExit(err, 'expected_fatalerror');
}

process.on('uncaughtException', function(err) {
	console.log(err);
	recordErrorAndExit(err, 'unexpected_fatalerror');
});

module.exports = {
	contentTypes:		contentTypes,
	fatalError:			fatalError
}