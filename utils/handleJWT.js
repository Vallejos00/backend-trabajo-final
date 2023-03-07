import dotenv from "dotenv"
const data = dotenv.config()
import jsonwebtoken from "jsonwebtoken"
const jwt_secret = process.env.jwt_secret
//firmamos el token
const tokenSign = async (user, time) => {
    const sign = jsonwebtoken.sign(user, jwt_secret, {expiresIn: time})
    return sign
}  

const tokenVerify = async (tokenJWT) => {
    try {
       return jsonwebtoken.verify(tokenJWT, jwt_secret)
    } catch (error) {
        return error
    }
}

const jwt = {tokenSign, tokenVerify}

export default jwt


