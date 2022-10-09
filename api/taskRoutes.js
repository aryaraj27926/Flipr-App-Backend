const express = require("express")
const router = express.Router()
const Task = require("../models/task.js")

router.post("/addtask", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    if (!req.session.user) {
        res.status(400).json({error:"User not Verified"}).send()
        return;
    }
    const { description, type, timeTaken, starTime } = req.body;
    try {
        const task = await new Task({
            userID:req.session.user._id,
            description:description,
            type:type,
            timeTaken:timeTaken,
            starTime:starTime
        })
        await task.save()
        const {__v, _id, ...other} = task._doc
        res.status(200).json(other).send()
    }
    catch(err){console.error(err);res.status(500).json({error:"Internal Server Error"}).send()}
})

router.get("/gettask/:id", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    if (!req.session.user) {
        res.status(400).json({error:"User not Verified"}).send()
        return;
    }
    if (!(req.session.user.isAdmin || req.session.user._id == req.params.id)) {
        res.status(400).json({error:"Invalid Permission"}).send()
        return;
    }
    try {
        const task = await Task.find({userID:req.params.id}, {__v:0, _id:0})
        res.status(200).json(task).send()
        }
    catch(err){console.error(err);res.status(500).json({error:"Internal Server Error"}).send()}
})

module.exports = router