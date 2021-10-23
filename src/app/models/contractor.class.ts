import { ContractorType } from "./contractor-type.class";
import { User } from "./user.class";

export class Contractor {
    contractorCognitoId: string
    contractorUser: User
    contractorType: ContractorType
    dateHired: Date
    startDate: Date
    endDate: Date
    company: string

    constructor() {
        this.contractorCognitoId = null;
        this.contractorUser = new User();
        this.contractorType = new ContractorType();
        this.dateHired = null;
        this.startDate = null;
        this.endDate = null;
        this.company = null;
    }
}