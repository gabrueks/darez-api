module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('promotions', 'discount', {
      type: Sequelize.DECIMAL(19, 4),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('promotions', 'discount', {
      type: Sequelize.DECIMAL(19, 2),
      allowNull: false,
    });
  },
};
