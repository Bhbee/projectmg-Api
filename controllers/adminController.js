const projectController = require("../controllers/projectController");
const{Admin} = require("../models");

exports.getProjectAdmins = async(req, res) => {
    selectedproject = projectController.getSelectedProject()
    const projectAdmins = await selectedproject.findAll({
        include: Admin,
        required: true 
    })
    return res.status(200).json(projectAdmins) ;
}
exports.makeParticipantAdmin = async(req, res) => {
    Admins = getProjectAdmins()
    if(!req?.body?.username){
        return res.status(400).json({"message": "enter username"});
    }
    admin = req.body.username
    await selectedproject.addAdmins(admin)
        if (err) console.log("added")
        return res.status(201).json({"message": "Task created"})
}

exports.makeAdminParticipant = async(req, res) => {
    Admins = getProjectAdmins()
    if(!req?.params?.adminUsername){
        return res.status(400).json({"message": "username is required"});
    }
    const adminToDelete = await Admins.deleteOne({ where:{adminUsername: req.params.adminUsername}});
    res.json(result);
}
