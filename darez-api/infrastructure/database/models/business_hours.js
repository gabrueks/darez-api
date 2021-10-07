module.exports = (sequelize, DataTypes) => {
  const BusinessHours = sequelize.define('BusinessHours', {
    company_id: {
      primaryKey: true,
      foreignKey: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    monday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    monday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    thusday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    thusday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    wednesday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    wednesday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    thursday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    thursday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    friday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    friday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    saturday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    saturday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    sunday_open: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    sunday_close: {
      allowNull: true,
      type: DataTypes.TIME,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'business_hours',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return BusinessHours;
};
