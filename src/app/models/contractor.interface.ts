import { ContractorType } from "./contractor-type.interface";

export interface Contractor {
    contractorType: ContractorType,
    dateHired: Date,
    startDate: Date,
    endDate: Date,
    company: string,
    folderPath: string
}