import { UserRole } from "./user-role.class";

export class User {
    userCognitoId: string
    role: UserRole
    firstName: string
    lastName: string
    email: string
    username: string
    ssn: string
}