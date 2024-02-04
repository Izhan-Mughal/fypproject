import multer from "multer";
// import path from "path"
// const __dirname = path.resolve();
// const newPath = path.join(__dirname, 'src/public/temp')
// console.log(__dirname)
// console.log(newPath)
// import fs from "fs"
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // cb(null, path.join(__dirname, './public/temp/'))
        cb(null, "./src/public/temp")
    },
    filename: function (req, file, cb) {

        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})