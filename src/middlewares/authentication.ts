// import types
import { Types } from 'mongoose';
import type { Request, Response, NextFunction } from 'express';

// import jsonwebtoken errors
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

// import utilities
import { verifyAccessToken } from '@/lib/jwt';
import logger from '@/lib/winston';

const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization;
    if (!token?.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided',
      });
    }

    // split the token to get the actual token string
    const accessToken = token.split(' ')[1];
    if (!accessToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: No token provided',
      });
    }

    // Verify the access token
    const decoded = verifyAccessToken(accessToken) as {
      userId: Types.ObjectId;
    };
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    // Log the error
    logger.error(`Authentication error: ${error}`);
    // handle expired token error
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        status: 'error',
        message:
          'Unauthorized: Token expired , request a new token with refresh token',
      });
    }
    // handle invalid token error
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: Invalid token',
      });
    }
    // handle all other errors
    return res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
  next();
};
export default authenticationMiddleware;
