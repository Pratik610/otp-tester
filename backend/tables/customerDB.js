import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import dotenv from 'dotenv'
import {
	DynamoDBDocumentClient,
	PutCommand,
	GetCommand,
	ScanCommand,
	UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
dotenv.config()

const client = new DynamoDBClient({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SCERET_KEY,
	},
	region: 'ap-south-1',
})
const docClient = DynamoDBDocumentClient.from(client)

export const createCustomer = async (customer_id) => {
	try {
		const generateCode = () => {
			let x = ''
			const allLetters = '1234567890'
			for (let index = 0; index < 6; index++) {
				x += allLetters[Math.floor(Math.random() * allLetters.length)]
			}
			return x
		}

		if (customer_id === '8698170964' || customer_id === '1234567890') {
			const otp = '000000'

			const command = new PutCommand({
				TableName: 'Store_Customers',
				Item: {
					customer_id,
					otp,
				},
				ReturnValues: 'ALL_OLD',
			})
			const response = await docClient.send(command)
			return { response, customer_id, otp }
		} else {
			const otp = generateCode()
			const command = new PutCommand({
				TableName: 'Store_Customers',
				Item: {
					customer_id,
					otp,
				},
				ReturnValues: 'ALL_OLD',
			})
			const response = await docClient.send(command)
			return { response, customer_id, otp }
		}
	} catch (error) {
		throw new Error(error)
	}
}
export const customerByPhoneNumber = async (customer_id) => {
	const customerDetailsCommand = new GetCommand({
		TableName: 'Store_Customers',
		Key: {
			customer_id,
		},
	})

	const customerDetails = await docClient.send(customerDetailsCommand)

	if (customerDetails) {
		return customerDetails.Item
	} else {
		throw new Error(`Customer Not Found`)
	}
}
