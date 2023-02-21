import dotenv from "dotenv"
const data = dotenv.config()
import jwt from "jsonwebtoken"
const jwt_secret = process.env.jwt_secret
//firmamos el token
const tokenSign = async (user, time) => {
    const sign = jwt.sign(user, jwt_secret, {expiresIn: time})
    return sign
}  

const tokenVerify = async (tokenJWT) => {
    try {
        jwt.verify(tokenJWT, jwt_secret)
    } catch (error) {
        return error
    }
}

const token = {tokenSign, tokenVerify}

export default token