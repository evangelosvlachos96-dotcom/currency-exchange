import express from 'express'

import {
  deleteExchange,
  updateExchange,
  getExchange,
  getExchanges,
  createExchange,
} from '../controllers/exchangeController.js'
import { authenticateUser, authorizeRoles } from '../middlewares/auth.js'
import {
  isRatioNaN,
  isExchangeExists,
  checkCurrenciesValues,
  checkValuesForUpdate,
} from '../middlewares/check-exchange.js'

const router = express.Router()

router.post(
  '/createExchange',
  isRatioNaN,
  checkCurrenciesValues,
  authenticateUser,
  authorizeRoles('superuser'),
  createExchange
)

router.get('/getExchanges', authenticateUser, getExchanges)
router.get('/getExchange/:id', isExchangeExists, authenticateUser, getExchange)
router.delete(
  '/deleteExchange/:id',
  isExchangeExists,
  authenticateUser,
  authorizeRoles('superuser'),
  deleteExchange
)
router.patch(
  '/updateExchange/:id',
  isRatioNaN,
  checkValuesForUpdate,
  isExchangeExists,
  authenticateUser,
  authorizeRoles('superuser'),
  updateExchange
)

export default router
