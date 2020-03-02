import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class CancelDeliveryController {
  async delete(req, res) {
    const { order_id } = req.params;

    const delivery = await Order.findByPk(order_id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
        },
      ],
    });

    const { deliveryman } = delivery;

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await deliveryman.update({ canceledAt: new Date() });

    return res.json({ ok: true });
  }
}

export default new CancelDeliveryController();
