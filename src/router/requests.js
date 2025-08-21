const express=require("express");
const { userAuth } = require("../middleware/auth");
const requestRouter=express.Router();

requestRouter.post("/sendConnentionRequest",userAuth,async(req,res)=>{
    const user=req.user;
    console.log("Sending Request to user");
    res.send(user.firstName+"sent the connection to user")
})
module.exports=requestRouter;