var express 			= require("express"),
 	mongoose 			= require("mongoose"),
 	passport 			= require("passport"),
	LocalStrategy 		= require("passport-local"),
	methodOverride		= require("method-override"),
	bodyParser 			= require("body-parser"),
	flash				= require("connect-flash"),
	session				= require("express-session");

var campgroundRoutes 	= require("./routes/campground"),
	commentRoutes		= require("./routes/comment"),
	indexRoutes			= require("./routes/index");

var app = express();
var User = require('./models/user');

/*
Passport configuration
*/
app.use(session({
	secret: "geralt wolf witcher",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine","ejs");
app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

//Connect to yelp_camp database
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/camp_review");


app.listen(process.env.PORT || 3000, function()
{
	console.log("CampReview Server is running on Port 3000");
});