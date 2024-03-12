import nodemailer from 'nodemailer'

export const OtpMail = (otp, name, email) => {
	var transporter = nodemailer.createTransport({
		host: 'smtp.hostinger.com',
		secure: true,
		secureConnection: false,
		tls: {
			ciphers: 'SSLv3',
		},
		requireTLS: true,
		port: 465,
		debug: true,
		connectionTimeout: 10000,
		auth: {
			user: 'no-reply@ingnious.ai',
			pass: 'QWEzxc#101',
		},
	})

	var mailOptions = {
		from: 'no-reply@ingnious.ai',
		to: email,
		subject: 'OTP',
		html: ` 
        <p>Hi, ${name}</p>
        <p>To enhance the security of your account, we have implemented Two-Factor Authentication (2FA) for your account. To ensure it's you logging in, we are providing you with a One-Time Password (OTP) via email.</p>
        <p>Please find your OTP below:</p>
        <h1>${otp}</h1>
        `,
	}

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error)
		} else {
			console.log('Email sent: ' + info.response)
		}
	})
}
