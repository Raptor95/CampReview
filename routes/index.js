var express     = require("express"),
    passport    = require("passport"),
    router      = express.Router();

var User		= require('../models/user');

router.get("/",function(req,res)
{
	res.render("auth/landing");
});

//Show Register form
router.get("/register",function(req,res){
	res.render("auth/register");
});

//Handle Sign up logic
router.post("/register",function(req,res){

	var newUser = new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
		{
			req.flash("error",err.message);
			res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Welcome to CampReview "+ user.username);
			res.redirect("/campgrounds");
		});
	});
});

//Show Login form
router.get("/login",function(req,res){
	res.render("auth/login");
});

//Handle login logic
router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
	failureFlash: "Invalid username or password"
}), function(req,res){

});

//Handle logout logic
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Successfully logged out!");
	res.redirect("/campgrounds");
});

module.exports = router;