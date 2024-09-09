import Joi from "joi";
import {
  SignUpType,
  LoginType,
  ChangeFirstTimeLoginPassword,
} from "../types/authType";
import { Genders, Titles } from "../enum/user.enums";

export const registerValidationSchema = Joi.object<SignUpType>().keys({
  email: Joi.string().email().required(),
  login_name: Joi.string().min(5).required(),
  password: Joi.string().required(),
  date_of_birth: Joi.date().iso().required(),
  title: Joi.string()
    .valid(...Object.values(Titles))
    .required(),
  first_name: Joi.string().required(),
  father_name: Joi.string().required(),
  family_name: Joi.string().required(),
  gender: Joi.string()
    .valid(...Object.values(Genders))
    .required(),
  phone: Joi.string().required(),
  nationalityId: Joi.number().strict().required(),
  passport_number: Joi.string().required(),
  passport_expire_date: Joi.date().iso().required(),
});

export const loginValidationSchema = Joi.object<LoginType>().keys({
  user_name: Joi.string().required(),
  password: Joi.string().required(),
});

export const changeFirstTimePasswordSchema =
  Joi.object<ChangeFirstTimeLoginPassword>().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    newPassword: Joi.string().required(),
  });
