import express from "express"
import usersController from "./usersController.js"
const usersRouter = express.Router()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.post("/", usersController.createUser)
usersRouter.put("/:id", usersController.editUser)
usersRouter.delete("/:id", usersController.deleteUser) 



export default usersRouter

