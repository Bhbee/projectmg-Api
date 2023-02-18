const Project = require("../models/Project");

//Get all users projects or all projects created by a particular user using a query string
exports.getAllUserProject = async(req, res) => {
    const creator = req.query.user
    try{
        let projects
        const page = req.query.p || 0
        const projectsPerPage = 3
        if (creator){
            projects = await Project
            .find({creator})
            .skip(page * projectsPerPage)
            .limit(projectsPerPage)
        }else{
            projects = await Project.find()
            .skip(page * projectsPerPage)
            .limit(projectsPerPage)
        }
        res.status(200).json(projects) 
    }catch(err){
        res.status(500).json(err) ;
    }   
}


//Create New Project
exports.createNewProject = async(req, res) => {
    if(!req?.body?.title || !req?.body?.description){
        return res.status(400).json({"message": "title and description are required"});
    }
    try {
        const info ={
            "title": req.body.title,
            "description": req.body.description,
            "creator": req.user, 
            "admins": [req.user]
        };
        await Project.create(info)
        res.status(201).json({"message": "Project created"})// created
    }
    catch (err) {
        return res.status(500).json({"message": err.message});
    }
}


//Get project by id
exports.getSelectedProject = async(req, res) => {
    const project = await Project.findById(req.params.id);
    if(!project) {
        return res.status(204).json({"message": "No project matches search"});}
    res.json(project);
}


//Modify project details(PS: can only be done by the creator and participant of a project)
exports.updateSelectedProject = async(req, res) => {
    const project = await Project.findById(req.params.id);
    const allAdmin = project.admins 
    const isAdmin = allAdmin.find(admin=> admin == req.user)
    
    try{
        if(!project) {
            return res.status(200).json({"message": "No project matches search" });
        }
        else if(isAdmin){
            try{
                const updatedProject = await Project.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body
                    },
                    {new: true}
                );
                res.status(200).json(updatedProject)
            }catch(err) {res.status(500).json(err) }
        }
        else{
            res.status(401).json({"message": "Project can only be modified by it's creator"})
        }
    }
    catch(err){res.status(500).json(err) }
}


//Delete selected project(Can only be done by creator of the selected project)
exports.deleteSelectedProject = async(req, res) => {
    const project = await Project.findById(req.params.id);
    const allAdmin = project.admins 
    const isAdmin = allAdmin.find(admin=> admin == req.user)
    
    try{
        if(!project) {
            res.status(204).json({"message": "No project matches search"});
        }
        else if(isAdmin){
            try{
                await project.delete();
                res.status(200).json({"message": "project deleted"});
            }catch(err){
                res.status(500).json(err)
            }
        }
        else{
            res.status(401).json({"message": "Project can only be deleted by it's creator only"})
        }
    }catch(err){
        res.status(500).json(err)
    }  
}



