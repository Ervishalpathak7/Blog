import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response } from 'express';
import refreshTokenModel from '@/models/refreshToken';
import { generateAccessToken, verifyRefreshToken } from '@/lib/jwt';
import logger from '@/lib/winston';
import { Types } from 'mongoose';

const refreshTokenController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // extract the refresh token from cookies
    const refreshToken = req.cookies.refreshToken as string;

    if (!refreshToken) {
      logger.warn('Refresh token not provided');
      res.status(401).json({
        status: 'error',
        message: 'Refresh token is required',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // verify the refresh token
    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };

    // Generate a new access token
    const accessToken = generateAccessToken(jwtPayload.userId);

    // Respond with the new access token
    res.status(200).json({
      status: 'success',
      message: 'Access token refreshed successfully',
      accessToken,
    });

    logger.info('Access token refreshed successfully', {
      userId: jwtPayload.userId,
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      logger.error('Refresh token attempt with expired token ', { error });
      res.status(403).json({
        status: 'error',
        message: 'Refresh token expired , please login again',
        timestamp: new Date().toISOString(),
      });
    } else if (error instanceof JsonWebTokenError) {
      logger.error('Refresh token attempt with invalid token', { error });
      res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token',
        timestamp: new Date().toISOString(),
      });
    } else {
      logger.error('Unexpected error during refresh token processing', {
        error,
      });
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};

export default refreshTokenController;
