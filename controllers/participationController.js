const nodemailer = require("nodemailer")
const Project = require("../models/Project");
const Users = require("../models/Users")



exports.requestToParticipate = async(req, res) => {
    const project = await Project.findById(req.params.id);
    const admins = project.admins
    
    admins.forEach(myFunction);

    function myFunction(value, index, array) {
      txt += value;
    }
    console.log( recipient)
    //map
    
    // if(!project) return res.send(400).json({"message": "Project not found"})
    // else{
    //     var transporter = nodemailer.createTransport({
    //         service: 'gmail',
    //         auth: {
    //             user: "samuelchristiana38@gmail.com",
    //             pass: "lfdeltnqsdtoqbrc",
    //         },
    //     });

    //     var mailOptions = {
    //         from: req.userEmail,
    //         to: recipient,
    //         subject: "Request to be a participant",
    //         text: "I will love to participate in thi project",
    //     };
    
    //     transporter.sendMail(mailOptions, function (error, info) {
    //         if (error) {
    //             console.log(error);
    //         } else {
    //             console.log("Email sent: " + info.response);
    //         }
    //     });
    //}
   
}


exports.getAllParticipant = async(req, res) => {
    try{
        const project = await Project.findById(req.params.id);
        const Participants = project.participants
        if(!project) return res.send(400).json({"message": "Project not found"})
        if(!Participants) return res.send(400).json({"message": "Project doesn't have any participant yet"})
        else{
           return res.status(200).json(Participants) 
        }
    }catch(err){
        res.status(500).json(err) ;
    }
}


exports.addNewParticipant = async(req, res) => {
    const username = req.body.username
    const UserExist = await Users.findOne({username});
    const project = await Project.findById(req.params.id);
    const allParticipants = project.participants 
    const participantExist = allParticipants.find(participants=> participants == username)
    const allAdmin = project.admins
    const isAdmin = allAdmin.find(admins=> admins === req.user)
    if(!req?.body?.username ){
        return res.status(400).json({"message": "Please enter a username"});
    }
    if(!UserExist) return res.status(404).json({"message": "User with the provided username doesn't exist"})
    
    else if(isAdmin){
        try{
            if(!participantExist && UserExist){
                await Project.findByIdAndUpdate(
                    req.params.id,
                    {
                        $push: { participants: username} 
                    },
                    {new: true}
                );
                res.status(201).json({"message": "Participant added"})
            }
            else if(UserExist && participantExist) return res.status(409).json({"message": "Already a participant"})
            res.status(404).json({"message": "try another username!"})
        }catch(err){res.status(500).json(err) }
    }     
    else{
        res.status(401).json({"message": "Project can only be modified by it's creator and admins"})
    }
}


exports.deleteParticipant = async(req, res) => {
    const username = req.body.username
    const project = await Project.findById(req.params.id)
    const Participants = project.participants
    const allAdmin = project.admins 
    const isAdmin = allAdmin.find(admins=> admins === req.user)
    if(isAdmin){
        const participantExist = Participants.find(participants=> participants == username)
        if(!participantExist) return res.status(200).json({"message": "User is not a participant"})
        else{ 
            try{
                await Project.findByIdAndUpdate(
                    req.params.id,
                    {
                        $pull: { participants: participantExist } 
                    },
                    {new: true}
                );
                res.status(200).json({"message": "participant deleted"});
            }catch(err){res.status(500).json(err)}  
            
        }
    }else{
        res.status(401).json({"message": "Project can only be deleted by it's creator only"})
    } 
}


exports.getParticipantDetails = async(req, res) => {
    //const username = req.params;
    const { id, username } = req.params;
    const userProfile = await Users.findOne({username})
    let details = []
    const {_id, password, refreshToken, ...other} = userProfile._doc
    try{ 
        details.push(other)
        res.status(200).json(details);
    }catch(err){res.status(500).json(err)}  
}
