const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        // "mongodb+srv://sachinsingh6386:ppg7nWapvoMpXTdW@bytebuddydev.bnwjmdf.mongodb.net/devTinder"
        "mongodb://127.0.0.1:27017/devTinder", // Local MongoDB
      
        
    );
};

module.exports=connectDB;