import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertyDetailsPage } from '../property-details/property-details.page';

//API connection
import { API } from 'aws-amplify';
import { Property } from '../models/property.class';
import { PropertyStatus } from '../models/property-status.class';
import { OccupancyStatus } from '../models/occupancy-status.class';
import { UserRole } from '../models/user-role.class';
import { User } from '../models/user.class';
import { PropertyAuction } from '../models/property-auction.class';
import { PropertyPrices } from '../models/property-prices.class';
import { PropertyAddress } from '../models/property-address.class';
import { PropertyEssentials } from '../models/property-essentials.class';
import { PropertyLoan } from '../models/property-loan.class';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss']
})
export class PropertiesPage implements OnInit {

  apiName = 'KitsRealtyAPI2';
  
  constructor(public modalController: ModalController) {}
  
  ngOnInit() {

    this.loadProperties();
    
  }

  public properties:Property[] = new Array();

  async loadProperties() {
    API
      .get(this.apiName, '/properties', {})
      .then(response => {
        var dbProperties = response.properties;
        console.log(dbProperties);
        for(var i = 0; i < dbProperties.length; i++) {
          var propertyStatus = new PropertyStatus();
          propertyStatus.propertyStatusDescription = dbProperties[i]["PROPERTY_STATUS_DESCRIPTION"];
          
          var occupancyStatus = new OccupancyStatus();
          occupancyStatus.occupancyStatusDescription = dbProperties[i]["OCCUPANCY_STATUS_DESCRIPTION"];

          var coordinatorUserRole = new UserRole();
          coordinatorUserRole.userRoleDescription = dbProperties[i]["USER_ROLE_DESCRIPTION"];
          console.log(dbProperties[i]);

          var coordinator = new User();
          coordinator.role = coordinatorUserRole;
          coordinator.firstName = dbProperties[i]["FIRST_NAME"];
          coordinator.lastName = dbProperties[i]["LAST_NAME"];
          coordinator.email = dbProperties[i]["EMAIL"];
          coordinator.username = dbProperties[i]["USERNAME"];
          coordinator.ssn = dbProperties[i]["SSN"];
          
          var propertyAuction = new PropertyAuction();
          propertyAuction.auctionLocation = dbProperties[i]["AUCTION_LOCATION"];
          propertyAuction.dateOfAuction = dbProperties[i]["DATE_OF_AUCTION"];

          var propertyPrices = new PropertyPrices();
          propertyPrices.buyValue = dbProperties[i]["BUY_VALUE"];
          propertyPrices.expectedValue = dbProperties[i]["EXPECTED_VALUE"];
          propertyPrices.sellValue = dbProperties[i]["SELL_VALUE"];
          propertyPrices.biddingPrice = dbProperties[i]["BIDDING_PRICE"];
          propertyPrices.marketPrice = dbProperties[i]["MARKET_PRICE"];

          var propertyAddress = new PropertyAddress();
          propertyAddress.address = dbProperties[i]["ADDRESS"];
          propertyAddress.county = dbProperties[i]["COUNTY"];
          propertyAddress.zipcode = dbProperties[i]["ZIPCODE"];
          propertyAddress.state = dbProperties[i]["STATE"];

          var propertyEssentials = new PropertyEssentials();
          propertyEssentials.propertyType = dbProperties[i]["PROPERTY_TYPE"];
          propertyEssentials.numBeds = dbProperties[i]["NUM_BEDS"];
          propertyEssentials.numBaths = dbProperties[i]["NUM_BATHS"];
          propertyEssentials.landFootage = dbProperties[i]["LAND_FOOTAGE"]; 
          propertyEssentials.propertyFootage = dbProperties[i]["PROPERTY_FOOTAGE"];
          propertyEssentials.yearBuilt = dbProperties[i]["YEAR_BUILT"];
          propertyEssentials.zillowLink = dbProperties[i]["ZILLOW_LINK"];

          var propertyLoan = new PropertyLoan();
          propertyLoan.amount = dbProperties[i]["AMOUNT"];
          propertyLoan.month = dbProperties[i]["MONTH"];
          propertyLoan.year = dbProperties[i]["YEAR"];

          var property = new Property();
          property.name = dbProperties[i]["NAME"];
          property.status = propertyStatus;
          property.occupancyStatus = occupancyStatus;
          property.coordinator = coordinator;
          property.auction = propertyAuction;
          property.prices = propertyPrices;
          property.address = propertyAddress;
          property.essentials = propertyEssentials;
          property.loan = propertyLoan;
          property.dateOfPurchase = dbProperties[i]["DATE_OF_PURCHASE"];
          property.dateOfSale = dbProperties[i]["DATE_OF_SALE"];
          property.trusteeName = dbProperties[i]["TRUSTEE_NAME"];
          property.time = dbProperties[i]["TIME"];
          property.subdivision = dbProperties[i]["SUBDIVISION"];
          property.countyAssessment = dbProperties[i]["COUNTY_ASSESSMENT"];
          property.notes = dbProperties[i]["NOTES"];
          property.propertyFolderPath = dbProperties[i]["PROPERTY_FOLDER_PATH"];
            
          console.log(property);
          this.properties.push(property);
        }
        console.log(this.properties);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getPriceByStatus(property: Property) {
    switch (property.status.propertyStatusDescription) {
      case "Researched": case "Pending Purchase":
        return property.prices.marketPrice; break;
      case "Purchased": case "Undergoing Remodeling": case "Finished Remodeling":
        return property.prices.buyValue; break;
      case "For Sale":
        return property.prices.expectedValue; break;
      case "Sold":
        return property.prices.sellValue; break;
      default:
        return null;
    }
  }

  getPriceTypeByStatus(property: Property) {
    switch (property.status.propertyStatusDescription) {
      case "Researched": case "Pending Purchase":
        return "Market Price";
      case "Purchased": case "Undergoing Remodeling": case "Finished Remodeling":
        return "Buy Value";
      case "For Sale":
        return "Expected Value";
      case "Sold":
        return "Sell Value";
      default:
        return "";
    }
  }

  async openPropertyDetails() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage
    });
    return await propertyDetailsModal.present();
  }
  async openAddPropertyForm() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage
    });
    return await propertyDetailsModal.present();
  }
  async openRequestResarchForm() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage
    });
    return await propertyDetailsModal.present();
  }

}
