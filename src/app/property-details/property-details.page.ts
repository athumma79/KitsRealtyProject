import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PickerController } from '@ionic/angular';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

import { Property } from '../models/property.class';
import { Contractor } from '../models/contractor.class';
import { PropertyStatus } from '../models/property-status.class';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.page.html',
  styleUrls: ['./property-details.page.scss'],
})
export class PropertyDetailsPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  constructor(
    public modalController: ModalController, 
    public pickerController: PickerController,
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

  async changeStatus(statusId: string) {
    this.property.status.statusId = statusId;
    console.log(statusId);
    const putInit = {
      body: {
        statusId: statusId,
      }, // replace this with attributes you need
      headers: { 
      }
    };
    API
    .put(this.apiName, '/properties/' + this.property.propertyId + '/status/' + statusId, putInit)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  async getStatus() {
    const picker = await this.pickerController.create({  
      buttons: [
        {
          text: "Cancel",
          role: 'cancel'
        },
        {
        text: 'Confirm',
        handler: (value) => {
          this.changeStatus(value.status.value);
          }
        }
      ],
      columns: [
        {
          name: 'status',
          options: [
            {
              text: 'Researched',
              value: '1'
            },
            {
              text: 'Pending Purchase',
              value: '2'
            },
            {
              text: 'Purchased',
              value: '3'
            },
            {
              text: 'Undergoing Remodeling',
              value: '4'
            },
            {
              text: 'Finished Remodeling',
              value: '5'
            },
            {
              text: 'For Sale',
              value: '6'
            },
            {
              text: 'Sold',
              value: '7'
            },
          ]
        }
      ]
    });
    await picker.present();
  }

  async deleteProperty() {
    if (window.confirm("Are you sure that you want to DELETE this property?")) {
      location.reload();
      API
      .del(this.apiName, '/deleteproperties/'+ this.property.propertyId, {})
      .then(response => {
        if (response.error) {
          window.alert("You cannot delete this property because it is referenced by a revenue.")
        }
      })
      .catch(error => {
        console.log(error);
        });
      }
      Storage.list("properties/" + this.property.propertyId + "/")
        .then(response => {
          for (let i = 0; i < response.length; i++) {
            Storage.remove(response[i].key)
              .then(response => {
                console.log(response);
              })
              .catch(err => {
                console.log(err);
              })
          }
        })
        .catch(err => {
          console.log(err);
        });
  }

  editProperty() {
    $("ion-input").removeAttr("readonly");
  }

  saveProperty() {
    $("ion-input").attr("readonly", "readonly");
    const putInit = {
      body: {
        property: this.property
      }
    };
    API
      .put(this.apiName, '/properties/', putInit)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
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
    this.property.status = updatedStatus;
    console.log(this.property.status);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}