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
}