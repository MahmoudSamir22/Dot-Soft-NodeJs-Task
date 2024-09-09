export type SignUpType = {
  title: string | null;
  first_name: string;
  father_name: string;
  family_name: string;
  gender: string;
  email: string;
  phone: string;
  login_name: string;
  password: string;
  date_of_birth: Date;
  nationalityId: number;
  passport_number: string;
  passport_expire_date: Date;
};

export type LoginType = {
  user_name: string;
  password: string;
};

export type ForgetPasswordReturnType = {
  email: string;
  code: number;
  username: string;
};

export type VerifyResetPassword = {
    email: string;
    code: string;
}

export type ResetPassword = {
    email: string;
    password: string;
}

export type ChangeFirstTimeLoginPassword = {
    email: string;
    password: string;
    newPassword: string;
}


export type AddAirwayRepresentativeType = {
  first_name: string;
  family_name: string;
  gender: string;
  email: string;
  phone: string;
  login_name: string;
  password: string;
  airway_CompanyId: number;
};