import jwt from 'jsonwebtoken';

// Note the change here from { id } to { userId } to match the middleware
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

