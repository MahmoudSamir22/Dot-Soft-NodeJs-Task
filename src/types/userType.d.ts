import IAirway_Company from "./airwayCompanyType";
import INationality from "./nationalityType";

export default interface IUser {
  id: number;
  title: string | null;
  first_name: string;
  father_name: string | null;
  family_name: string;
  gender: string;
  email: string;
  phone: string;
  login_name: string;
  password: string;
  date_of_birth: Date | null;
  nationalityId: number | null;
  passport_number: string | null;
  passport_expire_date: Date | null;
  airway_CompanyId: number | null;
  first_login: boolean;
  createdAt: Date;

  Aireway_Company?: IAirway_Company;
//   User_Codes?: IUser_Codes;
  Nationality?: INationality;
}
