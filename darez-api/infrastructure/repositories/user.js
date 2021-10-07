const { Op } = require('sequelize');
const { paginate } = require('./helper');

module.exports = class UserRepository {
  constructor(database) {
    this.database = database;
  }

  findOneLogin({ phoneNumber, confirmationCode, currentDateTime }, transaction) {
    return this.database.User.findOne({
      where: {
        phone_country_code: phoneNumber.phoneCountryCode,
        phone_area_code: phoneNumber.phoneAreaCode,
        phone_number: phoneNumber.phoneNumber,
        confirmation_code: confirmationCode,
        confirmation_code_requested_at: {
          [Op.gte]: currentDateTime,
        },
      },
      transaction,
    });
  }

  findOneFromPhone(phoneNumber, transaction) {
    return this.database.User.findOne({
      where: {
        phone_country_code: phoneNumber.phoneCountryCode,
        phone_area_code: phoneNumber.phoneAreaCode,
        phone_number: phoneNumber.phoneNumber,
      },
      transaction,
    });
  }

  findOrCreate({
    phone, confirmationCode, confirmationCodeRequestedAt, userGroup, codeType,
  }, transaction) {
    return this.database.User.findOrCreate({
      where: {
        phone_country_code: phone.phoneCountryCode,
        phone_area_code: phone.phoneAreaCode,
        phone_number: phone.phoneNumber,
      },
      defaults: {
        confirmation_code: confirmationCode,
        confirmation_code_requested_at: confirmationCodeRequestedAt,
        user_group: userGroup,
        last_login_type: codeType,
      },
      transaction,
    });
  }

  updateConfirmationCode({
    userId, confirmationCode, confirmationCodeRequestedAt, codeType,
  }, transaction) {
    return this.database.User.update({
      confirmation_code: confirmationCode,
      confirmation_code_requested_at: confirmationCodeRequestedAt,
      last_login_type: codeType,
    }, {
      where: {
        id: userId,
      },
    },
    { transaction });
  }

  updateUserLastLogin(userId, time, transaction) {
    return this.database.User.update(
      {
        last_user_login: time,
      },
      {
        where: {
          id: userId,
        },
        transaction,
      },
    );
  }

  /**
   * Get the ueser's information
   *
   * @param {integer} id User's identification
   * @param {array} id User's attributes
   */
  findOne(id, attributes, transaction) {
    return this.database.User.findOne({
      attributes,
      where: { id },
      raw: true,
      transaction,
    });
  }

  /**
   * Get the ueser's information
   *
   * @param {string} document User's cpf/cnpj
   */
  findOneByDocument(document) {
    return this.database.User.findOne({
      where: { document }, raw: true,
    });
  }

  findAll(page, pageSize, attributes) {
    return this.database.User.findAll({
      attributes,
      where: { active: 1 },
      ...paginate(page, pageSize),
    });
  }

  updateConsultorLastLogin(userId, time, consultor, transaction) {
    return this.database.User.update(
      {
        last_consultor_login: time,
        last_consultor_name_login: consultor.name,
        confirmation_code: consultor.confirmationCode,
      },
      {
        where: {
          id: userId,
        },
        transaction,
      },
    );
  }

  updateCreatedBy(id, creator, transaction) {
    return this.database.User.update(
      {
        new_user: false,
        created_by: creator,
      },
      {
        where: { id },
        transaction,
      },
    );
  }

  findUserGroup(id) {
    return this.database.User.findOne({
      attributes: ['user_group'],
      where: { id },
      raw: true,
    });
  }

  findUserLoginCode(id, transaction) {
    return this.database.User.findOne({
      attributes: ['confirmation_code', 'full_name'],
      where: { id },
      transaction,
    });
  }

  update(field, id, transaction) {
    return this.database.User.update(
      { ...field },
      { where: { id }, transaction },
    );
  }

  findOneTokenBased(defaultToken, refreshToken, attributes, transaction) {
    return this.database.User.findOne({
      attributes,
      where: {
<<<<<<< HEAD
        [Op.and]: {
          access_token: defaultToken,
          refresh_token: refreshToken,
        },
=======
        [Op.or]: [
          {
            [Op.and]: {
              web_access_token: defaultToken,
              web_refresh_token: refreshToken,
            },
          },
          {
            [Op.and]: {
              app_access_token: defaultToken,
              app_refresh_token: refreshToken,
            },
          },
        ],
>>>>>>> 8138969678f1dff0b8be0ae4dedb8ec8d6fe8b81
      },
      raw: true,
      transaction,
    });
  }
};
