import { Contractor } from "./contractor.class";
import { Property } from "./property.class";

export class PropertyContractor {
    contractor: Contractor
    property: Property

    constructor() {
        this.contractor = new Contractor();
        this.property = new Property();
    }
}