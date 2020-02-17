import * as Yup from 'yup';

import Deliveryman from '../models/deliveryman';
import File from '../models/file';

class DeliverymanController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'validation error!' });

    const userExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });

    if (userExists)
      return res.status(400).json({ error: 'User email already registered' });

    await Deliveryman.create(req.body);
    return res.json({ status: 'ok' });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'validation error!' });

    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) return res.status(404).json({ error: 'User not found' });
    await deliveryman.update(req.body);
    return res.json({ status: 'ok' });
  }

  async index(req, res) {
    const results = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url', 'name'],
        },
      ],
    });
    return res.json(results);
  }

  async show(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['path', 'url', 'name'],
        },
      ],
    });
    if (!deliveryman) return res.status(404).json({ error: 'User not found' });
    return res.json(deliveryman);
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);
    if (!deliveryman) return res.status(404).json({ error: 'User not found' });
    await Deliveryman.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({ status: 'ok' });
  }
}
export default new DeliverymanController();
