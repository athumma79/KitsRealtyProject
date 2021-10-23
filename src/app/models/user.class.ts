import { UserRole } from "./user-role.class";

export class User {
    userCognitoId: string
    role: UserRole
    firstName: string
    lastName: string
    email: string
    username: string
    ssn: string

    constructor() {
        this.userCognitoId = null;
        this.role = new UserRole();
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.username = null;
        this.ssn = null;
    }
}