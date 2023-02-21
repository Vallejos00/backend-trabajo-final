import token from "../utils/handleJWT.js";
import Post from "./postsModel.js";


const createNewPost = (req, res, next) => {
    const newPost = new Post({ ...req.body });
    console.log(req);
    newPost.save((error) => {
      if (error) return next(error);
      res.status(200).json({ message: "New post saved"});
    }); 
}



const listAllPosts = (req, res, next) => {
    Post.find()
    .then((data) => {
      !data.length ? next() : res.status(200).json(data);
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
}


const findByTitle = (req, res, next) => {

}

const postsController = {
    createNewPost,
    listAllPosts,
    findByTitle
}

export default postsController