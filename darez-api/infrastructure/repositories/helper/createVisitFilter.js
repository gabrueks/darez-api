const { Op } = require('sequelize');

module.exports = {
  createVisitFilter(companies, before, after) {
    let filters = {};
    if (before || after) {
      if (before && after) {
        filters.created_at = { [Op.between]: [after, before] };
      } else if (before) {
        filters.created_at = { [Op.lte]: before };
      } else {
        filters.created_at = { [Op.gte]: after };
      }
      if (companies) {
        filters = {
          [Op.and]: [
            { created_at: filters.created_at },
            { company_id: { [Op.in]: companies } },
          ],
        };
      }
    } else if (companies) {
      filters = {
        company_id: {
          [Op.in]: companies,
        },
      };
    }
    return filters;
  },
};
