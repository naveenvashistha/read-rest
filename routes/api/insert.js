const express = require("express");
const router = express.Router();
const {postGenre} = require("../../utils/checkGenre");
const {postLang} = require("../../utils/checkLang");
const {Account} = require("../../models/accounts");
const Post = require("../../models/post");
const countChar = require("../../utils/countChar");
const {accountDetailsAdd} = require("../../utils/accountUpdate");

const genre = ['fantasy','adventure','romance','contemporary','dystopian','mystery','horror','thriller',
,'scifi','children','memoir','cookbook','art','self-help','motivational','health',
'history','travel','guide','comedy','action','science','finance'];

const language = ['english','hindi','japanese','spanish','german','russian','mandarin','french','arabic','urdu'
                   ,'portugese','indonesian'];

const countCharObject = {
  wordsCount:/\s+/,
  numbersCount:/\d/,
  dollarCharCount:"$",
  percentCharCount:"%",
  lettersCount:/[a-zA-Z]/
}

router.post("/insert",async (req,res,next)=>{
  try{
    if (!(req.body.title && req.body.content && req.body.language && req.body.genre)){
        return next("Error: provide required details in the body of request");
    }
    const genreArray = postGenre(genre,req.body.genre);
    const lang = postLang(language,req.body.language);
    if (!(genreArray && lang)){
        return next("Error: Genre/language is not correct");
    }
    let user = await Account.findOne({_id:res.locals.authUser});
    let newPost = await new Post({
        title: req.body.title,
        content: req.body.content,
        genre: genreArray,
        language: lang
    });
    newPost.scope = req.body.scope?.trim()?.toLowerCase() === 'true'?true:false;
    newPost.author = {
        displayName:user.name,
        profileURL:`${process.env.BASE_URL}api/author?filter="authorid=${user._id}"`
    }
    for(let prop in countCharObject){
      newPost[prop] = countChar(req.body.content,countCharObject[prop]);
    }
    newPost.postURL = `${process.env.BASE_URL}api/posts/?filter="postid=${newPost._id}"`;
    await newPost.save();

    //updating fields in Account model
    accountDetailsAdd(newPost,user,countCharObject);
    await user.save();

    res.json(newPost);
  }
  catch(error){
    if (typeof newPost !== 'undefined'){
    let errUser = await Post.findOne({_id:newPost._id});
    await Post.deleteOne({_id:newPost._id});
    }
    next(`Error:${error}`);
  }
});

module.exports = router;