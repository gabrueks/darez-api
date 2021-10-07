module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
    },
    company_id: {
      allowNull: false,
      primaryKey: true,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    buyer: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    cep: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    street: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    street_number: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    address_2: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    neighborhood: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: false,
    },
    payment_method: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.STRING,
      references: {
        model: 'payment_methods',
        key: 'method',
      },
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING,
      defaultValue: 'Solicitado',
    },
    change: {
      type: DataTypes.DECIMAL(19, 2),
      allowNull: true,
    },
    asaas_object: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_id: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_status: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_bank_slip_url: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_invoice_url: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_net_value: {
      allowNull: true,
      type: DataTypes.DECIMAL(19, 2),
      defaultValue: null,
    },
    asaas_invoice_number: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    asaas_owner_email: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  sequelize.models.Order.belongsTo(sequelize.models.Company, {
    foreignKey: {
      name: 'company_id',
      allowNull: false,
    },
  });

  return Order;
};
