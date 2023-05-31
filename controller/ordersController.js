const { Order, Offer } = require('../schemas');
const { httpError, ctrlWrapper, sendEmail } = require('../helpers');

/**
 * ============================ Получение всех заказов
 */
const getAllOrders = async (req, res) => {
  const { page = 1, limit = 10, status = null } = req.query;

  const skip = (page - 1) * limit;

  const sortByStatus = () => {
    if (!status) {
      return {};
    }
    return { status };
  };

  const result = await Order.find(sortByStatus(), '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('offer');

  if (!result) {
    throw httpError(404, 'Orders not found');
  }

  res.status(200).json(result);
};

/**
 * ============================ Получение заказа по ID
 */
const getOrderById = async (req, res) => {
  const { id } = req.params;

  const result = await Order.findById(id);

  if (!result) {
    throw httpError(404, `Order with id ${id} Not found`);
  }

  res.status(200).json(result);
};

/**
 * ============================ Добавление заказа
 */
const createOrder = async (req, res) => {
  const { client, items, totalPrice } = req.body;

  const result = await (
    await Order.create(req.body)
  ).populate({
    path: 'items',
    select: '-createdAt -updatedAt',
    populate: {
      path: 'offer',
      model: Offer,
      select: '-createdAt -updatedAt',
    },
  });

  const { _id } = result;

  const orderItems = items => {
    let message = '';

    items.forEach(({ name, price, count, total }) => {
      message += `${name}: ${count}, <br> price: ${price}, <br> total: ${total}, <br> <br> `;
    });

    return message;
  };

  const newOrderEmail = {
    to: client.email,
    subject: `Order id: ${_id}`,
    html: `<p>Thank for your order, ${
      client.name
    }! <br> Let's start processing it! <br> <br> Order details: <br> <br> ${orderItems(
      items
    )}
    ----------------------------------------------------  <br> <br> <b> Total price: ${totalPrice}</b> <p>`,
  };

  await sendEmail.nodemailer(newOrderEmail);

  res.status(201).json(result);
};

/**
 * ============================ Обновление заказа
 */
const updateOrder = async (req, res) => {
  const { id } = req.params;

  const result = await Order.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw httpError(404, `Order with id ${id} not found`);
  }

  return res.status(200).json(result);
};

/**
 * ============================ Обновление статуса заказа
 */
const updateStatus = async (req, res) => {
  const { id } = req.params;

  const result = await Order.findByIdAndUpdate(id, req.body, { new: true });

  if (!result) {
    throw httpError(404, `Order with id ${id} not found`);
  }

  return res.status(200).json(result);
};

/**
 * ============================ Удаление заказа
 */
const removeOrder = async (req, res) => {
  const { id } = req.params;

  const removed = await Order.findByIdAndRemove(id);

  if (!removed) {
    throw httpError(404, `Order with id ${id} not found`);
  }

  res.status(200).json({ message: 'Order successfully removed' });
};

module.exports = {
  getAll: ctrlWrapper(getAllOrders),
  getById: ctrlWrapper(getOrderById),
  create: ctrlWrapper(createOrder),
  update: ctrlWrapper(updateOrder),
  updateStatus: ctrlWrapper(updateStatus),
  remove: ctrlWrapper(removeOrder),
};
