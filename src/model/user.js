const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstNmae:{
        type:String,
    },
    lastNmae:{
        type:String,
    },
    emailId:{
        type:String,
    },
    password:{
        type:String,
    },
    age:{
        type:Number,
    },
    gender:{
     type:String,
    },
        
    
});

module.exports=mongoose.model("User",userSchema);



