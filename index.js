const mongoose = require("mongoose");
const dotenv = require("dotenv")
const path = require('path');
const express = require("express")
const session = require("express-session")
const cors = require("cors")
const authRoutes = require("./api/authRoutes.js")
const taskRoutes = require("./api/taskRoutes.js")
const middleware = require("./middleware")
dotenv.config()

const port = process.env.PORT || 9000

const app = express()
app.use(middleware.run)
app.use(cors())
app.use(express.json())
app.use(session({ secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } }));
app.set('view engine', 'ejs');
app.use("/api/auth", authRoutes)
app.use("/api/task", taskRoutes)

mongoose.connect(process.env.DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })

app.listen(port, ()=>{
            console.log(`listening on port ${port}`);
        })