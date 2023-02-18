const Project = require("../models/Project");


exports.getProjectAdmins = async(req, res) => {
    try{
        const project = await Project.findById(req.params.id);
        const Admins = project.admins
        //console.log(Admins)
        res.status(200).json(Admins) 
    }catch(err){
        res.status(500).json(err) ;
    }
}


exports.makeParticipantAdmin = async(req, res) => {
    if(!req?.body?.username){
        return res.status(400).json({"message": "enter username"});
    }
    const project = await Project.findById(req.params.id);
    const allParticipants = project.participants
    const allAdmin = project.admins 
    const isAdmin = allAdmin.find(admins=> admins == req.user)
    const alreadyAdmin = allAdmin.find(admins=> admins == req.body.username)
    if(isAdmin){
        const participantExist = allParticipants.find(participants=> participants == req.body.username)
        try{
            if(!participantExist) return res.status(404).json({"message": "User with the provided username is not a participant in this project. Try making user a participant first "})
            if(participantExist && alreadyAdmin) return res.status(409).json({"message": "This user is already an admin"})
            if(participantExist && !alreadyAdmin){
                try{
                    await Project.findByIdAndUpdate(
                        req.params.id,
                        {
                            $push: { admins: req.body.username} 
                        },
                        {new: true}
                    );
                    res.status(201).json({"message": "Admin added"})
                }catch(err) {res.status(500).json(err) }
            return
            }
        }catch(err){{res.status(500).json(err) }}
    }
    res.status(401).json({"message": "Only admins are authorized to perform this action"})
}


exports.makeAdminParticipant = async(req, res) => {
    if(!req?.body?.username){
        return res.status(400).json({"message": "enter username"});
    }
    const project = await Project.findById(req.params.id);
    const allAdmin = project.admins 
    const isAdmin = allAdmin.find(admins=> admins == req.user)
    if(isAdmin){
        const adminExist = allAdmin.find(admins=> admins == req.body.username)
        try{
            if(!adminExist) res.status(200).json({"message": "User is already not an admin"})
            if(project.creator == req.body.username) return res.status(401).json({"message": "You are not authorized to withdraw admin rights from this user"});
            if(adminExist){
                try{
                    await Project.findByIdAndUpdate(
                        req.params.id,
                        {
                            $pull: { admins: req.body.username} 
                        },
                        {new: true}
                    );
                    res.status(200).json({"message": "Admin removed"})
                }catch(err) {res.status(500).json(err) }
            }
        }catch(err){{res.status(500).json(err) }}
    return
    }
    res.status(401).json({"message": "Only admins are authorized to perform this action"})
}
