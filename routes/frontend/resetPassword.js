const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {Account} = require("../../models/accounts");
const Token = require("../../models/authToken");

router.get("/:userid/:token",async (req,res)=>{
    console.log("Hi");
    res.render("resetPassword",{userid:req.params.userid,token:req.params.token,msg:"",error1:"",error2:"",cond:false});
});

router.post("/:userid/:token",async (req,res)=>{
    try{
    const joiSchema = Joi.object({
        new: Joi.string().required(),
        confirm: Joi.ref("new")
    });
    const {error} = joiSchema.validate(req.body,{abortEarly:false});
    if (error){
        console.log(error.details); //show these error under the input elements
        let err = {new:"",confirm:""};
        for (const i of error.details){
            err[i.context.label] = i.message;
        }
        res.render("resetPassword",{error1:err.new,error2:err.confirm,userid:req.params.userid,token:req.params.token,msg:"",cond:false});
        return;
    }
    const user = await Token.findOne({accountID:req.params.userid});
    if(!user){
        res.render("resetPassword",{error1:"",error2:"",userid:req.params.userid,token:req.params.token,msg:"invalid link",cond:false});
        return;
    }
    const result = await bcrypt.compare(req.params.token, user.token);
    if (!result){
        res.render("resetPassword",{error1:"",error2:"",userid:req.params.userid,token:req.params.token,msg:"invalid link",cond:false});
        return;
    }
    let hash = await bcrypt.hash(req.body.new, Number(process.env.SALT));
    await Token.deleteOne({accountID: user.accountID});
    await Account.updateOne(
        { _id: req.params.userid},
        { $set: { password: hash } },
        { new: true }
      );
      res.render("resetPassword",{error1:"",error2:"",userid:req.params.userid,token:req.params.token,msg:"Password Updated Successfully",cond:true});
    }catch(error){
        res.redirect("/error");
    }
});

module.exports = router;