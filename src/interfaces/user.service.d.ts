import IUser, { UserProfile } from "../types/userType";
import { SignUpType } from "../types/authType";

export default interface IUserService {
    getProfile(id: number): Promise<UserProfile>;
}