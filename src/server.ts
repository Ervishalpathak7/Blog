/**
 * @copyright 2025 Vishal Pathak
 * @license Apache-2.0
 */

//Node modules
import express from 'express';
import cors from 'cors';
import { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

// Custom modules
import config from '@/config';
import rateLimiter from '@/lib/rateLimiter';
import v1routes from '@/routes/v1';
import {connectToMongoDB , disconnectFromMongoDB} from '@/lib/mongoose'; // Importing mongoose to ensure connection is established
import logger from '@/lib/winston';

// Express application initialization
const app = express();

// Cors configuration
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`), false);
      logger.warn(`CORS not allowed for origin: ${origin}`);
    }
  },
};

// Enable CORS with the specified options
app.use(cors(corsOptions));

// Enable JSON parsing
app.use(express.json());

// Enable URL-encoded data parsing with extended mode
app.use(express.urlencoded({ extended: true }));

// Enable cookie parsing
app.use(cookieParser());

// Enable compression for response bodies
app.use(
  compression({
    threshold: 1024, // Compress responses larger than 1KB
  }),
);

// Enable security headers to protect against common vulnerabilities
app.use(helmet());

// set rate limiting to prevent abuse
app.use(rateLimiter);

// immidiately invoked async function (IIFE) for starting the server or performing initial setup
(async () => {
  try {

     // Connect to MongoDB
    await connectToMongoDB();

    // Route setup
    app.use('/api/v1', v1routes);

    // Start the server and listen on the configured port
    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server:', error);
    if (config.NODE_ENV === 'production') {
      process.exit(1); // Exit the process with a failure code
    }
  }
})();


// Handle server shutdown gracefully
const serverShutdown = async () => {
  try {
    // Disconnect from MongoDB
    await disconnectFromMongoDB();
    logger.warn('Shutting down server gracefully...');
    process.exit(0); // Exit the process with a success code
  } catch (error) {
    logger.error('Error during server shutdown:', error);
  }
}

// Listen for termination signals to gracefully shut down the server
process.on('SIGINT', serverShutdown);
process.on('SIGTERM', serverShutdown);