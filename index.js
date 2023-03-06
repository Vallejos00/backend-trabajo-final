/*---------SETTINGS------------------------------*/
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import express from "express"
import cors from "cors"
import usersRouter from "./users/usersRouter.js"
import postsRouter from './posts/postsRouter.js';
import mongo from "./config/mongo.js"

const PORT = 3030
const api = express()
api.use(express.static('public'));
api.use(express.json());
api.use(express.urlencoded({extended: false}));
api.use(cors());

/*-----------------------------------------------------*/

api.use("/api/users", usersRouter)
api.use("/api/posts", postsRouter)

api.listen(PORT, (err) => {
    err ? console.log(`Error: ${err}`)
    :
    console.log(`Server running on http://localhost:${PORT}`)})

/*---------------------ERRORS--------------------------*/
//404
api.use((req, res, next) => {
    console.log("404 handler");
    let error = new Error();
    error.message = "Recurso no encontrado";
    error.status = 404;
    next(error);
  });
  
  //general error handler
  api.use((error, req, res, next) => {
    if (!error.status) error.status = 400;
    res.status(error.status).json({ status: error.status, message: error.message });
  });
  
    


