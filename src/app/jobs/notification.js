import Mail from '../../lib/Mail';

class NotificationJob {
  get key() {
    return 'notificationJob';
  }

  async handle({ data }) {
    const { deliveryman, recipient, product } = data;
    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Nova encomenda disponivel para retirada`,
      template: 'notifications',
      context: {
        deliveryman: deliveryman.name,
        recipient,
        product,
      },
    });
  }
}

export default new NotificationJob();
