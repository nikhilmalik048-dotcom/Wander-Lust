// it used for handling server side validation for the data 
// which is coming from the client side and also for handling errors in the server side code

const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().required(),
        location: joi.string().required(),
        country: joi.string().required().min(0),

        image: joi.object({
            filename: joi.string().allow("", null),
            url: joi.string().allow("", null)
        }).allow(null)

    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required()
    }).required()
});