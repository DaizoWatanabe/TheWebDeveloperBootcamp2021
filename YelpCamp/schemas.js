const Joi = require("joi");

module.exports.campgroundSchema =  Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    description: Joi.string().required(),
  }).required()
})

