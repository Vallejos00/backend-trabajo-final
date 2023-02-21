import mongoose from "mongoose";
const Schema = mongoose.Schema

const PostSchema = Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
},
{ timestamps: true }
)

const Post = mongoose.model("Post", PostSchema);
export default Post