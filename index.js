/*---------SETTINGS------------------------------*/
import express from "express"
import usersRouter from "./users/usersRouter.js"
import mongo from "./config/mongo.js"

const PORT = 3030
const api = express()
api.use(express.static('public'));
api.use(express.json());
api.use(express.urlencoded({extended: false}));

/*-----------------------------------------------------*/

api.use("/api/users", usersRouter)



api.listen(PORT, (err) => {
    err ? console.log(`Error: ${err}`)
    :
    console.log(`Server running on http://localhost:${PORT}`)})
    


