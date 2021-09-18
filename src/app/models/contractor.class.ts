import { ContractorType } from "./contractor-type.class";

export class Contractor {
    contractorCognitoId: string
    contractorType: ContractorType
    dateHired: Date
    startDate: Date
    endDate: Date
    company: string
}