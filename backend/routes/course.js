const { Router } = require("express")
const {userMiddleware} = require('../middleware/user')
const {purchaseModel, courseModel} = require('../db')
const courseRouter = Router()

courseRouter.post('/purchase',userMiddleware,async(req,res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;
    //should check that the user har actually check the course
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "You have succesfully bought the course"
    })



})
courseRouter.get('/preview',async(req,res)=>{
    const courses = await courseModel.find({})

    res.json({
        courses
    })

}) 

module.exports ={
    courseRouter:courseRouter
}