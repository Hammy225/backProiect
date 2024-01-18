import { Project , Judgment} from "../Models/models.js";
import { ErrorResponse } from "../utilities/error.js";

//get all judgments posted bu a user 
//route 
//
const getSentJudgments = async (req, res, next) => { 
    try {
        const judgment = await Judgment.find({user: req.user.id});
        
        if (!judgment) {
            return next(
                new ErrorResponse(
                    `judgment not found with id of ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({ succss: true, count: judgment.length, data: review });
    } catch (err) {
        next(err);
    }
};

//get all the judgments of a project 
//route 
//
const getJudgmentsForProject = async (req, res, next) => {   
    try {
        const judgments = await Judgment.findAll({ where: { projectId: req.params.id } });

        if (!judgments) {
            return next(
                new ErrorResponse(
                    `No judgments found for project with id of ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({ success: true, count: judgments.length, data: judgments });
    } catch (err) {
        next(err);
    }
};

//create a judgment 
//route
//
const createJudgment = async (req, res, next) => { 
    try {
        // Add user 
       // req.body.userId = req.user.id;
        req.body.projectId = req.params.id;

        console.log(req.params.projectId);

        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        req.body.projectName = project.title;
        
        const judgment = await Judgment.create(req.body);

        

        res.status(201).json({
            success: true,
            data: judgment
        });
    } catch (err) {
        next(err);
    }
};

export {getSentJudgments , getJudgmentsForProject , createJudgment}