import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertyDetailsPage } from '../property-details/property-details.page';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

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

    this.loadProperties(() => this.loadThumbnails());

  }

  public properties:Property[] = new Array();

  async loadProperties(callback) {
    API
      .get(this.apiName, '/properties', {})
      .then(response => {
        var dbProperties = response.properties;
        for(var i = 0; i < dbProperties.length; i++) {
          var propertyStatus = new PropertyStatus();
          propertyStatus.statusId = dbProperties[i]["STATUS_ID"];
          propertyStatus.propertyStatusDescription = dbProperties[i]["PROPERTY_STATUS_DESCRIPTION"];
          
          var occupancyStatus = new OccupancyStatus();
          occupancyStatus.occupancyStatusId = dbProperties[i]["OCCUPANCY_STATUS_ID"];
          occupancyStatus.occupancyStatusDescription = dbProperties[i]["OCCUPANCY_STATUS_DESCRIPTION"];

          var coordinatorUserRole = new UserRole();
          coordinatorUserRole.roleId = dbProperties[i]["ROLE_ID"];
          coordinatorUserRole.userRoleDescription = dbProperties[i]["USER_ROLE_DESCRIPTION"];

          var coordinator = new User();
          coordinator.userCognitoId = dbProperties[i]["USER_COGNITO_ID"];
          coordinator.role = coordinatorUserRole;
          coordinator.firstName = dbProperties[i]["FIRST_NAME"];
          coordinator.lastName = dbProperties[i]["LAST_NAME"];
          coordinator.email = dbProperties[i]["EMAIL"];
          coordinator.username = dbProperties[i]["USERNAME"];
          coordinator.ssn = dbProperties[i]["SSN"];
          
          var propertyAuction = new PropertyAuction();
          propertyAuction.auctionId = dbProperties[i]["AUCTION_ID"];
          propertyAuction.auctionLocation = dbProperties[i]["AUCTION_LOCATION"];
          propertyAuction.dateOfAuction = dbProperties[i]["DATE_OF_AUCTION"];

          var propertyPrices = new PropertyPrices();
          propertyPrices.pricesId = dbProperties[i]["PROPERTY_PRICES"];
          propertyPrices.buyValue = dbProperties[i]["BUY_VALUE"];
          propertyPrices.expectedValue = dbProperties[i]["EXPECTED_VALUE"];
          propertyPrices.sellValue = dbProperties[i]["SELL_VALUE"];
          propertyPrices.biddingPrice = dbProperties[i]["BIDDING_PRICE"];
          propertyPrices.marketPrice = dbProperties[i]["MARKET_PRICE"];

          var propertyAddress = new PropertyAddress();
          propertyAddress.addressId = dbProperties[i]["ADDRESS_ID"];
          propertyAddress.address = dbProperties[i]["ADDRESS"];
          propertyAddress.county = dbProperties[i]["COUNTY"];
          propertyAddress.zipcode = dbProperties[i]["ZIPCODE"];
          propertyAddress.state = dbProperties[i]["STATE"];

          var propertyEssentials = new PropertyEssentials();
          propertyEssentials.essentialsId = dbProperties[i]["ESSENTIALS_ID"];
          propertyEssentials.propertyType = dbProperties[i]["PROPERTY_TYPE"];
          propertyEssentials.numBeds = dbProperties[i]["NUM_BEDS"];
          propertyEssentials.numBaths = dbProperties[i]["NUM_BATHS"];
          propertyEssentials.landFootage = dbProperties[i]["LAND_FOOTAGE"]; 
          propertyEssentials.propertyFootage = dbProperties[i]["PROPERTY_FOOTAGE"];
          propertyEssentials.yearBuilt = dbProperties[i]["YEAR_BUILT"];
          propertyEssentials.zillowLink = dbProperties[i]["ZILLOW_LINK"];

          var propertyLoan = new PropertyLoan();
          propertyLoan.loanId = dbProperties[i]["LOAN_ID"];
          propertyLoan.amount = dbProperties[i]["AMOUNT"];
          propertyLoan.month = dbProperties[i]["MONTH"];
          propertyLoan.year = dbProperties[i]["YEAR"];

          var property = new Property();
          property.propertyId = dbProperties[i]["PROPERTY_ID"];
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
            
          this.properties.push(property);
        }
        $(function() {
          callback();
        });
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

  async loadThumbnails() {
    console.log('loading');
    for (var i = 0; i < this.properties.length; i++) {
      var property = this.properties[i];
      console.log(property);
      console.log($(".thumbnail-" + property.propertyId));
      $(".thumbnail-" + property.propertyId).append("<img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png\"/>");
      // $(".thumbnail-" + property.propertyId).append("<img src=\"" + await this.getThumbnail(this.properties[i]) + "\"/>");
    }
  }

  async getThumbnail(property: Property) {
    console.log("called");
    await Storage.list("properties/" + property.propertyId + "/thumbnail/")
    .then(response => {
      console.log(response);
      Storage.get(response[1].key)
      .then(response => {
        console.log(response);
        return response;
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    });
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
