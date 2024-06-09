import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, path.resolve('./', 'public', 'upload', 'images'))
  },
  filename: (req, file, callback) => {
    const time = new Date().getTime();

    callback(null, `${file.originalname}_${time}`);
  }
})

const upload = multer({ storage });

export default upload;