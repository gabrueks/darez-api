module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'companies',
      'asaas_account_key',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'asaas_login_email',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'asaas_wallet_id',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'companies',
      'asaas_object',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.createTable('user_asaas', {
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
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        foreign_key: true,
        references: {
          model: 'companies',
          key: 'id',
        },
      },
      asaas_id: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      asaas_created_at: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      asaas_object: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      asaas_account_key: {
        allowNull: true,
        type: Sequelize.STRING,
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

    await queryInterface.addColumn(
      'orders',
      'asaas_object',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_id',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_status',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_bank_slip_url',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_invoice_url',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_net_value',
      {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_invoice_number',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );

    await queryInterface.addColumn(
      'orders',
      'asaas_owner_email',
      {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('companies', 'asaas_account_key');
    await queryInterface.removeColumn('companies', 'asaas_login_email');
    await queryInterface.removeColumn('companies', 'asaas_wallet_id');
    await queryInterface.removeColumn('companies', 'asaas_object');
    await queryInterface.dropTable('user_asaas');
    await queryInterface.removeColumn('orders', 'asaas_object');
    await queryInterface.removeColumn('orders', 'asaas_id');
    await queryInterface.removeColumn('orders', 'asaas_status');
    await queryInterface.removeColumn('orders', 'asaas_bank_slip_url');
    await queryInterface.removeColumn('orders', 'asaas_invoice_url');
    await queryInterface.removeColumn('orders', 'asaas_net_value');
    await queryInterface.removeColumn('orders', 'asaas_invoice_number');
    await queryInterface.removeColumn('orders', 'asaas_owner_email');
  },
};
