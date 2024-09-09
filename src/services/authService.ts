import prisma from "../../prisma/client";
import {
  LoginType,
  SignUpType,
  ResetPassword,
  VerifyResetPassword,
  ForgetPasswordReturnType,
  ChangeFirstTimeLoginPassword,
  AddAirwayRepresentativeType,
  ChangePassword,
} from "../types/authType";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import generateOTP, { encrypt } from "../utils/generateOTP";
import IAuthService from "../interfaces/auth.service";
import IUser, { UserProfile } from "../types/userType";
import { Roles } from "../enum/user.enums";
import nationalityService from "./nationalityService";
import airwayCompanyService from "./airwayCompanyService";

class AuthService implements IAuthService {
  // @description: Sign up a new user
  // @throw 400 status code if email already exists
  // @throw 400 status code if phone already exists
  // @throw 400 status code if login name already exists
  async signUp(data: SignUpType): Promise<IUser> {
    await this.checkFieldExists("email", data.email);
    await this.checkFieldExists("phone", data.phone);
    await this.checkFieldExists("login_name", data.login_name);
    await nationalityService.getOne(data.nationalityId);

    const user = await prisma.user.create({
      data: {
        ...data,
        role: Roles.CUSTOMER,
        first_login: false,
        password: await bcrypt.hash(data.password, 8),
      },
    });
    return user;
  }

  // @description: Login a user
  // @throw 400 status code if user not found
  // @throw 400 status code if password is incorrect
  async login(data: LoginType): Promise<UserProfile> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: data.user_name,
          },
          {
            login_name: data.user_name,
          },
          {
            phone: data.user_name,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        first_name: true,
        father_name: true,
        family_name: true,
        gender: true,
        email: true,
        phone: true,
        date_of_birth: true,
        nationalityId: true,
        passport_number: true,
        passport_expire_date: true,
        first_login: true,
        role: true,
        Nationality: true,
        Aireway_Company: true,
        password: true,
      },
    });
    if (!user) {
      throw new ApiError("Incorrect user name or password", 400);
    }
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new ApiError("Incorrect user name or password", 400);
    }
    const { password, ...rest } = user;
    return rest;
  }

  // @description: Forget password and send reset code to email
  // @throw 404 status code if user not found
  async forgetPassword(email: string): Promise<ForgetPasswordReturnType> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const codes = generateOTP();
    await prisma.user_Codes.upsert({
      where: {
        userId: user.id,
      },
      update: {
        resetPasswordCode: codes.hashedOTP,
        resetPasswordCodeExpiresAt: new Date(codes.otpExpiration),
      },
      create: {
        resetPasswordCode: codes.hashedOTP,
        resetPasswordCodeExpiresAt: new Date(codes.otpExpiration),
        userId: user.id,
      },
    });
    return { email: user.email, code: codes.otp, username: user.first_name };
  }

  // @description: Verify reset code
  // @throw 400 status code if code is invalid or expired
  async verifyResetPasswordCode(data: VerifyResetPassword): Promise<void> {
    const hashedOTP = encrypt(data.code);
    const userCode = await prisma.user_Codes.findFirst({
      where: {
        resetPasswordCode: hashedOTP,
        resetPasswordCodeExpiresAt: {
          gte: new Date(),
        },
        User: {
          email: data.email,
        },
      },
    });
    if (!userCode) {
      throw new ApiError("Code is Invalid Or Expired", 400);
    }
  }

  // @description: Reset password
  async resetPassword(data: ResetPassword): Promise<void> {
    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        password: await bcrypt.hash(data.password, 8),
      },
    });
  }

  // @description: Change first time login password
  // @throw 400 status code if email or password is incorrect
  // @throw 400 status code if new password is same as old password
  async changeFirstTimePassword(
    data: ChangeFirstTimeLoginPassword
  ): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) throw new ApiError("Incorrect email or password", 400);
    if (!user.first_login)
      throw new ApiError("You are not allowed to change password", 400);
    if (!(await bcrypt.compare(data.password, user.password)))
      throw new ApiError("Incorrect email or password", 400);
    if (data.password === data.newPassword)
      throw new ApiError("You can't use the same password", 400);
    return await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await bcrypt.hash(data.newPassword, 8),
        first_login: false,
      },
      select: {
        id: true,
        title: true,
        first_name: true,
        father_name: true,
        family_name: true,
        gender: true,
        email: true,
        phone: true,
        date_of_birth: true,
        nationalityId: true,
        passport_number: true,
        passport_expire_date: true,
        first_login: true,
        role: true,
        Nationality: true,
        Aireway_Company: true,
      },
    });
  }

  // @description: Add airway representative
  // @throw 400 status code if phone already exists
  // @throw 400 status code if email already exists
  // @throw 400 status code if login name already exists
  // @throw 404 status code if company not found
  async addAirwayRepresentative(
    data: AddAirwayRepresentativeType
  ): Promise<UserProfile> {
    await this.checkFieldExists("email", data.email);
    await this.checkFieldExists("phone", data.phone);
    await this.checkFieldExists("login_name", data.login_name);
    await airwayCompanyService.getOne(data.airway_CompanyId);

    const user = await prisma.user.create({
      data: {
        ...data,
        role: Roles.AIRWAY_REPRESENTATIVE,
        password: await bcrypt.hash(data.password, 8),
      },
      select: {
        id: true,
        title: true,
        first_name: true,
        father_name: true,
        family_name: true,
        gender: true,
        email: true,
        phone: true,
        date_of_birth: true,
        nationalityId: true,
        passport_number: true,
        passport_expire_date: true,
        first_login: true,
        role: true,
        Nationality: true,
        Aireway_Company: true,
      },
    });
    return user;
  }

  // @description: Change password
  // @throw 404 status code if user not found
  // @throw 400 status code if old password is incorrect
  async changePassword(userId: number, data: ChangePassword): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new ApiError("User not found", 404);
    const passwordMatch = await bcrypt.compare(data.oldPassword, user.password);
    if (!passwordMatch) throw new ApiError("Old password is incorrect", 400);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(data.newPassword, 8),
      },
    });
  }

  // @description: Check if field exists with value
  private async checkFieldExists(
    field: "email" | "phone" | "login_name",
    value: string
  ): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        [field]: value,
      },
    });
    if (user) {
      throw new ApiError(`${field} already exists`, 400);
    }
  }
}

const authService = new AuthService();
export default authService;
