const express=require("express");
const connectDB=require("./config/database.js");
const User=require("./model/user.js")
const {validateSignUpData}=require("./utils/validation.js")
const bcrypt=require("bcrypt")
const cookieParser=require("cookie-parser")
const jwt=require("jsonwebtoken");
const {userAuth}=require("./middleware/auth.js")
const app=express();
app.use(express.json());
app.use(cookieParser());


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
    const isPasswordValid= await user.validatePassword(password);
    if(isPasswordValid)
    {
        // Create a JWT token
        const token=await user.getJWT();
       

        //console.log(token);
        res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000) // expires in 8 hours
        });

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


//Profile APIs
app.get("/profile",userAuth,async(req,res)=>{
    try{
    const user= req.user
    res.send(user)
    }catch(err)
    {
        res.status(400).send("ERROR :"+err.message); 
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

