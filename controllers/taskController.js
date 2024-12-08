const Task = require('../models/Task');

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      createdBy: req.userId,
      assignedTo,
    });

    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.userId });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { createTask, getTasks };
