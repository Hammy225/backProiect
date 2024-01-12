import express from "express";

import * as AuthentificationController from "../Controllers/authentification.js";
import * as projectController from "../Controllers/projects.js";
import* as judgmentController from '../Controllers/judgment.js';
import* as requirementController from '../Controllers/requirement.js';

import {protect , authorize} from '..//Middleware/authentification.js';



const router = express.Router();

//rewuirememts
//router.get('/requirement/:id', requirementController.getProjectRequirements);
//router.put('/requirement_add/:id', requirementController.updateProjectRequirements);
//judgments
router.post('/create', judgmentController.createJudgment);
router.get('/sent', judgmentController.getSentJudgments);
router.get('/project/:id', judgmentController.getJudgmentsForProject);
//authentification
router.post('/register', AuthentificationController.register);//bine
router.post('/login', AuthentificationController.login);//bine
router.put('/updatedetails', AuthentificationController.updateDetails);


//router.put('/updatepassword', AuthentificationController.updatePassword);


router.get('/me',protect , AuthentificationController.getMe);



//project
router.post('/project', projectController.createProject);
router.get('/project/:id', projectController.getProjectById);
router.get('/projects', projectController.getProjects);
router.get('/project/user/:userId', projectController.getProjectByUser);
router.put('/project/:id', projectController.updateProject);
router.delete('/project/:id', projectController.deleteProject);


export {router};


