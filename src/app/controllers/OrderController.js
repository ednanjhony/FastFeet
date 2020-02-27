import * as Yup from 'yup';
import Order from '../models/Order';

import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

class OrderController {
  async index(req, res) {
    const deliveryOrder = await Deliveryman.findByPk(req.params.id);

    if (deliveryOrder) {
      const showOrder = await Order.findAll({
        where: { deliveryman_id: req.params.id },
      });

      return res.json(showOrder);
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number()
        .integer()
        .required(),
      deliveryman_id: Yup.number()
        .integer()
        .required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: 'Validation fails',
      });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const recipientExists = await Recipient.findOne({
      where: { id: req.body.recipient_id },
    });

    if (!recipientExists) {
      return res.status(400).json({
        error: 'Recipient doesnt exist',
      });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: req.body.deliveryman_id },
    });

    if (!deliverymanExists) {
      return res.status(400).json({
        error: 'Deliveryman doesnt exist',
      });
    }

    const order = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
    });

    return res.json(order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    const { id, product } = await order.update(req.body);

    return res.json({
      id,
      product,
    });
  }

  async delete(req, res) {
    const orderDelete = await Order.destroy({
      where: { id: req.params.id },
    });

    return res.json(orderDelete);
  }
}

export default new OrderController();
