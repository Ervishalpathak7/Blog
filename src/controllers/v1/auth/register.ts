import logger from '@/lib/winston';
import type { Request, Response } from 'express';
import user from '@/models/user';
import type { IUser } from '@/models/user';
import refreshToken from '@/models/refreshToken';
import { genUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import config from '@/config';

// Define the type for user data to be registered
type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

/**
 * Controller for handling user registration.
 * @param req - The request object containing user data.
 * @param res - The response object to send back the result.
 */
const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Extract user data from the request body
    const { email, password, role } = req.body as UserData;

    if(role === 'admin' && !config.WHITELIST_EMAILS.includes(email)) {
      logger.warn(`Unauthorized admin registration attempt`, {
        email,
      });
      res.status(403).json({
        status: 'error',
        message: 'Unauthorized to register as admin',
        timestamp: new Date().toISOString(),
      });
      return
    }


    // Generate a random username
    const username = genUsername();

    // create a new user in the database
    const newUser = await user.create({
      email,
      password,
      username,
      role,
    });

    // generate access token and refresh token for new user
    const newAccessToken = generateAccessToken(newUser._id);
    const newRefreshToken = generateRefreshToken(newUser._id);

    // store the refresh token in the database
    await refreshToken.create({
      token: newRefreshToken,
      userId: newUser._id,
    });

    logger.info(`New Refresh Token created for user`, {
      userId: newUser._id,
    });

    // set the refresh token in a secure, httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
 
    res.status(200).json({
      status: 'ok',
      message: 'User Registered Successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
      newAccessToken,
      timestamp: new Date().toISOString(),
    });

    logger.info(`User registered successfully`, {
      userId: newUser._id,
      email: newUser.email,
      username: newUser.username,
      role: newUser.role,
    });
  } catch (error) {
    logger.error(`Error in register : ${error}`);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};

export default registerController;
