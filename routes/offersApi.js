const express = require('express');
const router = express.Router();

const { isValidId, authentication } = require('../middleware');
const { validateBody } = require('../helpers');
const { offersController } = require('../controller');
const { offerValidation } = require('../schemas');

const { offerAddSchema } = offerValidation;

router.get('/', offersController.getAll);

router.get('/:id', isValidId, offersController.getById);

router.post(
  '/',
  authentication,
  validateBody(offerAddSchema),
  offersController.create
);

router.put(
  '/:id',
  authentication,
  isValidId,
  validateBody(offerAddSchema),
  offersController.update
);

router.delete('/:id', authentication, isValidId, offersController.remove);

module.exports = router;
