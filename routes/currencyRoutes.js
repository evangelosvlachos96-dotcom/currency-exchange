import express from 'express'

import {
  deleteCurrency,
  getCurrencies,
  getSingleCurrency,
  updateCurrency,
  creatCurrency,
  searchCurrencies,
} from '../controllers/currencyController.js'

import { authenticateUser, authorizeRoles } from '../middlewares/auth.js'
import {
  isCurrencyExists,
  checkBodyValues,
} from '../middlewares/check-currencies.js'

const router = express.Router()

router.post(
  '/createCurrency',
  checkBodyValues,
  authenticateUser,
  authorizeRoles('admin', 'superuser'),
  creatCurrency
)
router.patch(
  '/updateCurrency/:id',
  isCurrencyExists,
  checkBodyValues,
  authenticateUser,
  authorizeRoles('admin', 'superuser'),
  updateCurrency
)
router.get('/searchCurrencies', searchCurrencies)
router.get(
  '/getSignleCurrency/:id',
  isCurrencyExists,
  authenticateUser,
  authorizeRoles('admin', 'superuser'),
  getSingleCurrency
)
router.get('/getCurrencies', getCurrencies)
router.delete(
  '/deleteCurrency/:id',
  isCurrencyExists,
  authenticateUser,
  authorizeRoles('admin', 'superuser'),
  deleteCurrency
)

export default router
