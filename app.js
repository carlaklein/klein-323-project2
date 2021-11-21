var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var passport = require("passport");
var session = require("express-session");
var flash = require("connect-flash");
var params = require("./params/params");

var setUpPassport = require("./setuppassport");
var routes = require("./routes");
var postes = require("./models/post");

var app = express();
mongoose.connect(params.DATABASECONNECTION);
setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"noodle",
    resave:false,
    saveUninitialized:false
}));

app.use("/uploads", express.static(path.resolve(__dirname, 'uploads')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(routes);

app.listen(app.get("port"),function(){
    console.log("Server started on port " + app.get("port"));
});