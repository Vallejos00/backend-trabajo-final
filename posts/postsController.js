import { json, query } from "express";
import token from "../utils/handleJWT.js";

import Post from "./postsModel.js";


const createNewPost =  (req, res, next) => {
    const newPost = new Post({ ...req.body });
    
    newPost.save ( async (error) => {
      if (error) return next(error);
      const resultado = await Post.aggregate([
        {
        $lookup:{
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorUser"
        }
      },
      {$unwind:"$authorUser"},  
      
    ])
res.status(200).json({ message: "New post saved"});
    }); 
}



const listAllPosts = async (req, res, next) => {
  console.log(req.params);
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
    
    res.status(200).json({postWithUser})
    
  }


}


const findByTitle = (req, res, next) => {
  const { query } = req.params;
  Post.find({ $text: { $search: query } }, (err, result) => {
    if (err){
      next()
    } else if(!result.length){
      next();
    } else {
      res.json(result)
    }
  });
};

const postsController = {
    createNewPost,
    listAllPosts,
    findByTitle
}

export default postsController