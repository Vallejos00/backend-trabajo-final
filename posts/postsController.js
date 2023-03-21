import { json, query } from "express";
import jwt from "../utils/handleJWT.js";
import Post from "./postsModel.js";


const createNewPost = async (req, res, next) => {
    const authToken = req.headers.authorization.split(" ").pop()
    const tokenStatus = await jwt.tokenVerify(authToken);
    const newPost = new Post({ ...req.body  });

    newPost.save ( async (error) => {
      if (error) return next(error);

    res.status(200).json({ message: `${tokenStatus.userName}, ya publicamos tu posteo!`});
    }); 
}
/*--------------------------------------------------------------------------------------*/


const listAllPosts = async (req, res, next) => {
  const data = await Post.find()
  if (!data.length) {
   next()
  } else{
    const postWithUser = await Post.aggregate([
      {
      $lookup:{
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user"
      }
    },
    {$unwind:"$user"},    
  ],  
  )
   res.status(200).json(postWithUser) 
  }
}
/*--------------------------------------------------------------------------------------*/


const findPost =  (req, res, next) => {
  const { query } = req.params;
  Post.find( { $text: { $search: query } }, (err, result) => {
    if (err){
      next()
    } else if(!result.length){
      next();
    } else {
      res.json(result)
    }
  });
};
/*--------------------------------------------------------------------------------------*/


const getMyPosts = async (req, res, next) => {
  const authToken = req.headers.authorization.split(" ").pop()
  const tokenStatus = await jwt.tokenVerify(authToken);

  const posts = await Post.find().where({ author: tokenStatus.id });
  if(!posts.length)return next()
  res.status(200).json(posts)
}
/*--------------------------------------------------------------------------------------*/


const deletePost = async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if(!post){
    next()
  } else return res.json({message:"Posteo eliminado"})
}


const postsController = {
    createNewPost,
    listAllPosts,
    findPost,
    getMyPosts,
    deletePost
}

export default postsController