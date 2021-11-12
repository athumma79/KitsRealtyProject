import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Property } from '../models/property.class';
import { API, Storage } from 'aws-amplify';
import { PropertyStatus } from '../models/property-status.class';
import { OccupancyStatus } from '../models/occupancy-status.class';
import { User } from '../models/user.class';
import { PropertyAuction } from '../models/property-auction.class';
import { PropertyPrices } from '../models/property-prices.class';
import { PropertyAddress } from '../models/property-address.class';
import { PropertyEssentials } from '../models/property-essentials.class';
import { PropertyLoan } from '../models/property-loan.class';


@Component({
  selector: 'app-add-property-form',
  templateUrl: './add-property-form.page.html',
  styleUrls: ['./add-property-form.page.scss'],
})
export class AddPropertyFormPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  newProperty: Property = new Property();
  thumbnail: any;

  constructor(
    public modalController: ModalController
  ) {}

  ngOnInit() {
    let defaultStatus = new PropertyStatus();
    defaultStatus.statusId = "1";
    defaultStatus.propertyStatusDescription = "Researched";
    this.newProperty.status = defaultStatus;
  }


  updateInput(field, event) {
    let value = event.target.value;
    switch (field) {
      case 'thumbnail': this.thumbnail = event.target.files[0]; break;
      case 'address': this.newProperty.address.address = value; break;
      case 'city': this.newProperty.address.city = value; break;
      case 'county': this.newProperty.address.county = value; break;
      case 'state': this.newProperty.address.state = value;
      case 'zipcode': this.newProperty.address.zipcode = value; break;
      case 'propertyType': this.newProperty.essentials.propertyType = value; break;
      case 'yearBuilt': this.newProperty.essentials.yearBuilt = value; break;
      case 'numBeds': this.newProperty.essentials.numBeds = value; break;
      case 'numBaths': this.newProperty.essentials.numBaths = value; break;
      case 'landFootage': this.newProperty.essentials.landFootage = value; break;
      case 'propertyFootage': this.newProperty.essentials.propertyFootage = value; break;
      case 'dateOfPurchase': this.newProperty.dateOfPurchase = value; break;
      case 'dateOfSale': this.newProperty.dateOfSale = value; break;
      case 'subdivision': this.newProperty.subdivision = value; break;
      case 'trusteeName': this.newProperty.trusteeName = value; break;
      case 'countyAssessment': this.newProperty.countyAssessment = value; break;
      case 'zillowLink': this.newProperty.essentials.zillowLink = value; break;
      case 'buyValue': this.newProperty.prices.buyValue = value; break;
      case 'expectedValue': this.newProperty.prices.expectedValue = value; break;
      case 'biddingPrice': this.newProperty.prices.biddingPrice = value; break;
      case 'marketPrice': this.newProperty.prices.marketPrice = value; break;
      case 'auctionLocation': this.newProperty.auction.auctionLocation = value; break;
      case 'dateOfAuction': this.newProperty.auction.dateOfAuction = value; break;
      case 'amount': this.newProperty.loan.amount = value; break;
      case 'month': this.newProperty.loan.month = value; break;
      case 'year': this.newProperty.loan.year = value; break;
      case 'notes': this.newProperty.notes = value; break;
    }
  }

  async submit() {
    const postInit = {
      body: {
        property: this.newProperty
      }
    };
    console.log(this.newProperty);
    API
      .post(this.apiName, '/properties', postInit)
      .then(response => {
        if (this.thumbnail) {
          Storage.put('properties/' + response + '/thumbnail/' + this.thumbnail.name + "-" + Date.now(), this.thumbnail, {})
            .then((response) => {
              this.dismiss();
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.dismiss();
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  updateStatus(e) {
    let updatedStatus = new PropertyStatus();
    switch (e.detail.value) {
      case "researched":
        updatedStatus.statusId = "1";
        updatedStatus.propertyStatusDescription = "Researched";
        break;
      case "pending-purchase":
        updatedStatus.statusId = "2";
        updatedStatus.propertyStatusDescription = "Pending Purchase";
        break;
      case "purchased":
        updatedStatus.statusId = "3";
        updatedStatus.propertyStatusDescription = "Purchased";
        break;
      case "undergoing-remodeling":
        updatedStatus.statusId = "4";
        updatedStatus.propertyStatusDescription = "Undergoing Remodeling";
        break;
      case "finished-remodeling":
        updatedStatus.statusId = "5";
        updatedStatus.propertyStatusDescription = "Finished Remodeling";
        break;
      case "for-sale":
        updatedStatus.statusId = "6";
        updatedStatus.propertyStatusDescription = "For Sale";
        break;
      case "sold":
        updatedStatus.statusId = "7";
        updatedStatus.propertyStatusDescription = "Sold";
        break;
    }
    this.newProperty.status = updatedStatus;
  }

  updateOccupancyStatus(e) {
    let updatedOccupancyStatus = new OccupancyStatus();
    switch (e.detail.value) {
      case "occupied":
        updatedOccupancyStatus.occupancyStatusId = "1";
        updatedOccupancyStatus.occupancyStatusDescription = "Occupied";
        break;
      case "unoccupied":
        updatedOccupancyStatus.occupancyStatusId = "2";
        updatedOccupancyStatus.occupancyStatusDescription = "Unoccupied";
        break;
    }
    this.newProperty.occupancyStatus = updatedOccupancyStatus;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
