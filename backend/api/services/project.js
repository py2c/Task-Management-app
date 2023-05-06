const Project = require('../models/project');

const SharedService = require('./shared');
const UserService = require('./user');

// helper function which interacts with the UserService
const _getValidUsers = async (users) => {
    if (users && users.length) {
        let userProjects = await UserService.getUsersProject(users);

        if (typeof users === 'string') {
            userProjects = [userProjects];
        }

        // always return users that can be assigned to the project
        // if a user is already assigned to another project then filter them out
        return userProjects
            .filter((user) => user.isActive && !user.project)
            .map((user) => user._id);
    }

    return [];
};

const getAllProjects = async (query) => {
    if (query.name) {
        return await Project.find({
            name: { $regex: query.name, $options: 'i' }
        });
    }

    return await Project.find({}).populate('manager');
};

const addProject = async (body) => {
    const { users, ...project } = body;

    // when adding a project ensure manager and associated users can be assigned to the project
    const manager = await UserService.getUsersProject(project.manager);
    const validUsers = await _getValidUsers(users);

    if (!manager) {
        throw new Error(`Manager does not exist.`);
    }

    if (!manager.isActive || manager.project) {
        throw new Error(
            `Manager ${manager.first} ${manager.last} cannot be assigned to project.`
        );
    }

    return await SharedService.create(Project, {
        ...project,
        users: validUsers
    });
};

const getProjectById = async (id) => {
    return await Project.findById(id).populate('manager').populate('tasks');
};

const updateProject = async (id, body) => {
    const { users, ...project } = body;

    // when updating a project ensure manager and associated users can be assigned to the project
    let manager;
    let validUsers = [];

    if (project.manager) {
        manager = await UserService.getUsersProject(project.manager);
        if (!manager) {
            throw new Error(`Manager does not exist.`);
        }
        if (!manager.isActive || manager.project) {
            throw new Error(
                `Manager ${manager.first} ${manager.last} cannot be assigned to project.`
            );
        }
    }

    if (users) {
        validUsers = await _getValidUsers(users);
    }

    return await Project.findByIdAndUpdate(
        id,
        {
            $set: { ...project },
            $addToSet: { users: validUsers }
        },
        { returnDocument: 'after' }
    );
};

// IMPORTANT
// these two support functions have logic that is based off the Mongoose Models
// and those Models define the relationship between Project, Task and User
const addProjectUser = async (id, user) =>
    await Project.findByIdAndUpdate(id, { $addToSet: { users: user } });

const removeProjectUser = async (user) => {
    return await Project.findOneAndUpdate(
        { users: { $in: user } },
        { $pull: { users: user } }
    );
};

module.exports = {
    getAllProjects,
    addProject,
    getProjectById,
    updateProject,
    addProjectUser,
    removeProjectUser
};
