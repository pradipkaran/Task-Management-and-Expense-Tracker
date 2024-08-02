const Task = require('../models/Task');
const User = require('../models/user');
const transporter = require('../config/nodemailer');

exports.createTask = async (req, res) => {
    const { title, description, deadline, category, assignedTo } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            deadline,
            category,
            assignedTo,
            createdBy: req.user._id,
        });

        if (assignedTo) {
            const user = await User.findById(assignedTo);
            if (user) {
                const mailOptions = {
                    from: process.env.MAIL_USER,
                    to: user.email,
                    subject: 'Task Assigned',
                    text: `You have been assigned a new task: ${task.title}`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(error.message);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
        }

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTask = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'deadline', 'status', 'category', 'assignedTo'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        updates.forEach((update) => (task[update] = req.body[update]));
        await task.save();

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
