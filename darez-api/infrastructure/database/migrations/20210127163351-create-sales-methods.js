module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sale_methods', {
      method: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      operator: {
        type: Sequelize.TINYINT,
        allowNull: false,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('sale_methods');
  },
};
