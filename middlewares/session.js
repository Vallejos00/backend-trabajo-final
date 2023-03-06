import token from "../utils/handleJWT.js";
 
const isAuth = async (req, res, next) => {
    let error = new Error("Forbidden access | Invalid token");
    if (!req.headers.authorization) {
        let error = new Error("No token provided");
        error.status = 403;
        return next(error);
    }
const authToken = req.headers.authorization.split(" ").pop()

const verifiedToken = await token.tokenVerify(authToken)
if(verifiedToken instanceof Error) {
    error.status = 401;
    error.message = "Invalid token";
    return next(error);
  }
  next();
}

export default isAuth