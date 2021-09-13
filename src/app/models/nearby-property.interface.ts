import { PropertyAddress } from "./property-address.interface";
import { PropertyEssentials } from "./property-essentials.interface";
import { PropertyPrices } from "./property-prices.interface";
import { Property } from "./property.interface";


export interface NearbyProperty {
    property: Property,
    prices: PropertyPrices,
    address: PropertyAddress,
    essentials: PropertyEssentials
}