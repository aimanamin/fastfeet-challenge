import Mail from '../../lib/Mail';

class CancellationJob {
  get key() {
    return 'CancellationJob';
  }

  async handle({ data }) {
    const { delivery } = data;
    await Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: `Encomenda cancelada`,
      template: 'cancellation',
      context: { delivery },
    });
  }
}

export default new CancellationJob();
