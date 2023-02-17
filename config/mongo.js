import dotenv from "dotenv"
const data = dotenv.config()
import mongoose, { mongo } from "mongoose"
const URI = process.env.DB_URI
mongoose.set('strictQuery', false)


mongoose.connect(URI, (err) => {
    err? console.log('Algo falló' + err) : console.log('Mongo Atlas connected')
})

export default mongo