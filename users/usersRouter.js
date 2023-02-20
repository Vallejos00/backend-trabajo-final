import express from "express"
import usersController from "./usersController.js"
import uploadPic from "../utils/handleStorage.js"
const usersRouter = express.Router()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.post("/", uploadPic.single("profilePic"), usersController.createUser)
usersRouter.put("/:id", usersController.editUser)
usersRouter.delete("/:id", usersController.deleteUser) 



export default usersRouter

