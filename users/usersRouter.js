import express from "express"
import usersController from "./usersController.js"
import uploadPic from "../utils/handleStorage.js"
import token from "../utils/handleJWT.js"
const usersRouter = express.Router()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.post("/", uploadPic.single("profilePic"), usersController.createUser)
usersRouter.post("/login", usersController.loginUser )
usersRouter.put("/:id", uploadPic.single("profilePic"), usersController.editUser)
usersRouter.delete("/:id", usersController.deleteUser) 



export default usersRouter

