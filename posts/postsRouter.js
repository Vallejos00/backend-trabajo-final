import  express  from "express";
import isAuth from "../middlewares/session.js";
const postsRouter = express.Router()
import postsController from "./postsController.js";

postsRouter.get("/", postsController.listAllPosts);
postsRouter.post("/", isAuth, postsController.createNewPost);
postsRouter.get("/:query", postsController.findByTitle);








export default postsRouter