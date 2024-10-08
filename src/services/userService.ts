import prisma from "../../prisma/client";
import IUser, { UserProfile } from "../types/userType";
import { SignUpType } from "../types/authType";
import IUserService from "../interfaces/user.service";
import ApiError from "../utils/ApiError";
import { Roles } from "../enum/user.enums";

class UserService implements IUserService {
  // @description: Get User Profile Details
  // @throw 404 status code if user not found
  async getProfile(id: number): Promise<UserProfile> {
    const user = await prisma.user.findUnique({
      where: { id },
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
    if (!user) throw new ApiError("User not found", 404);
    return user;
  }
}

const userService = new UserService();
export default userService;