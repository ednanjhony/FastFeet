import * as Yup from 'yup';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Signature from '../models/Signature';

class DeliveryDone {
  async update(req, res) {
    const { deliveryman_id, order_id } = req.params;

    const schema = Yup.object().shape({
      signature_id: Yup.number()
        .integer()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails!' });
    }

    const { signature_id } = req.body;

    const signatureExists = await Signature.findByPk(signature_id);

    if (!signatureExists) {
      return res.status(404).json({ error: 'Signature not found' });
    }

    const delivery = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
        start_date: { [Op.ne]: null },
        end_date: null,
        canceled_at: null,
        signature_id: null,
      },
    });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    await delivery.update({ end_date: new Date(), signature_id });
    return res.json({ ok: true });
  }
}

export default new DeliveryDone();
