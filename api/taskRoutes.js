const express = require("express")
const router = express.Router()
const Task = require("../models/task.js")

router.post("/weeklytaskdata", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'BadRequest' }).send();
        return;
    }
    const { id } = req.body;
    const currDate = new Date();
    const currMonth = currDate.getMonth();
    const currYear = currDate.getFullYear();
    const week1 = new Date(currYear + "-" + (currMonth + 1) + "-01")
    const week2 = new Date(currYear + "-" + (currMonth + 1) + "-08")
    const week3 = new Date(currYear + "-" + (currMonth + 1) + "-15")
    const week4 = new Date(currYear + "-" + (currMonth + 1) + "-22")
    let week5 = undefined;
    if (currMonth === 0 || currMonth === 2 || currMonth === 4 || currMonth === 6 || currMonth === 7 || currMonth === 9 || currMonth === 11) {
        week5 = new Date(currYear + "-" + (currMonth + 1) + "-31")
    } else if (currMonth === 1 && currYear % 4 === 0) {
        if (currYear % 100 === 0 && currYear % 400 !== 0) {
            week5 = new Date(currYear + "-" + (currMonth + 1) + "-28")
        }else{
            week5 = new Date(currYear + "-" + (currMonth + 1) + "-29")
        }
    } else if (currMonth === 1 && currYear % 4 !== 0) {
        week5 = new Date(currYear + "-" + (currMonth + 1) + "-28")
    }
    else{
        week5 = new Date(currYear + "-" + (currMonth + 1) + "-30")
    }
    const w1q1 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week1 } }, { starTime: { '$lt': week2 } }] }, { type: "Work" }, { userID: id }] }, { "timeTaken": 1 })
    const w1workTotal = w1q1.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w1q2 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week1 } }, { starTime: { '$lt': week2 } }] }, { type: "Meeting" }, { userID: id }] }, { "timeTaken": 1 })
    const w1meetingTotal = w1q2.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w1q3 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week1 } }, { starTime: { '$lt': week2 } }] }, { type: "Break" }, { userID: id }] }, { "timeTaken": 1 })
    const w1breakTotal = w1q3.reduce((acc, curr) => acc + curr.timeTaken, 0);

    const w2q1 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week2 } }, { starTime: { '$lt': week3 } }] }, { type: "Work" }, { userID: id }] }, { "timeTaken": 1 })
    const w2workTotal = w2q1.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w2q2 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week2 } }, { starTime: { '$lt': week3 } }] }, { type: "Meeting" }, { userID: id }] }, { "timeTaken": 1 })
    const w2meetingTotal = w2q2.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w2q3 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week2 } }, { starTime: { '$lt': week3 } }] }, { type: "Break" }, { userID: id }] }, { "timeTaken": 1 })
    const w2breakTotal = w2q3.reduce((acc, curr) => acc + curr.timeTaken, 0);

    const w3q1 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week3 } }, { starTime: { '$lt': week4 } }] }, { type: "Work" }, { userID: id }] }, { "timeTaken": 1 })
    const w3workTotal = w3q1.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w3q2 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week3 } }, { starTime: { '$lt': week4 } }] }, { type: "Meeting" }, { userID: id }] }, { "timeTaken": 1 })
    const w3meetingTotal = w3q2.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w3q3 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week3 } }, { starTime: { '$lt': week4 } }] }, { type: "Break" }, { userID: id }] }, { "timeTaken": 1 })
    const w3breakTotal = w3q3.reduce((acc, curr) => acc + curr.timeTaken, 0);

    const w4q1 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week4 } }, { starTime: { '$lt': week5 } }] }, { type: "Work" }, { userID: id }] }, { "timeTaken": 1 })
    const w4workTotal = w4q1.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w4q2 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week4 } }, { starTime: { '$lt': week5 } }] }, { type: "Meeting" }, { userID: id }] }, { "timeTaken": 1 })
    const w4meetingTotal = w4q2.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const w4q3 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': week4 } }, { starTime: { '$lt': week5 } }] }, { type: "Break" }, { userID: id }] }, { "timeTaken": 1 })
    const w4breakTotal = w4q3.reduce((acc, curr) => acc + curr.timeTaken, 0);

    data = {
        week1: {
            work: w1workTotal,
            meeting: w1meetingTotal,
            break: w1breakTotal
        },
        week2: {
            work: w2workTotal,
            meeting: w2meetingTotal,
            break: w2breakTotal
        },
        week3: {
            work: w3workTotal,
            meeting: w3meetingTotal,
            break: w3breakTotal
        },
        week4: {
            work: w4workTotal,
            meeting: w4meetingTotal,
            break: w4breakTotal
        },
    }

    res.status(200).json(data).send();

})

router.post("/taskdata", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'BadRequest' }).send();
        return;
    }
    const { id, date } = req.body;
    const currDate = new Date(date);
    const currMonth = currDate.getMonth();
    const currYear = currDate.getFullYear();
    const currDay = currDate.getDate();
    const newDate = currYear + "-" + (currMonth + 1) + "-" + (currDay + 1);
    const nextDay = new Date(newDate);
    const query = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': currDate } }, { starTime: { '$lt': nextDay } }] }, { type: "Work" }, { userID: id }] }, { "timeTaken": 1 })
    const workTotal = query.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const query2 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': currDate } }, { starTime: { '$lt': nextDay } }] }, { type: "Meeting" }, { userID: id }] }, { "timeTaken": 1 })
    const meetingTotal = query2.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const query3 = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': currDate } }, { starTime: { '$lt': nextDay } }] }, { type: "Break" }, { userID: id }] }, { "timeTaken": 1 })
    const breakTotal = query3.reduce((acc, curr) => acc + curr.timeTaken, 0);
    const allTasks = await Task.find({ $and: [{ $and: [{ starTime: { '$gte': currDate } }, { starTime: { '$lt': nextDay } }] }, { userID: id }] }, { "__v": 0, "_id": 0 })
    res.status(200).json({ work: workTotal, meeting: meetingTotal, break: breakTotal, allTasks: allTasks }).send();

})

router.post("/addtask", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'BadRequest' }).send();
        return;
    }
    const { description, type, timeTaken, starTime } = req.body;
    try {
        const task = await new Task({
            userID: req.user._id,
            description: description,
            type: type,
            timeTaken: timeTaken,
            starTime: starTime
        })
        await task.save()
        const { __v, _id, ...other } = task._doc
        res.status(200).json(other).send()
    }
    catch (err) {
        if (err.code == "ERR_HTTP_HEADERS_SENT") { console.log(err.code) } else {
            console.error(err); res.status(500).json({ error: "Internal Server Error" }).send()
        }
    }
})

router.get("/gettask/:id", async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: 'BadRequest' }).send();
        return;
    }
    if (!(req.user.isAdmin || req.user._id == req.params.id)) {
        res.status(400).json({ error: "Invalid Permission" }).send()
        return;
    }
    try {
        const task = await Task.find({ userID: req.params.id }, { __v: 0, _id: 0 })
        res.status(200).json({ data: task }).send()
    }
    catch (err) {
        if (err.code == "ERR_HTTP_HEADERS_SENT") { console.log(err.code) } else {
            console.error(err); res.status(500).json({ error: "Internal Server Error" }).send()
        }
    }
})

module.exports = router