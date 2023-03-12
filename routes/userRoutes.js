import express from 'express'

import { getCurrentUser } from '../controllers/userController.js'
import { authenticateUser } from '../middlewares/auth.js'

const router = express.Router()

router.get('/getCurrentUser', authenticateUser, getCurrentUser)

export default router
