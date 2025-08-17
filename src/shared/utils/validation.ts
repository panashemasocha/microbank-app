import * as yup from 'yup';
import { VALIDATION_MESSAGES } from '@/shared/constants/appConstants';

// Login
export const loginSchema = yup.object({
  email: yup
    .string()
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: yup
    .string()
    .min(6, VALIDATION_MESSAGES.MIN_PASSWORD_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Register
export const registerSchema = yup.object({
  name: yup.string().required(VALIDATION_MESSAGES.REQUIRED),
  email: yup
    .string()
    .email(VALIDATION_MESSAGES.INVALID_EMAIL)
    .required(VALIDATION_MESSAGES.REQUIRED),
  password: yup
    .string()
    .min(6, VALIDATION_MESSAGES.MIN_PASSWORD_LENGTH)
    .required(VALIDATION_MESSAGES.REQUIRED),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], VALIDATION_MESSAGES.PASSWORDS_MUST_MATCH)
    .required(VALIDATION_MESSAGES.REQUIRED),
});

// Transaction
export const transactionSchema = yup.object({
  amount: yup
    .number()
    .typeError(VALIDATION_MESSAGES.INVALID_AMOUNT)
    .positive(VALIDATION_MESSAGES.INVALID_AMOUNT)
    .min(0.01, VALIDATION_MESSAGES.MINIMUM_AMOUNT)
    .required(VALIDATION_MESSAGES.REQUIRED),
  description: yup.string().optional(),
});
