const express=require("express");
const authRouter=express.Router();
const {validateSignUpData}=require("../utils/validation.js");
const bcrypt=require("bcrypt");
const User=require("../model/user.js")


authRouter.post("/signup",async(req,res)=>{
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

authRouter.post("/login",async(req,res)=>{
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
});
authRouter.post("/logout",async(req,res)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
  });
  res.send("logout successful");
})

module.exports=authRouter;