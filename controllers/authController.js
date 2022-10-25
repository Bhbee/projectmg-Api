const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const{Users} = require("../models");


exports.register = async (req, res) => {
    const checkEmail = req.body.email;
    const emailExists = await Users.findOne({ where: { email: checkEmail }  });
    if (emailExists) { 
        return res.status(409).json({"message": "Email already in use"})//conflict
    }
    else if (req.body.password != req.body.passwordConfirm) {
        return res.status(400).json({"message": "Password dont match"})      
    };
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        const info ={
            "first_name": req.body.first_name,
            "last_name": req.body.last_name,
            "email": req.body.email,
            "username": req.body.username,
            "password": hashedPassword,
        };
        await Users.create(info)
            return res.status(201).json({"message": "User registered"})//success 
    }
    catch (err) {
        return res.status(500).json({"message": err.message})
    }
}

exports.login = async (req, res) => {
    const checkEmail = req.body.email;
    const userFound = await Users.findOne({ where: { email: checkEmail }});
    if(userFound){
        res.sendStatus(200).json({"message": "successful"});
    }
    res.sendStatus(401) //unauthorized     
    // try{
    //     let password_valid = await bcrypt.compare(checkPassword, userFound.password)
    //     if(password_valid){
    //         //create jwt
    //         const accessToken = jwt.sign(
    //             {
    //                 "UserInfo":{
    //                  "username": decoded.username,
    //                  "role": role
    //                 }
    //             },
    //             process.env.JWT_ACCESS_SECRET, 
    //             {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
    //         );
    //         const refreshToken = jwt.sign(
    //             { "username": userFound.username }, 
    //             process.env.JWT_REFRESH_SECRET, 
    //             {expiresIn: process.env.RERESH_TOKEN_EXPIRES_IN}
    //         );
    //         //save refresh_token to current user
    //         userFound.refreshToken = refreshToken;
    //         await userFound.save();
    //         const cookieOptions = {
    //             expires: new Date(
    //                 Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    //             ),
    //             httpOnly: true,
    //             sameSite: 'None',
    //             secure: true
    //         }
    //         res.cookie('userSaved', refreshToken, cookieOptions);
    //         res.json({accessToken});
    //         res.status(200).json({"message": "Login successful"});
    //     } 
    // } 
    // catch (err) {
    //     return res.status(401); //unauthorized
    // }
}

exports.isLoggedIn = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401); 
    const refreshToken = cookies.jwt;

    const userFound = await Users.findOne({ where: { refreshToken: refreshToken } });
    if (!userFound) return res.sendStatus(403) //forbidden 
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) =>{
            if(err || userFound.username != decoded.username) return res.sendStatus(403) //forbidden
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                     "username": decoded.username,
                     "role": role
                    }
                },
            
                process.env.JWT_ACCESS_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN}
            );
            res.json({accessToken})
        }
    ); 
}

exports.logout = async  (req, res) => {
    //on client side, also delete accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204)
    const userFound = await Users.findOne({ where: { refreshToken: refreshToken } });
    const cookieOptions = {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    }
    if(!userFound) {
        res.clearCookie('userSaved', cookieOptions)
        res.sendStatus(204);
    }
    //delete refreshtoken in db
    userFound.refreshToken = '';
    const result = await userFound.save();
    
    res.clearCookie('userSaved', cookieOptions);
    res.sendStatus(204);
}