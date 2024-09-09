import {User} from "@prisma/client";
import {Request} from "express";
import { Language } from "../types/languageType";

export default interface CustomRequest extends Request {
    userId: number,
    companyId: number | null,
    role: string;
    language: Language;
    skipLang: boolean;
}