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
router.post('/judgment/create/:id', judgmentController.createJudgment); // DONE
//router.get('/judgment/sent', judgmentController.getSentJudgments);
router.get('/judgment/:id', judgmentController.getJudgmentsForProject); // done

//authentification
router.post('/register', AuthentificationController.register);// DONE
router.post('/login', AuthentificationController.login);// DONE
//router.put('/updatedetails',protect, AuthentificationController.updateDetails);
router.get('/me', protect , AuthentificationController.getMe); // DONE
//router.put('/updatepassword', AuthentificationController.updatePassword);

//project
router.post('/project', protect, authorize('student', 'judge', 'admin'), projectController.createProject); // DONE 
router.get('/project/:id', protect, projectController.getProjectById); // done
router.get('/projects', protect, authorize('judge', 'professor', 'student'), projectController.getProjects); // done
//router.get('/project/user/:userId', protect, projectController.getProjectByUser);
router.put('/project/update/:id', protect, authorize('student', 'judge', 'admin'), projectController.updateProject); // done
router.delete('/project/delete/:id', protect, authorize('student', 'judge', 'admin'), projectController.deleteProject); // done


export {router};


