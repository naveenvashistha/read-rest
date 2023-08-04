const mongoose = require("mongoose");
const Joi = require("joi");

const accountSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    key: String,
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
    profileURL:String
},{ minimize: false });

const Account = mongoose.model("accounts",accountSchema);

const signupValidate = (user)=>{
    const joiSchema = Joi.object({name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()});

    return joiSchema.validate(user,{abortEarly:false});
}

const loginValidate = (user)=>{
    const joiSchema = Joi.object({name: Joi.string().required(),
    password: Joi.string().required()});

    return joiSchema.validate(user,{abortEarly:false});
}

module.exports = {Account, signupValidate, loginValidate};