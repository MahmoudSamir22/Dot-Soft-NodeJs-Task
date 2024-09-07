import Joi from "joi";
import {
  CreateNationality,
  UpdateNationality,
} from "../types/nationalityType";

export const createNationalitySchema = Joi.object<CreateNationality>({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }).required(),
});

export const updateNationalitySchema = Joi.object<UpdateNationality>({
  name: Joi.object({
    en: Joi.string(),
    ar: Joi.string(),
    fr: Joi.string(),
  }),
});
