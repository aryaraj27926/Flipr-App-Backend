const express = require("express")
const router = express.Router()
const Task = require("../models/task.js")

router.post("/addtask", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    const { description, type, timeTaken, starTime } = req.body;
    try {
        const task = await new Task({
            userID:req.user._id,
            description:description,
            type:type,
            timeTaken:timeTaken,
            starTime:starTime
        })
        await task.save()
        const {__v, _id, ...other} = task._doc
        res.status(200).json(other).send()
    }
    catch(err){  
        if(err.code=="ERR_HTTP_HEADERS_SENT") {console.log(err.code)}else{
        console.error(err); res.status(500).json({ error: "Internal Server Error" }).send()} }
})

router.get("/gettask/:id", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    if (!(req.user.isAdmin || req.user._id == req.params.id)) {
        res.status(400).json({error:"Invalid Permission"}).send()
        return;
    }
    try {
        const task = await Task.find({userID:req.params.id}, {__v:0, _id:0})
        res.status(200).json({data:task}).send()
        }
    catch(err){  
        if(err.code=="ERR_HTTP_HEADERS_SENT") {console.log(err.code)}else{
        console.error(err); res.status(500).json({ error: "Internal Server Error" }).send()} }
})

module.exports = router