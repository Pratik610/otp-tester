import express from 'express'
const router = express.Router()
import {
	userSignUp,
	userLogin,
	getUserByID,
} from '../controllers/adminControllers.js'
import { protect } from '../middleware/authMiddleware.js'

router.post('/signup', userSignUp)
router.post('/login', userLogin)
router.post('/', protect, getUserByID)

export default router
