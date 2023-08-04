module.exports = (body, reg)=>{
    if (reg.toString() === /\s+/.toString()){
        return body.trim().split(reg).length;
    }
    return body.trim().split(reg).length - 1;
}