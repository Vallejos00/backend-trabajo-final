import mongoose from "mongoose";
const {Schema, model} = mongoose

const PostSchema = Schema({
    body: { type: String, required: true },
    author: {type: mongoose.Types.ObjectId, required: true},
    date: { type: Date, default: Date.now },
   
},
{ timestamps: true },
)

PostSchema.index({body: "text"})


const Post = model("Post", PostSchema);





export default Post