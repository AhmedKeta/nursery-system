const multer = require("multer");
const fileFilter = (req, file, callBack) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callBack(null, true);
  } else {
    callBack(null, false);
  }
};
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "images");
  },
  filename: (req, file, callBack) => {
    callBack(null, new Date().getTime() + "-" + file.originalname);
  },
});
module.exports = multer({
  storage,
  fileFilter,
}).single("image");
