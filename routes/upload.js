const express = require("express");
const router = express.Router();
const appError = require("../service/Error");
const handleErrorAsync = require("../service/handleErrorAsync");
const sizOf = require("image-size");
const {isAuth,generateSendJWT} = require("../service/auth");
const uploadImage = require("../service/uploadImage");
const { ImgurClient }= require("imgur");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"});

router.post("/",isAuth,uploadImage, handleErrorAsync(async(req,res,next) =>{
    console.log("upload");
    console.log(req.files);
    if(!req.files.length){
        return next(appError(400,"尚未上傳檔案",next))
    }
    const dimensions = sizOf(req.files[0].buffer);
    // if(dimensions.width !== dimensions.height){
    //     return next(appError(400,"圖片長寬不符合1:1",next));
    // }
    const client = new ImgurClient({
        clientId:process.env.imgur_Client_ID,
        clientSecret: process.env.imgur_client_secret,
        refreshToken: process.env.imgur_refresh_token
    });
    console.log(client);
    const response = await client.upload({
        image: req.files[0].buffer.toString("base64"),
        type:"base64",
        album:process.env.imgur_Album_ID
    });

    res.status(200).json({
        status:"success",
        imgUrl:response.data.link
    })
}));

module.exports = router;