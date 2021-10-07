module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      document: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      fantasy_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      cep: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      street: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      street_number: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      address_2: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      neighborhood: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      delivery_range: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 5,
      },
      latitude: {
        allowNull: true,
        type: Sequelize.FLOAT(10, 6),
      },
      longitude: {
        allowNull: true,
        type: Sequelize.FLOAT(10, 6),
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
    await queryInterface.createTable('business_hours', {
      company_id: {
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      monday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      monday_close: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      thusday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      thusday_close: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      wednesday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      wednesday_close: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      thursday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      thursday_close: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      friday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      friday_close: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      saturday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      saturday_close: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      sunday_open: {
        allowNull: true,
        type: Sequelize.TIME,
      },
      sunday_close: {
        allowNull: true,
        type: Sequelize.TIME,
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
    await queryInterface.createTable('payment_methods', {
      method: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      description: {
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
    });
    await queryInterface.createTable('company_payments', {
      company_id: {
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      method: {
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        type: Sequelize.STRING,
        references: {
          model: 'payment_methods',
          key: 'method',
        },
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
    await queryInterface.dropTable('business_hours');
    await queryInterface.dropTable('company_payment');
    await queryInterface.dropTable('companies');
    await queryInterface.dropTable('payment_methods');
  },
};
