import Joi from "joi";
import {
  CreateAirPort,
  UpdateAirPort,
} from "../types/airPortType";

export const createAirPortSchema = Joi.object<CreateAirPort>({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }).required(),
  country: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }).required(),
  city: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }).required(),
});

export const updateAirPortSchema = Joi.object<UpdateAirPort>({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }),
  country: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }),
  city: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }),
});
