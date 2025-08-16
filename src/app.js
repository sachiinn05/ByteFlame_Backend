const express=require("express");
const connectDB=require("./config/database.js");
const User=require("./model/user.js")
const app=express();
app.use(express.json());
app.post("/signUp",async(req,res)=>{
   const user=new User(req.body);
   try{
      await  user.save();
  res.send("User data save")
   }
  catch(err){
    res.status(400).send("User cannot connected to dataabse connect to team")
  }


    
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

