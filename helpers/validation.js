const Joi = require('joi');
const CustomJoi = Joi.extend(require('joi-phone-number'));
const HttpError = require('./httpError');

/**
 * Схема валидации добавления контакта.
 */
const contactAddValidationSchema = CustomJoi.object({
  name: Joi.string().min(3).max(30).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),

  phone: CustomJoi.string().phoneNumber({ format: 'international' }).required(),

  favorite: Joi.bool(),
});

/**
 * Схема валидации обновления контакта.
 */
const contactUpdateValidationSchema = CustomJoi.object({
  name: Joi.string().min(3).max(30),

  email: Joi.string().email({
    minDomainSegments: 2,
  }),

  phone: CustomJoi.string().phoneNumber({ format: 'international' }),

  favorite: Joi.bool(),
}).min(1);

/**
 * Функция валидации данных контакта.
 */
const validateBody = schema => {
  const func = async (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

module.exports = {
  contactAddValidationSchema,
  contactUpdateValidationSchema,
  validateBody,
};
