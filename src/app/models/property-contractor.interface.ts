import { Contractor } from "./contractor.interface";
import { Property } from "./property.interface";

export interface PropertyContractor {
    contractor: Contractor,
    property: Property,
}