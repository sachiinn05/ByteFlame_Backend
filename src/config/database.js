const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://sachinsingh6386:ppg7nWapvoMpXTdW@bytebuddydev.bnwjmdf.mongodb.net/devTinder"
    );
};

module.exports=connectDB;