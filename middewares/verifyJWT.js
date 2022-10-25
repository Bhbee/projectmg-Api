const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startWith('Bearer')) return res.sendStatus(401);   
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET,
        (err, decoded) =>{
            if(err){
                return res.sendStatus(403); //forbidden, invalid token
            }
            req.user = decoded.userInfo.username;
            req.roles = decoded.userInfo.roles;
            next();
        }
    )
}

module.exports = verifyJWT;