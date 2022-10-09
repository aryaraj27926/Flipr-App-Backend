const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

router.get("/getemployee", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    if(!req.user.isAdmin){
        res.status(400).json({error:"User not Admin"}).send()
        return;
    }
    try {
        const employee = await User.find({isAdmin:false}, {password:0, __v:0})
        res.status(200).json({data:employee}).send()
        }
    catch(err){console.error(err);res.status(500).json({error:"Internal Server Error"}).send()}
})

router.post("/addemployee", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    if(!req.user.isAdmin){
        res.status(400).json({error:"User not Admin"}).send()
        return;
    }
    const { name, email, password, contact, department, joiningDate } = req.body;
    const isAdmin = false;
    try {
        const Emailuser = await User.findOne({email:email})
        if(Emailuser) {
        res.status(400).json({error:"Email already exist"}).send()
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
    catch(err){console.error(err);res.status(500).json({error:"Internal Server Error"}).send()}
})

router.post("/login", async (req,res)=>{
    if(!req.body) {
        res.status(400).json({error: 'BadRequest'}).send();
        return;
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({email: email});
        if(!user){
            res.status(400).json({error:"User Not Found"}).send()}
        else{
        const validatePass = await bcrypt.compare(password, user.password)
            if(!validatePass){
                res.status(400).json({error:"Password Did not match"}).send()
            }
            else if(user.isAdmin || user.isActive){
            const {password, __v,...other} = user._doc
            console.log(process.env.JWT_SECRET);
            const token = jwt.sign(other, process.env.JWT_SECRET, { expiresIn: '12h' });
            const userData = {
                token: token,
                user: other
              }
            res.status(200).json(userData).send()
            }
            else{
                res.status(400).json({error:"User is not active"}).send()
            }
        }
    }
    catch(err){console.error(err);res.status(500).json({error:"Internal Server Error"}).send()}
})

module.exports = router