import Joi from 'joi';

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required(),
    username: Joi.string().alphanum().required(),
    password: Joi.string().min(8).required(),
  //   roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  // createdAt: Joi.date, default: Date.now ,
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};

module.exports = {
  validateSignup
};
