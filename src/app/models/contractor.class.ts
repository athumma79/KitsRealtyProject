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
}