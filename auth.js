import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthenticationError } from 'apollo-server-express';

const JWT_SECRET = 'your-secret-key';

export const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/*
We define a JWT_SECRET constant to sign and verify the JWT tokens.
The generateToken function takes a user object and returns a signed JWT token containing the user's ID.
The verifyToken function verifies the provided token and returns the user ID if the token is valid.
The hashPassword function takes a plain-text password and returns a hashed version using bcrypt.
The comparePassword function compares a plain-text password with a hashed password.
*/