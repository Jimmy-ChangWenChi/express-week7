const express = require("express");
const jwt = require("jsonwebtoken");
const appError = require("../service/Error");
const handleErrorAsync = require("../service/handleErrorAsync");
const USER = require("../models/usersModel");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"});

const isAuth = handleErrorAsync(async(req,res,next)=>{

    //console.log("1");
    //確認token 是否存在
    let token;
    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        token = req.headers.authorization.split(" ")[1];
    }
    //console.log("2");
    if(!token){
        return next(appError("401","你尚未登入",next));
    }
    console.log("3");
    //驗證token 是否正確
    const decode = await new Promise((resolve,reject)=>{
        console.log("4");
        jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
            console.log("5");
            if(err){
                reject(err)
            }else{
                resolve(payload)
            }
        })
    })
    console.log("4");
    const currentUser = await USER.findById(decode.id);
    req.user = currentUser; //自訂的屬性
    next();
});
const generateSendJWT= (user,statusCode,res)=>{
    // 產生 JWT token
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXPIRES_DAY
    });
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      user:{
        token,
        name: user.name
      }
    });
  }



module.exports = {
    isAuth,
    generateSendJWT
};