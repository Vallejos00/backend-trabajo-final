import { json, query } from "express";
import jwt from "../utils/handleJWT.js";
import Post from "./postsModel.js";
import User from "../users/usersModel.js"


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
const listUserPost = async (req, res, next) => {
  const id = req.params.id
  const posts = await Post.find().where({author: id})
  if(!posts.length)return next()
  res.status(200).json(posts)


}
/*--------------------------------------------------------------------------------------*/
const findPost = async (req, res, next) => {
  const { query } = req.params;
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
  const busqueda = postWithUser.filter((post)=> post.body.toLowerCase().includes(query))    
  if(!busqueda.length) return next()
  res.status(200).json(busqueda)
}

/*--------------------------------------------------------------------------------------*/

const getMyPosts = async (req, res, next) => {
  const authToken = req.headers.authorization.split(" ").pop()
  const tokenStatus = await jwt.tokenVerify(authToken);

  const posts = await Post.find().where({ author: tokenStatus.id });
  if(!posts.length){
    next()
  } else {
   res.status(200).json(posts) 
  }
  
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
    listUserPost,
    findPost,
    deletePost,
    getMyPosts
}

export default postsController