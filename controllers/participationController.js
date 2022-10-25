const projectController = require("../controllers/projectController");
const{Participant} = require("../models");

exports.requestToParicipate = async(req, res) => {
    res.send("send mail") //send mail
}

exports.getAllParticipant = async(req, res) => {
    selectedproject = projectController.getSelectedProject()
    const projectParticipants = await selectedproject.findAll({  
        include: Participant,
        required: true
    });
    res.status(200).json(projectParticipants);
}

exports.addNewParticipant = async(req, res) => {
    participants = getAllParticipant()
    if(!req?.body?.username){
        return res.status(400).json({"message": "enter username"});
    }
    const nameToCheck = req.body.username;
    const participant = await participants.findOne({where: { name: nameToCheck }});
    if(participant)
        try {
            const info ={
                "name":req.body.username,
                "name": req.params.ProjectTitle
            };
            await Role.create(info)
                if (err) console.log("added") 
                return res.status(201).json({"message": "User registered"})//success 
        }
        catch (err) {
            return res.status(500).json({"message": err.message})
        }
    return res.status(409).json({"message": "Already a participant"})//conflict
}
exports.deleteParticipant = async(req, res) => {
    if(!req?.params?.projectTitle?.id) {
        return res.status(400).json({"message": "Project id is required"});}
    const project = await Project.findOne({ where: { id: req.params.id}  });
    if(!project) {
        return res.status(204).json({"message": "No project matches"});}
    const result = await Project.deleteOne({ where: { id: req.params.id}  });
    res.json(result);
}
exports.getParticipantDetails = async(req, res) => {
    if(!req?.params?.projectTitle?.id){
        return res.status(400).json({"message": "participantID is required"});
    }
    else if(!project) return res.status(204).json({"message": "No project matches given title "});
    const participantDetails = await Project.findAll({ 
        where: { id: req.params.id}, 
        include: Participant,
        required: true
    });
    res.status(200).json(participantDetails);
}
