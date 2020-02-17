module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('deliverymen', 'deleted_at', {
      type: Sequelize.DATE,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('deliverymen', 'deleted_at');
  },
};
