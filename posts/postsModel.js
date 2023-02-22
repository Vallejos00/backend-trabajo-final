import mongoose from "mongoose";
const {Schema, model} = mongoose

const PostSchema = Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: {type: mongoose.Types.ObjectId, required: true},
    date: { type: Date, default: Date.now },
    algo: { type: String}
},
{ timestamps: true },
)
const Post = model("Post", PostSchema);





export default Post