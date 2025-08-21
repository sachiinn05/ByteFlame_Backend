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
const validateEditiProfileData=(req)=>{
    const allowedEditiFields=[
        "firstName",
        "lastName",
        "about",
        "skills",
        "age",
        "photoUrl",
        "emailId",
        "gender",
    ]
    const isEditiAllowed=Object.keys(req.body).every((field)=>allowedEditiFields.includes(field));
    return isEditiAllowed;
}
module.exports={
    validateSignUpData,
    validateEditiProfileData,
}