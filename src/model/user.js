const mongoose=require("mongoose");
const validator=require("validator")
const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
               throw new Error("Invalid Email address"+value);
            }
        },
    },
    password:{
        type:String,
        required:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
     type:String,
     validate(value){
        if(!["male","female","others"].includes(value))
        {
            throw new Error("Gender data is not valid");
        }
     },
    },
    photoUrl:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/female-profile-picture-placeholder-vector-260nw-450966928.jpg",
        validate(value)
        {
            if(!validator.isURL(value))
            {
               throw new Error("Invalid Photo Url"+value);
            }
        },
    },
    about:{
        type:String,
        default:"This is a default about of user"
    },
    skills:{
       type:[String],
    },    

},
{
    timestamps:true,
});

module.exports=mongoose.model("User",userSchema);



