const express=require("express");

const app=express();

app.use("/test",(req,res)=>{
    res.send("hello from test");
});
app.use("/insta",(req,res)=>{
    res.send("helloe from insta");
});
app.use("/",(req,res) =>{
    res.send("hello from Sachin server");
});

app.listen(9000,()=>{
    console.log("Server listen on port 9000");
});