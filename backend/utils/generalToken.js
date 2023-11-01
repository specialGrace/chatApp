import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;


const generateToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: '7d'
  });
};

module.exports = generateToken;
