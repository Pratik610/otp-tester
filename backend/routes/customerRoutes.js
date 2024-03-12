import express from 'express'
const router = express.Router()
import {
	customerRegistration,
	customerOTPVerification,
	resendOTP,
} from '../controllers/customerControllers.js'

router.post('/register', customerRegistration)
router.post('/verify', customerOTPVerification)
router.post('/resend-otp', resendOTP)

export default router
