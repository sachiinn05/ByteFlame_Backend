const express=require("express");
const { userAuth } = require("../middleware/auth");
const userRouter=express.Router();
const ConnectionRequest=require("../model/connectionRequest")
const User=require("../model/user")
const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
       const loggedInUser=req.user;
       const connectionRequest=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
       }).populate("fromUserId",USER_SAFE_DATA );
       res.json({
        message:"Data fetched successfully",
        data:connectionRequest,
       });

    }
    catch(err){
        res.status(404).send("ERROR :"+err.message);
    }
});
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
         const loggedInUser=req.user;
         const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
         }).populate("fromUserId",USER_SAFE_DATA);
         const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString())
            {
                return row.toUserId;
            }
            return row.fromUserId
         });
         res.json({data:connectionRequest});
    }catch(err)
    {
        res.status(400).send("ERROR :"+err.message);
    }
})
userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            $or: 
            [{fromUserId :loggedInUser._id},{toUserId:loggedInUser._id}],
        }).select("fromUserId toUserId");
       const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
     const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA)
      res.send(users)
    }
    catch(err)
    {
        res.status(400).json({message:err.message});
    }
})

module.exports=userRouter