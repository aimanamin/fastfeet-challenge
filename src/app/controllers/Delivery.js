import * as Yup from 'yup';

import Delivery from '../models/delivery';
import Deliveryman from '../models/deliveryman';
import Recipient from '../models/recipient';

import Notification from '../schemas/notification';

import NotificationJob from '../jobs/notification';
import Queue from '../../lib/Queue';

class DeliveryController {
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
   * Delete a delivery
   * TODO: add notification and email send
   * @param {*} req
   * @param {*} res
   */
  async delete(req, res) {
    await Delivery.destroy({
      where: { id: req.params.id },
    });
    res.json({ status: 'ok' });
  }
}

export default new DeliveryController();
