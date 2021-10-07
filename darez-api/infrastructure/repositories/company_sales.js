const moment = require('moment-timezone');
const { Op, QueryTypes } = require('sequelize');

module.exports = class CompanySaleRepository {
  constructor(database) {
    this.database = database;
  }

  create(sales, transaction) {
    return this.database.CompanySales.bulkCreate(sales, {
      fields: [
        'company_id', 'description', 'price', 'client_id', 'sale_method', 'sale_time', 'split_times', 'split_number'],
    }, { transaction });
  }

  update(field, id, companyId, transaction) {
    return this.database.CompanySales
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

  findAll(companyId) {
    return this.database.CompanySales
      .findAll({
        attributes: ['id', 'price', 'sale_method', 'client_id', 'description', 'sale_time'],
        where: {
          company_id: companyId,
          active: true,
        },
        raw: true,
      });
  }

  findOne(id, companyId) {
    return this.database.CompanySales
      .findOne({
        attributes: ['id', 'price', 'sale_method', 'client_id', 'description', 'sale_time'],
        where: {
          id,
          company_id: companyId,
        },
        raw: true,
      });
  }

  async findAllDateRange(companyId, startDate, endDate) {
    const result = await this.database.CompanySales
      .findAll({
        attributes: ['id', 'price', 'sale_method', 'client_id', 'description', 'sale_time'],
        where: {
          [Op.and]: {
            company_id: companyId,
            sale_time: { [Op.lte]: endDate, [Op.gte]: startDate },
            active: true,
          },
        },
        include: {
          attributes: ['name'],
          model: this.database.CompanyClients,
          required: false,
        },
        raw: true,
      });

    return result.map((item) => {
      const {
        // eslint-disable-next-line camelcase
        client_id, description, payment_method, price, sale_time, id, sale_method,
      } = item;
      return ({
        client_id, description, payment_method, price, sale_time, id, sale_method, client_name: item['CompanyClient.name'],
      });
    });
  }

  getAllClient(companyId, clientId, attributes) {
    return this.database.CompanySales
      .findAll({
        attributes,
        where: {
          [Op.and]: {
            company_id: companyId,
            client_id: clientId,
            active: true,
          },
        },
        raw: true,
      });
  }

  findTotalFromRange(companyId, startDate, endDate) {
    return this.database.sequelize.query(
      `SELECT IFNULL(cs.total, 0) AS total, IFNULL(cs.countSaleMethod, 0) AS countSaleMethod, sm.method AS saleMethod, sm.operator
        FROM (SELECT company_id, sale_time, active, sale_method, SUM(price) AS total, COUNT(sale_method) AS countSaleMethod
            FROM company_sales
            WHERE company_id = :companyId AND sale_time >= :startDate AND sale_time <= :endDate AND active = 1 GROUP BY sale_method) cs
        RIGHT OUTER JOIN sale_methods sm ON cs.sale_method = sm.method;`,
      {
        replacements: { companyId, startDate, endDate },
        type: QueryTypes.SELECT,
      },
    );
  }

  async findAllDateRangeClient(companyId, startDate, endDate) {
    const result = await this.database.CompanySales
      .findAll({
        attributes: ['sale_time', 'description', 'sale_method', 'price'],
        where: {
          [Op.and]: {
            company_id: companyId,
            sale_time: { [Op.lte]: endDate, [Op.gte]: startDate },
            active: true,
          },
        },
        include: {
          attributes: ['name'],
          model: this.database.CompanyClients,
          required: false,
        },
        order: [['sale_time', 'ASC']],
        raw: true,
      });
    return result.map((item) => ({
      date: moment(item.sale_time).format('DD/MM/YYYY'),
      description: item.description,
      type: item.sale_method,
      saleTime: item.sale_time,
      price: item.price,
      client: item['CompanyClient.name'],
    }));
  }

  deleteOne(saleId, companyId, transaction) {
    return this.database.CompanySales.update(
      {
        active: 0,
        deleted_at: moment().tz('America/Sao_Paulo'),
      },
      {
        where: {
          id: saleId,
          company_id: companyId,
        },
      },
      { transaction },
    );
  }
};
