const express = require('express');
const router = express.Router();

const { isValidId, authentication } = require('../middleware');
const { validateBody } = require('../helpers');
const { ordersController } = require('../controller');
const { orderValidation } = require('../schemas');

const { orderAddSchema, orderUpdateSchema, statusUpdateSchema } =
  orderValidation;

router.get('/', authentication, ordersController.getAll);

router.get('/:id', authentication, isValidId, ordersController.getById);

router.post('/', validateBody(orderAddSchema), ordersController.create);

router.put(
  '/:id',
  authentication,
  isValidId,
  validateBody(orderUpdateSchema),
  ordersController.update
);

router.patch(
  '/:id/status',
  authentication,
  isValidId,
  validateBody(statusUpdateSchema),
  ordersController.updateStatus
);

router.delete('/:id', authentication, isValidId, ordersController.remove);

module.exports = router;
