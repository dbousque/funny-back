

var VideoCategory = require('./models/videoCategory.js');
var ArticleCategory = require('./models/articleCategory.js');
var Video = require('./models/video.js');
var Article = require('./models/article.js');

var contentTypes = {
	video:		{cat: VideoCategory, content: Video},
	article:	{cat: ArticleCategory, content: Article}
};

function fatalError(err)
{
	throw err;
}

module.exports = {
	contentTypes:	contentTypes,
	fatalError:		fatalError
}