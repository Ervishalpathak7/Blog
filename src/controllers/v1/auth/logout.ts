import logger from '@/lib/winston';
import { Request, Response } from 'express';
import config from '@/config';

const logoutController = async (req: Request, res: Response) => {
  try {

    res.sendStatus(204);

  } catch (error) {
    logger.error(`Error in logout : ${error}`);
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Internal Server Error',
    });
  }
};

export default logoutController
