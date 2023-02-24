import User from "./usersModel.js"
import handlePass from "../utils/handlePassword.js"
import token from "../utils/handleJWT.js"

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

const loginUser = async (req, res, next) => {
  const user = await User.find().where({userName: req.body.userName})
  if(!user.length) {
    let error = new Error("Username or password invalid")
    error.status = 401
    return next(error)
  } 
  const hashedPassword = user[0].password
  const match = await handlePass.checkPass(req.body.password, hashedPassword)
  if(!match){
    let error = new Error("Username or password invalid")
    error.status = 401
     return next(error) 
  }
  //token
 const userToken = {
  fullName: user[0].fullName,
  userName: user[0].userName,
  
 }

  const accesToken = await token.tokenSign(userToken, "1h")
  res.status(200).json({message: "Se pudo acceder correctamente", token: accesToken, user: userToken})
}

const editUser = async (req, res, next) => {
    try {  
      let profilePic = "";
      if (req.file) {
        profilePic = `http://localhost:3030/storage/${req.file.filename}`;
      }
      console.log(req.body);
      
      const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true }, );
      console.log(req.body.profilePic);
      
        res.status(200).json({ message: "usuario con cambios", usuario: user });
      } catch (error) {
        console.log(error);
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
    loginUser,
    editUser
}

export default usersController