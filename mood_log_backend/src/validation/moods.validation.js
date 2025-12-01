import Joi from 'joi';

export const moodTypes = ['Happy', 'Neutral', 'Sad', 'Angry', 'Excited'];

export const createMoodSchema = Joi.object({
  mood_type: Joi.string()
    .valid(...moodTypes)
    .required(),
  note: Joi.string().allow('', null).max(1000),
  date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required()
});

export const updateMoodSchema = Joi.object({
  mood_type: Joi.string()
    .valid(...moodTypes)
    .optional(),
  note: Joi.string().allow('', null).max(1000).optional(),
  date: Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
}).min(1);
