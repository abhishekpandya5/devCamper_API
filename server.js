const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
// const logger = require('./middlewares/logger'); //custom logger middleware
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to Database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// app.use(logger); // for custom logger middleware

// Dev logging middleware (morgan)
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// File upload 
app.use(fileupload());

// Sanitize data to prevent NoSQL Injection
app.use(mongoSanitize());

// Prevent XSS attacks 
app.use(xss());

// Adding security header through Helmet
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100
});
app.use(limiter);

// Prevent http param pollution
// app.use(hpp());

// Enable CORS
app.use(cors());

// Set public as a static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

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
