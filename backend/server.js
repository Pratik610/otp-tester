import express from 'express'
import dotenv from 'dotenv'
import adminRoutes from './routes/adminRoutes.js'
import customerRoute from './routes/customerRoutes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './swagger-output.json' assert { type: 'json' }
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

const app = express()
dotenv.config()

app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
	methods: ['GET', 'POST'],
	secure: true,
})

// routes
app.use('/api/admin', adminRoutes)
app.use('/api/customer', customerRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

// adding and removing users from list
let users = []
const addUser = (userInfo, socketId) => {
	users.push({ user: userInfo, socketId })
	console.log(users)
}

const checkUser = (userInfo) => {
	return users.some(
		(user) =>
			user.user.userId === userInfo.userId &&
			user.user.loginCode === userInfo.loginCode
	)
}

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId)
}

io.on('connection', (socket) => {
	socket.on('addUser', (user) => {
		if (!checkUser(user)) {
			addUser(user, socket.id)
		} else {
			socket.emit('duplicateUser', 'This Device is already running')
		}
	})

	socket.on('disconnect', () => {
		console.log('user Disconnected')
		removeUser(socket.id)
		io.emit('getUsers', users)
	})
})

// custom errors handling
app.use(notFound)
app.use(errorHandler)

server.listen(
	process.env.PORT || 5000,
	console.log(`Server Running on PORT ${process.env.PORT}`)
)
