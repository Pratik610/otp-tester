import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { userByID } from '../tables/adminDB.js'

const protect = asyncHandler(async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.user = await userByID(decoded.id)

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			throw new Error('Not authorized ,token failed')
		}
	}
	if (!token) {
		res.status(401)

		throw new Error('Not authorized , NO token')
	}
})

export { protect }