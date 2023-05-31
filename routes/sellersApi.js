const express = require('express');
const router = express.Router();

const { isValidId, authentication } = require('../middleware');
const { validateBody } = require('../helpers');
const { sellersController } = require('../controller');
const { sellerValidation } = require('../schemas');

const { sellerAddSchema } = sellerValidation;

router.get('/', sellersController.getAll);

router.get('/:id', isValidId, sellersController.getById);

router.post(
  '/',
  authentication,
  validateBody(sellerAddSchema),
  sellersController.create
);

router.put(
  '/:id',
  authentication,
  isValidId,
  validateBody(sellerAddSchema),
  sellersController.update
);

router.delete('/:id', authentication, isValidId, sellersController.remove);

module.exports = router;
