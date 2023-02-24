import multer from "multer"
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathStorage = `${__dirname}/../public/storage`;
        cb(null, pathStorage);
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop(); 
        const filename = `usrPic_${Date.now()}.${ext}`;
        cb(null, filename);
      },
})

const uploadPic = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        !file  
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Warning: Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  });
  export default uploadPic;

