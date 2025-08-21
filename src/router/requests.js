const express=require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest=require("../model/connectionRequest")
const requestRouter=express.Router();
const User=require("../model/user")

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus)
        {
            return res.status(400).json({message :"Invalid status type"+status});
        }
        
        const user=await User.findById(toUserId);
        if(!user)
        {
            return res.status(400).json({message:"Invalid user"});
        }
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId},
            ]
        });
        if(existingConnectionRequest){
            return res.status(400).json({message:"Connection request Already Exists!!"})
        }
        const connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data=await connectionRequest.save();
        res.json({
            message:"Connection Request Sent Successfully",
            data,
        })
    }
    catch(err){
        res.status(400).send("ERROR :"+err.message);
    }
  
})
module.exports=requestRouter;