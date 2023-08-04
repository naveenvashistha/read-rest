const postLang = (language,lang)=>{
    let res = language.includes(lang.trim().toLowerCase());
    if(!res){
        return false;
    }
    return lang.trim().toLowerCase();
}

const authorLangAdd = (newPost,user)=>{
    if(user.languages[newPost.language]){
        user.languages[newPost.language] += 1;
    }
    else{
        user.languages[newPost.language] = 1;
    }
    user.markModified('languages');
}

const authorLangDelete = (newPost,user)=>{
    user.languages[newPost.language] -= 1;
    user.markModified('languages');
}

module.exports = {postLang,authorLangAdd,authorLangDelete};