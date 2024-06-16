import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const login = (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = req.body;

  const user = {
    username: process.env.USER_USERNAME,
    password: process.env.USER_PASSWORD,
  };

  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
    res.status(200).json({ token, user: { username: user.username } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

export default login;
