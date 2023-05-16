import express from "express"
import usersController from "./usersController.js"
import uploadPic from "../utils/handleStorage.js"
import isAuth from "../middlewares/session.js"
import cors from 'cors'
import {registerValidator, editValidator, resetPassword} from "../middlewares/validator.js"
const usersRouter = express.Router()

usersRouter.get("/", usersController.getAllUsers)
usersRouter.post("/", registerValidator, usersController.createUser)
usersRouter.get("/:query", usersController.findUser)
usersRouter.post("/login", usersController.loginUser )
usersRouter.get("/myprofile", isAuth, usersController.showMyProfile)
usersRouter.put("/myprofile/:id", isAuth, editValidator, usersController.editUserData)
usersRouter.put("/myprofile/pic/:id", uploadPic.single('profilePic'), usersController.editUserPic)
usersRouter.delete("/myprofile/:id", isAuth, usersController.deleteUser) 
usersRouter.post("/forgot-password", usersController.forgotPass)
usersRouter.get("/reset/:token", usersController.reset)
usersRouter.post("/reset/:token", resetPassword, usersController.saveNewPass)



export default usersRouter

