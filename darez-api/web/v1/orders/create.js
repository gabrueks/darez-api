const moment = require('moment-timezone');
const { httpResponse } = require('../../../infrastructure/adapters/http');
const { database } = require('../../../infrastructure/adapters/database');
const {
  sendNewSale, buildUserAddress, createUserAddress, throwError,
  // distanceBetweenCoords, inaccessibleDistance,
} = require('../helpers');
const OrderRepository = require('../../../infrastructure/repositories/order');
const OrderProductRepository = require('../../../infrastructure/repositories/order_product');
const ProductRepository = require('../../../infrastructure/repositories/product');
const ProductVariationRepository = require('../../../infrastructure/repositories/product_variation');
const TransactionRepository = require('../../../infrastructure/repositories/transaction');
const CompanyRepository = require('../../../infrastructure/repositories/company');
const UserRepository = require('../../../infrastructure/repositories/user');
const UserAddressRepository = require('../../../infrastructure/repositories/user_address');
const { toSlack } = require('../slack');

const { slackChannel: { SLACK_ORDERS }, orderStatusString: { doNotNeed }, newSaleSlackString } = require('../helpers/strings');

const orderRepository = new OrderRepository(database);
const orderProductRepository = new OrderProductRepository(database);
const productRepository = new ProductRepository(database);
const productVariationRepository = new ProductVariationRepository(database);
const transactionRepository = new TransactionRepository(database);
const companyRepository = new CompanyRepository(database);
const userRepository = new UserRepository(database);
const userAddressRepository = new UserAddressRepository(database);

