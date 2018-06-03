var mongoose = require('mongoose');

//Define Campground Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
	image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//Create Campground collection (i.e. table)
var Campground = mongoose.model("Campground",campgroundSchema);

module.exports = Campground;