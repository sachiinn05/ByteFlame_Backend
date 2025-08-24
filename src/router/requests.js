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
  
});
requestRouter.post("/request/review/:status/:requestId",userAuth, async(req,res)=>{
    try{
       const loggedInUser=req.user;
       const {status,requestId}=req.params;
       const allowedStatus=["accepted","rejected"];
       if(!allowedStatus.includes(status))
       {
        return res.status(400).json({message:"Status not allowed!"});
       }
       const connectionRequest=await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
       });
              


       if(!connectionRequest)
       {
        return res.status(404).json({message:"Connection request not found"});
       }
       connectionRequest.status=status;
       const data =await connectionRequest.save();
       res.status(200).json({message:"Connection request"+status,data});



    }
    catch(err){
       res.status(400).send("ERROR:"+err.message); 
    }
})
module.exports=requestRouter;