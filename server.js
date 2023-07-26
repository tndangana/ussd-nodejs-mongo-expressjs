// Import necessary modules and services
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import connectToMongoDB from './config/database.js';
import { ussd } from './server/routes.js';
import { session_secret, port } from './config/configuration.js';

// Create a new instance of the express application
const app = express();

// Enable CORS middleware
app.use(cors());

// Enable Helmet middleware for security
app.use(helmet());

// Enable Morgan middleware for logging
app.use(morgan('dev'));

// Enable Compression middleware for response compression
app.use(compression());

// Enable bodyParser middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable express-session middleware for session management
app.use(
session({
secret: session_secret,
resave: false,
saveUninitialized: false,
cookie: { maxAge: 3600000 } // Set the cookie to expire in 1 hour (in milliseconds)
}));

// Connect to the MongoDB database
connectToMongoDB();

// Enable passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

// Enable flash middleware for displaying flash messages
app.use(flash());

// Register the ussd route
ussd(app);

// Start the server and listen on the specified port
app.listen(port, () => {
console.log(`Server started on port ${port}`);
});