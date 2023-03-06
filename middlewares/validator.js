import { check, validationResult } from "express-validator";
const registerValidator = [
check("fullName")
.trim().notEmpty().withMessage("Este campo no puede estar vacío")
.isAlpha("es-ES", {ignore: " "}).withMessage("Su nombre sólo puede contener letras")
.isLength({min: 5, max:30}).withMessage("Mínimo 5 carácteres y máximo 30"),

check("userName")
.trim().notEmpty().withMessage("Este campo no puede estar vacío")
.isLength({min: 5, max:30}).withMessage("Mínimo 5 carácteres y máximo 30"),

check("email").trim().notEmpty().withMessage("Este campo no puede estar vacío"),

check("password")
.trim().notEmpty().withMessage("Este campo no puede estar vacío")
.isLength({min: 8, max:16}).withMessage("Mínimo 8 carácteres y máximo 16"),

(req, res, next) => {
 const errors = validationResult(req)
 if(!errors.isEmpty()){
  return res.status(400).json(errors)
 } 
 next()
}
]

const editValidator = [
    check("fullName")
    .trim().notEmpty().withMessage("Este campo no puede estar vacío")
    .isAlpha("es-ES", {ignore: " "}).withMessage("Su nombre sólo puede contener letras")
    .isLength({min: 5, max:30}).withMessage("Mínimo 5 carácteres y máximo 30"),
    
    check("userName")
    .trim().notEmpty().withMessage("Este campo no puede estar vacío")
    .isLength({min: 5, max:30}).withMessage("Mínimo 5 carácteres y máximo 30"),
    
    check("email").trim().notEmpty().withMessage("Este campo no puede estar vacío"),
    
    (req, res, next) => {
     const errors = validationResult(req)
     if(!errors.isEmpty()){
        console.log(req.body);  
      return res.status(400).json(errors)
     } 
     next()
    }
    ]



export {registerValidator, editValidator}