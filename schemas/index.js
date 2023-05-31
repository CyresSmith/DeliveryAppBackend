const { Order, orderValidation } = require('./order');
const { Offer, offerValidation } = require('./offer');
const { Seller, sellerValidation } = require('./seller');
const { User, userValidation } = require('../schemas/user');

module.exports = {
  Order,
  orderValidation,
  Offer,
  offerValidation,
  Seller,
  sellerValidation,
  User,
  userValidation,
};
