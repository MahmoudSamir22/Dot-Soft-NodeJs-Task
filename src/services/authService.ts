import prisma from "../../prisma/client";
import {
  LoginType,
  SignUpType,
  ResetPassword,
  VerifyResetPassword,
  ForgetPasswordReturnType,
} from "../types/authType";
import bcrypt from "bcrypt";
import ApiError from "../utils/ApiError";
import generateOTP, { encrypt } from "../utils/generateOTP";
import IAuthService from "../interfaces/auth.service";
import IUser from "../types/userType";

class AuthService implements IAuthService {
  async signUp(data: SignUpType): Promise<IUser> {
    await this.checkFieldExists("email", data.email);
    await this.checkFieldExists("phone", data.phone);
    await this.checkFieldExists("login_name", data.login_name);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 8),
      },
    });
    return user;
  }

  async login(data: LoginType): Promise<IUser> {
    const { user_name, password } = data;
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: user_name,
          },
          {
            login_name: user_name,
          },
          {
            phone: user_name,
          },
        ],
      },
    });
    if (!user) {
      throw new ApiError("Incorrect user name or password", 400);
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new ApiError("Incorrect user name or password", 400);
    }
    return user;
  }

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
