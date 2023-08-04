const {Account,signupValidate} = require("../../models/accounts");
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const router = express.Router();
const {encryptKey} = require("../../utils/apiKeySecurity");
const AccountInfo = require("../../models/accountInfo");
const mongoose = require("mongoose");

router.get("/",(req,res)=>{
    if(req.query.err){
        res.render("signup",{error1:req.query.err,error2:"",error3:"",email:"",name:""});
        return;
    }
    res.render("signup",{error1:"",error2:"",error3:"",email:"",name:""});
});

router.post("/",async (req,res)=>{
    try{
        const session = await mongoose.connection.startSession();
        const {error} = signupValidate(req.body);
        if (error){
            console.log(error.details); //show these error under the input elements
            let err = {name:"",email:"",password:""};
            for (const i of error.details){
                err[i.context.label] = i.message;
            }
            res.render("signup.ejs",{error1:err.name,error2:err.email,error3:err.password,email:req.body.email,name:req.body.name});
            return;
        }
        let user = await Account.findOne({ email: req.body.email.toLowerCase() });
        if (user){
            console.log(user); //show user exist under the input
            res.render("signup.ejs",{error1:"",error2:"Already Registered User",error3:"",email:req.body.email,name:req.body.name});
            return;
        }
        let name = await Account.findOne({ name: req.body.name.toLowerCase() });
        if (name){
            console.log(name); //show name exist under the input, provide unique name
            res.render("signup.ejs",{error1:"provide unique name",error2:"",error3:"",email:req.body.email,name:req.body.name});
            return;        
        }
        const password = await bcrypt.hash(req.body.password, Number(process.env.SALT));
        const account  = await new Account({
            name: req.body.name.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: password,
        });
        const rawKey = crypto.randomBytes(8).toString("hex")+account._id;
        account.key = encryptKey(rawKey);
        try{
            session.startTransaction();
            await account.save({session});
            await new AccountInfo({
                accountID: account._id,
                profileURL:`${proess.env.BASE_URL}api/author?filter="accountID=${account._id}"`
            }).save({session});
            await session.commitTransaction();
            req.session.api = account._id;
            res.redirect("/dashboard");
        }catch(error){
            console.log(error);
            await session.abortTransaction();
            throw error;
        }
        session.endSession();
    }catch(error){
        console.log(error);
        res.redirect("/error");
    }
});

module.exports = router;