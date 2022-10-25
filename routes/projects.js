const express = require("express");
const authController = require("../controllers/authController");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/tasksController");
const adminController = require("../controllers/adminController");
const participantController = require("../controllers/participationController");
const verifyRole = require("../middewares/verifyRoles");
const ROLES_LIST = require("../config/roles_list")
const router = express.Router();


router.post('/project', projectController.createNewProject);
router.route('/project/:id')
    .get(projectController.getSelectedProject)
    .put(verifyRole(ROLES_LIST.Participant, ROLES_LIST.Admin), projectController.updateSelectedProject)
    .delete(verifyRole(ROLES_LIST.Admin), projectController.deleteSelectedProject);
router.get('/project', authController.isLoggedIn, verifyRole(ROLES_LIST.Admin), projectController.getAllUserProject)



router.post('/projects/:id/join', participantController.requestToParicipate);
router.route('/projects/:id/participants')
    .get(participantController.getAllParticipant)
    .post(participantController.addNewParticipant)
    .delete(participantController.deleteParticipant);
router.get('/projects/:id/participant/participantsID', participantController.getParticipantDetails);



router.route('/projects/:id/admins')
    .get(adminController.getProjectAdmins)
    .post(adminController.makeParticipantAdmin)
router.delete('/projects/:id/admins/:adminUsername', (verifyRole(ROLES_LIST.superAdmin)),adminController.makeAdminParticipant);//make a made admin a participant



router.route('/projects/:id/tasks/:taskID')
    .get(taskController.showSelectedProjectTasks)
    .put(taskController.updateSelectedProjectTaskStatus)
    .delete(taskController.deleteSelectedProjectTasks);
router.post('/project/:id/task', taskController.addNewTask);



module.exports = router;






