import { IUser } from "../models/users_model";

export type User = IUser & {
    accessToken?: string,
    refreshToken?: string
};