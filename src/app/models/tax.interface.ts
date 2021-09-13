import { User } from "./user.interface";

export interface Tax {
    governmentTaxId: string,
    user: User,
    folderPath: string
}