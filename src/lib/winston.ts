import config from "@/config";
import winston from "winston";


// Define custom formats
const { json ,errors , timestamp , combine , align , printf , colorize } = winston.format;

// Define transports
const transports : winston.transport[] = [];

// If the environment is not production, add console transport
if( config.NODE_ENV !== 'production' ) {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all : true }), // Colorize all logs
        timestamp({format : 'YYYY-MM-DD HH:mm:ss' }), // Timestamp format
        align(), // Align the log messages
        printf(({ timestamp, level  , message, ...meta }) => {
            const metaString = Object.keys(meta).length ? `\n ${JSON.stringify(meta)}` : '';
            return `${timestamp} ${level } : ${message}${metaString}`;
          
        })
      )
    })
  );
}

// Create a instance of winston logger
const logger = winston.createLogger({
    level : config.LOG_LEVEL || 'info', // Default log level
    format: winston.format.combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }), // Timestamp format
        errors({ stack: true }), // Include stack trace for errors
        json() // Log in JSON format
    ),
    transports, // Add the defined transports
    silent: config.NODE_ENV === 'test', // Silence logs in test environment
})

export default logger;