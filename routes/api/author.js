const express = require("express");
const router = express.Router();
const {Account} = require("../../models/accounts");
const Post = require("../../models/post");

router.get("/author",async (req,res)=>{
    if(req.query.authorid){
        let result = await Account.findOne({_id:req.query.authorid},`${req.query.include} -email -password -key`);
        res.json(result);
    }
});

module.exports = router;
