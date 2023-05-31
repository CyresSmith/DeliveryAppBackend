const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const { emailRegexp, phoneRegExp } = require('./ValidationRegexp');

const Joi = require('joi').extend(require('joi-phone-number'));
const order = new Schema(
  {
    client: {
      type: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'user',
          required: [true, 'User Id is required to create order'],
        },
        name: {
          type: String,
          required: [true, 'Name is required to create a order'],
        },
        email: {
          required: [true, 'Email is required to create a order'],
          type: String,
          match: emailRegexp,
        },
        phone: {
          type: String,
          required: [true, 'Phone is required to create a order'],
        },
        address: {
          type: String,
          required: [true, 'Address is required to create a order'],
        },
      },
      required: [true, 'Client is required to create order'],
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'seller',
      required: [true, 'Seller is required to create order'],
    },
    items: [
      {
        offer: {
          type: Schema.Types.ObjectId,
          ref: 'offer',
        },
        name: {
          type: String,
          required: [true, 'Item name is required to create a order'],
        },
        price: {
          type: Number,
          required: [true, 'Price is required to create a order'],
        },
        count: {
          type: Number,
          required: [true, 'Count is required to create a order'],
        },
        total: {
          type: Number,
          required: [true, 'Total price is required to create a order'],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required to create order'],
    },
  },
  { versionKey: false, timestamps: true }
);

order.post('save', handleMongooseError);

/**
 * Схема валидации добавления заказа.
 */
const orderAddSchema = Joi.object({
  client: Joi.object().keys({
    _id: Joi.string().max(30).required().messages({
      'any.required': `"User ID" is required`,
      'string.empty': `"User ID" cannot be empty`,
      'string.base': `"User ID" must be string`,
    }),
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
  }),
  seller: Joi.string().max(30).required().messages({
    'any.required': `"Seller" is required`,
    'string.empty': `"Seller" cannot be empty`,
    'string.base': `"Seller" must be string`,
  }),
  items: Joi.array()
    .items(
      Joi.object({
        offer: Joi.string().required().messages({
          'any.required': `"Item ID" is required`,
          'string.empty': `"Item ID" cannot be empty`,
          'string.base': `"Item ID" must be string`,
        }),
        name: Joi.string().required().messages({
          'any.required': `"Item name" is required`,
          'string.empty': `"Item name" cannot be empty`,
          'string.base': `"Item name" must be string`,
        }),
        price: Joi.number().required().messages({
          'any.required': `"Price" is required`,
          'string.empty': `"Price" cannot be empty`,
          'string.base': `"Price" must be number`,
        }),
        count: Joi.number().required().messages({
          'any.required': `"Count" is required`,
          'string.empty': `"Count" cannot be empty`,
          'string.base': `"Count" must be number`,
        }),
        total: Joi.number().required().messages({
          'any.required': `"Total price" is required`,
          'string.empty': `"Total price" cannot be empty`,
          'string.base': `"Total price" must be number`,
        }),
      })
        .required()
        .messages({
          'any.required': `"Item" is required`,
          'string.base': `"Item ID" must be an object`,
        })
    )
    .min(1),
  totalPrice: Joi.number().required(),
  status: Joi.string().valid('received', 'processing', 'completed'),
});

/**
 * Схема валидации обновления заказа.
 */
const orderUpdateSchema = Joi.object({
  client: Joi.object().keys({
    _id: Joi.string().max(30).required().messages({
      'any.required': `"User ID" is required`,
      'string.empty': `"User ID" cannot be empty`,
      'string.base': `"User ID" must be string`,
    }),
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
    phone: Joi.string()
      .phoneNumber({ format: 'international' })
      .required()
      .messages({
        'any.required': `"Phone" is required`,
        'string.empty': `"Phone" cannot be empty`,
        'string.base': `"Phone" must be string`,
      }),
    address: Joi.string().min(8).max(40).required().messages({
      'any.required': `"Address" is required`,
      'string.empty': `"Address" cannot be empty`,
      'string.base': `"Address" must be string`,
    }),
  }),
  items: Joi.array()
    .items(
      Joi.string().required().messages({
        'any.required': `"Item ID" is required`,
        'string.empty': `"Item ID" cannot be empty`,
        'string.base': `"Item ID" must be string`,
      })
    )
    .min(1),
  totalPrice: Joi.number().required(),
});

/**
 * Схема валидации обновления статуса заказа.
 */
const statusUpdateSchema = Joi.string().valid(
  'received',
  'processing',
  'completed'
);

const orderValidation = {
  orderAddSchema,
  orderUpdateSchema,
  statusUpdateSchema,
};

const Order = model('order', order);

module.exports = { Order, orderValidation };
