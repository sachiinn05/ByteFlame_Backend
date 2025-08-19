const express=require("express");
const connectDB=require("./config/database.js");
const User=require("./model/user.js")
const {validateSignUpData}=require("./utils/validation.js")
const bcrypt=require("bcrypt")
const app=express();
app.use(express.json());

//signUP APIs
app.post("/signup",async(req,res)=>{
    //Validation of data
    try{
    validateSignUpData(req);
    const {firstName,lastName,emailId,password}=req.body;
    //Encrypt the password
    const passwordHash=await bcrypt.hash(password,10);
    console.log(passwordHash);
    //Creating a new instance of user model
   const user=new User({
    firstName,
    lastName,
    emailId,
    password:passwordHash,
   });
   
      await  user.save();
  res.send("User data save")
   }
  catch(err){
    res.status(400).send("ERROR : "+ err.message)
  }  
});

//LogIn APIs
app.post("/login",async(req,res)=>{
    try{
    const {emailId,password}=req.body;
    const user= await User.findOne({emailId:emailId});
    if(!user)
    {
        throw new Error("User not found");
    }
    const isPasswordValid=await bcrypt.compare(password,user.password);
    if(isPasswordValid)
    {
        res.send("Login successful !");
    }
    else{
        throw new Error("Password is incorrect");
    }
   } catch(err)
   {
    res.status(400).send("ERROR :"+err.message);

   }
})


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
app.delete("/user",async(req,res)=>{
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
app.patch("/user/:userId",async(req,res)=>{
    const userId=req.params?.userId;
    const data=req.body;
    try{
        const ALLOWED_UPDATE=["photoUrl","about","gender","skills","age"];
        const isUpdateAllowed=Object.keys(data).every((k)=>
        ALLOWED_UPDATE.includes(k));
        if(!isUpdateAllowed){
            throw new Error("Update not allowed")
        }
        if(data?.skills.length>100)
        {
            throw new Error("Skills not more than 100 words")
        }
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

