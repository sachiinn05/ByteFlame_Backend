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
    res.status(400).send("SignUP failed"+err.message)
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
        res.status(400).send("Something went wrong"+err.message);

    }
});

//find all data from database
app.get("/feed",async(req,res)=>{
    try{
      const users=await User.find({});
      res.send(users); 
    }catch(err){
        res.status(400).send("Something went wrong")
    }
})

//delete user by id
app.delete("/delete",async(req,res)=>{
    const userId=req.body.userId;
    try{
       const users=await User.findByIdAndDelete(userId);
       if(!users)
       {
          res.status(404).send("User not found");

       }
       else{
        res.send("User delete from database")
       }
    }catch(err)
    {
       res.status(400).send("Something went wrong"); 
    }
})
//update the data from database by id
app.patch("/update",async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
      await User.findByIdAndUpdate({_id:userId},data);
      res.send("user update")
    }catch(err)
    {
       res.status(400).send("Something went wrong"+err.message);  
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

