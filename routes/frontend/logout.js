const express = require("express");
const router = express.Router();

router.get("/",async (req,res)=>{
    try{
       await req.session.destroy();
       res.redirect("/login");
    }
    catch(error){
        res.redirect("/error");
    }
});

module.exports = router;