import { ProjectRequirements } from "../Models/models.js";
import { ErrorResponse } from "../utilities/error.js";

//get project requiremenrts 
const getProjectRequirements = async (req, res, next) => { 
    try {
        const requirements = await ProjectRequirements.findByPk(req.params.id);

        if (!requirements) {
            return next(
                new ErrorResponse(`Project requirements not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({ success: true, data: requirements });
    } catch (err) {
        next(err);
    }
};

//update project requirements 
//
//
const updateProjectRequirements = async (req, res, next) => { 
    try {
        let requirements = await ProjectRequirements.findByPk(req.params.id);

        if (!requirements) {
            return next(
                new ErrorResponse(`Project requirements not found with id of ${req.params.id}`, 404)
            );
        }

        requirements = await requirements.update(req.body);

        res.status(200).json({
            success: true,
            data: requirements   
        });
    } catch (err) {
        next(
            new ErrorResponse(`Project requirements not updated`, 404)
        );
    }
};

export {getProjectRequirements , updateProjectRequirements};