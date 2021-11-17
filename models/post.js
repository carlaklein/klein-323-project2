var mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    image: {type:mongoose.Schema.Types.ObjectId, required:false, unique:false},
    photo_caption: {type: String, required:true},
    geolocation: {type:String, required: true},
    tags: {type:String, required: true},
    captured_date: {type:Date, default:Date.now},
    captured_by: {type:String, required:true},
    userID: {type:mongoose.Schema.Types.ObjectId,  required:false, unique:false}
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;