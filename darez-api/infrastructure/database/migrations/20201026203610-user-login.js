module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_login', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreign_key: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      is_consultant: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      consultor_name: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_login');
  },
};
