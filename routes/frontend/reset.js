const {Account} = require("../../models/accounts");
const Token = require("../../models/authToken");
const sendEmail = require("../../utils/email");
const express = require("express");
const Joi = require("joi");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/",async (req,res)=>{
    res.render("reset",{email:"",error2:"",msg:""});
});

router.post("/",async (req,res)=>{
   try{
    const joiSchema = Joi.object({email: Joi.string().email().required()});
    const {error} = joiSchema.validate(req.body,{abortEarly:false});
    if (error){
        res.render("reset",{email:req.body.email,error2:error.details[0].message,msg:""});
        return;
    }
    const emailFound = await Account.findOne({ email: req.body.email.toLowerCase() });
    if (!emailFound){
        res.render("reset",{email:req.body.email,error2:"Wrong Email",msg:""});
        return;
    }
    let userToken = await Token.findOne({accountID:emailFound._id});
    if (userToken){
        await Token.deleteOne({accountID:emailFound._id});
    }
    let token = crypto.randomBytes(32).toString("hex");
    let hashedToken = await bcrypt.hash(token, Number(process.env.SALT));
    userToken = await new Token({
        accountID: emailFound._id,
        token: hashedToken
    }).save();
    const link = `${process.env.BASE_URL}reset-password/${userToken.accountID}/${token}`;
    const payload = {link:link,name:emailFound.name};
    const sent = await sendEmail(req.body.email.toLowerCase(),payload);
    console.log(sent);
    if(!sent){
        res.render("reset",{msg:"Error at sending email",email:"",error2:""});
        return;
    }
    res.render("reset",{msg:"Password reset email sent successfully",email:"",error2:""});
}catch(error){
    res.redirect("/error");
}
});

module.exports = router;