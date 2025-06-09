
import jwt from 'jsonwebtoken';
import config from '@/config';
import { Types } from 'mongoose'

export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign({ userId } , config.JWT_ACCESS_TOKEN_SECRET, 
    {
        expiresIn: config.JWT_ACCESS_TOKEN_EXPIRATION,
        subject : 'accessToken'
    });
}

export const generateRefreshToken = (userId: Types.ObjectId): string => {
    return jwt.sign({ userId } , config.JWT_REFRESH_TOKEN_SECRET, 
    {
        expiresIn: config.JWT_REFRESH_TOKEN_EXPIRATION,
        subject : 'refreshToken'
    });
}
