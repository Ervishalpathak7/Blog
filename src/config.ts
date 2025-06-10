import { configDotenv } from "dotenv";
import type ms from "ms";

// Load environment variables from .env file
configDotenv();

const config = {
    PORT: process.env.PORT || 3000, // The port on which the server will run
    NODE_ENV: process.env.NODE_ENV || 'development', // Environment mode (development, production, etc.)
    WHITELIST_ORIGINS : ["http://localhost:3000", "http://example.com"], // Add your allowed origins here
    MONGODB_URI: process.env.MONGODB_URI || '', // MongoDB connection URI
    LOG_LEVEL: process.env.LOG_LEVEL || 'info', // Log level for the application
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
    ACCESS_TOKEN_EXPIRY : process.env.JWT_ACCESS_TOKEN_SECRET!,
    JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
    JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION as ms.StringValue ,
    JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION as ms.StringValue,
    WHITELIST_EMAILS: [
        'vishalpathak.er@gmail.com',
    ]
}

// Export the configuration object
export default config;