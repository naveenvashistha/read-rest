const postGenre = (genre,userGenre)=>{
    let genreArray = userGenre.trim().toLowerCase().split(" ").join("").split(",");
    for(let ele of genreArray){
        let res = genre.includes(ele);
        if(!res){
            return false;
        }
    }
    return genreArray;
}

const authorGenreAdd = (newPost,user)=>{
    for (let ele of newPost.genre){
        if(user.genres[ele]){
            user.genres[ele] += 1;
        }else{
            user.genres[ele] = 1;
        }
    }
    user.markModified('genres');
}

const authorGenreDelete = (newPost,user)=>{
    for (let ele of newPost.genre){
        user.genres[0][ele] -= 1;
    }
    user.markModified('genres');
}

module.exports = {postGenre,authorGenreDelete,authorGenreAdd};