const { default: mongoose } = require("mongoose");
const { config } = require("dotenv");
config();

exports.dbconnect =  async ()=>{
    try {
     const {connection} =   await mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,

     });
        console.log("mongo db connectied with ", connection._connectionString);
    }
    catch(e){
        console.log("something went wrong in db connection",e);

    }
}