module.exports = {
  create: async ({ body, userId }) => {
    const f = async (transaction) => {
      const {
        products, company_id: companyId, payment_method: paymentMethod, total_price: totalPrice,
        change, address_id: addressId,
      } = body;

      const userAddress = (addressId)
        ? await userAddressRepository.findOne(addressId, ['cep',
          'street', 'street_number', 'address_2', 'neighborhood', 'city', 'state',
          'latitude', 'longitude'])
        : await createUserAddress(body.address, userId, transaction);

      const companyInfo = await companyRepository.findOne(
        ['latitude', 'longitude', 'delivery_range', 'phone_country_code', 'phone_area_code',
          'phone_number', 'fantasy_name', 'neighborhood', 'state', 'street', 'street_number',
          'address_2', 'city', 'user_id'],
        companyId, transaction,
      );
      const userOrderAddress = userAddress.dataValues ? userAddress.dataValues : userAddress;
      const { full_name: companyOwner } = await userRepository.findOne(companyInfo.user_id, ['full_name'], transaction);
      // As linhas comentadas a baixo indicam se uma compra esta dentro do raio de entrega de uma
      // loja
      // const distance = distanceBetweenCoords(
      //   companyInfo.latitude, companyInfo.longitude, userAddress.latitude, userAddress.longitude,
      // );
      // if (distance > companyInfo.delivery_range) throw new Error(inaccessibleDistance);
      const {
        full_name: userName, phone_area_code: userPhoneAreaCode, phone_number: userPhoneNumber,
      } = await userRepository.findOne(userId, ['full_name', 'phone_area_code', 'phone_number'], transaction);
      const userCompleteNumber = `(${userPhoneAreaCode}) ${userPhoneNumber.slice(0, 5)}-${userPhoneNumber.slice(5, 9)}`;
      const { dataValues: order } = await orderRepository.create(
        {
          cep: userOrderAddress.cep,
          street: userOrderAddress.street,
          street_number: userOrderAddress.street_number,
          address_2: userOrderAddress.address_2,
          neighborhood: userOrderAddress.neighborhood,
          city: userOrderAddress.city,
          state: userOrderAddress.state,
          buyer: userId,
          company_id: companyId,
          payment_method: paymentMethod,
          price: totalPrice,
          change,
        }, transaction,
      );
      const orderId = order.id;
      const productsUpload = [];
      let productsString = '';
      let productsNamesWTS = '';
      let productsQuantityWTS = '\nQuantidade: ';
      let productSlack = '';
      const timeString = moment().tz('America/Sao_Paulo').toISOString();
      /* eslint-disable no-restricted-syntax, no-await-in-loop */
      for (const product of products) {
        const {
          name,
          description,
          category,
          subcategory,
        } = await productRepository.findOne(['name', 'description', 'category', 'subcategory', 'promotion'], product.product_id, timeString, transaction);

        const newProduct = {
          order_id: orderId,
          product_id: product.product_id,
          unity_price: product.unity_price,
          promotion_price: product.promotion_price,
          company_id: companyId,
          product_variation_id: (!product.variation_id) ? 0 : product.variation_id,
          quantity: product.quantity,
          name,
          description,
          category,
          subcategory,
        };

        productsString += `${name}`;
        productsNamesWTS += `${name}`;
        productSlack += `${name}, `;
        if (product.variation_id) {
          const { color, size } = await productVariationRepository.findOne(['color', 'size'], product.variation_id, transaction);
          newProduct.color = (color !== 'NULL') ? color : 'NULL';
          newProduct.size = (size !== 'NULL') ? size : 'NULL';
          productsString += (color !== 'NULL') ? ` ${color}` : '';
          productsString += (size !== 'NULL') ? ` ${size}` : '';
          productsNamesWTS += (color !== 'NULL') ? ` ${color}` : '';
          productsNamesWTS += (size !== 'NULL') ? ` ${size}` : '';
          productsString += `\nQuantidade: ${product.quantity}`;
          productsQuantityWTS += `${product.quantity}, `;
        }
        productsString += (product.variation_id) ? '' : `\nQuantidade: ${product.quantity}`;
        productsString += (product.promotion_price) ? `\nValor: ${product.promotion_price}\n\n` : `\nValor: ${product.unity_price}\n\n`;
        productsQuantityWTS += (product.variation_id) ? '' : `${product.quantity}, `;
        productsNamesWTS += ', ';
        productsUpload.push(newProduct);
      }
      const productWTS = `${productsNamesWTS.slice(0, -2)}${productsQuantityWTS.slice(0, -2)}\n`;
      const productToSlack = `${productSlack.slice(0, -2)}`;
      await orderProductRepository.createMany(productsUpload, transaction);
      const address = buildUserAddress(userOrderAddress);
      const today = moment().tz('America/Sao_Paulo');
      const date = moment(today).format('DD/MM/YYYY');
      const time = moment(today).format('HH:mm');
      sendNewSale(userName, orderId, productsString, totalPrice, paymentMethod, (!change) ? doNotNeed : change, '-', address, userCompleteNumber, date, time, {
        phoneCountryCode: companyInfo.phone_country_code,
        phoneAreaCode: companyInfo.phone_area_code,
        phoneNumber: companyInfo.phone_number,
      }, 'SMS');
      // To send Whatsapp
      sendNewSale(userName, orderId, productWTS, totalPrice, paymentMethod, (!change) ? doNotNeed : change, '-', address, userCompleteNumber, date, time, {
        phoneCountryCode: companyInfo.phone_country_code,
        phoneAreaCode: companyInfo.phone_area_code,
        phoneNumber: companyInfo.phone_number,
      }, 'WTS');
      toSlack(SLACK_ORDERS, newSaleSlackString(orderId, { ...companyInfo, owner: companyOwner },
        {
          userName,
          userPhoneAreaCode,
          userPhoneNumber,
          address,
        }, productToSlack,
        totalPrice, paymentMethod));
      return httpResponse(201, { order_id: orderId });
    };

    try {
      const result = await transactionRepository.transaction(f);
      if (result.error) throw new Error(result.error);
      return result;
    } catch (err) {
      // As linhas comentadas a baixo retornam erro caso a entrega esteja fora do raio da loja
      // if (err.message === inaccessibleDistance) {
      //   return httpResponse(409, { message: inaccessibleDistance });
      // }
      return throwError(err, 'orders/create');
    }
  },
};
