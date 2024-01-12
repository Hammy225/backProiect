import { Project } from "../Models/models.js";
import { ErrorResponse } from "../utilities/error.js";

//get all projects 

const getProjects = async (req, res, next) => { 
    try {
        const projects = await Project.findAll();

        if(projects.length === 0) {
           return res.status(204).json({ success: true, data: projects });
        }

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};


//get a project by id 
const getProjectById = async (req, res, next) => { 
    try {
        req.body.user = req.user.id;
        
        const project = await Project.findByPk(req.params.id);

        if (!project) {
            return next(
                new ErrorResponse(
                    `Project not found with id of ${req.params.id}`,
                    404
                )
            );
        }

        res.status(200).json({ success: true, data: project });
    } catch (err) {
        next(err);
    }
};

//get project by user
const getProjectByUser = async (req, res, next) => { 
    try {
        const projects = await Project.findAll({ where: { userId: req.user.id } });

        if (!projects || projects.length === 0) {
            return next(
                new ErrorResponse(
                    `No projects found for user with id of ${req.user.id}`,
                    404
                )
            );
        }

        res.status(200).json({ success: true, data: projects });
    } catch (err) {
        next(err);
    }
};


//create a project 
const createProject = async (req, res, next) => {
    try {
        // Check if user is defined
        if (!req.user) {
            return next(new ErrorResponse('Authentication failed', 401));
        }

        // Add user 
        req.body.user = req.user.id;

        // Check for published project
        const publishedProject = await Projects.findOne({ user: req.user.id });
        
        // if user != admin, can only add 1 project
        if(publishedProject && req.user.role !=='admin') {
            return next
            (new ErrorResponse(
                `The user with ID ${req.user.id} has already published a project`, 
                400
                )
            );
        }

        const projects = await Projects.create(req.body);
        

        res.status(201).json({
            success: true,
            data: projects
        });
    } catch (err) {
        next(err);
    }
};


//update projecy
const  updateProject = async (req, res, next) => { 
    try {
        let projects = await Projects.findById(req.params.id);

        if (!projects) {
            return next(
                new ErrorResponse(
                    `projects not found with id of ${req.params.id}`,
                    404
                )
            );
        }

        if(projects.user.toString() !== req.user.id) {
            return next(
                new ErrorResponse(
                    `User ${req.params.id} is not authorized to update this project`,
                    401 
                )
            );
        }

        projects = await Projects.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        next(err);
    }
};

//delete project 
const deleteProject = async (req, res, next) => { 
    try {         
        let project = await Project.findByPk(req.params.id);

        if (!project) {
            return next(
                new ErrorResponse(
                    `Project not found with id of ${req.params.id}`,
                    404
                )
            );
        }

        if(project.userId.toString() !== req.user.id) {
            return next(
                new ErrorResponse(
                    `User ${req.params.id} is not authorized to delete this project`,
                    401 
                )
            );
        }

        await project.destroy();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};

export {getProjects , getProjectById , getProjectByUser , createProject , updateProject , deleteProject};