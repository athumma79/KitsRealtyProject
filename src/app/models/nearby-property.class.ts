import { PropertyAddress } from "./property-address.class";
import { PropertyEssentials } from "./property-essentials.class";
import { PropertyPrices } from "./property-prices.class";
import { Property } from "./property.class";


export class NearbyProperty {
    nearbyPropertyId: string
    property: Property
    prices: PropertyPrices
    address: PropertyAddress
    essentials: PropertyEssentials
}