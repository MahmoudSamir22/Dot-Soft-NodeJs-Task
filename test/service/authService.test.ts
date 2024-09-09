import authService from "../../src/services/authService";
import prisma from "../../prisma/client";
import bcrypt from "bcrypt";
import ApiError from "../../src/utils/ApiError";
import generateOTP, { encrypt } from "../../src/utils/generateOTP";
import {
  SignUpType,
  LoginType,
  ResetPassword,
  VerifyResetPassword,
  ChangeFirstTimeLoginPassword,
  AddAirwayRepresentativeType,
  ChangePassword,
} from "../../src/types/authType";
import nationalityService from "../../src/services/nationalityService";
import airwayCompanyService from "../../src/services/airwayCompanyService";

jest.mock("../../prisma/client", () => ({
  user: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  user_Codes: {
    upsert: jest.fn(),
    findFirst: jest.fn(),
  },
}));

jest.mock("../../src/utils/generateOTP", () => ({
  encrypt: jest.fn(),
  default: jest.fn(),
}));

jest.mock("../../src/services/nationalityService", () => ({
  getOne: jest.fn(),
}));

jest.mock("../../src/services/airwayCompanyService", () => ({
  getOne: jest.fn(),
}));

describe("AuthService", () => {
  beforeEach(() => {
    jest.resetAllMocks(); 
  });
  describe("signUp", () => {
    it("should sign up a new user", async () => {
      const signUpData: SignUpType = {
        title: "Mr.",
        first_name: "John",
        father_name: "Doe",
        family_name: "Smith",
        gender: "Male",
        email: "john.doe@example.com",
        phone: "1234567890",
        login_name: "johndoe",
        password: "password123",
        date_of_birth: new Date("1990-01-01"),
        nationalityId: 1,
        passport_number: "A1234567",
        passport_expire_date: new Date("2030-01-01"),
      };

      (nationalityService.getOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: { en: "English", ar: "عربي", fr: "Français" },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...signUpData,
        role: "Customer",
        first_login: false,
        password: await bcrypt.hash(signUpData.password, 8),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.signUp(signUpData);
      expect(result).toHaveProperty("id", 1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...signUpData,
          role: "Customer",
          first_login: false,
          password: expect.any(String),
        },
      });
    });

    it("should throw an error if email is already in use", async () => {
      const signUpData: SignUpType = {
        title: "Mr.",
        first_name: "John",
        father_name: "Doe",
        family_name: "Smith",
        gender: "Male",
        email: "john.doe@example.com",
        phone: "1234567890",
        login_name: "johndoe",
        password: "password123",
        date_of_birth: new Date("1990-01-01"),
        nationalityId: 1,
        passport_number: "A1234567",
        passport_expire_date: new Date("2030-01-01"),
      };
      (authService as any).checkFieldExists = jest
        .fn()
        .mockRejectedValue(new ApiError("email already exists", 400));

      await expect(authService.signUp(signUpData)).rejects.toThrowError(
        new ApiError("email already exists", 400)
      );
    });
  });

  describe("login", () => {
    it("should log in a user with correct credentials", async () => {
      const loginData: LoginType = {
        user_name: "john.doe@example.com",
        password: "password123",
      };
    
      const mockUser = {
        id: 1,
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123", 8),
        
      };
    
      
      (prisma.user.findFirst as jest.Mock).mockResolvedValueOnce(mockUser); 
    
      const result = await authService.login(loginData);
      expect(result).toEqual(
        expect.objectContaining({ id: 1, email: "john.doe@example.com" })
      );
    
      
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: {
          OR: [
            { email: loginData.user_name },
            { login_name: loginData.user_name },
            { phone: loginData.user_name },
          ],
        },
        select: expect.any(Object), 
      });
    
      
      expect(prisma.user.findFirst).toHaveBeenCalledTimes(1); 
    });

    it("should throw an error if login fails", async () => {
      (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        authService.login({
          user_name: "wrong@example.com",
          password: "password123",
        })
      ).rejects.toThrowError(
        new ApiError("Incorrect user name or password", 400)
      );
    });
  });

  describe("forgetPassword", () => {
    it.skip("should send a reset password code", async () => {
      const email = "john.doe@example.com";
      const user = { id: 1, email, first_name: "John" };
    
      
      prisma.user.findUnique = jest.fn().mockResolvedValue(user);
      prisma.user_Codes.upsert = jest.fn();
    
      
      const mockedOTP = {
        hashedOTP: "hashedOTP",
        otp: "123456",
        otpExpiration: new Date(Date.now() + 3600 * 1000),
      };
    
      
      (generateOTP as jest.Mock).mockReturnValue(mockedOTP);
    
      await authService.forgetPassword(email);
    
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    
      expect(prisma.user_Codes.upsert).toHaveBeenCalledWith({
        where: { userId: user.id },
        update: {
          resetPasswordCode: mockedOTP.hashedOTP,
          resetPasswordCodeExpiresAt: expect.any(Date),
        },
        create: {
          resetPasswordCode: mockedOTP.hashedOTP,
          resetPasswordCodeExpiresAt: expect.any(Date),
          userId: user.id,
        },
      });
    
      expect(generateOTP).toHaveBeenCalled();
    });

    it("should throw an error if user not found", async () => {
      const email = "wrong@example.com";
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(authService.forgetPassword(email)).rejects.toThrowError(
        new ApiError("User not found", 404)
      );
    });
  });

  describe("verifyResetPasswordCode", () => {
    it("should verify the reset password code", async () => {
      const verifyData: VerifyResetPassword = {
        email: "john.doe@example.com",
        code: "123456",
      };
    
      
      const hashedCode = encrypt(verifyData.code); 
    
      (prisma.user_Codes.findFirst as jest.Mock).mockResolvedValue({
        resetPasswordCode: hashedCode,
        resetPasswordCodeExpiresAt: new Date(Date.now() + 3600 * 1000),
        User: { email: verifyData.email },
      });
    
      await authService.verifyResetPasswordCode(verifyData);
    
      expect(prisma.user_Codes.findFirst).toHaveBeenCalledWith({
        where: {
          resetPasswordCode: hashedCode, 
          resetPasswordCodeExpiresAt: { gte: expect.any(Date) },
          User: { email: verifyData.email },
        },
      });
    });

    it("should throw an error if the code is invalid or expired", async () => {
      (prisma.user_Codes.findFirst as jest.Mock).mockResolvedValue(null);
      await expect(
        authService.verifyResetPasswordCode({
          email: "john.doe@example.com",
          code: "wrongCode",
        })
      ).rejects.toThrowError(new ApiError("Code is Invalid Or Expired", 400));
    });
  });

  describe("resetPassword", () => {
    it("should reset the user password", async () => {
      const resetData: ResetPassword = {
        email: "john.doe@example.com",
        password: "newpassword123",
      };
      (prisma.user.update as jest.Mock).mockResolvedValue({
        email: "john.doe@example.com",
        password: await bcrypt.hash("newpassword123", 8),
      });

      await authService.resetPassword(resetData);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { email: resetData.email },
        data: { password: expect.any(String) },
      });
    });
  });

  describe("changeFirstTimePassword", () => {
    it("should change password for the first time login", async () => {
      const changeData: ChangeFirstTimeLoginPassword = {
        email: "john.doe@example.com",
        password: "password123",
        newPassword: "newpassword123",
      };
      const mockUser = {
        id: 1,
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123", 8),
        first_login: true,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.user.update as jest.Mock).mockResolvedValue({
        
        ...mockUser,
        password: await bcrypt.hash("newpassword123", 8),
        first_login: false,
      });

      const result = await authService.changeFirstTimePassword(changeData);
      expect(result).toEqual({
        id: 1,
        email: "john.doe@example.com",
        password: expect.any(String),
        first_login: false,
      });
    });

    it("should throw an error if current password is incorrect", async () => {
      const changeData: ChangeFirstTimeLoginPassword = {
        email: "john.doe@example.com",
        password: "wrongpassword",
        newPassword: "newpassword123",
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123", 8),
        first_login: true,
      });

      await expect(
        authService.changeFirstTimePassword(changeData)
      ).rejects.toThrowError(new ApiError("Incorrect email or password", 400));
    });
  });

  describe("addAirwayRepresentative", () => {
    it("should add a new airway representative", async () => {
      const addData: AddAirwayRepresentativeType = {
        email: "example1@example.com",
        login_name: "user1234",
        password: "password123",
        first_name: "John",
        family_name: "Doe",
        gender: "Male",
        phone: "+1234567892",
        airway_CompanyId: 1,
      };

      
      (authService as any).checkFieldExists = jest.fn().mockResolvedValue(null);
      (airwayCompanyService.getOne as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Airways Inc.",
      });

      
      const hashedPassword = await bcrypt.hash(addData.password, 8);

      
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...addData,
        role: "Airway Representative",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.addAirwayRepresentative(addData);

      expect(result).toHaveProperty("id", 1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...addData,
          role: "Airway Representative",
          password: expect.any(String), 
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
    });

    it("should throw an error if company does not exist", async () => {
      
      (authService as any).checkFieldExists = jest.fn().mockResolvedValue(null);

      
      (airwayCompanyService.getOne as jest.Mock).mockRejectedValue(
        new ApiError("Company does not exist", 404)
      );

      
      await expect(
        authService.addAirwayRepresentative({
          email: "example123@example.com",
          login_name: "user1234",
          password: "password123",
          first_name: "John",
          family_name: "Doe",
          gender: "Male",
          phone: "+1234567892",
          airway_CompanyId: 999,
        })
      ).rejects.toThrowError(new ApiError("Company does not exist", 404));
    });
  });

  describe("changePassword", () => {
    it("should change the user password", async () => {
      const changeData: ChangePassword = {
        oldPassword: "oldpassword123",
        newPassword: "newpassword123",
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "john.doe@example.com",
        password: await bcrypt.hash("oldpassword123", 8),
      });
      (prisma.user.update as jest.Mock).mockResolvedValue({
        email: "john.doe@example.com",
        password: await bcrypt.hash("newpassword123", 8),
      });

      await authService.changePassword(1, changeData);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: expect.any(String) },
      });
    });

    it("should throw an error if old password is incorrect", async () => {
      const changeData: ChangePassword = {
        oldPassword: "wrongpassword",
        newPassword: "newpassword123",
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        email: "john.doe@example.com",
        password: await bcrypt.hash("correctpassword123", 8),
      });

      await expect(
        authService.changePassword(1, changeData)
      ).rejects.toThrowError(new ApiError("Old password is incorrect", 400));
    });
  });
});
