const express = require("express");
const router = express.Router();
const error = require("../Handlers/errorHandle")
const success = require("../Handlers/successHandle");
const POST = require("../models/postsModel")
const USER = require("../models/usersModel")
const Header = require("../Header/Headers");
const appError = require("../service/Error");
const handleErrorAsync = require("../service/handleErrorAsync");

//第五週作業
router.get("/", handleErrorAsync(async (req, res, next) => {
    const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
    const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {}; //q是url的參數
    //http://localhost:3005/posts?q=For
    //const q = req.query.content !== undefined ? { "content": new RegExp(req.query.content) } : {}; 
    //是url的參數, http://localhost:3005/posts?content=For
    //console.log(q);
    const allPosts = await POST.find(q).populate({
        path: "user", // POST的user欄位
        select: "name"
    }).sort(timeSort);
    // asc 遞增(由小到大，由舊到新) createdAt ; 
    // desc 遞減(由大到小、由新到舊) "-createdAt"

    res.status(200).json({
        "status": "success",
        "message": "Search done",
        data: allPosts
    })

}))

router.post("/", handleErrorAsync(async (req, res, next) => { //要記得next, 否則service/Error.js 無法使用
    
    const data = req.body;

    const result = await USER.findById(data.user).exec();//因為data.user的資料是從USER來, 如果用POST會找不到資料
    //console.log(result);
    //自定義錯誤
    if (data.user == undefined) {
        return next(appError(400, "未填寫name 資料", next))
    }
    if (data.content == undefined) {
        return next(appError(400, "未填寫content 資料", next))
    }
    if (data.tags == undefined) {
        return next(appError(400, "未填寫tags 資料", next))
    }
    if(result == null){
        return next(appError(400,"無此使用者",next))
    }

    //自定義錯誤

    const newPost = await POST.create(data);
    res.status(200).json({
        "status": "success",
        "message": "Create done",
        newPost
    })
}))

router.delete("/", handleErrorAsync(async (req, res) => {
    await POST.deleteMany();
    const allPosts = await POST.find()
    res.status(200).json({
        "status": "success",
        "message": "Delete done",
        allPosts
    })
}))
router.delete("/:id", handleErrorAsync(async (req, res) => {
    const id = req.params.id;
    await POST.findByIdAndDelete(id)
    const allPosts = await POST.find();
    res.status(200).json({
        "status": "success",
        "message": "Delete id Done",
        "All Data": allPosts
    })
}))

router.patch("/:id", handleErrorAsync(async (req, res) => {
    const id = req.params.id;
    let data = req.body;
    if (data.name == undefined) {
        return next(appError(400, "未填寫name 資料", next))
    }
    if (data.tags == undefined) {
        return next(appError(400, "未填寫tags 資料", next))
    }
    if (data.content == undefined) {
        return next(appError(400, "未填寫content 資料", next))
    }
    await POST.findByIdAndUpdate(id, data);
    editPost = await POST.findById(id)
    res.status(200).json({
        "status": "success",
        "message": "update done",
        editPost
    })
}))
//第五週作業



//第四週作業
// router.get("/", async (req, res, next) => {
//     const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
//     const q = req.query.q !== undefined ? { "content": new RegExp(req.query.q) } : {}; //q是url的參數
//     //http://localhost:3005/posts?q=For
//     //const q = req.query.content !== undefined ? { "content": new RegExp(req.query.content) } : {}; 
//     //是url的參數, http://localhost:3005/posts?content=For
//     //console.log(q);
//     const allPosts = await POST.find(q).populate({
//         path: "user", // POST的user欄位
//         select: "name"
//     }).sort(timeSort);
//     // asc 遞增(由小到大，由舊到新) createdAt ; 
//     // desc 遞減(由大到小、由新到舊) "-createdAt"

//     res.status(200).json({
//         "status": "success",
//         "message": "Search done",
//         data: allPosts
//     })

// })

// router.post("/", async (req, res, next) => { //要記得next, 否則service/Error.js 無法使用
//     try {
//         const data = req.body;
//         //console.log(req)
//         /*如要使用req.body 必須在server.js 加入
//         app.use(express.json());
//         app.use(express.urlencoded({ extended: false }));
//         否則沒有req.body的資料
//         */

//         //cconsole.log(data.content);
//         if (data.content !== undefined) {
//             const newPost = await POST.create(data);
//             res.status(200).json({
//                 "status": "success",
//                 "message": "Create done",
//                 newPost
//             })
//         } else {
//             // res.status(400).json({
//             //     "status": "false",
//             //     "message": "欄位有誤",
//             // })
//             return next(appError(400, "你沒有填寫content資料", next))
//         }
//     } catch (err) {
//         // 如果在這直接寫, 就無法統一在server.js 的express錯誤處理觸發
//         // res.status(200).json({
//         //     "status": "false",
//         //     "message": err,
//         // })

//         // 用next 才可以在server.js 的express 錯誤處理觸發
//         return next(err);
//     }
// })
//第四週作業


