module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('asaas_transfer_data', {
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
      asaas_id: {
        allowNull: true,
        type: Sequelize.STRING,
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
      value: {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: null,
      },
      net_value: {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: null,
      },
      asaas_status: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      asaas_transfer_fee: {
        allowNull: true,
        type: Sequelize.DECIMAL(19, 2),
        defaultValue: null,
      },
      asaas_transaction_receipt_url: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: null,
      },
      asaas_schedule_date: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
      },
      asaas_authorized: {
        allowNull: true,
        type: Sequelize.STRING,
        defaultValue: false,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('asaas_transfer_data');
  },
};
