const mongoose = require("mongoose");

const connection = async ()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/wikiDB", {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          replicaSet: 'rs0'
      });
        console.log('Connection to DB Successful');
      } catch (err) {
        console.log('Connection to DB Failed: '+err);
      }
}

module.exports = connection;



