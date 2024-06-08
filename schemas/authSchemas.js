import Joi from "joi";

export const userRegisterSchema = Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }),
    password: Joi.string().required().min(6),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['net', 'com', 'ua'] } }),
    password: Joi.string().required(),
});

export const userUpdateInfo = Joi.object({
    name: Joi.string().min(3),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } }),
    password: Joi.string().min(6),
})