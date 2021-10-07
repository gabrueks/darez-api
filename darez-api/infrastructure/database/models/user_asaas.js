module.exports = (sequelize, DataTypes) => {
  const UserAsaas = sequelize.define('UserAsaas', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    user_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    company_id: {
      allowNull: false,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
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
    asaas_account_key: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
  }, {
    tableName: 'user_asaas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return UserAsaas;
};
