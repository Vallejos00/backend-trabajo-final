import bcrypt from "bcrypt"

const saltRounds = 10
const hashPass = async(password) => {
    return await bcrypt.hash(password, saltRounds)
}

const checkPass = async (password, hashedPass) => {
    return await bcrypt.compare(password, hashedPass)
}

const handlePass = {
    hashPass,
    checkPass
}

export default handlePass