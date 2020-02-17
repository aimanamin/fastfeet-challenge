import * as Yup from 'yup';

import Recipient from '../models/recipient';

class RecipientController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      complemento: Yup.string(),
      post_code: Yup.string()
        .length(9)
        .matches(/[0-9]{5}-[\d]{3}/)
        .required(),
      city_id: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error!' });
    }

    const { id, name } = await Recipient.create(req.body);
    return res.json({ id, name });
  }

  async index(req, res) {
    const result = await Recipient.findAll({
      attributes: {
        exclude: ['createdAt', 'id', 'updatedAt'],
      },
    });
    return res.json(result);
  }

  async show(req, res) {
    const result = await Recipient.findByPk(req.params.id, {
      attributes: {
        exclude: ['createdAt', 'id', 'updatedAt'],
      },
    });
    if (!result) {
      return res.status(404).json({ error: 'User not found!' });
    }
    return res.json(result);
  }

  async put(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      complemento: Yup.string(),
      post_code: Yup.string()
        .length(9)
        .matches(/[0-9]{5}-[\d]{3}/),
      city_id: Yup.number().positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'validation error!' });
    }

    const result = await Recipient.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'User not found!' });
    }
    try {
      const recipient = await result.update(req.body);
      return res.json(recipient);
    } catch (error) {
      return res.status(500);
    }
  }

  async delete(req, res) {
    const result = await Recipient.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'User not found!' });
    }
    try {
      await Recipient.destroy({ where: { id: req.params.id } });
      return res.json({ status: 'ok' });
    } catch (error) {
      return res.status(500);
    }
  }
}

export default new RecipientController();
