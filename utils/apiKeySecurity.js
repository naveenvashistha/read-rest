const crypto = require("crypto");

const encryptKey = (msg)=>{
    let cipher = crypto.createCipheriv("aes-256-cbc", process.env.SECRET_KEY, process.env.IV);
    let encryptedData = cipher.update(msg, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return encryptedData;
}

const decryptKey = (encryptedData)=>{
    let decipher = crypto.createDecipheriv("aes-256-cbc", process.env.SECRET_KEY, process.env.IV);
    let msg = decipher.update(encryptedData, "hex", "utf-8");
    msg += decipher.final("utf8");
    return msg;
}

module.exports = {encryptKey, decryptKey};