import User from "./usersModel.js"
import handlePass from "../utils/handlePassword.js"

const getAllUsers = (req, res, next) => {
User.find().
then((data) => {
    !data.length ? next() : res.status(200).json(data);
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
}

const createUser = async(req, res) => {
    let profilePic = "";
  if (req.file) {
    profilePic = `http://localhost:3030/storage/${req.file.filename}`;
  }

 const password = await handlePass.hashPass(req.body.password)
 const newUser = new User({...req.body, profilePic, password}) 
 newUser.save((error, result) => {
    if(error){
      error.status = 400;
      next(error);
    } else {
        res.status(200).json(newUser)
    }
 })
}

const editUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
        res.status(200).json({ message: "usuario con cambios", usuario: user });
      } catch (error) {
        next();
      }
    };

const deleteUser = async (req, res, next) => {
 
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json("Usuario borrado")
    } catch (error){
        next()
    }
}






const usersController = {
    getAllUsers,
    deleteUser,
    createUser,
    editUser
}

export default usersController