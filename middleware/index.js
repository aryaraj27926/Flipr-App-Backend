const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()
class Middleware {
  async run(req, res, next) {
    try{
    if(req.path === "/api/auth/login"){
      next()
    }else{
    const token = req.headers.authorization.split(' ')[1];
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const expT = new Date(data.exp*1000);
    const currT = new Date();
    if (currT >= expT) {
        return res.status(400).json({error: 'Token Expired'});   
    }else{
        req.user = data;
        next();
    }}
  }catch(err){
    console.log(err);
    return res.status(400).json({error: 'Provide Token in authorization header'});
  }
  }
}

module.exports = new Middleware();