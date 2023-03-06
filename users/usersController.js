import User from "./usersModel.js"
import handlePass from "../utils/handlePassword.js"
import token from "../utils/handleJWT.js"
import fs from "fs"

const getAllUsers = async(req, res, next) => {
const data = await User.find()
if(!data.length){
  return next()
}
res.json(data)
}

const createUser = async(req, res, next) => {
    let profilePic = "";
  if (req.file) {
    profilePic = `http://localhost:3030/storage/${req.file.filename}`;
  }

 const password = await handlePass.hashPass(req.body.password)
 const newUser = new User({...req.body, profilePic, password}) 
 newUser.save(async (error, result) => {
    if(error){ 
       error.status = 400;
       return next(error);
    }
    const user = await User.find().where({userName: req.body.userName})
    const userToken = {
      fullName: user[0].fullName,
      userName: user[0].userName,
      
     }
    
      const accesToken = await token.tokenSign(userToken, "30m")
      res.status(200).json({message: "Usuario creado correctamente", token: accesToken, user: userToken})

 })
}

const loginUser = async (req, res, next) => {
  const user = await User.find().where({userName: req.body.userName})
  if(!user.length) {
    let error = new Error("Usuario o contraseña inválido")
    error.status = 401
    return next(error)
  } 
  const hashedPassword = user[0].password
  const match = await handlePass.checkPass(req.body.password, hashedPassword)
  if(!match){
    let error = new Error("Usuario o contraseña inválido")
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

const editUserData = async (req, res, next) => {
    try {    
        const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true }, );
        console.log(req.body);
        res.status(200).json({ message: "usuario con cambios", usuario: user });
      } catch (error) {
        next();   
      }
    };

    const editUserPic = async (req, res, next) => {
      const user = await User.findById(req.params.id)
      function obtenerSubcadena(str) {
        let index = str.indexOf("storage")
        if (index != -1) {
         return str.substring(index)
       } else {
         return next()
        }
       }
       const pathPic = `public/${obtenerSubcadena(user.profilePic)}`
       fs.unlink(pathPic, (err) => { 
        if (err) return console.log("No hay Imagen");;
        console.log("user picture deleted");
      })



   try {
     let newProfilePic = req.body
     if(req.file && req.file.filename){
       newProfilePic.profilePic = `http://localhost:3030/storage/${req.file.filename}`
      const user = await User.findByIdAndUpdate( req.params.id, newProfilePic, { new: true }, )
      
       res.status(200).json({ message: "usuario con cambios", usuario: user });
     } else {
      newProfilePic.profilePic = ""
      const user = await User.findByIdAndUpdate( req.params.id, newProfilePic, { new: true }, );
      res.status(200).json({ message: "usuario con cambios", usuario: user });
    }

   } catch(error){
     next(error)
   }
      };

      const deleteUser = async (req, res, next) => {
        
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user.profilePic.length) return res.json({message: "Usuario eliminado"})
        
        function obtenerSubcadena(str) {
         let index = str.indexOf("storage")
         if (index != -1) {
          return str.substring(index)
        } else {
          return next()
         }
        }
        
        const pathPic = `public/${obtenerSubcadena(user.profilePic)}`
        
        
        fs.unlink(pathPic, (err) => { 
          if (err) return next();;
          console.log("user picture deleted");
          res.json({message: "Usuario eliminado"})
        })
}






const usersController = {
    getAllUsers,
    deleteUser,
    createUser,
    loginUser,
    editUserData,
    editUserPic
}

export default usersController