import { Request, Response, NextFunction } from "express";
import CustomRequest from "../interfaces/customRequest";
import { Language } from "../types/languageType";
import response from "../utils/response";

export default function setLanguage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const supportedLanguages: Language[] = ["en", "ar", "fr"];
  const language = (req.headers["accept-language"] as Language) || "en";
  if (!supportedLanguages.includes(language)) {
    return response(res, 400, {
      status: false,
      message: `Unsupported language provided only ${supportedLanguages} are supported`,
    });
  }
  (req as CustomRequest).language = language;
  (req as CustomRequest).skipLang = !!(
    req.headers.localization && req.headers.localization === "false"
  );
  next();
}
