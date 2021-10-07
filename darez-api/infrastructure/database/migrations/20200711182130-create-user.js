module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phone_country_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_area_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone_number: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      confirmation_code: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      confirmation_code_requested_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      active: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
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
      full_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
