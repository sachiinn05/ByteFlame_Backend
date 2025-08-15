const adminAuth=(req,res,next)=>{
    console.log("Auth cheaked proper")
    const token="xyz";
    const isAdminAuth=token ==="xyz";
    if(!isAdminAuth)
    {
        res.status(404).send("Error ");
    }
    else{
        next();
    }
};
const userAdmin=(req,res,next)=>{
    console.log("User Auth Start");
    const token="xyz";
    const isUserAdmin=token==="xyz";
    if(!isUserAdmin)
    {
        res.status(400).send("Error");
    }
    else{
        next();
    }
}

module.exports={
adminAuth,
userAdmin,
}