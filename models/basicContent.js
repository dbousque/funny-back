

var basicContent = {
	name:			{type: String, required: true},
	author:			{type: String, required: true},
	description:	{type: String, required: true},
	key:			{type: String, required: true}
};

var basicExtra = {
	releaseDate:	Date,
	note:			Double
}

module.exports = {content: basicContent, extra: basicExtra};