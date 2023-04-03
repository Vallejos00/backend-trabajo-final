import User from "./usersModel.js"
import handlePass from "../utils/handlePassword.js"
import jwt from "../utils/handleJWT.js"
import fs from "fs"
import transporter from "../config/nodemailer.js"
import obtenerSubcadena from "../config/subcadena.js"

const getAllUsers = async(req, res, next) => {
const data = await User.find()
if(!data.length){
  return next()
}
res.json(data)
}
/*--------------------------------------------------------------------------------------*/

const findUser = (req, res, next) => {
  const { query } = req.params;
  User.find({ $text: { $search: query } }, (err, result) => {
  if (err){
  next()
  } else if(!result.length){
  next();
  } else {
  res.json(result)
  }
  });
  }
/*--------------------------------------------------------------------------------------*/

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
      id: user[0].id,
      fullName: user[0].fullName,
      userName: user[0].userName,      
     }    
      const accesToken = await jwt.tokenSign(userToken, "30m")
      res.status(200).json({message: "Usuario creado correctamente", token: accesToken, user: userToken})
 })
}
/*--------------------------------------------------------------------------------------*/

const loginUser = async (req, res, next) => {
  const user = await User.find().where({userName: req.body.userName})
  if(!user.length) {
    let error = new Error("Usuario o contraseña inválido")
    error.status = 401
    console.log(error);
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
  id: user[0].id,
  fullName: user[0].fullName,
  userName: user[0].userName, 
 }
  const accesToken = await jwt.tokenSign(userToken, "1h")
  console.log(accesToken);
  res.status(200).json({message: "Se pudo acceder correctamente", token: accesToken, user: [userToken.fullName, userToken.userName, userToken.id, accesToken]})
}
/*--------------------------------------------------------------------------------------*/

const editUserData = async (req, res, next) => {
    try {    
        const user = await User.findByIdAndUpdate( req.params.id, req.body, { new: true }, );
        const newUser = await User.find().where({userName : req.body.userName})
        const userToken = {
          id: newUser[0].id,
          fullName: newUser[0].fullName,
          userName: newUser[0].userName, 
        }
        const accesToken = await jwt.tokenSign(userToken, "1h")
        res.status(200).json({message: "usuario con cambios y nuevo token", token: accesToken, user: userToken})
        
      } catch (error) {
        console.log(error);   
      }
    };
/*--------------------------------------------------------------------------------------*/

const editUserPic = async (req, res, next) => {
  const user = await User.findById(req.params.id)
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

 const profilePic = user.profilePic
 if(!profilePic){
   console.log("No había imágen");
  }else{
    const pathPic = `public/${obtenerSubcadena(profilePic)}`
   fs.unlink(pathPic, (err) => { 
    if (err) throw err
    console.log("user picture deleted");
  })
 }
  };
  /*--------------------------------------------------------------------------------------*/

      const showMyProfile = async (req, res, next) => {
        const authToken = req.headers.authorization.split(" ").pop()
        const tokenStatus = await jwt.tokenVerify(authToken);
        console.log(tokenStatus);

        const user = await User.find().where({userName: tokenStatus.userName})
        if(!user.length)return next()
        res.status(200).json(user)
      }

 /*--------------------------------------------------------------------------------------*/

      const deleteUser = async (req, res, next) => {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user.profilePic.length) return res.json({message: "Usuario eliminado"})
        
        const pathPic = `public/${obtenerSubcadena(user.profilePic)}`       
         fs.unlink(pathPic, (err) => { 
          if (err) return next();;
          console.log("user picture deleted");
          res.json({message: "Usuario eliminado"})
        })
}
/*--------------------------------------------------------------------------------------*/

const forgotPass = async (req, res, next) => {
  let error = new Error("No user with than email");
  const user = await User.find().where({ email: req.body.email });
  if (!user.length) {
    console.log("hola");
    error.status = 404;
    return next(error);
  }
  
  const userForToken = {
    id: user[0].id,
    fullName: user[0].fullName,
    email: user[0].email,
  };
  const token = await jwt.tokenSign(userForToken, "15m")
  const link = `http://localhost:3030/api/users/reset/${token}`;
  const mailDetails = {
    from: "soporte@miapi.com",
    to: userForToken.email,
    subject: "Link de recuperación de contraseña",
    html: `<h2>Recuperación de contraseña</h2>
  <p>Clickear en el siguiente link para restablecer su contraseña</p>
  <a href="${link}">click aquí</a>
  `,
  };
  transporter.sendMail(mailDetails, (error, data) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({
        message: `Hola ${userForToken.fullName}, te hemos enviado un mail para que recuperes tu contraseña.`,
      });
    }
  });
}
/*--------------------------------------------------------------------------------------*/

const reset = async (req, res, next) => {
  const {token} = req.params

  const tokenStatus = await jwt.tokenVerify(token);
  console.log(tokenStatus);
  if (tokenStatus instanceof Error) {
    return next(tokenStatus);
  }
  res.render("resetPass", { token, tokenStatus })
};
/*--------------------------------------------------------------------------------------*/

const saveNewPass = async (req, res, next) => {
  const { token } = req.params;
  console.log(token);
  const tokenStatus = await jwt.tokenVerify(token);
  if (tokenStatus instanceof Error) return next(tokenStatus);

  const newPassword = await handlePass.hashPass(req.body.password_1);
  try {
    console.log(tokenStatus);
    const updatedUser = await User.findByIdAndUpdate(tokenStatus.id, {
      password: newPassword,
    });
    res
      .status(200)
      .json({ message: `Contraseña actualizada` });
  } catch (error) {
    next(error);
  }
};


const usersController = {
    getAllUsers,
    deleteUser,
    createUser,
    loginUser,
    editUserData,
    editUserPic,
    forgotPass,
    reset,
    saveNewPass,
    showMyProfile,
    findUser
}

export default usersController