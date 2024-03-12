import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import dotenv from 'dotenv'
import {
	DynamoDBDocumentClient,
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import { OtpMail } from '../emails/OTPemail.js'
import bcrypt from 'bcrypt'
dotenv.config()

const client = new DynamoDBClient({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SCERET_KEY,
	},
	region: 'ap-south-1',
})
const docClient = DynamoDBDocumentClient.from(client)

export const createUser = async (data) => {
	const checkUserExistsCommand = new ScanCommand({
		TableName: 'Users',
		FilterExpression: 'email = :emailValue', // Comment or remove this line
		ExpressionAttributeValues: {
			':emailValue': data.email,
		},
	})

	const checkUserExists = await docClient.send(checkUserExistsCommand)

	if (checkUserExists.Count > 0) {
		throw new Error(`User with email: ${data.email} already exists`)
	} else {
		const command = new PutCommand({
			TableName: 'Users',
			Item: data,
			ReturnValues: 'ALL_OLD',
		})
		const response = await docClient.send(command)
		console.log(response)
		return response
	}
}

export const checkloginDetails = async (data) => {
	const loginUserCommand = new ScanCommand({
		TableName: 'RaymondAdminUsers',
		FilterExpression: 'email = :emailValue',
		ExpressionAttributeValues: {
			':emailValue': data.email,
		},
	})

	const checkloginUser = await docClient.send(loginUserCommand)

	if (checkloginUser.Items.length <= 0) {
		throw new Error(`Invalid email or password`)
	}

	const checkPass = await bcrypt.compare(
		data.password,
		checkloginUser.Items[0].password
	)

	if (!checkPass) {
		throw new Error(`Invalid email or password`)
	}

	return checkloginUser.Items[0]
}

export const userByID = async (id) => {
	const userDetailsCommand = new GetCommand({
		TableName: 'RaymondAdminUsers',
		Key: {
			userID: id,
		},
	})

	const userDetails = await docClient.send(userDetailsCommand)

	if (userDetails) {
		return userDetails.Item
	} else {
		throw new Error(`User Not Found`)
	}
}
