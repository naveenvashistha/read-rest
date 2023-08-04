const {Account} = require("../models/accounts");
const {encryptKey} = require("./apiKeySecurity");

module.exports = async (req,res,next)=>{
    try{
    if (!req.headers.rrkey){
        return next("Error: Api Key is not provided.");
    }
    const apiKey = req.headers.rrkey;
    const encryptedKey = encryptKey(apiKey);
    const user = await Account.findOne({key:encryptedKey});
    if (!user){
        return next("Error: Wrong Api Key.");
    }
    res.locals.authUser = user._id;
    return next();
  }catch(error){
    next(`Error:${error}`);
  }
}