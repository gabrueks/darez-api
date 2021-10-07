module.exports = class CompanyClientRepository {
  constructor(database) {
    this.database = database;
  }

  create(client, companyId, transaction) {
    return this.database.CompanyClients
      .create({ ...client, company_id: companyId, active: 1 }, { transaction });
  }

  getOne(id, companyId, attributes) {
    return this.database.CompanyClients.findOne({
      attributes,
      where: {
        id,
        active: 1,
        company_id: companyId,
      },
    });
  }

  getAllCompany(companyId, attributes) {
    return this.database.CompanyClients.findAll({
      attributes,
      where: {
        company_id: companyId,
        active: 1,
      },
      order: [['name', 'ASC']],
    });
  }

  update(field, id, companyId, transaction) {
    return this.database.CompanyClients
      .update(
        { ...field },
        {
          where: {
            id,
            company_id: companyId,
          },
        },
        { transaction },
        { raw: true },
      );
  }

  deleteOne(id, companyId) {
    return this.database.CompanyClients.update(
      { active: 0 },
      {
        where: {
          id,
          company_id: companyId,
        },
      },
    );
  }
};
