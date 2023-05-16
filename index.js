/*---------SETTINGS------------------------------*/
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
import express from "express"
import cors from "cors"
import usersRouter from "./users/usersRouter.js"
import postsRouter from './posts/postsRouter.js';
import exphbs from "express-handlebars"
import path from 'path';
import mongo from "./config/mongo.js"
import uploadPic from './utils/handleStorage.js';

const PORT = 3030
const api = express()
api.use(cors());
api.use(express.static('public'));
api.use(express.json());
api.use(express.urlencoded());
api.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")))
api.use( "/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));

/*------------------------HBS-----------------------------*/

const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
  helpers: {
    errBelowInput: function (arrWarnings, inputName) {
      if (!arrWarnings) return null;
      const warning = arrWarnings.find((el) => el.param === inputName);
      if (warning == undefined) {
        return null;
      } else {
        return `
       <div class="alert alert-danger mt-1" role="alert">
       ${warning.msg}
       </div>
        `;
      }
    },
  },
});

api.set("views", "./views");
api.engine("handlebars", hbs.engine);
api.set("view engine", "handlebars");
/*--------------------------------------------------------------------------------*/

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
  
    


