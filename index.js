const mongoose = require("mongoose");
const dotenv = require("dotenv")
const path = require('path');
const express = require("express")
const cors = require("cors")
// const helmet = require("helmet");
// const morgan = require("morgan");
const authRoutes = require("./api/authRoutes.js")
// const emailRoutes = require("./api/emailRoute.js")
// const reactRouts = require("./src/reactRoutes.js")
dotenv.config()

const port = process.env.PORT || 9000

const app = express()

app.use(cors())
app.use(express.json())
// app.use(helmet())
// app.use(morgan("common"))
app.set('view engine', 'ejs');

// app.use('/static', express.static(path.join(__dirname, 'public')))
// app.use("", reactRouts)
app.use("/api/auth", authRoutes)
// app.use("/api/v1/email", emailRoutes)
// app.use("*",(req, res) => res.status(404).json({error:"Not Found"}))

mongoose.connect(process.env.DB_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })

app.listen(port, ()=>{
            console.log(`listening on port ${port}`);
        })