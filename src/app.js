const express=require("express");

const app=express();
const {adminAuth,userAdmin}=require("./middleware/auth.js")

app.use("/admin",adminAuth);
app.use("/user",userAdmin);

app.get("/admin/login",(req,res)=>{
    res.send("login succesfull");
});
app.get("/user/data",(req,res)=>{
    res.send("data fetch succesfull");
})




app.listen(9000,()=>{
    console.log("Server listen on port 9000");
});