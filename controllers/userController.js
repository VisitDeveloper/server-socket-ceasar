const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const MAX_AGE = 60 * 60 * 24 * 30; 

// Register a new user
exports.register = async (req, res) => {
  const { username, password, email } = req.body;
  try {

    if (!password) {  
      return res.status(400).json({ message: 'Password is required.' });
    }

    const existingUser = await User.findOne({ email });
    // const existingUser = await User?.findOne({email});
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists.' });
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    const secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
        { email },
        secret,
        { expiresIn: MAX_AGE }
    );

    res.status(201).json({ message: 'User registered successfully!' , token });
  } catch (error) {
    console.error(error); // این خط برای نمایش جزئیات خطا است
    res.status(500).json({ message: 'Error registering user.', error: error.message }); // پیغام خطای دقیق‌تر
  }
};

// Login a user
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // چک کردن وجود کاربر
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // مقایسه پسورد
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // ایجاد توکن JWT
    const secret = process.env.JWT_SECRET || '';
    const token = jwt.sign(
      { email: user.email },
      secret,
      { expiresIn: MAX_AGE } 
    );

    // ارسال پاسخ
    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error(error); // نمایش جزئیات خطا
    res.status(500).json({ message: 'Error logging in.', error: error.message });
  }
};


// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
};
