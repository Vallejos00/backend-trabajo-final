import express from "express"
import usersController from "./usersController.js"
import uploadPic from "../utils/handleStorage.js"
import isAuth from "../middlewares/session.js"
import {registerValidator, editValidator, resetPassword} from "../middlewares/validator.js"
const usersRouter = express.Router()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.post("/", uploadPic.single("profilePic"), registerValidator, usersController.createUser)
usersRouter.post("/login", usersController.loginUser )
usersRouter.put("/:id", isAuth, editValidator, usersController.editUserData)
usersRouter.put("/pic/:id", isAuth, uploadPic.single("profilePic"), usersController.editUserPic)
usersRouter.delete("/:id", usersController.deleteUser) 
usersRouter.get("/forgot-password", usersController.forgotPass)
usersRouter.get("/reset/:token", usersController.reset)
usersRouter.post("/reset/:token", resetPassword, usersController.saveNewPass)



export default usersRouter

