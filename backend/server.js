// start your server with: npm run start

// require in your dependencies
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const { username, password, dbName } = require('./config.json');

// call the express fn which creates the express application
// this allows us to use the full functionality for our express server
const app = express();
const port = 8888;

// require in our route resources
const projects = require('./api/routes/projects');
const tasks = require('./api/routes/tasks');
const users = require('./api/routes/users');

// apply middleware to the application
app.use(cors());
// middleware to parse POST/PUT bodies in express
app.use(express.json());

// add resource route to our express app
app.use('/projects', projects);
app.use('/tasks', tasks);
app.use('/users', users);

// start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

const URL = `mongodb+srv://${username}:${password}@cluster0.ctizv7j.mongodb.net/${dbName}?retryWrites=true&w=majority`;
mongoose
    .connect(URL)
    .then(() => console.log('Connected to Mongo'))
    .catch(() => console.log('Failed to Connect'));
