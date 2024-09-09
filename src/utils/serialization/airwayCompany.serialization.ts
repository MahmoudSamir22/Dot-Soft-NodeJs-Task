import { Language } from "../../types/languageType";
import IAirway_Company from "../../types/airwayCompanyType";

export const airwayCompanySerialization = (
  airwayCompany: IAirway_Company,
  lang: Language
) => ({
  ...airwayCompany,
  name: airwayCompany.name[lang],
});

export const airewayCompaniesSerialization = (
  airewayCompanies: IAirway_Company[],
  lang: Language
) =>
  airewayCompanies.map((airwayCompany) =>
    airwayCompanySerialization(airwayCompany, lang)
  );
