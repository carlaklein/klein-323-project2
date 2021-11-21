var express = require("express");
var passport = require("passport");

var multer = require("multer");
var crypto = require("crypto");
var path = require("path");

var ensureAuthenticated = require("./auth/auth").ensureAuthenticated;

var User = require("./models/user");
var Post = require("./models/post");

var router = express.Router();

var storage = multer.diskStorage({
    destination: './uploads/images/',
    filename: function(req, file, cb){
        crypto.pseudoRandomBytes(16, function(err, raw){
            cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
        });
    }
});

var upload = multer({storage:storage});

router.use(function(req,res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");

    next();
});

router.get("/", function(req,res){
    res.render("index");
});

router.get("/posts/add", ensureAuthenticated, function(req, res){
    res.render("addpost");
});

router.post("/posts/add", upload.single('image'), ensureAuthenticated, function(req, res){
    var newPost = new Post({
        image: req.file.path,
        photo_caption:req.body.photo_caption,
        geolocation:req.body.geolocation,
        tags:req.body.tags,
        captured_date:req.body.captured_date,
        captured_by:req.body.captured_by,
        userID:req.user._id
    });

    newPost.save(function(err,post){
        if(err){console.log(err);}
        res.redirect("/posts");
    });
});

router.get("/home", ensureAuthenticated, function(req,res){
    res.render("home");
});

router.get("/posts", ensureAuthenticated, function(req,res){
    Post.find({userID:req.user._id}).exec(function(err, posts){
        if(err){console.log(err);}

        res.render("posts", {posts:posts})
    });
});

router.get("/posts/read/:postId", function(req, res){
    Post.findById(req.params.postId).exec(function(err, post){
        res.render("detailpost",{post:post});
    });
});

router.get("/posts/edit/:postId", function(req, res){
    Post.findById(req.params.postId).exec(function(err, post){
        res.render("editpost",{post:post});
    });
});

router.post("/posts/update", async function(req, res){
    const post = await Post.findById(req.body.postId);

    post.photo_caption = req.body.photo_caption;
    post.geolocation = req.body.geolocation;
    post.tags = req.body.tags;
    post.captured_by = req.body.captured_by;

    try {
        let savePost = awaitpost.save();
        console.log("savepost", savePost);
        res.redirect("/posts/" + req.body.postId);
    } catch (err) {
        console.log("An error occured. Please try again.");
        res.status(see).send(err);
    }
});

router.get("/login", function(req,res){
    res.render("login");
});

router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

router.post("/login", passport.authenticate("login", {
    successRedirect:"/home",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/signup", function(req,res){
    res.render("signup");
});

router.post("/signup", function(req,res,next){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email}, function(err, user){
        if(err){return next(err);}
        if(user){
            req.flash("error", "Email address already exists");
            return res.redirect("/signup");
        }

        var newUser = new User({
            username:username,
            password:password,
            email:email
        });

        newUser.save(next);
    });
}, passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect:"/signup",
    failureFlash:true
}));

module.exports = router;