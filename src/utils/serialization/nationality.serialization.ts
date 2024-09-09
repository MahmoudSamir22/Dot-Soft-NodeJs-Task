import { Language } from "../../types/languageType";
import INationality from "../../types/nationalityType";

export const nationalitySerialization = (
  nationality: INationality,
  lang: Language
) => ({
  ...nationality,
  name: nationality.name[lang],
});

export const nationalitiesSerialization = (
  nationalities: INationality[],
  lang: Language
) =>
  nationalities.map((nationality) =>
    nationalitySerialization(nationality, lang)
  );
