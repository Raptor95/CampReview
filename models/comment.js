var mongoose = require('mongoose');

//Define Comment Schema
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

//Create Comment collection (i.e. table)
var Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;