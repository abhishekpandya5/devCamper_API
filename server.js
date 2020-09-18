const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middlewares/logger'); //custom logger middleware
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

const app = express();

// Body parser
app.use(express.json());

// app.use(logger); // for custom logger middleware

// Dev logging middleware (morgan)
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File upload 
app.use(fileupload());

// Set public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
	)
);

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// close server and exit process
	server.close(() => process.exit(1)); // for exit with failure, we pass 1 to exit.
});
