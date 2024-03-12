import asyncHandler from 'express-async-handler'
import { createUser, checkloginDetails, userByID } from '../tables/adminDB.js'
import { createTokken } from '../config/token.js'
import { v4 as uuidv4 } from 'uuid'
import {
	S3Client,
	CreateBucketCommand,
	HeadBucketCommand,
} from '@aws-sdk/client-s3'
import CryptoJS from 'crypto-js'
import bcrypt from 'bcrypt'

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SCERET_KEY,
	},
	region: 'ap-south-1',
})

const userSignUp = asyncHandler(async (req, res) => {
	const {
		name,
		email,
		password,
		phoneNumber,
		category,
		segment,
		businessName,
		pincode,
	} = req.body

	const data = await createUser({
		userID: uuidv4(),
		userName: name,
		email,
		password: await bcrypt.hash(password, 10),
		phoneNumber,
		category,
		segment,
		businessName,
		pincode,
		devices: [],
	})
	if (data.$metadata.httpStatusCode == 200) {
		res.status(200).json({ message: 'SignUp Successfull' })
	} else {
		res.status(401)
		throw new Error('Something went wrong')
	}
})

const userLogin = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const data = await checkloginDetails({
		email,
		password,
	})

	if (data) {
		res.status(200).json({ token: createTokken(data.userID) })
	} else {
		res.status(401)
		throw new Error('Something went wrong')
	}
})

const getUserByID = asyncHandler(async (req, res) => {
	if (req.user) {
		delete req.user['password']
		delete req.user['otp']

		res.status(200).json(req.user)
	} else {
		res.status(401)
		throw new Error('Something went wrong')
	}
})

export { userSignUp, userLogin, getUserByID }
