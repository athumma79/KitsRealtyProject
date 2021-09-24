import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';

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

  property: Property;
  contractors: Contractor;
  progressImages: string[] = new Array();

  ngOnInit() {
    this.property = this.navParams.data.property;
    this.loadContractors();
    this.getThumbnail();
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

  async getThumbnail() {
    await Storage.list("properties/" + this.property.propertyId + "/thumbnail/")
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

  async loadProgressImages() {
      await this.getProgressImages((response) => {
        this.progressImages.push(response);
      });
      console.log(this.progressImages);
      $(document).ready(function() {
        $(".progress-image-0").addClass("active");
        var carousel = document.querySelector('#progressImageCarousel');
        carousel.addEventListener('slide.bs.carousel', function (e: any) {
          $(".progress-image-" + e.from).addClass("carousel-item-start");
          $(".progress-image-" + e.to).addClass("carousel-item-next");
        })
        carousel.addEventListener('slid.bs.carousel', function (e: any) {
          $(".progress-image-" + e.from).removeClass("carousel-item-start");
          $(".progress-image-" + e.to).removeClass("carousel-item-next");
          $(".progress-image-" + e.from).removeClass("active");
          $(".progress-image-" + e.to).addClass("active");
        })
      });
  }

  async getProgressImages(callback) {
    await Storage.list("properties/" + this.property.propertyId + "/progress_images/")
      .then(async response => {
        if (!response || response.length < 2) {
          return;
        }
        for (let i = 1; i < response.length; i++) {
          await Storage.get(response[i].key)
            .then(response => {
              callback(response);
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}