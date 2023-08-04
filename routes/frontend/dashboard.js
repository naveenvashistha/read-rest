const express = require("express");
const router = express.Router();
const {decryptKey} = require("../../utils/apiKeySecurity");
const {Account}  = require("../../models/accounts");

router.get("/",async (req,res)=>{
    try{
    if(req.session.api){
        const user = await Account.findOne({_id:req.session.api});
        const apiKey = decryptKey(user.key);
        res.render("dashboard",{api_key:apiKey});
    }
    else{
        res.redirect("/signup?err=sign-in-required");
    }
}catch(error){
    console.log(error);
    res.redirect("/error");
}
});

module.exports = router;