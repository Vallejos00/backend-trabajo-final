import  express  from "express";
import isAuth from "../middlewares/session.js";
const postsRouter = express.Router()
import postsController from "./postsController.js";

postsRouter.get("/", postsController.listAllPosts);
postsRouter.post("/", isAuth, postsController.createNewPost);
postsRouter.get("/profile/:id", postsController.listUserPost)
postsRouter.get("/:query", postsController.findPost);
postsRouter.get("/myposts", isAuth, postsController.getMyPosts)
postsRouter.delete("/myposts/:id", isAuth, postsController.deletePost)








export default postsRouter