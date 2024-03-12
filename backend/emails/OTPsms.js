import axios from 'axios'

export const sentOTP_SMS = async (otp, phoneNumber) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					'uopJ5YnNfe6wlQEW4tAV8iGgIzMB0rsH9Ryxhakc1CmPSLTOUvvRGIWzqmjTQol18XeFkPMJywuHD2Ef',
			},
		}
		const { data } = await axios.post(
			'https://www.fast2sms.com/dev/bulkV2',
			{ route: 'otp', variables_values: otp, numbers: phoneNumber },
			config
		)

		return data
	} catch (error) {
		console.log(error)
		throw new Error('Someting went wrong')
	}
}
