import { User } from "./user.class";

export class Tax {
    taxId: number
    governmentTaxId: string
    user: User

    constructor() {
        this.taxId = null;
        this.governmentTaxId = null;
        this.user = new User();
    }
}