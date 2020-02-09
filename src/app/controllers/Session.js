import jwt from 'jsonwebtoken';

import User from '../models/user';
import { secret, expiresIn } from '../../configs/auth';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Username or Password incorrect!' });
    }

    const { id, is_administrator } = user;
    return res.json({
      token: jwt.sign({ id, is_administrator }, secret, { expiresIn }),
    });
  }
}
export default new SessionController();
