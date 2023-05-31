const { Seller } = require('../schemas');
const { httpError, ctrlWrapper } = require('../helpers');

/**
 * ============================ Получение всех продавцов
 */
const getAllSellers = async (req, res) => {
  const { page = 1, limit = 10, seller = null } = req.query;

  const skip = (page - 1) * limit;

  const result = await Seller.find({}, '-createdAt -updatedAt');

  if (!result) {
    throw httpError(404, 'Sellers not found');
  }

  res.status(200).json(result);
};

/**
 * ============================ Получение продавца по ID
 */
const getSellerById = async (req, res) => {
  const { id } = req.params;

  const result = await Seller.findById(id);

  if (!result) {
    throw httpError(404, `Seller with id ${id} Not found`);
  }

  res.status(200).json(result);
};

/**
 * ============================ Добавление продавца
 */
const createSeller = async (req, res) => {
  const result = await Seller.create(req.body);
  res.status(201).json(result);
};

/**
 * ============================ Обновление продавца
 */
const updateSeller = async (req, res) => {
  const { id } = req.params;

  const result = await Seller.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw httpError(404, `Seller with id ${id} not found`);
  }

  return res.status(200).json(result);
};

/**
 * ============================ Удаление продавца
 */
const removeSeller = async (req, res) => {
  const { id } = req.params;

  const removed = await Seller.findByIdAndRemove(id);

  if (!removed) {
    throw httpError(404, `Seller with id ${id} not found`);
  }

  res.status(200).json({ message: 'Seller successfully removed' });
};

module.exports = {
  getAll: ctrlWrapper(getAllSellers),
  getById: ctrlWrapper(getSellerById),
  create: ctrlWrapper(createSeller),
  update: ctrlWrapper(updateSeller),
  remove: ctrlWrapper(removeSeller),
};
