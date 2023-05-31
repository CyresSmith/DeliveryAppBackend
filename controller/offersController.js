const { Offer } = require('../schemas');
const { httpError, ctrlWrapper } = require('../helpers');

/**
 * ============================ Получение всех предложений
 */
const getAllOffers = async (req, res) => {
  const { page = 1, limit = 10, seller = null } = req.query;

  const skip = (page - 1) * limit;

  const sortBySeller = () => {
    if (!seller) {
      return {};
    }
    return { seller };
  };

  const result = await Offer.find(
    sortBySeller(),
    '-createdAt -updatedAt'
  ).populate('seller');

  if (!result) {
    throw httpError(404, 'Offers not found');
  }

  res.status(200).json(result);
};

/**
 * ============================ Получение предложения по ID
 */
const getOfferById = async (req, res) => {
  const { id } = req.params;

  const result = await Offer.findById(id);

  if (!result) {
    throw httpError(404, `Offer with id ${id} Not found`);
  }

  res.status(200).json(result);
};

/**
 * ============================ Добавление предложения
 */
const createOffer = async (req, res) => {
  const result = await Offer.create(req.body);
  res.status(201).json(result);
};

/**
 * ============================ Обновление предложения
 */
const updateOffer = async (req, res) => {
  const { id } = req.params;

  const result = await Offer.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw httpError(404, `Offer with id ${id} not found`);
  }

  return res.status(200).json(result);
};

/**
 * ============================ Удаление предложения
 */
const removeOffer = async (req, res) => {
  const { id } = req.params;

  const removed = await Offer.findByIdAndRemove(id);

  if (!removed) {
    throw httpError(404, `Offer with id ${id} not found`);
  }

  res.status(200).json({ message: 'Offer successfully removed' });
};

module.exports = {
  getAll: ctrlWrapper(getAllOffers),
  getById: ctrlWrapper(getOfferById),
  create: ctrlWrapper(createOffer),
  update: ctrlWrapper(updateOffer),
  remove: ctrlWrapper(removeOffer),
};
