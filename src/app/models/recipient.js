import Sequelize, { Model } from 'sequelize';

class Recipient extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        street: Sequelize.STRING,
        complemento: Sequelize.STRING,
        post_code: Sequelize.INTEGER,
        city_id: Sequelize.INTEGER,
      },
      { sequelize }
    );
    return this;
  }
}

export default Recipient;
