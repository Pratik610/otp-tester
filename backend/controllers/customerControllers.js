import asyncHandler from 'express-async-handler'
import { sentOTP_SMS } from '../emails/OTPsms.js'
import { createCustomer, customerByPhoneNumber } from '../tables/customerDB.js'

const customerRegistration = asyncHandler(async (req, res) => {
	const { customer_id } = req.body

	const data = await createCustomer(customer_id)

	if (data.response.$metadata.httpStatusCode == 200) {
		if (
			data.customer_id === '8698170964' ||
			data.customer_id === '1234567890'
		) {
			res.status(200).json({ message: `OTP SENT TO +91 ${customer_id} ` })
		} else {
			const response = sentOTP_SMS(data.otp, data.customer_id)
			if (response) {
				res.status(200).json({ message: `OTP SENT TO +91 ${customer_id} ` })
			} else {
				res.status(401)
				throw new Error('Something went wrong')
			}
		}
	} else {
		res.status(401)
		throw new Error('Something went wrong')
	}
})

const customerOTPVerification = asyncHandler(async (req, res) => {
	const { customer_id, otp } = req.body

	const data = await customerByPhoneNumber(customer_id)

	if (data.otp === otp) {
		res.status(200).json({ message: 'OTP VERIFIED' })
	} else {
		res.status(400)
		throw new Error('Invalid OTP')
	}
})

const resendOTP = asyncHandler(async (req, res) => {
	const { customer_id } = req.body
	const data = await customerByPhoneNumber(customer_id)

	if (data) {
		console.log(data)
	}
})

export { customerRegistration, customerOTPVerification, resendOTP }
