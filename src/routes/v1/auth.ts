import { Router } from 'express';
import { body } from 'express-validator';

// Import necessary Controllers
import registerController from '@/controllers/v1/auth/register';
import validationErrorMiddleware from '@/middlewares/validationError';
import user from '@/models/user';
import loginController from '@/controllers/v1/auth/login';
import bcrypt from 'bcrypt';

const router = Router();

// Route for user registration
router.post(
  '/register',
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters')
    .isEmail()
    .withMessage('Invalid email address')
    .custom(async (value) => {
      const existingUser = await user.exists({ email: value });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters'),

  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either "user" or "admin"'),

  validationErrorMiddleware,
  registerController,
);



// Route for user login
router.post(
  '/login', 
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isLength({ max: 255 })
    .withMessage('Email must be less than 255 characters')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 64 })
    .withMessage('Password must be between 8 and 64 characters')
    .custom( async ( value, { req }) => {
      const { email } = req.body as { email : string };
      const existingUser = await user.exists({ email })
      .select('password')
      .lean()
      .exec();

      if (!existingUser) {
        throw new Error('Invalid email or password');
      }

      const passwordMatch = await bcrypt.compare(value, existingUser.password);
      if (!passwordMatch) {
        throw new Error('Invalid email or password');
      }
      return true;
    }),
      
  validationErrorMiddleware,
  loginController
  );




export default router;
