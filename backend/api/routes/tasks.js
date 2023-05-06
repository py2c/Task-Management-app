const router = require('express').Router();

const task = require('../controllers/task');

// POST /tasks
router.post('/', task.addTask);

// GET /tasks/priorities
router.get('/priorities', task.getTaskPriorities);

// GET /tasks/statuses
router.get('/statuses', task.getTaskStatuses);

// GET /tasks/:id
router.get('/:id', task.getTaskById);

// PUT /tasks/:id
router.put('/:id', task.updateTask);

// DELETE /tasks/:id
router.delete('/:id', task.removeTask);

module.exports = router;
