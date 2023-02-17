import User from "./usersModel.js"
import handlePass from "../utils/handlePassword.js"

const getAllUsers = (req, res) => {
User.find().then((data) => {
    !data.length ? res.json( {message:"No se encontraron usuarios"}).status(404) : res.json(data).status(200);
}).catch((error)=> console.log(error))
}

const createUser = async(req, res) => {

 const password = await handlePass.hashPass(req.body.password)
 const newUser = new User({...req.body, password}) 
 newUser.save((error) => {
    if(error){
        console.log(error);
    } else {
        res.status(200).json(newUser)
    }
 })
}

const editUser = async (req, res) => {
    try {
       const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(user)
    } catch (error) {
        res.send("Usuario no encontrado").status(404)
    }
}

const deleteUser = async (req, res) => {
 
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json("Usuario borrado")
    } catch (error){
        res.send("hubo un error").status(404)
    }
}






const usersController = {
    getAllUsers,
    deleteUser,
    createUser,
    editUser
}

export default usersController