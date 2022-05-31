const path = require("path");
const multer = require("multer");
const appError = require("../service/Error");
const handleErrorAsync = require("../service/handleErrorAsync");
const upload = multer({
    limits:{
        fileSize:2*1024*1024, //檔案大小 2MB
    },
    fileFilter(req,file,cb){
        const ext = path.extname(file.originalname).toLocaleLowerCase();
        if(ext != ".jpg" && ext != ".png" &&ext != ".jpeg"){
            cb(new Error("檔案格式錯誤,僅限上傳 jpg, png,jpeg格式"))
        }
        cb(null,true);
    },
}).any();

module.exports = upload;