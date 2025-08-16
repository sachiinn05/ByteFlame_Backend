const express=require("express");
const connectDB=require("./config/database.js");
const User=require("./model/user.js")
const app=express();
app.use(express.json());

//signUP APIs
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

//get data from DB by using email
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    console.log(userEmail);
    
    try{
        const users = await User.find({emailId:userEmail})
        if(users.length===0)
        {
            res.status(404).send("User not found")
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.status(400).send("Something went wrong")

    }
});
app.get("/feed",async(req,res)=>{
    try{
      const users=await User.find({});
      res.send(users);
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})

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

