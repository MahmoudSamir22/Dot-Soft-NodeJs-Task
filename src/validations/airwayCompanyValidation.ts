import Joi from "joi";
import {
  CreateAirwayCompany,
  UpdateAirwayCompany,
} from "../types/airwayCompanyType";

export const createAirwayCompanySchema = Joi.object<CreateAirwayCompany>({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }).required(),
});

export const updateAirwayCompanySchema = Joi.object<UpdateAirwayCompany>({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
    fr: Joi.string().required(),
  }).optional(),
});
