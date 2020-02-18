import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import Recipient from '../app/models/recipient';

import User from '../app/models/user';
import File from '../app/models/file';
import Deliveryman from '../app/models/deliveryman';
import Delivery from '../app/models/delivery';

import databaseConfig from '../configs/database';

const models = [Recipient, User, File, Deliveryman, Delivery];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect('mongodb://localhost/fastfeet', {
      useNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

export default new Database();
