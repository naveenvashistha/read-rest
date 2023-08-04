const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    accountID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accounts"
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});


module.exports = mongoose.model("authtokens",tokenSchema);