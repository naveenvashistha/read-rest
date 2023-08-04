const mongoose = require("mongoose");
const Joi = require("joi");

const accountInfoSchema = new mongoose.Schema({
    articlesCount:{type:Number, default:0},
    wordsCount:{type:Number, default:0},
    lettersCount:{type:Number, default:0},
    percentcharCount:{type:Number, default:0},
    dollarCharCount:{type:Number, default:0},
    publicArticlesCount:{type:Number,default:0},
    lastPublished:{type:Date,default:null},
    lastUpdated:{type:Date,default:null},
    posts:[String],
    genres:{type:mongoose.Schema.Types.Mixed,default:{}},
    languages:{type:mongoose.Schema.Types.Mixed,default:{}},
    profileURL:String,
    accountID:String
},{ minimize: false });

module.exports =  mongoose.model("accountInfo",accountInfoSchema);