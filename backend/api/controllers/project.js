const ProjectService = require('../services/project');

const getProjects = async (req, res) => {
    const { query } = req;

    try {
        const projects = await ProjectService.getAllProjects(query);
        res.json(projects);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};

const addProject = async (req, res) => {
    const { body } = req;

    try {
        const project = await ProjectService.addProject(body);
        res.json(project);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};

const getProjectById = async (req, res) => {
    const {
        params: { id }
    } = req;

    try {
        const project = await ProjectService.getProjectById(id);
        res.json(project);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};

const updateProject = async (req, res) => {
    const {
        body,
        params: { id }
    } = req;

    try {
        const project = await ProjectService.updateProject(id, body);
        res.json(project);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
};

module.exports = {
    getProjects,
    getProjectById,
    addProject,
    updateProject
};
