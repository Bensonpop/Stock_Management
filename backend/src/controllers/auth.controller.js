const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


const register = async (req, res, next) => {
  try {
    console.log('Received registration request:', req.body);  
    const { name, password, role } = req.body;
    console.log('Registering user:', { name, role });

    if (!name || !password || !role) {
      console.log('Checking if user exists for name:', name); 
      return res.status(400).json({ error: 'Please provide name, password, and role' });
    }

    
    const userExists = await User.findOne({ username: name });
    console.log('User exists:', userExists);
    if (userExists) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    console.log('Creating new user with username:  1', name); 
    const user = await User.create({ username: name, password, role });
    console.log('User created successfully:-------', user); 

    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    console.log('Generated JWT token for user:', token); 
    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    
    const { name, password } = req.body;
    const username = name;
    console.log('Login request received for username:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Please provide both username and password' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET ,
      { expiresIn: process.env.JWT_EXPIRES_IN  }
    );

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };