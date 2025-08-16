const express=require("express");
const connectDB=require("./config/database.js");
const User=require("./model/user.js")
const app=express();

app.post("/signUp",async(req,res)=>{
   const user=new User({
    firstNmae:"Himu",
    lastNmae:"Singh",
    emailId:"himu@gmail.com",
    password:"123456"
   });
  await  user.save();
  res.send("User data save")


    
});

connectDB()
.then(()=>{
    console.log("DataBase connection established..");
    app.listen(9000,()=>{
    console.log("Server listen on port 9000");
});
})
.catch((err)=>{
    console.log("Database cannot be connected..")
});

