const express = require("express");
const {Account,loginValidate} = require("../../models/accounts");
const bcrypt = require("bcrypt");
const findUser = require("../../utils/findUser");
const router = express.Router();

router.get("/",async (req,res)=>{
    res.render("login",{error1:"",error3:"",name:""});
});

router.post("/",async (req,res)=>{
    try{
        const {error} = loginValidate(req.body);
        if (error){
            console.log(error.details); //show these error under the input elements
            let err = {name:"",password:""};
            for (const i of error.details){
                err[i.context.label] = i.message;
            }
            res.render("login.ejs",{error1:err.name,error3:err.password,name:req.body.name});
            return;
        }
        let user1 = await Account.findOne({ name: req.body.name.toLowerCase() });
        let user2 = await Account.findOne({ email: req.body.name.toLowerCase() });
        if (!user1 && !user2){
            res.render("login.ejs",{error1:"Username/password is wrong",error3:"",name:req.body.name});
            return;
        }
        let user = findUser(user1,user2);
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result){
            res.render("login.ejs",{error1:"Username/password is wrong",error3:"",name:req.body.name});
            return;
        }
        req.session.api = user._id;
        res.redirect("/dashboard");
    }catch(error){
        console.log(error);
        res.redirect("/error");
    }
});

module.exports = router;