import { UserRole } from "./user-role.class";

export class User {
    userCognitoId: string
    role: UserRole
    firstName: string
    lastName: string
    email: string
    ssn: string

    constructor() {
        this.userCognitoId = null;
        this.role = new UserRole();
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.ssn = null;
    }
}