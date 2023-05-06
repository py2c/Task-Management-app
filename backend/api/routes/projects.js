const router = require('express').Router();

const project = require('../controllers/project');

// GET /projects
router.get('/', project.getProjects);

// POST /projects
router.post('/', project.addProject);

// GET /projects/:id
router.get('/:id', project.getProjectById);

// PUT /projects/:id
router.put('/:id', project.updateProject);

module.exports = router;
