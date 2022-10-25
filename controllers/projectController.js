const { User } = require("../config/roles_list");
const{Project} = require("../models");

exports.getAllUserProject = async(req, res) => {
    const usersProjects = await User.findAll(
        {where: {id: req.params.id},
        include: Project,
        required: true 
    })
    return res.status(200).json(usersProjects) ;
    
}

exports.createNewProject = async(req, res) => {
    if(!req?.body?.title || !req?.body?.description){
        return res.status(400).json({"message": "title and description"});
    }
    try {
        const info ={
            "projectTitle": req.body.title,
            "description": req.body.description,
            "creator": req.body.username,
            "superAdmin": true //The loggedin user username should be fetched
        };
        await Project.create(info)
            if (err) console.log("added")
            return res.status(201).json({"message": "Project created"})//success 
    }
    catch (err) {
        return res.status(500).json({"message": err.message});
    }
}

exports.getSelectedProject = async(req, res) => {
    if(!req?.params?.id){
        return res.status(400).json({"message": "title is a required parameter"});
    }
    const project = await Project.findOne({ where: { id: req.params.id}  });
    if(!project) {
        return res.status(204).json({"message": "No project matches search"});}
    res.json(project);
}

exports.updateSelectedProject = async(req, res) => {
    if(!req?.params?.id){
        return res.status(400).json({"message": "id parameter is required"});
    }
    const project = await Project.findOne({ where: { id: req.params.id}  });
    if(!project) {
        return res.status(204).json({"message": "No project matches search" });}
    else {
        id = req.body.id;
        description = req.body.description;
    }
    const result = await project.save();
    res.json(result);
}
exports.deleteSelectedProject = async(req, res) => {
    if(!req?.params?.id) {
        return res.status(400).json({"message": "Project id is required"});}
    const project = await Project.findOne({ where: { id: req.params.id}  });
    if(!project) {
        return res.status(204).json({"message": "No project matches search"});}
    const result = await Project.deleteOne({ where: { id: req.params.id}  });
    res.json(result);
}



