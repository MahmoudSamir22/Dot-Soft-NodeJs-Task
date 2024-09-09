import IUser, { UserProfile } from "../types/userType";
import {
  LoginType,
  SignUpType,
  ForgetPasswordReturnType,
  VerifyResetPassword,
  ResetPassword,
  ChangeFirstTimeLoginPassword,
  AddAirwayRepresentativeType,
  ChangePassword
} from "../types/authType";

export default interface IAuthService {
  signUp(data: SignUpType): Promise<IUser>;
  login(data: LoginType): Promise<UserProfile>;
  forgetPassword(email: string): Promise<ForgetPasswordReturnType>;
  verifyResetPasswordCode(data: VerifyResetPassword): Promise<void>;
  resetPassword(data: ResetPassword): Promise<void>;
  changeFirstTimePassword(
    data: ChangeFirstTimeLoginPassword
  ): Promise<UserProfile>;
  addAirwayRepresentative(data: AddAirwayRepresentativeType): Promise<UserProfile>;
  changePassword(userId: number, data: ChangePassword): Promise<void>;
}
