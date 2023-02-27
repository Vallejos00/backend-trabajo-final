import express from "express"
import usersController from "./usersController.js"
import uploadPic from "../utils/handleStorage.js"
import isAuth from "../auth/session.js"
const usersRouter = express.Router()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.post("/", uploadPic.single("profilePic"), usersController.createUser)
usersRouter.post("/login", usersController.loginUser )
usersRouter.put("/:id", isAuth, uploadPic.single("profilePic"), usersController.editUserData)
usersRouter.put("/pic/:id", isAuth, uploadPic.single("profilePic"), usersController.editUserPic)
usersRouter.delete("/:id", usersController.deleteUser) 



export default usersRouter

