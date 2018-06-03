var express = require("express");
var router = express.Router();

var Comment 	= require('../models/comment'),
    Campground 	= require('../models/campground');
    middleware  = require('../middleware/index');

//Add new comment route
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn,function(req,res){
	
	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
			console.log(err);
		else
			res.render("comment/new",{campground:foundCampground});
	});	
});

//Handle logic related to adding new comment
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req,res){

	Campground.findById(req.params.id,function(err,foundCampground){
		if(err)
		{
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			Comment.create(req.body.comment,function(err,createdComment){
				if(err){
                    req.flash("error","Something went wrong");
                    console.log(err);
                }
				else
				{
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
					foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    req.flash("success","Successfully added comment");
					res.redirect("/campgrounds/"+foundCampground._id);
				}
			});
		}
			
	});
	
});

//Edit comment route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentPrivileges,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id,function(err,foundComment){
                res.render("comment/edit",{campground: foundCampground,comment: foundComment});
            });
        }
    });
});

//Handle logic related to updating comment
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentPrivileges,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err)
            res.redirect("back");
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//Delete comment route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentPrivileges,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
            res.redirect("back");
        else{
            req.flash("success","Comment deleted");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;