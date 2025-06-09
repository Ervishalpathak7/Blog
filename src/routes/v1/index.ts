
// Import necessary modules
import { Router } from 'express';

// Impport routes
import authRouter from '@/routes/v1/auth';


// Express router for API version 1
const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Use the auth router for authentication-related routes
router.use('/auth', authRouter);

export default router;