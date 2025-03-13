import multer from "multer";
import { existsSync, mkdirSync } from "fs";

if (!existsSync(process.env.UPLOADS_FOLDER)) {
  mkdirSync(process.env.UPLOADS_FOLDER);
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${req.user.id}-${file.originalname}`);
  },
});

export { multerStorage };