const {authorGenreAdd,authorGenreDelete} = require("./checkGenre");
const {authorLangAdd,authorLangDelete} = require("./checkLang");

const accountDetailsAdd = async (newPost, user, countCharObject)=>{    
    for(let prop in countCharObject){
        user[prop] += newPost[prop];
    }
    user.lastPublished = newPost.published;
    user.articlesCount += 1;
    newPost.scope?null:user.publicArticlesCount++;
    user.posts.push(newPost.postURL);
    authorGenreAdd(newPost,user);
    authorLangAdd(newPost,user);
}

const accountDetailsDelete = (newPost, user, countCharObject)=>{    
    for(let prop in countCharObject){
        user[prop] -= newPost[prop];
    }
    user.lastUpdated = Date.now();
    user.articlesCount -= 1;
    newPost.scope?null:user.publicArticlesCount--;
    user.posts.splice(user.posts.indexOf(newPost.postURL),1);
    authorGenreDelete(newPost,user);
    authorLangDelete(newPost,user);
}

module.exports = {accountDetailsAdd,accountDetailsDelete};