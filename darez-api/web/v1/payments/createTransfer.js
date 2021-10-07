const { createTransfer } = require('../../../infrastructure/implementations/asaas_api');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const AsaasTransferDataRepository = require('../../../infrastructure/repositories/asaas_transfer_data');
const { slackChannel: { SLACK_ERR }, forbidden, unavailableAmount } = require('../helpers/strings');
const { toSlack } = require('../slack');

const companyRepository = new CompanyRepository(database);
const asaasTransferDataRepository = new AsaasTransferDataRepository(database);

module.exports = {
  createTransfer: async ({ companyId, body }) => {
    const {
      value, bank_code: bankCode, owner_name: ownerName, document, agency, account,
      account_digit: accountDigit, account_type: accountType,
    } = body;
    try {
      const company = await companyRepository.findOne(['asaas_account_key'], companyId);
      if (!company.asaas_account_key) throw new Error(forbidden);
      const data = await createTransfer(
        company.asaas_account_key, value, bankCode, ownerName, document, agency, account,
        accountDigit, accountType,
      );
      await asaasTransferDataRepository.create({
        company_id: companyId,
        asaas_id: data.id,
        asaas_created_at: data.dateCreated,
        asaas_object: data.object,
        value: data.value,
        net_value: data.netValue,
        asaas_status: data.status,
        asaas_transfer_fee: data.transferFee,
        asaas_transaction_receipt_url: data.transactionReceiptUrl,
        asaas_schedule_date: data.scheduleDate,
        asaas_authorized: data.authorized,

      });
      return httpResponse(201);
    } catch (err) {
      if (err.message === forbidden) return httpResponse(403, { message: forbidden });
      if (err.message === unavailableAmount) {
        return httpResponse(400, { message: unavailableAmount });
      }
      toSlack(SLACK_ERR, err, 'payments/createTransfer');
      return httpResponse(500);
    }
  },
};
