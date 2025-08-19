const validator=require("validator");

const validateSignUpData=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(!firstName || !lastName)
    {
        throw new Error("Name is invalid");
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("Email ID is  invalid");
    }
    else if(!validator.isStrongPassword(password))
    {
        throw new Error("Please enter strong password");
    }
};
module.exports={
    validateSignUpData,
}