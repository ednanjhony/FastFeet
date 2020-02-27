import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import hours from '../../util/hours';

import Order from '../models/Order';

class DeliveryStart {
  async update(req, res) {
    const { deliveryman_id, order_id } = req.params;

    const delivery = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
        canceled_at: null,
        start_date: null,
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    const currentHour = new Date().getHours();

    if (hours.indexOf(currentHour.toString()) === -1) {
      return res.status(401).json({
        error: 'You are just alow to withdraw deliveries at business hours',
      });
    }

    const deliveries = await Order.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
        canceled_at: null,
      },
    });

    if (deliveries.length >= 5) {
      return res
        .status(401)
        .json({ error: 'You can get only 5 deliveries per day.' });
    }

    await delivery.update({ start_date: new Date() });

    return res.json({ ok: true });
  }
}

export default new DeliveryStart();
