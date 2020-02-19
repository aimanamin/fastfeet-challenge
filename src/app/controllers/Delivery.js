import * as Yup from 'yup';

import Delivery from '../models/delivery';
import Deliveryman from '../models/deliveryman';
import Recipient from '../models/recipient';
import File from '../models/file';

import Notification from '../schemas/notification';

import CancellationJob from '../jobs/cancellation';
import NotificationJob from '../jobs/notification';
import Queue from '../../lib/Queue';

class DeliveryController {
  /**
   * Create delivery
   * @param {Object} req
   * @param {Object} res
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number()
        .positive()
        .required(),
      recipient_id: Yup.number()
        .positive()
        .required(),
      product: Yup.string()
        .min(5)
        .required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation error' });

    const { deliveryman_id, recipient_id, product } = req.body;

    const recipient = await Recipient.findByPk(recipient_id);

    if (!recipient)
      return res.status(404).json({ error: 'Recipient not found' });

    const deliveryman = await Deliveryman.findByPk(deliveryman_id, {
      attributes: ['name', 'email'],
    });

    if (!deliveryman)
      return res.status(404).json({ error: 'Deliveryman not found' });

    const delivery = await Delivery.create({
      deliveryman_id,
      recipient_id,
      product,
    });

    await Notification.create({
      content: `Nova encomenda disponível para retirada. ${recipient.name} está esperando por seu produto. Mais detalhes sobre a entrega enviados ao seu e-mail.`,
      user: deliveryman_id,
    });

    await Queue.add(NotificationJob.key, { deliveryman, recipient, product });

    return res.json(delivery);
  }

  /**
   * Update record
   * @param {Object} req
   * @param {Object} res
   */
  async update(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery)
      return res.status(404).json({ error: 'Delivery not found!' });

    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().positive(),
      recipient_id: Yup.number().positive(),
      product: Yup.string().min(5),
    });

    if (!(await schema.isValid(req.body)))
      return res.status(400).json({ error: 'Validation error' });

    const { deliveryman_id, recipient_id, product } = req.body;

    if (deliveryman_id && !(await Deliveryman.findByPk(deliveryman_id)))
      return res.status(404).json({ error: 'Deliveryman not found!' });

    if (recipient_id && !(await Recipient.findByPk(recipient_id)))
      return res.status(404).json({ error: 'Recipient not found!' });
    const newDelivery = await delivery.update(req.body);
    return res.json(newDelivery);
  }

  /**
   * Delete a delivery
   * add notification and email send
   * @param {Object} req
   * @param {Object} res
   */
  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
      ],
    });
    if (!delivery)
      return res.status(404).json({ error: 'Delivery not found!' });
    await Delivery.destroy({
      where: { id: req.params.id },
    });
    await Notification.create({
      content: `Delivery number ${delivery.id} has been cancelled. We have sent more informations on your e-mail`,
      user: `${delivery.deliveryman.id}`,
    });
    await Queue.add(CancellationJob.key, { delivery });
    return res.json(delivery);
  }

  /**
   * List all deliveries
   * @param {Object} req
   * @param {Object} res
   */
  async index(req, res) {
    const delivery = await Delivery.findAll({
      attributes: ['id', 'product'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });
    if (!delivery)
      return res.status(404).json({ error: 'Delivery not found!' });
    return res.json(delivery);
  }

  async show(req, res) {
    const delivery = await Delivery.findByPk(req.params.id, {
      attributes: ['id', 'product'],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['path', 'url'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['path', 'url'],
        },
      ],
    });
    if (!delivery)
      return res.status(404).json({ error: 'Delivery not found!' });
    return res.json(delivery);
  }
}

export default new DeliveryController();
