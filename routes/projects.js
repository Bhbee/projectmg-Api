const express = require("express");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/tasksController");
const adminController = require("../controllers/adminController");
const participantController = require("../controllers/participationController");

const router = express.Router();


router.post('/', projectController.createNewProject);
router.route('/select/:id')
    .get(projectController.getSelectedProject)
    .put(projectController.updateSelectedProject)
    .delete(projectController.deleteSelectedProject);
router.get('/',  projectController.getAllUserProject)



router.post('/:id/join', participantController.requestToParticipate);
router.route('/:id/participants')
    .get(participantController.getAllParticipant)
    .post(participantController.addNewParticipant)
    .delete(participantController.deleteParticipant)
router.route('/:id/participants/:username')
    .get(participantController.getParticipantDetails)
    

router.route('/:id/admins')
    .get(adminController.getProjectAdmins)
    .post(adminController.makeParticipantAdmin)
    .delete(adminController.makeAdminParticipant)//make a made admin a participant



router.route('/:id/tasks/:taskID')
    .get(taskController.showSelectedTask)
    .put(taskController.updateSelectedProjectTaskStatus)
    .delete(taskController.deleteSelectedProjectTasks);
router.put('/:id/task', taskController.addNewTask);
router.get('/:id/task', taskController.showProjectTasks);



module.exports = router;






