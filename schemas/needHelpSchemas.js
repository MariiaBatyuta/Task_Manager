import Joi from "joi";

export const needHelpSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }),
    message: Joi.string().required(),
})