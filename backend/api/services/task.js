/* eslint-disable camelcase */
const Task = require('../models/task');

const ProjectService = require('./project');
const SharedService = require('./shared');
const UserService = require('./user');

const addTask = async (body) => {
    // when adding a task ensure user can be assigned to the task
    // the user should be active and assigned to the project that the task is associated to
    const user = await UserService.getUsersProject(body.user);

    if (!user.isActive) {
        throw new Error(`User ${user.first} ${user.last} is not active.`);
    }

    if (
        user.project &&
        user.project._id.toString() !== body.project.toString()
    ) {
        throw new Error(
            `User ${user.first} ${user.last} already assigned to project ${user.project.name}`
        );
    }

    if (!user.project && body.user) {
        // add the user to the project if they are assigned to this task
        // and currently are not assigned to any project
        await ProjectService.addProjectUser(body.project, body.user);
    }
    return await SharedService.create(Task, body);
};

const getTaskPriorities = () => {
    return Task.schema.path('priority').enumValues;
};

const getTaskStatuses = () => {
    return Task.schema.path('status').enumValues;
};

const getTaskById = async (id) => {
    return await Task.findById(id)
        .populate('project', 'name description')
        .populate('user');
};

const updateTask = async (id, body) => {
    const task = await Task.findById(id);

    if (!task) {
        throw new Error(`Task with ${id} not found.`);
    }

    // when updating a task ensure user can be assigned to the task
    // the user should be active and assigned to the project that the task is associated to
    const user = await UserService.getUsersProject(body.user || task.user);
    const project_id = body.project || task.project;

    if (!user.isActive) {
        throw new Error(`User ${user.first} ${user.last} is not active.`);
    }

    if (user.project && user.project._id.toString() !== project_id.toString()) {
        throw new Error(
            `User ${user.first} ${user.last} already assigned to project ${user.project.name}`
        );
    }

    // check the task status === assigned to updated the entire task
    // else only update the task status
    const updateTask =
        task.status === 'assigned' ? body : { status: body.status };

    if (!user.project && updateTask.user) {
        // add the user to the project if they are assigned to this task
        // and currently are not assigned to any project
        await ProjectService.addProjectUser(project_id, updateTask.user);
    }

    return await Task.findByIdAndUpdate({ _id: id }, updateTask, {
        returnDocument: 'after',
        runValidators: true
    });
};

const removeTask = async (id) => await SharedService.remove(Task, id);

// IMPORTANT
// this support function has logic that is based off the Mongoose Models
// and those Models define the relationship between Project, Task and User
const removeTaskUser = async (user) => {
    return await Task.updateMany({ user }, { $set: { user: null } });
};

module.exports = {
    addTask,
    getTaskById,
    updateTask,
    removeTask,
    removeTaskUser,

    getTaskPriorities,
    getTaskStatuses
};
