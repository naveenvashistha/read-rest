const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author:{
        displayName: String,
        profileURL: String
    },
    scope: Boolean,
    postURL: String,
    published: {type: Date, default: Date.now},
    updated:{type: Date,default: Date.now},
    language: String,
    genre:[String],
    lettersCount: Number,
    wordsCount: Number,
    numbersCount: Number,
    percentCharCount: Number,
    dollarCharCount: Number
});


module.exports = mongoose.model("post",postSchema);