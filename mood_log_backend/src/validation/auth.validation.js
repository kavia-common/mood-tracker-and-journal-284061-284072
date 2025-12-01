import Joi from 'joi';

const email = Joi.string().email().max(255).required();
const password = Joi.string().min(8).max(128).required();

export const signupSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email,
  password
});

export const loginSchema = Joi.object({
  email,
  password
});
