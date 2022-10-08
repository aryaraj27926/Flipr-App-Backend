const express = require("express")
const router = express.Router()
const User = require("../models/user.js")
const bcrypt = require("bcryptjs")

router.post("/login", async (req,res)=>{
    if(req.method === 'POST') {
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
        const validatePass = await bcrypt.compare(req.body.password, user.password)
            if(!validatePass){
                res.status(401).statusMessage="Password Did not match"
                res.send()
            }
            else{
            const {password, __v,...other} = user._doc
            res.status(200).json(other).send()
            }
        }
    }
    catch(err){console.error(err);res.status(401)
        res.send()}
    }
})

module.exports = router