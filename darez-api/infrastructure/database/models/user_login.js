module.exports = (sequelize, DataTypes) => {
  const UserLogin = sequelize.define('UserLogin', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_consultant: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    consultor_name: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
  }, {
    tableName: 'user_login',
    timestamps: false,
  });
  return UserLogin;
};
