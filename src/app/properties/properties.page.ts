import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertyDetailsPage } from '../property-details/property-details.page';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';
import { LoadingController } from '@ionic/angular';
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
import { AddPropertyFormPage } from '../add-property-form/add-property-form.page';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss']
})
export class PropertiesPage implements OnInit {

  apiName = 'KitsRealtyAPI2';
  filterTerm: string;

  constructor(public modalController: ModalController, public loadingController: LoadingController) {}
  
  ngOnInit() {

    this.loadProperties(() => this.loadThumbnails());

  }

  properties: Property[] = new Array();
  backupProperties: Property[] = new Array();

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
          coordinator.ssn = dbProperties[i]["SSN"];
          
          var propertyAuction = new PropertyAuction();
          propertyAuction.auctionId = dbProperties[i]["AUCTION_ID"];
          propertyAuction.auctionLocation = dbProperties[i]["AUCTION_LOCATION"];
          propertyAuction.dateOfAuction = dbProperties[i]['DATE_OF_AUCTION'] ? new Date(dbProperties[i]['DATE_OF_AUCTION'].substring(0, dbProperties[i]['DATE_OF_AUCTION'].lastIndexOf('.'))) : null;

          var propertyPrices = new PropertyPrices();
          propertyPrices.pricesId = dbProperties[i]["PRICES_ID"];
          propertyPrices.buyValue = dbProperties[i]["BUY_VALUE"];
          propertyPrices.expectedValue = dbProperties[i]["EXPECTED_VALUE"];
          propertyPrices.sellValue = dbProperties[i]["SELL_VALUE"];
          propertyPrices.biddingPrice = dbProperties[i]["BIDDING_PRICE"];
          propertyPrices.marketPrice = dbProperties[i]["MARKET_PRICE"];

          var propertyAddress = new PropertyAddress();
          propertyAddress.addressId = dbProperties[i]["ADDRESS_ID"];
          propertyAddress.address = dbProperties[i]["ADDRESS"];
          propertyAddress.city = dbProperties[i]["CITY"];
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
          property.status = propertyStatus;
          property.occupancyStatus = occupancyStatus;
          property.coordinator = coordinator;
          property.auction = propertyAuction;
          property.prices = propertyPrices;
          property.address = propertyAddress;
          property.essentials = propertyEssentials;
          property.loan = propertyLoan;
          property.dateOfPurchase = dbProperties[i]['DATE_OF_PURCHASE'] ? new Date(dbProperties[i]['DATE_OF_PURCHASE'].substring(0, dbProperties[i]['DATE_OF_PURCHASE'].lastIndexOf('.'))) : null;
          property.dateOfSale = dbProperties[i]['DATE_OF_SALE'] ? new Date(dbProperties[i]['DATE_OF_SALE'].substring(0, dbProperties[i]['DATE_OF_SALE'].lastIndexOf('.'))) : null;
          property.trusteeName = dbProperties[i]["TRUSTEE_NAME"];
          property.subdivision = dbProperties[i]["SUBDIVISION"];
          property.countyAssessment = dbProperties[i]["COUNTY_ASSESSMENT"];
          property.notes = dbProperties[i]["NOTES"];
            
          this.properties.push(property);
          this.backupProperties.push(property);
        }
        $(document).ready(function() {
          callback();
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  

  sortProperties(e){
    switch(e.detail.value){
      case "status": this.properties.sort((a, b) => a.status.statusId.localeCompare(b.status.statusId));break
      case "state": this.properties.sort((a, b) => a.address.state.localeCompare(b.address.state));break
      case "type": this.properties.sort((a, b) => a.essentials.propertyType.localeCompare(b.essentials.propertyType));break
      case "city": this.properties.sort((a, b) => a.address.city.localeCompare(b.address.city));break
      case "numBeds": this.properties.sort((a, b) => a.essentials.numBeds-b.essentials.numBeds);break
      case "numBaths": this.properties.sort((a, b) => a.essentials.numBaths-b.essentials.numBaths);break
      case "landFootage": this.properties.sort((a, b) => a.essentials.landFootage-b.essentials.landFootage);break
      case "propertyFootage": this.properties.sort((a, b) => a.essentials.propertyFootage-b.essentials.propertyFootage);break
      case "yearBuilt": this.properties.sort((a, b) => a.essentials.yearBuilt-b.essentials.yearBuilt);break
    }
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
      case "Sold Price":
        return "Sell Value";
      default:
        return "";
    }
  }
  async loadThumbnails() {
    for (var i = 0; i < this.properties.length; i++) {
      var property = this.properties[i];
      await this.getThumbnail(this.properties[i], (response) => { 
        $(".thumbnail-" + property.propertyId).append("<img height='100px' width='auto'  src=\"" + response + "\">");
      })
    }
  }
  
  async getThumbnail(property: Property, callback) {
    await Storage.list("properties/" + property.propertyId + "/thumbnail/")
      .then(async response => {
        if (!response || response.length < 1) {
          $(".thumbnail-" + property.propertyId).append("<img height='100px' width='auto'  src=\"/assets/placeholder-image.png\">");
          return;
        }
        await Storage.get(response[0].key)
          .then(response => {
            callback(response);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  filterList(evt) {
    this.properties = this.backupProperties;
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.properties = this.properties.filter(property => {
      return ((property.address.address) ? (property.address.address.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((property.address.city) ? (property.address.city.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((property.address.state) ? (property.address.state.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((property.address.county) ? (property.address.county.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((property.address.zipcode) ? (property.address.zipcode.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((property.status.propertyStatusDescription) ? (property.status.propertyStatusDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false);
    });
  }

  async openPropertyDetails(index: number) {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage,
      componentProps: {
        'property': this.properties[index],
      }
    });
    propertyDetailsModal.onDidDismiss().then((dismissed) => {
      location.reload();
  });
    return await propertyDetailsModal.present();
  }
  async openAddPropertyForm() {
    const AddPropertyFormModal = await this.modalController.create({
      component: AddPropertyFormPage
    });
    AddPropertyFormModal.onDidDismiss().then((dismissed) => {
        location.reload();
    });
    return await AddPropertyFormModal.present();
  }
  async openRequestResarchForm() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage
    });
    return await propertyDetailsModal.present();
  }

}
