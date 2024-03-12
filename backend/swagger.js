import swaggerAutogen from 'swagger-autogen'

const doc = {
	info: {
		title: 'InGnous AI',
		description: '',
	},
	host: 'localhost:5000',
}

const outputFile = './swagger-output.json'
const routes = [
	'./routes/customerRoutes.js',
	'./routes/imageRoutes.js',
	'./routes/userRoutes.js',
]

swaggerAutogen(outputFile, routes, doc)
