module.exports = (sequelize, DataTypes) => {
  const AsaasTransferData = sequelize.define('AsaasTransferData', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    company_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    asaas_id: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_created_at: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    asaas_object: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    value: {
      allowNull: true,
      type: DataTypes.DECIMAL(19, 2),
      defaultValue: null,
    },
    net_value: {
      allowNull: true,
      type: DataTypes.DECIMAL(19, 2),
      defaultValue: null,
    },
    asaas_status: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_transfer_fee: {
      allowNull: true,
      type: DataTypes.DECIMAL(19, 2),
      defaultValue: null,
    },
    asaas_transaction_receipt_url: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_schedule_date: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue: null,
    },
    asaas_authorized: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: false,
    },
  }, {
    tableName: 'asaas_transfer_data',
    timestamps: false,
  });
  return AsaasTransferData;
};
