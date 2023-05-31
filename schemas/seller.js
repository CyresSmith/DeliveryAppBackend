const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const Joi = require('joi').extend(require('joi-phone-number'));

const { emailRegexp, phoneRegExp } = require('./ValidationRegexp');

const seller = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required to create a seller'],
    },
    email: {
      required: [true, 'Email is required to create a seller'],
      type: String,
      match: emailRegexp,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required to create a seller'],
    },
    address: {
      type: String,
      required: [true, 'Address is required to create a seller'],
    },
    plusCode: {
      type: String,
    },
    web: {
      type: String,
    },
    hours: {
      type: [
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
        {
          isOpen: {
            type: String,
          },
          from: {
            type: String,
          },
          to: {
            type: String,
          },
        },
      ],
    },
  },
  { versionKey: false, timestamps: true }
);

seller.post('save', handleMongooseError);

/**
 * Схема валидации добавления заказа.
 */
const sellerAddSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'any.required': `"Name" is required`,
    'string.empty': `"Name" cannot be empty`,
    'string.base': `"Name" must be string`,
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `"Email" is required`,
    'string.empty': `"Email" cannot be empty`,
    'string.base': `"Email" must be string`,
    'string.pattern.base': `"Email" doesn't look like an email`,
  }),
  phone: Joi.string().pattern(phoneRegExp).required().messages({
    'any.required': `"Phone" is required`,
    'string.empty': `"Phone" cannot be empty`,
    'string.base': `"Phone" must be string`,
  }),
  address: Joi.string().min(8).max(40).required().messages({
    'any.required': `"Address" is required`,
    'string.empty': `"Address" cannot be empty`,
    'string.base': `"Address" must be string`,
  }),
  plusCode: Joi.string().max(40).messages({
    'string.base': `"Plus code" must be string`,
  }),
  web: Joi.string().max(40).messages({
    'string.base': `"Web url" must be string`,
  }),
  hours: Joi.array()
    .items(
      Joi.object({
        isOpen: Joi.boolean(),
        from: Joi.string().min(5).max(5),
        to: Joi.string().min(5).max(5),
      })
    )
    .min(7)
    .max(7)
    .messages({
      'array.base': `"Hours" must be a array`,
    }),
});

const sellerValidation = {
  sellerAddSchema,
};

const Seller = model('seller', seller);

module.exports = { Seller, sellerValidation };
