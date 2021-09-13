import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PropertyDetailsPage } from '../property-details/property-details.page';

//API connection
import { API } from 'aws-amplify';
import { Property } from '../models/property.interface';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.page.html',
  styleUrls: ['./properties.page.scss'],
})
export class PropertiesPage implements OnInit {

  apiName = 'KitsRealtyAPI2';
  
  constructor(public modalController: ModalController) {}
  
  ngOnInit() {

    this.loadProperties();
    
  }

  public properties: Array<Property>;

  async loadProperties() {
    API
      .get(this.apiName, '/properties', {})
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  async openPropertyDetails() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage,
    });
    return await propertyDetailsModal.present();
  }
  async openAddPropertyForm() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage,
    });
    return await propertyDetailsModal.present();
  }
  async openRequestResarchForm() {
    const propertyDetailsModal = await this.modalController.create({
      component: PropertyDetailsPage,
    });
    return await propertyDetailsModal.present();
  }

}
