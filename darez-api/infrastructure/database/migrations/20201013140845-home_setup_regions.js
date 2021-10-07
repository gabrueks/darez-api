module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('home_setup_regions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreign_key: true,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      banner_url_high_res: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      banner_url_low_res: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lat: {
        allowNull: true,
        type: Sequelize.FLOAT(10, 6),
      },
      lng: {
        allowNull: true,
        type: Sequelize.FLOAT(10, 6),
      },
      main_shop: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
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

    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('home_setup_companies');
  },
};
