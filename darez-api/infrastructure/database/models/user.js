// const Company = require('./company');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phone_country_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_area_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmation_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmation_code_requested_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_login_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_consultor_name_login: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_user_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_consultor_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    new_user: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    a_b_group: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    user_group: {
      type: DataTypes.INTEGER,
      allowNull: true,
      foreign_key: true,
      references: {
        model: 'user_groups',
        key: 'id',
      },
    },
    document: {
      type: DataTypes.STRING,
      allowNull: true,
    },
<<<<<<< HEAD
    access_token: {
=======
    web_access_token: {
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
<<<<<<< HEAD
    refresh_token: {
=======
    web_refresh_token: {
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
<<<<<<< HEAD
=======
    app_access_token: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    app_refresh_token: {
      allowNull: true,
      type: DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      allowNull: true,
      type: DataTypes.STRING(1000),
      defaultValue: null,
    },
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  sequelize.models.Company.belongsTo(User, {
    foreignKey: {
      name: 'user_id',
      allowNull: false,
    },
  });
  return User;
};
