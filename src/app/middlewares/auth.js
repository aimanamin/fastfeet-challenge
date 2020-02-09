import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { secret } from '../../configs/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Not authorized!' });
  }
  const [, token] = authHeader.split(' ');
  try {
    const { is_administrator, id } = await promisify(jwt.verify)(token, secret);
    req.is_administrator = is_administrator;
    req.id = id;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized!' });
  }
};

export function privillageCheck(req, res, next) {
  if (!req.is_administrator) {
    return res.status(401).json({ error: 'Not authorized!' });
  }
  return next();
}
