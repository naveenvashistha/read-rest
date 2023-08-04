const express = require("express");
const Joi = require("joi");
const {Account} = require("../../models/accounts");
const router = express.Router();
const crypto = require("crypto");
const {encryptKey} = require("../../utils/apiKeySecurity");

router.get("/onboarding",async (req,res)=>{
    try{
       if(req.session.email){
        res.render("onboarding",{name:"",error1:""});
        return;
       }
       throw new Error("invalid url");
    }
    catch(error){
        res.redirect("/error");
    }
});

router.post("/onboarding", async (req,res)=>{
    try {
        if(req.session.email){
            const joiSchema = Joi.object({name: Joi.string().required()});
            const {error} = joiSchema.validate(req.body,{abortEarly:false});
            if (error){
                res.render("onboarding",{name:req.body.name,error1:error.details[0].message});
                return;
            }
            let name = await Account.findOne({ name: req.body.name.toLowerCase() });
            if (name){
                res.render("onboarding",{error1:"provide unique name",name:req.body.name});
                return;        
            }
            let userEmail = await Account.findOne({ email: req.session.email.toLowerCase() });
            if (userEmail){
                res.render("onboarding",{error1:"email already exist",name:req.body.name});
                return;        
            }
            const account  = await new Account({
                name: req.body.name.toLowerCase(),
                email:req.session.email.toLowerCase(),
                password:""
            });
            const rawKey = crypto.randomBytes(8).toString("hex")+account._id;
            account.key = encryptKey(rawKey);
            await account.save();
            req.session.api = account._id;
            req.session.email = null;
            res.redirect("/dashboard");
            return;
        }
        throw new Error("invalid url");
    } catch (error) {
        res.redirect("/error");
    }
});

module.exports = router;