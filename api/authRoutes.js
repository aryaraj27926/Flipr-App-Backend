const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const bcrypt = require("bcryptjs")

router.get("/getemployee", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({message: 'BadRequest'});
        return;
    }
    if (!req.session.user) {
        res.status(400).statusMessage="User not Verified";res.send()
        return;
    }else if(!req.session.user.isAdmin){
        res.status(400).statusMessage="User not Admin";res.send()
        return;
    }
    try {
        const employee = await User.find({isAdmin:false}, {password:0, __v:0})
        res.status(200).json(employee).send()
        }
    catch(err){console.error(err);res.status(500).statusMessage="Internal Server Error";res.send()}
})

router.post("/addemployee", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({message: 'BadRequest'});
        return;
    }
    if (!req.session.user) {
        res.status(400).statusMessage="User not Verified";res.send()
        return;
    }else if(!req.session.user.isAdmin){
        res.status(400).statusMessage="User not Admin";res.send()
        return;
    }
    const { name, email, password, contact, department, joiningDate } = req.body;
    const isAdmin = false;
    try {
        const Emailuser = await User.findOne({email:email})
        if(Emailuser) {
        res.status(400).statusMessage="Email already exist";res.send()
        }else{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt)
        const user = await new User({
            name:name,
            email:email,
            password:hashedPass,
            contact:contact,
            department:department,
            joiningDate:joiningDate,
            isAdmin:isAdmin
        })
        await user.save()
        const {password, __v,...other} = user._doc
        res.status(200).json(other).send()
        }
    }
    catch(err){console.error(err);res.status(500).statusMessage="Internal Server Error";res.send()}
})

router.post("/login", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({message: 'BadRequest'});
        return;
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            res.status(400).statusMessage="User Not Found"
            res.send()}
        else{
        const validatePass = await bcrypt.compare(password, user.password)
            if(!validatePass){
                res.status(401).statusMessage="Password Did not match"
                res.send()
            }
            else if(user.isAdmin || user.isActive){
            const {password, __v,...other} = user._doc
            req.session.user = other
            res.status(200).json(other).send()
            }
            else{
                res.status(40).statusMessage="User is not active"
                res.send()
            }
        }
    }
    catch(err){console.error(err);res.status(401)
        res.send()}
})

module.exports = router