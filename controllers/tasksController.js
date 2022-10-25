const{Task} = require("../models");
const projectController = require("../controllers/projectController");


exports.addNewTask = async(req, res) => {
    if(!req?.body?.title || !req?.body?.description){
        return res.status(400).json({"message": "title and description is required"});
    }
    try {const info ={
            "title": req.body.title,
            "description": req.body.description,
            "assignedTo": req.body.description};
        await Task.create(info)
            if (err) console.log(err)
            return res.status(201).json({"message": "Task created"})
    }
    catch (err) {return res.status(500).json({"message": err.message});}
}  

exports.showSelectedProjectTasks = async(req, res) => {
    selectedproject = projectController.getSelectedProject()
    const Task = await selectedproject.getTasks({
        include: Task,
        where: {title: req.params.title}, 
    });
    res.status(200).json(Task);
}

exports.deleteSelectedProjectTasks = async(req, res) => {
    selectedproject = projectController.getSelectedProject()
    const itsTask = await selectedproject.getTasks({where: { id: req.params.taskID}})
    const result = await itsTask.deleteOne({ where: { id: req.id}  });
    res.json(result);
    }

exports.updateSelectedProjectTaskStatus = async(req, res) => {
    selectedproject = projectController.getSelectedProject()
    const itsTask = await selectedproject.getTasks({where: { id: req.params.taskID}})
    if(itsTask.isCompleted == " ") itsTask.isCompleted = true;
    res.json("Done");
}
