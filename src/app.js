const express=require("express");
const connectDB=require("./config/database.js");
const app=express();
const cookieParser=require("cookie-parser")

app.use(express.json());
app.use(cookieParser());

const authRouter=require("./router/auth.js");
const profileRouter=require("./router/profile..js");
const requestRouter=require("./router/requests.js");
const userRouter=require("./router/user.js")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter)



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

