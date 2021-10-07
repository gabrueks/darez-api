module.exports = (sequelize, DataTypes) => {
  const UserAddresses = sequelize.define('UserAddresses', {
    id: {
      allowNull: false,
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
    active: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    tableName: 'user_addresses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return UserAddresses;
};
