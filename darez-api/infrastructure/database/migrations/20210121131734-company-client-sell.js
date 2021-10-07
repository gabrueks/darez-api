module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'email',
      {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'employees',
      {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    );

    await queryInterface.createTable('company_clients', {
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
      name: {
        allowNull: true,
        type: Sequelize.STRING,
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
      email: {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null,
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

    await queryInterface.createTable('company_sales', {
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
      client_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        foreign_key: true,
        references: {
          model: 'company_clients',
          key: 'id',
        },
      },
      price: {
        type: Sequelize.DECIMAL(19, 2),
        allowNull: false,
      },
      payment_method: {
        foreignKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'payment_methods',
          key: 'method',
        },
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING(1000),
        defaultValue: null,
      },
      sale_time: {
        allowNull: false,
        type: Sequelize.DATE,
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
    await queryInterface.removeColumn('users', 'email');
    await queryInterface.removeColumn('companies', 'employees');

    await queryInterface.dropTable('company_sales');
    await queryInterface.dropTable('company_clients');
  },
};
