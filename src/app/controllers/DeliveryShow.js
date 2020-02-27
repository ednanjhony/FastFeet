import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryShow {
  async index(req, res) {
    const deliveryOrder = await Deliveryman.findByPk(req.params.id);

    if (deliveryOrder) {
      const showOrder = await Order.findAll({
        where: { deliveryman_id: req.params.id, start_date: null },
      });

      return res.json(showOrder);
    }
  }
}

export default new DeliveryShow();
