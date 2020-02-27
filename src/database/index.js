import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Recipient from '../app/models/Recipient';
import Deliveryman from '../app/models/Deliveryman';
import Signature from '../app/models/Signature';
import Order from '../app/models/Order';
import DeliveryProblems from '../app/models/DeliveryProblems';

import databaseConfig from '../config/database';

const models = [
  Recipient,
  User,
  Deliveryman,
  File,
  Signature,
  Order,
  DeliveryProblems,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
    return this;
  }
}

export default new Database();
