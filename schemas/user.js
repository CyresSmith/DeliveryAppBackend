const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const {
  emailRegexp,
  phoneRegExp,
  passwordRegex,
} = require('./ValidationRegexp');

const Joi = require('joi');

const user = new Schema(
  {
    name: {
      required: [true, 'Name is required'],
      type: String,
    },
    email: {
      required: [true, 'Email is required'],
      type: String,
      match: emailRegexp,
      unique: true,
    },
    phone: {
      required: [true, 'Phone is required'],
      type: String,
      match: phoneRegExp,
      unique: true,
    },
    address: {
      required: [true, 'Address is required'],
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    avatarUrl: {
      type: String,
      required: [true, 'Avatar url is required'],
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

/**
 * Схема валидации регистрации пользователя.
 */
const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
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
    'string.pattern.base': `"Phone" doesn't look like an phone`,
  }),
  address: Joi.string().min(8).max(30).required().messages({
    'any.required': `"Address" is required`,
    'string.empty': `"Address" cannot be empty`,
    'string.base': `"Address" must be string`,
  }),
  password: Joi.string().min(8).max(20).pattern(passwordRegex).messages({
    'any.required': `"Password" is required`,
    'string.empty': `"Password" cannot be empty`,
    'string.base': `"Password" must be string`,
  }),
});

/**
 * Схема валидации email.
 */
const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `Missing required field email`,
    'string.empty': `"Email" cannot be empty`,
    'string.base': `"Email" must be string`,
    'string.pattern.base': `"Email" doesn't look like an email`,
  }),
});

/**
 * Схема валидации логина пользователя.
 */
const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    'any.required': `"Email" is required`,
    'string.empty': `"Email" cannot be empty`,
    'string.base': `"Email" must be string`,
    'string.pattern.base': `"Email" doesn't look like an email`,
  }),
  password: Joi.string().min(8).max(20).pattern(passwordRegex).messages({
    'any.required': `"Password" is required`,
    'string.empty': `"Password" cannot be empty`,
    'string.base': `"Password" must be string`,
  }),
});

/**
 * Схема валидации refresh.
 */
const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': `Refresh token is required field`,
    'string.empty': `Refresh token cannot be empty`,
  }),
});

user.post('save', handleMongooseError);

const userValidation = {
  userRegisterSchema: userRegisterSchema,
  emailSchema: emailSchema,
  userLoginSchema: userLoginSchema,
  refreshSchema: refreshSchema,
};

const User = model('user', user);

module.exports = { User, userValidation };
