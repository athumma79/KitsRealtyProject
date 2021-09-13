import { UserRole } from "./user-role.interface";

export interface User {
    role: UserRole,
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    ssn: string
}