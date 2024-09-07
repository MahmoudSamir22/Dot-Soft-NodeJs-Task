import IUser from "../types/userType";
import {
  LoginType,
  SignUpType,
  ForgetPasswordReturnType,
  VerifyResetPassword,
  ResetPassword,
} from "../types/authType";

export default interface IAuthService {
  signUp(data: SignUpType): Promise<IUser>;
  login(data: LoginType): Promise<IUser>;
  forgetPassword(email: string): Promise<ForgetPasswordReturnType>;
  verifyResetPasswordCode(data: VerifyResetPassword): Promise<void>;
  resetPassword(data: ResetPassword): Promise<void>;
}
