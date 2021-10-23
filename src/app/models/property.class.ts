import { Time } from "@angular/common";
import { OccupancyStatus } from "./occupancy-status.class";
import { PropertyAddress } from "./property-address.class";
import { PropertyAuction } from "./property-auction.class";
import { PropertyEssentials } from "./property-essentials.class";
import { PropertyLoan } from "./property-loan.class";
import { PropertyPrices } from "./property-prices.class";
import { PropertyStatus } from "./property-status.class";
import { User } from "./user.class";

export class Property {
    propertyId: number
    status: PropertyStatus
    occupancyStatus: OccupancyStatus
    coordinator: User
    auction: PropertyAuction
    prices: PropertyPrices
    address: PropertyAddress
    essentials: PropertyEssentials
    loan: PropertyLoan
    dateOfPurchase: Date
    dateOfSale: Date
    trusteeName: string
    subdivision: string
    countyAssessment: number
    notes: string

    constructor() {
        this.propertyId = null;
        this.status = new PropertyStatus();
        this.occupancyStatus = new OccupancyStatus();
        this.coordinator = new User();
        this.auction = new PropertyAuction();
        this.prices = new PropertyPrices();
        this.address = new PropertyAddress();
        this.essentials = new PropertyEssentials();
        this.loan = new PropertyLoan();
        this.dateOfPurchase = null;
        this.dateOfSale = null;
        this.trusteeName = null;
        this.subdivision = null;
        this.countyAssessment = null;
        this.notes = null;
    }
}