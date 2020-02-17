import Sequelize from 'sequelize';

import Recipient from '../app/models/recipient';

import User from '../app/models/user';
import File from '../app/models/file';
import Deliveryman from '../app/models/deliveryman';

import databaseConfig from '../configs/database';

const models = [Recipient, User, File, Deliveryman];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
