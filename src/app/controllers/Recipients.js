import Recipient from '../models/recipient';

class RecipientController {
  async store(req, res) {
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
    const result = await Recipient.findByPk(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'User not found!' });
    }
    try {
      const recipient = await result.update(req.body);
      return res.json(recipient);
    } catch (error) {
      console.error(error);
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
