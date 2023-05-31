const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const Joi = require('joi').extend(require('joi-phone-number'));

const offer = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required to create a offer'],
    },
    image: {
      type: String,
      required: [true, 'Image Url is required to create a offer'],
    },
    desc: {
      type: String,
      required: [true, 'Description is required to create a offer'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required to create a offer'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'seller',
      required: [true, 'Seller is required to create a offer'],
    },
  },
  { versionKey: false, timestamps: true }
);

offer.post('save', handleMongooseError);

/**
 * Схема валидации добавления заказа.
 */
const offerAddSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'any.required': `"Name" is required`,
    'string.empty': `"Name" cannot be empty`,
    'string.base': `"Name" must be string`,
  }),
  image: Joi.string().required().messages({
    'any.required': `"Image url" is required`,
    'string.empty': `"Image url" cannot be empty`,
    'string.base': `"Image url" must be string`,
  }),
  desc: Joi.string().min(10).max(200).required().messages({
    'any.required': `"Description" is required`,
    'string.empty': `"Description" cannot be empty`,
    'string.base': `"Description" must be string`,
  }),
  price: Joi.number().required().messages({
    'any.required': `"Price" is required`,
    'string.empty': `"Price" cannot be empty`,
    'string.base': `"Price" must be number`,
  }),
  seller: Joi.number().required().messages({
    'any.required': `"Seller" is required`,
    'string.empty': `"Seller" cannot be empty`,
    'string.base': `"Seller" must be number`,
  }),
});

const offerValidation = {
  offerAddSchema,
};

const Offer = model('offer', offer);

module.exports = { Offer, offerValidation };
