import { Time } from "@angular/common";
import { OccupancyStatus } from "./occupancy-status.interface";
import { PropertyAddress } from "./property-address.interface";
import { PropertyAuction } from "./property-auction.interface";
import { PropertyEssentials } from "./property-essentials.interface";
import { PropertyLoan } from "./property-loan.interface";
import { PropertyPrices } from "./property-prices.interface";
import { PropertyStatus } from "./property-status.interface";
import { User } from "./user.interface";

export interface Property {
    name: string,
    status: PropertyStatus,
    occupancyStatus: OccupancyStatus,
    coordinator: User,
    auction: PropertyAuction,
    prices: PropertyPrices,
    address: PropertyAddress,
    essentials: PropertyEssentials,
    loan: PropertyLoan,
    dateOfPurchase: Date,
    dateOfSale: Date,
    trusteeName: string
    time: Time,
    subdivision: string,
    countyAssessment: number,
    notes: string,
    folderPath: string
}