//第三週作業
// router.get("/", async (req, res) => {
//     const allPosts = await POST.find();
//     res.status(200).json({
//         "status": "success",
//         "message": "Search done",
//         allPosts
//     })
//     //console.log("success")
// })

// router.delete("/", async (req, res) => {
//     await POST.deleteMany();
//     const allPosts = await POST.find()
//     res.status(200).json({
//         "status": "success",
//         "message": "Delete done",
//         allPosts
//     })
// })
// router.delete("/:id", async (req, res) => {
//     const id = req.params.id;
//     await POST.findByIdAndDelete(id)
//     const allPosts = await POST.find();
//     res.status(200).json({
//         "status": "success",
//         "message": "Delete id Done",
//         "All Data": allPosts
//     })
// })

// // 如果要寫在一起, 需要在server.js 呼叫兩次, 才能判斷
// // router.delete("/:id", async (req, res) => {
// //     try {
// //         console.log(req.params)
// //         const id = req.params.id;

// //         console.log(id);
// //         if (id !== "posts") {
// //             console.log(1);
// //             await POST.findByIdAndDelete(id);
// //             const allPosts = await POST.find();
// //             res.status(200).json({
// //                 "status": "success",
// //                 "message": "Delete id Done",
// //                 "All Data": allPosts
// //             })
// //         } else {

// //             console.log(2);
// //             await POST.deleteMany()
// //             const allPosts = await POST.find();
// //             res.status(200).json({
// //                 "status": "success",
// //                 "message": "Delete done",
// //                 allPosts
// //             })
// //         }
// //     } catch (err) {
// //         res.status(400).json({
// //             err
// //         })
// //     }
// // })

// router.post("/", async (req, res) => {
//     try {
//         const data = req.body;
//         //console.log(req)
//         /*如要使用req.body 必須在server.js 加入
//         app.use(express.json());
//         app.use(express.urlencoded({ extended: false }));
//         否則沒有req.body的資料
//         */

//         console.log(data);
//         if (data.name !== undefined || data.tags !== undefined || data.content !== undefined) {
//             const newPost = await POST.create(data);
//             res.status(200).json({
//                 "status": "success",
//                 "message": "Create done",
//                 newPost
//             })
//         } else {
//             res.status(400).json({
//                 "status": "false",
//                 "message": "欄位有誤",
//             })
//         }
//     } catch (err) {
//         res.status(200).json({
//             "status": "false",
//             "message": err,
//         })
//     }
// })

// router.patch("/:id", async (req, res) => {
//     const id = req.params.id;
//     let data = req.body;
//     if (data.name !== undefined || data.tags !== undefined || data.content !== undefined) {
//         await POST.findByIdAndUpdate(id, data);
//         editPost = await POST.findById(id)
//         res.status(200).json({
//             "status": "success",
//             "message": "update done",
//             editPost
//         })
//     } else {
//         res.status(400).json({
//             "status": "false",
//             "message": "欄位有誤",
//         })
//     }
// })
//第三週作業

module.exports = router;

//第二週作業
// const router = async function (req, res) {
//     let body = "";
//     req.on("data", chuck => {
//         body += chuck;
//     })

//     if (req.url == "/posts" && req.method == "GET") {
//         req.body.name
//         const allPosts = await POST.find();

//         success(res, allPosts, "全部資料");
//     } else if (req.url == "/posts" && req.method == "POST") {
//         req.on("end", async () => {
//             try {
//                 const data = JSON.parse(body);

//                 if (data !== undefined) {
//                     const newPost = await POST.create(
//                         {
//                             name: data.name,
//                             tags: data.tags,
//                             content: data.content,
//                             createAt: data.createAt,
//                             likes: data.likes
//                         }
//                     )

//                     success(res, newPost, "新增成功");
//                 } else {
//                     error(res, "data error")
//                 }
//             } catch (error) {
//                 error(res, error);
//             }
//         })
//     } else if (req.url == "/posts" && req.method == "DELETE") {
//         const allPosts = await POST.deleteMany({})
//         success(res, allPosts, "全部刪除成功");

//     } else if (req.url == "/posts" && req.method == "OPTIONS") {
//         const allPosts = await POST.find()
//         success(res, allPosts, "OPTION")
//     } else if (req.url.startsWith("/posts/") && req.method == "PATCH") {
//         req.on("end", async () => {
//             try {
//                 const data = JSON.parse(body);
//                 console.log(data);
//                 const id = req.url.split("/").pop();
//                 console.log(id)
//                 if (data !== undefined) {
//                     await POST.findByIdAndUpdate(id, data);
//                     const allPosts = await POST.find();
//                     console.log("測試")
//                     success(res, allPosts, "更新成功");
//                 }else{
//                     error(res,"更新失敗")
//                 }
//             } catch (err) {
//                 error(res, "資料錯誤")
//             }
//         })
//     } else if (req.url.startsWith("/posts/") && req.method == "DELETE") {
//         const id = req.url.split("/").pop();
//         await POST.findByIdAndDelete(id)
//         const allPosts = await POST.find();
//         success(res, allPosts, "單筆刪除成功");
//     } else {
//         error(res, "找不到路由");
//     }
// }
//第二週作業