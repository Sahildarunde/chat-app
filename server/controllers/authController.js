const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        res.writeHead(201);
        res.end(JSON.stringify({ message: 'User registered successfully' }));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Registration failed' }));
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: 'Incorrect password' }));
            return;
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET);
        res.writeHead(200);
        res.end(JSON.stringify({ token }));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ message: 'Login failed' }));
    }
};
