

var mongoose = require('mongoose');
var Video = require('./models/video.js');
var VideoCategory = require('./models/videoCategory.js');
var Article = require('./models/article.js');
var ArticleCategory = require('./models/articleCategory.js');
var Channel = require('./models/channel.js');

// to prevent irrelevant depreciation warning
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/funnywhere');

var articleText = '<h2>Bon article</h2><p>Avec du contenu aussi</p>';
var resChannels = {};
var resVideoCategories = {};
var resArticleCategories = {};

var channels = [
	{
		name: 'Ma Chaine de ouf',
		categories: ['gaming', 'tourism'],
		key: 'aaaaaa'
	},
	{
		name: 'Le foot c\'est cool',
		categories: ['tourism'],
		key: 'bbbbbb'
	},
	{
		name: 'Allez l\'OM',
		categories: ['documentary'],
		key: 'cccccc'
	}
];

var counter = 0;

var videos = {
	gaming: [
		{
			name: 'Video1 - Gaming',
			author: 'Author1',
			description: 'descr1',
			keywords: ['danse', 'emeraude'],
			key: 'aaaaaa',
			channel: channels[0].name
		},
		{
			name: 'Video2 - Gaming',
			author: 'Author2',
			description: 'descr2',
			keywords: ['foot', 'ruby'],
			key: 'bbbbbb',
			channel: channels[1].name
		},
		{
			name: 'Video3 - Gaming',
			author: 'Author3',
			description: 'descr3',
			keywords: ['danse', 'diamant'],
			key: 'cccccc',
			channel: channels[0].name
		},
		{
			name: 'Video4 - Gaming',
			author: 'Author4',
			description: 'descr4',
			keywords: ['danse', 'quartz'],
			key: 'dddddd',
			channel: channels[1].name
		}
	],
	documentary: [
		{
			name: 'Video5 - Documentary',
			author: 'Author5',
			description: 'descr5',
			keywords: ['foot', 'opale'],
			key: 'eeeeee',
			channel: channels[2].name
		},
		{
			name: 'Video6 - Documentary',
			author: 'Author6',
			description: 'descr6',
			keywords: ['philosophie', 'saphir'],
			key: 'ffffff',
			channel: channels[0].name
		}
	],
	tourism: [
		{
			name: 'Video7 - Tourism',
			author: 'Author7',
			description: 'descr7',
			keywords: ['calisse', 'agate'],
			key: 'gggggg',
			channel: channels[2].name
		},
		{
			name: 'Video8 - Tourism',
			author: 'Author8',
			description: 'descr8',
			keywords: ['char', 'jade'],
			key: 'hhhhhh',
			channel: channels[0].name
		},
		{
			name: 'Video9 - Tourism',
			author: 'Author9',
			description: 'descr9',
			keywords: ['animaux', 'ambre'],
			key: 'iiiiii',
			channel: channels[1].name
		}
	]
};

var articles = {
	news: [
		{
			name: 'Article1 - News',
			author: 'Author1',
			description: 'descr1',
			keywords: ['du brin', 'turquoise'],
			textContent: articleText,
			key: 'jjjjjj'
		},
		{
			name: 'Article2 - News',
			author: 'Author2',
			description: 'descr2',
			keywords: ['ectoplasme', 'topaze'],
			textContent: articleText,
			key: 'kkkkkk'
		}
	],
	science: [
		{
			name: 'Article3 - Science',
			author: 'Author3',
			description: 'descr3',
			keywords: ['foot', 'morganite'],
			textContent: articleText,
			key: 'llllll'
		},
		{
			name: 'Article4 - Science',
			author: 'Author4',
			description: 'descr4',
			keywords: ['games', 'grenat'],
			textContent: articleText,
			key: 'mmmmmm'
		},
		{
			name: 'Article5 - Science',
			author: 'Author5',
			description: 'descr5',
			keywords: ['danse', 'nacre'],
			textContent: articleText,
			key: 'nnnnnn'
		},
	]
}

var totArticlesAndVideos = 0;
for (var cat in videos) {
	totArticlesAndVideos += videos[cat].length;
}
for (var cat in articles) {
	totArticlesAndVideos += articles[cat].length;
}

function populateArticles() {
	for (var cat in articles) {
		for (var i = 0; i < articles[cat].length; i++) {
			var article = articles[cat][i];
			var obj = {};
			obj.content = {};
			obj.extra = {};
			obj.content.name = article.name;
			obj.content.author = article.author;
			obj.content.description = article.description;
			obj.content.categories = [resArticleCategories[cat]];
			obj.content.keywords = article.keywords;
			obj.content.key = article.key;
			obj.textContent = article.textContent;
			obj = new Article(obj);
			obj.save(function(err, doc) {
				counter += 1;
				if (counter == totArticlesAndVideos)
					mongoose.disconnect();
			});
		}
	}
}

function populateVideos() {
	for (var cat in videos) {
		for (var i = 0; i < videos[cat].length; i++) {
			var video = videos[cat][i];
			var obj = {};
			obj.content = {};
			obj.extra = {};
			obj.content.name = video.name;
			obj.content.author = video.author;
			obj.content.description = video.description;
			obj.content.categories = [resVideoCategories[cat]];
			obj.content.keywords = video.keywords;
			obj.content.key = video.key;
			obj.extra.channel = resChannels[video.channel];
			obj = new Video(obj);
			obj.save(function(err, doc) {
				counter += 1;
				if (counter == totArticlesAndVideos)
					mongoose.disconnect();
			});
		}
	}
}

function populateChannels(channels) {
	if (channels.length == 0)
	{
		populateVideos();
		populateArticles();
		return ;
	}
	var obj = {};
	obj.name = channels[0].name;
	obj.categories = channels[0].categories.map(function(cat) { return resVideoCategories[cat] });
	obj.key = channels[0].key;
	obj = new Channel(obj);
	obj.save(function(err, doc) {
		resChannels[channels[0].name] = doc._id;
		populateChannels(channels.slice(1, channels.length));
	})
}

function populateArticleCategories(articleCats) {
	if (articleCats.length == 0)
		return populateChannels(channels);
	var obj = {};
	obj.name = articleCats[0];
	obj = new ArticleCategory(obj);
	obj.save(function(err, doc) {
		resArticleCategories[articleCats[0]] = doc._id;
		populateArticleCategories(articleCats.slice(1, articleCats.length));
	})
}

function populateVideoCategories(videoCats) {
	if (videoCats.length == 0)
		return populateArticleCategories(Object.keys(articles));
	var obj = {};
	obj.name = videoCats[0];
	obj = new VideoCategory(obj);
	obj.save(function(err, doc) {
		resVideoCategories[videoCats[0]] = doc._id;
		populateVideoCategories(videoCats.slice(1, videoCats.length));
	})
}

function populateDb() {
	populateVideoCategories(Object.keys(videos));
}

populateDb();