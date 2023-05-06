const {
    Types: { ObjectId }
} = require('mongoose');

const User = require('../models/User');

const SharedService = require('./shared');

const getAllUsers = async (query) => {
    // ?isActive=true
    if (query.isActive) {
        const isActive = query.isActive === 'true';
        return await User.find({ isActive });
    }

    // ?project=1234567890 || ?project=null
    if (query.project) {
        // $or accepts an array of all OR conditions
        // declare the base or match array where we are looking for users not assiged to any projects
        const orMatch = [{ project: { $exists: false } }];

        // if the query specified a valid project id then add to the or match array
        // push in the condition that the user must already be associated the the project based on id
        if (query.project !== 'null') {
            orMatch.push({
                'project._id': {
                    $eq: ObjectId(query.project)
                }
            });
        }

        // user aggregate to compose a mongo query
        // $match where the user isActive
        // $lookup which project a user is associated to from the projects
        // $unwind the array into a single document object
        // $match where user must be on the specified project OR the must not be assigned to any other projects
        return await User.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $lookup: {
                    from: 'projects',
                    foreignField: 'users',
                    localField: '_id',
                    as: 'project'
                }
            },
            {
                $unwind: {
                    path: '$project',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: orMatch
                }
            }
        ]);
    }

    return await SharedService.all(User);
};

const getUserById = async (id) => await SharedService.get(User, id);

const updateUser = async (id, body) => {
    // require these Services inside the function to avoid circular dependency error
    const ProjectService = require('./project');
    const TaskService = require('./task');

    if (!body.isActive) {
        // when setting the user to inactive remove their associated project and tasks
        await TaskService.removeTaskUser(id);
        await ProjectService.removeProjectUser(id);
    }
    return await SharedService.update(User, id, body);
};

// IMPORTANT
// this support function has logic that is based off the Mongoose Models
// and those Models define the relationship between Project, Task and User
const getUsersProject = async (users) => {
    if (users instanceof Array) {
        return await User.find({ _id: users }).populate('project', 'name');
    } else {
        return await User.findOne({ _id: users }).populate('project', 'name');
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    getUsersProject
};
