var express = require("express");
var router = express.Router();

var Comment 	= require('../models/comment'),
    Campground 	= require('../models/campground');
    middleware  = require('../middleware/index');

//Used to extract details of all campgrounds from the database and display them
router.get("/campgrounds",function(req,res)
{
	Campground.find({},function(err,foundCampground)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("campground/index",{campgrounds:foundCampground});
		}
	});
	
});


//Used to create new campground,store/push it to the database and then display all campgrounds
router.post("/campgrounds",middleware.isLoggedIn, function(req,res)
{
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };

	var newCampground = {name:name,price:price,image:image,description:desc,author:author};
	//campgrounds.push(newCampground);
	Campground.create(newCampground,function(err,newCampground)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			req.flash("success","Successfully added campground");
			res.redirect("/campgrounds");
		}
	})

	
});

router.get("/campgrounds/new",middleware.isLoggedIn, function(req,res)
{
	res.render("campground/new");
});

//Used to display deatils of clicked/selected campground
router.get("/campgrounds/:id",function(req,res)
{
	var campgroundId = req.params.id;
	Campground.findById(campgroundId).populate("comments").exec(function(err,foundCampground)
	{
		if(err)
		{
			console.log(err);
		}
		else
		{
			res.render("campground/show",{campground:foundCampground});
		}
	});
});

//Used to edit campground
router.get("/campgrounds/:id/edit",middleware.checkCampgroundPrivileges, function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
            res.render("campground/edit",{campground:foundCampground});
        });
});

//Used to handle logic regarding editing of campground
router.put("/campgrounds/:id",middleware.checkCampgroundPrivileges, function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err)
            res.redirect("/campgrounds")
        else
            res.redirect("/campgrounds/"+req.params.id);
    });
});

//Used to delete campground
router.delete("/campgrounds/:id",middleware.checkCampgroundPrivileges,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err)
            res.redirect("/campgrounds");
        else
            res.redirect("/campgrounds");
    });
});

module.exports = router;