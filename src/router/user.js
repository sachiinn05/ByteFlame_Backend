const express=require("express");
const { userAuth } = require("../middleware/auth");
const userRouter=express.Router();
const ConnectionRequest=require("../model/connectionRequest")
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
       const loggedInUser=req.user;
       const connectionRequest=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
       }).populate("fromUserId",["firstName","lastName"]);
       res.json({
        message:"Data fetched successfully",
        data:connectionRequest,
       });

    }
    catch(err){
        res.status(404).send("ERROR :"+err.message);
    }
})
module.exports=userRouter