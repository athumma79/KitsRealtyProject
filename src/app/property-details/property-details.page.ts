import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, PickerController } from '@ionic/angular';

import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

import { Property } from '../models/property.class';
import { Contractor } from '../models/contractor.class';
import { PropertyStatus } from '../models/property-status.class';
import { UserRole } from '../models/user-role.class';
import { User } from '../models/user.class';
import { ContractorType } from '../models/contractor-type.class';

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
  contractors: Contractor[] = new Array();
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

    console.log(this.property.coordinator);
    console.log(this.contractors);
  }

  async loadContractors() {
    const postInit = {
      body: {
        propertyid: this.property.propertyId
      }
    };
    API
      .post(this.apiName, '/contractors', postInit)
      .then(response => {
        var dbContractors = response.contractors;
        for(var i = 0; i < dbContractors.length; i++) {
          var userRole = new UserRole();
          userRole.roleId = dbContractors[i]["ROLE_ID"];
          userRole.userRoleDescription = dbContractors[i]["USER_ROLE_DESCRIPTION"];

          var user = new User();
          user.userCognitoId = dbContractors[i]["USER_COGNITO_ID"];
          user.role = userRole;
          user.firstName = dbContractors[i]["FIRST_NAME"];
          user.lastName = dbContractors[i]["LAST_NAME"];
          user.email = dbContractors[i]["EMAIL"];
          user.username = dbContractors[i]["USERNAME"];
          user.ssn = dbContractors[i]["SSN"];

          var contractorType = new ContractorType();
          contractorType.contractorTypeId = dbContractors[i]["CONTRACTOR_TYPE_ID"];
          contractorType.contractorTypeDescription = dbContractors[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          var contractor = new Contractor();
          contractor.contractorCognitoId = dbContractors[i]["CONTRACTOR_COGNITO_ID"];
          contractor.contractorUser = user;
          contractor.contractorType = contractorType;
          contractor.dateHired = dbContractors[i]["DATE_HIRED"];
          contractor.startDate = dbContractors[i]["START_DATE"];
          contractor.endDate = dbContractors[i]["END_DATE"];
          contractor.company = dbContractors[i]["COMPANY"];
            
          this.contractors.push(contractor);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  editContractors() {
    $(function() {
      $(".edit-btn-contractors").addClass("d-none");
      $(".save-btn-contractors").removeClass("d-none");
      $(".delete-btn-contractor").removeClass("d-none");
    });
  }

  saveContractors() {
    $(function() {
      $(".edit-btn-contractors").removeClass("d-none");
      $(".save-btn-contractors").addClass("d-none");
      $(".delete-btn-contractor").addClass("d-none");
    });
  }

  deleteContractor(contractor: Contractor) {
    if (window.confirm("Are you sure that you want to DELETE this file?")) {
      const deleteInit = {
        body: {
          contractorCognitoId: contractor.contractorCognitoId,
          propertyId: this.property.propertyId
        }
      };
      API
      .del(this.apiName, '/contractors', deleteInit)
      .then(response => {})
      .catch(error => {
        console.log(error);
      });
    }
  }

  deleteCoordinator() {
    if (window.confirm("Are you sure that you want to DELETE this file?")) {
      
    }
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
        console.log(response);
        if (!response || response.length < 1 || (response.length < 2 && response[0].size == 0)) {
          return;
        }
        for (var i = 0; i < response.length; i++) {
          let filePath = response[i].key;
          let fileName = filePath.substring(filePath.lastIndexOf("/") + 1, filePath.length);
          console.log(filePath);
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
      this.salesDocs.push(file as any); 
      this.salesDocsNames.push(fileName);
    }
  }

  public fileToUpload: any;

  selectFileToUpload(e) {
    this.fileToUpload = e.target.files[0]
  }

  editFiles(filetype: string) {
    $(function() {
      switch (filetype) {
        case 'purchase':
          $(".edit-btn-purchase").addClass("d-none");
          $(".save-btn-purchase").removeClass("d-none");
          $(".delete-btn-purchase").removeClass("d-none");
          break;
        case 'utilities':
          $(".edit-btn-utilities").addClass("d-none");
          $(".save-btn-utilities").removeClass("d-none");
          $(".delete-btn-utilities").removeClass("d-none");
          break;
        case 'sales':
          $(".edit-btn-sales").addClass("d-none");
          $(".save-btn-sales").removeClass("d-none");
          $(".delete-btn-sales").removeClass("d-none");
          break;
      }
    });
  }

  saveFiles(filetype: string) {
    $(function() {
      switch (filetype) {
        case 'purchase':
          $(".edit-btn-purchase").removeClass("d-none");
          $(".save-btn-purchase").addClass("d-none");
          $(".delete-btn-purchase").addClass("d-none");
          break;
        case 'utilities':
          $(".edit-btn-utilities").removeClass("d-none");
          $(".save-btn-utilities").addClass("d-none");
          $(".delete-btn-utilities").addClass("d-none");
          break;
        case 'sales':
          $(".edit-btn-sales").removeClass("d-none");
          $(".save-btn-sales").addClass("d-none");
          $(".delete-btn-sales").addClass("d-none");
          break;
      }
    });
  }

  async uploadFile(path: string) {
    try {
      await Storage.put('properties/' + this.property.propertyId + '/' + path + '/' + this.fileToUpload.name + "-" + Date.now(), this.fileToUpload, {});
      this.getFiles(path);
    } catch (err) {
      console.log(err);
    }  
  }

  async deleteFile(path: string, fileToDelete: string) {
    if (window.confirm("Are you sure that you want to DELETE this file?")) {
      try {
        await Storage.remove('properties/' + this.property.propertyId + '/' + path + '/' + fileToDelete, {});
        this.getFiles(path);
      } catch (err) {
        console.log(err);
      }  
    }
  }

  onAlbumImageSelected(event) {
    window.open(event, '_blank');
  }

  async deleteProperty() {
    if (window.confirm("Are you sure that you want to DELETE this property?")) {
      location.reload();
      const deleteInit = {
        body: {
          propertyid: this.property.propertyId
        }
      };
      API
      .del(this.apiName, '/properties', deleteInit)
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
    $("ion-textarea").removeAttr("readonly");
  }

  async saveProperty() {
    if (window.confirm("Save property information?")) {
      $("ion-input").attr("readonly", "readonly");
      $("ion-textarea").attr("readonly", "readonly");
      const putInit = {
        body: {
          property: this.property
        }
      };
      API
        .put(this.apiName, '/properties', putInit)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
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