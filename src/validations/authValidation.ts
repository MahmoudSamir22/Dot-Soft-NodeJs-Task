import Joi from "joi";
import {
  SignUpType,
  LoginType,
  ChangeFirstTimeLoginPassword,
  AddAirwayRepresentativeType,
  ChangePassword,
  ResetPassword,
} from "../types/authType";
import { Genders, Titles } from "../enum/user.enums";

export const registerValidationSchema = Joi.object<SignUpType>().keys({
  email: Joi.string().email().required(),
  login_name: Joi.string().min(5).required(),
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)."
    ),
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
    newPassword: Joi.string()
      .required()
      .pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)."
      ),
  });

export const addAirwayRepresentativeSchema =
  Joi.object<AddAirwayRepresentativeType>().keys({
    email: Joi.string().email().required(),
    login_name: Joi.string().min(5).required(),
    password: Joi.string()
      .required()
      .pattern(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)."
      ),
    first_name: Joi.string().required(),
    family_name: Joi.string().required(),
    gender: Joi.string()
      .valid(...Object.values(Genders))
      .required(),
    phone: Joi.string().required(),
    airway_CompanyId: Joi.number().strict().required(),
  });

export const changePasswordSchema = Joi.object<ChangePassword>().keys({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .required()
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)."
    ),
});


export const resetPasswordSchema = Joi.object<ResetPassword>().keys({
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character (@, $, !, %, *, ?, &)."
    ),
});