import * as Yup from 'yup';
import DeliveryProblems from '../models/DeliveryProblems';
import Order from '../models/Order';

class DeliveryProblemController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const deliveriesProblems = await DeliveryProblems.findAll({
      include: [
        {
          model: Order,
          as: 'orders',
          attributes: [
            'id',
            'deliveryman_id',
            'signature_id',
            'product',
            'canceled_at',
            'start_date',
            'end_date',
          ],
        },
      ],
      limit: 15,
      offset: (page - 1) * 15,
    });

    return res.json(deliveriesProblems);
  }

  async store(req, res) {
    const { order_id } = req.params;
    const schema = Yup.object().shape({
      description: Yup.string()
        .min(3)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const deliveryExists = await Order.findByPk(order_id);

    if (!deliveryExists) {
      return res.status(404).json({ error: 'Delivery not found!' });
    }

    const problem = await DeliveryProblems.create({
      description: req.body.description,
      order_id,
    });

    return res.json(problem);
  }
}

export default new DeliveryProblemController();
