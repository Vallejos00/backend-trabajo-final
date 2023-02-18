import mongoose from "mongoose"
const {Schema, model} = mongoose

const userSchema = new Schema({
    fullName: {type: String, required: true,},
    userName: {type: String, required: true},
    email: {type: String, required: true, lowercase: true, trim: true, unique: true, match     : [/.+\@.+\..+/]},
    profilePic: {type: String},
    password: {type: String, required: true},
},
{timestamps: true}
);

userSchema.set("toJSON", {
    transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
        delete ret.password
    }
})

const User = model("User", userSchema)


export default User