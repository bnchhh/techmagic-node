const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  description: Joi.string(),

  completed: Joi.boolean(),
});

module.exports = schema;

