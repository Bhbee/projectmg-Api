const verifyRole = (allowedRole) =>{
    return (req, res, next) => {
        if(!req?.role) return res.sendStatus(401);
        (req.role === allowedRole)
        next()
    }

}
module.exports = verifyRole;