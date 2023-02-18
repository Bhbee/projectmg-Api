const Project = require("../models/Project");


exports.addNewTask = async(req, res) => {
    if(!req?.params?.id){
        return res.status(400).json({"message": "id parameter is required, a project must be selected"});
    }
    try {
        const project = await Project.findById(req.params.id);
        if(!req?.body?.title || !req?.body?.description){
            return res.status(400).json({"message": "title and description is required"});
        }
        const allAdmin = project.admins 
        const isAdmin = allAdmin.find(admins=> admins == req.user)
    
        if(isAdmin){
            try{
                NEW_TASK = {
                    "title": req.body.title,
                    "description": req.body.description,
                    "assignedTo": req.body.assignedTo,
                    "isCompleted": false
                }
                await Project.findByIdAndUpdate(
                    req.params.id,
                    {
                        $push: { tasks: NEW_TASK } 
                    },
                    {new: true}
                );
                res.status(200).json({"message": "Task added"})
            }catch(err) {res.status(500).json(err) }
        }
        else{
            res.status(401).json({"message": "Project can only be modified by it's creator and participants"})
        }
    }
    catch (err) {return res.status(500).json({"message": err.message});}
}  


exports.showProjectTasks = async(req, res) => {
    const project = await Project.findById(req.params.id);
    try{
        const tasks = project.tasks
        if(!tasks) res.status(400).json({"message": "No task available for this project"})
        else{
            res.status(200).json(tasks)
        }
    }catch(err){
        res.status(500).json(err) ;
    }   
}


exports.showSelectedTask = async(req, res) => {
    const { id, taskID } = req.params;
    if(!req?.params?.taskID) return res.status(400).json({"message": "taskID parameter is required, a project must be selected"});
    try{
        const project = await Project.findById(id);
        const tasks = project.tasks
        if(!tasks) return res.status(400).json({"message": "No task available for this project"})
        else{
            let selectedTask = tasks.find(tasks=> tasks._id == taskID)
            if(selectedTask) return res.status(200).json(selectedTask)
            else return res.status(404).json({"message": "This task does not exist"})
        }
    }catch(err){
        res.status(500).json(err) ;
    }   
}


exports.deleteSelectedProjectTasks = async(req, res) => {
    const { id, taskID } = req.params;
    const project = await Project.findById(id)
    const task = project.tasks
    const allAdmin = project.admins 
    const isAdmin = allAdmin.find(admins=> admins == req.user)

    if(isAdmin){
        let selectedTask = task.find(tasks=> tasks._id == taskID)
        try{
            if(!selectedTask) return res.status(204).json({"message": "Task doesn't exit"})
            else{
                try{                    
                    await Project.findByIdAndUpdate(
                        id,
                        {
                            $pull: { tasks: selectedTask } 
                        },
                        {new: true}
                    );
                    res.status(200).json({"message": "task deleted"});
                }catch(err) {res.status(500).json(err) };
            }
        }catch(err) {res.status(500).json(err) };
    }else{
        res.status(401).json({"message": "task can only be deleted by it's creator only"})
    } 
}


exports.updateSelectedProjectTaskStatus = async(req, res) => {
    const { id, taskID } = req.params;
    const project = await Project.findById(id)
    const tasks = project.tasks
    try {
        if(!tasks) res.status(400).json({"message": "No task available for this project"})
        else{ 
            let selectedTask = tasks.find(tasks=> tasks._id == taskID)
            if(!selectedTask) return res.status(400).json({"message": "Task doesn't exist"})
            if(selectedTask.assignedTo == req.user){
                try {
                    selectedTask.isComplete = req.body.isComplete
                    console.log(selectedTask)
                    res.status(200).json({"message": "task status updated"}); 
                } catch (err) {res.status(500).json(err) }
            }
            res.status(401).json({"message": "Only participant this task is assigned is authorized to perform this action"}) 
        }
    }catch (err) {res.status(500).json(err) }
}     
