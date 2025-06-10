import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import logger from '@/lib/winston';
import user from '@/models/user';
import refreshToken from '@/models/refreshToken';
import config from '@/config';
import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type LoginData = Pick<IUser, 'email' | 'password'>;

const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginData;

    // Check if the user exists
    const existingUser = await user
      .findOne({ email })
      .select('_id email password role')
      .lean()
      .exec();

    if (!existingUser) {
      logger.warn(`Login attempt with non-existing email`, { email });
      res.status(404).json({
        status: 'error',
        message: 'User not found',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Generate access token and refresh token
    const accessToken = generateAccessToken(existingUser._id);
    const refreshTokenValue = generateRefreshToken(existingUser._id);

    // Store the refresh token in the database
    await refreshToken.create({
      token: refreshTokenValue,
      userId: existingUser._id,
    });

    logger.info(`New Refresh Token created for user`, {
      email: existingUser.email,
    });

    // store refresh token in cookies
    res.cookie('refreshToken', refreshTokenValue, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Respond with the tokens
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user : existingUser,
      accessToken,
    });

    logger.info(`User Logged In Successfully` ,{
      userId: existingUser._id,
      email: existingUser.email,
      username: existingUser.username,
      role: existingUser.role,
    })

  } catch (error) {
    logger.error(`Error in login : ${error}`);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};

export default loginController;
