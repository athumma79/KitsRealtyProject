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
  purchaseDocs: string[] = new Array();
  purchaseDocsNames: string[] = new Array();
  salesDocs: string[] = new Array();
  salesDocsNames: string[] = new Array();
  utilitiesDocs: string[] = new Array();
  utilitiesDocsNames: string[] = new Array();

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

  async getFiles(path: string) {
    this.resetFiles(path);
    await Storage.list("properties/" + this.property.propertyId + "/" + path)
      .then(async response => {
        if (!response || response.length < 2) {
          return;
        }
        for (var i = 0; i < response.length; i++) {
          let filePath = response[i].key;
          let fileName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length);
          await Storage.get(filePath)
            .then(response => {
              this.storeFile(path, response, fileName);
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

  resetFiles(path: string) {
    switch(path) {
      case 'purchase_docs':
        this.purchaseDocs = new Array();
        this.purchaseDocsNames = new Array();
        break;
      case 'utilities_docs':
        this.utilitiesDocs = new Array();
        this.utilitiesDocsNames = new Array();
        break;
      case 'sales_docs':
        this.salesDocs = new Array();
        this.salesDocsNames = new Array();
        break;
    }
  }

  storeFile(path, file, fileName) {
    if (path == 'purchase_docs' && fileName.length != 0) { 
      this.purchaseDocs.push(file as any);
      this.purchaseDocsNames.push(fileName); 
    }
    else if (path == 'utilities_docs' && fileName.length != 0) { 
      this.utilitiesDocs.push(file as any);
      this.utilitiesDocsNames.push(fileName); 
    }
    else if (path == 'sales_docs' && fileName.length != 0) { 
      this.salesDocsNames.push(file as any); 
      this.salesDocs.push(fileName);
    }
  }

  public fileToUpload: any;

  selectFileToUpload(e) {
    this.fileToUpload = e.target.files[0]
  }

  async uploadFile(path: string) {
    try {
      await Storage.put('properties/' + this.property.propertyId + '/' + path + '/' + this.fileToUpload.name + "-" + Date.now(), this.fileToUpload, {});
      console.log(this.purchaseDocsNames);
      this.getFiles(path);
      console.log(this.purchaseDocsNames);
    } catch (err) {
      console.log(err);
    }  
  }

  onAlbumImageSelected(event) {
    window.open(event, '_blank');
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}