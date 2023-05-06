const TaskService = require('../services/task');

const addTask = async (req, res) => {
    const { body } = req;

    try {
        const task = await TaskService.addTask(body);
        res.json(task);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};

const getTaskById = async (req, res) => {
    const {
        params: { id }
    } = req;

    try {
        const task = await TaskService.getTaskById(id);
        res.json(task);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateTask = async (req, res) => {
    const {
        params: { id },
        body
    } = req;

    try {
        const task = await TaskService.updateTask(id, body);
        res.json(task);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};

const removeTask = async (req, res) => {
    const {
        params: { id }
    } = req;

    try {
        const task = await TaskService.removeTask(id);
        res.json({ deleted: task });
    } catch (error) {
        res.status(500).json(error);
    }
};

const getTaskPriorities = (req, res) => {
    try {
        const priorities = TaskService.getTaskPriorities();
        res.json(priorities);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getTaskStatuses = (req, res) => {
    try {
        const status = TaskService.getTaskStatuses();
        res.json(status);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    addTask,
    getTaskById,
    updateTask,
    removeTask,

    getTaskPriorities,
    getTaskStatuses
};
