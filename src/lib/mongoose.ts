import mongoose from 'mongoose';
import type { ConnectOptions } from 'mongoose';
import config from '@/config';
import logger from '@/lib/winston';

/**
 * Connects to MongoDB using Mongoose.
 * Throws an error if the connection fails.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is successful.
 */
export const connectToMongoDB = async (): Promise<void> => {
  if (!config.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the configuration');
  }

  try {
    const options: ConnectOptions = {
      dbName: 'blog',
      appName: 'blog',
      serverApi: {
        version: '1', // Use the latest stable version of the MongoDB server API
        strict: true, // Ensure strict mode for API compatibility
        deprecationErrors: true, // Enable deprecation errors for better error handling
      },
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if the server is not available
    };

    // Connect to MongoDB with the specified options
    await mongoose.connect(config.MONGODB_URI, options);
    logger.info('Connected to MongoDB successfully');
  } catch (error) {
    if (error instanceof Error) {
      throw error.message; // Re-throw the error if it's an instance of Error
    }
    logger.error('Failed to connect to MongoDB:', error);
  }
};

/**
 * Disconnects from MongoDB.
 * Logs an error if the disconnection fails.
 */
export const disconnectFromMongoDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.warn('Disconnected from MongoDB successfully');
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      logger.error('Failed to disconnect from MongoDB:', error);
    }
  }
};
