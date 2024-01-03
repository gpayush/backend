import mongoose, { Schema}from 'mongoose';
import  bcrypt, { genSaltSync } from 'bcrypt';
// Declare the Schema of the Mongo model
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },  
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
}
);


 
userSchema.pre("save", async function (next){
    const salt =await genSaltSync(10);
    this.password =await bcrypt.hash(this.password, salt);
})


userSchema.methods.isPassWordMatched =async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Export the model
export const User =mongoose.model("User", userSchema);
