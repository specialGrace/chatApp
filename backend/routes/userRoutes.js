import  express  from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import User from "../models/User.js"
import { validateSignup } from "../middleware/validateSignup.js"
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

router.post('/signup', validateSignup, async (req, res) => {
  try {
    const { email, phoneNumber, username, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      phoneNumber,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Login Route
router.post('/login', async (req, res) => {
  try {
    const { emailOrNumber, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrNumber }, { phoneNumber: emailOrNumber }],
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or phone number' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: user._id }, secret, {
      expiresIn: '1h',
    });

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Forgot Password (Mock implementation)
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    // Here you would typically send a password reset email
    // For this example, we'll just return a mock response
    res.json({ message: `Password reset link sent to ${email}` });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;








