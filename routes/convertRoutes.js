import express from 'express'
import { convertCurrency } from '../controllers/convertCurrency.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.post('/convertCurrency', authenticateUser, convertCurrency)

export default router
