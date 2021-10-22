import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Property } from '../models/property.class';
import { API, Storage } from 'aws-amplify';
import { PropertyStatus } from '../models/property-status.class';


@Component({
  selector: 'app-add-property-form',
  templateUrl: './add-property-form.page.html',
  styleUrls: ['./add-property-form.page.scss'],
})
export class AddPropertyFormPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  newProperty: Property = new Property();

  constructor(
    public modalController: ModalController, 
    public navParams: NavParams
  ) { }

  ngOnInit() {
    let defaultStatus = new PropertyStatus();
    defaultStatus.statusId = "1";
    defaultStatus.propertyStatusDescription = "Researched";
    this.newProperty.status = defaultStatus;
  }

  renderThumbnail(event: Event) {

  }

  submit() {
    const postInit = {
      body: {
        property: this.newProperty
      }
    };
    API
      .post(this.apiName, '/properties', postInit)
      .then(response => {
        console.log(response);
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
    console.log(this.newProperty.status);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
