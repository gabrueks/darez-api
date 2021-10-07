module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('promotions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      discount: {
        allowNull: false,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: false,
      },
      has_limit_date: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      date_start: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      date_end: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_by: {
        allowNull: true,
        type: Sequelize.STRING,
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
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
    await queryInterface.addColumn(
      'products',
      'promotion',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreign_key: true,
        references: {
          model: 'promotions',
          key: 'id',
        },
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('products', 'promotion');
    await queryInterface.dropTable('promotions');
  },
};
