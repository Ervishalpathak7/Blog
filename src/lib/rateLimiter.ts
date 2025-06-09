/**
 * @copyright 2025 Vishal Pathak
 * @license Apache-2.0
 */

import rateLimit from 'express-rate-limit';


const rateLimiter = rateLimit({ 
    windowMs: 60 * 1000, // 60 seconds
    max: 60, // Limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8', // use the latest standard headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        status: 429,
        error: 'Too Many Requests',
        message: 'You have exceeded the number of requests allowed. Please try again later.'
    }
});

export default rateLimiter;
