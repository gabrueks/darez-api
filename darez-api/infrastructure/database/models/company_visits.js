module.exports = (sequelize, DataTypes) => {
  const CompanyVisit = sequelize.define('CompanyVisit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userIpv4: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  }, {
    tableName: 'company_visits',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return CompanyVisit;
};
