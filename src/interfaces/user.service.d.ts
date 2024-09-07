import IUser, { UserProfile } from "../types/userType";
import { SignUpType } from "../types/authType";

export default interface IUserService {
    getProfile(id: number): Promise<UserProfile>;
    updateProfile(id: number, data: SignUpType): Promise<UserProfile>;
    addAirwayRepresentative(data: SignUpType): Promise<UserProfile>;
}