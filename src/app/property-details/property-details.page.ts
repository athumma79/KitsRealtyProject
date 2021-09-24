import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

import { Property } from '../models/property.class';
import { Contractor } from '../models/contractor.class';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.page.html',
  styleUrls: ['./property-details.page.scss'],
})
export class PropertyDetailsPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  constructor(
    public modalController: ModalController, 
    public navParams: NavParams
  ) { }

  public property: Property;
  public contractors: Contractor;

  ngOnInit() {
    this.property = this.navParams.data.property;
    this.loadContractors();
    this.getThumbnail(this.property);
  }

  async loadContractors() {
    API
      .get(this.apiName, '/contractors/' + this.property.propertyId, {})
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      })
  }

  async getThumbnail(property: Property) {
    await Storage.list("properties/" + property.propertyId + "/thumbnail/")
      .then(async response => {
        if (!response || response.length < 2) {
          return;
        }
        await Storage.get(response[1].key)
          .then(response => {
            $(".thumbnail").attr("src", response as string);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onAlbumDocSelected(event) {
    window.open( event, '_blank' );
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
