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
import { Revenue } from '../models/revenue.class';
import { ExpenseStatus } from '../models/expense-status.class';

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
  ) { 
    this.property = this.navParams.data.property;
  }

  property: Property;
  contractors: Contractor[] = new Array();
  potentialContractors: Contractor[] = new Array();
  potentialCoordinators: User[] = new Array();
  revenues: Revenue[] = new Array();
  purchaseDocs: string[] = new Array();
  purchaseDocsNames: string[] = new Array();
  salesDocs: string[] = new Array();
  salesDocsNames: string[] = new Array();
  utilitiesDocs: string[] = new Array();
  utilitiesDocsNames: string[] = new Array();
  noThumbnail = false;

  ngOnInit() {
    this.loadContractors();
    this.loadRevenues();
    this.getThumbnail();
  }

  async loadContractors() {
    const postInit = {
      body: {
        propertyId: this.property.propertyId
      }
    };
    API
      .post(this.apiName, '/property-contractor', postInit)
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
          user.ssn = dbContractors[i]["SSN"];

          var contractorType = new ContractorType();
          contractorType.contractorTypeId = dbContractors[i]["CONTRACTOR_TYPE_ID"];
          contractorType.contractorTypeDescription = dbContractors[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          var contractor = new Contractor();
          contractor.contractorCognitoId = dbContractors[i]["CONTRACTOR_COGNITO_ID"];
          contractor.contractorUser = user;
          contractor.contractorType = contractorType;
          contractor.dateHired = dbContractors[i]['DATE_HIRED'] ? new Date(dbContractors[i]['DATE_HIRED'].substring(0, dbContractors[i]['DATE_HIRED'].lastIndexOf('.'))) : null;
          contractor.startDate = dbContractors[i]['START_DATE'] ? new Date(dbContractors[i]['START_DATE'].substring(0, dbContractors[i]['START_DATE'].lastIndexOf('.'))) : null;
          contractor.endDate = dbContractors[i]['END_DATE'] ? new Date(dbContractors[i]['END_DATE'].substring(0, dbContractors[i]['END_DATE'].lastIndexOf('.'))) : null;
          contractor.company = dbContractors[i]["COMPANY"];
            
          this.contractors.push(contractor);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  async loadPotentialAssignments() {
    this.loadPotentialContractors();
    this.loadPotentialEmployees();
  }

  async loadPotentialContractors() {
    API
      .get(this.apiName, '/contractors', {})
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
          user.ssn = dbContractors[i]["SSN"];

          var contractorType = new ContractorType();
          contractorType.contractorTypeId = dbContractors[i]["CONTRACTOR_TYPE_ID"];
          contractorType.contractorTypeDescription = dbContractors[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          var contractor = new Contractor();
          contractor.contractorCognitoId = dbContractors[i]["CONTRACTOR_COGNITO_ID"];
          contractor.contractorUser = user;
          contractor.contractorType = contractorType;
          contractor.dateHired = dbContractors[i]['DATE_HIRED'] ? new Date(dbContractors[i]['DATE_HIRED'].substring(0, dbContractors[i]['DATE_HIRED'].lastIndexOf('.'))) : null;
          contractor.startDate = dbContractors[i]['START_DATE'] ? new Date(dbContractors[i]['START_DATE'].substring(0, dbContractors[i]['START_DATE'].lastIndexOf('.'))) : null;
          contractor.endDate = dbContractors[i]['END_DATE'] ? new Date(dbContractors[i]['END_DATE'].substring(0, dbContractors[i]['END_DATE'].lastIndexOf('.'))) : null;
          contractor.company = dbContractors[i]["COMPANY"];
            
          this.potentialContractors.push(contractor);
        }
        console.log(this.potentialContractors);
      })
      .catch(err => {
        console.log(err);
      })
  }

  async loadPotentialEmployees() {
    API
      .get(this.apiName, '/employees', {})
      .then(response => {
        var dbEmployees = response.employees;
        for(var i = 0; i < dbEmployees.length; i++) {
          var userRole = new UserRole();
          userRole.roleId = dbEmployees[i]["ROLE_ID"];
          userRole.userRoleDescription = dbEmployees[i]["USER_ROLE_DESCRIPTION"];

          var employee = new User();
          employee.userCognitoId = dbEmployees[i]["USER_COGNITO_ID"];
          employee.role = userRole;
          employee.firstName = dbEmployees[i]["FIRST_NAME"];
          employee.lastName = dbEmployees[i]["LAST_NAME"];
          employee.email = dbEmployees[i]["EMAIL"];
          employee.ssn = dbEmployees[i]["SSN"];
            
          this.potentialCoordinators.push(employee);
        }
        console.log(this.potentialCoordinators);
      })
      .catch(err => {
        console.log(err);
      })
  }

  addContractor(event: any) {
    console.log(event.detail.value);
  }

  addCoordinator(event: any) {
    console.log(event.detail.value);
  }

  editContractors() {
    $(function() {
      $(".edit-btn-contractors").addClass("d-none");
      $(".save-btn-contractors").removeClass("d-none");
      $(".add-btn-contractors").removeClass("d-none");
      $(".add-btn-coordinator").removeClass("d-none");
      $(".delete-btn-contractor").removeClass("d-none");
    });
  }

  saveContractors() {
    $(function() {
      $(".edit-btn-contractors").removeClass("d-none");
      $(".save-btn-contractors").addClass("d-none");
      $(".add-btn-contractors").addClass("d-none");
      $(".add-btn-coordinator").addClass("d-none");
      $(".delete-btn-contractor").addClass("d-none");
    });
  }

  deleteCoordinator() {
    if (window.confirm("Remove from property?")) {
      this.property.coordinator = new User();
      this.saveProperty(false);
    }
  }

  deleteContractor(contractor: Contractor) {
    if (window.confirm("Remove from property?")) {
      for (let i = 0; i < this.contractors.length; i++) {
        if (this.contractors[i].contractorCognitoId == contractor.contractorCognitoId) {
          this.contractors.splice(i, 1);
        }
      }
      const deleteInit = {
        body: {
          contractorCognitoId: contractor.contractorCognitoId,
          propertyId: this.property.propertyId
        }
      };
      API
      .del(this.apiName, '/property-contractor', deleteInit)
      .then(response => {})
      .catch(error => {
        console.log(error);
      });
    }
  }
  noRevenues=false;
  async loadRevenues() {
    const postInit = {
      body: {
        propertyId: this.property.propertyId
      }
    };
    API
      .post(this.apiName, '/revenues', postInit)
      .then(response => {
        var dbRevenues = response.revenues;
        for(var i = 0; i < dbRevenues.length; i++) {
          let expenseStatus = new ExpenseStatus();
          expenseStatus.expenseStatusId = dbRevenues[i]['EXPENSE_STATUS_ID'];
          expenseStatus.expenseStatusDescription = dbRevenues[i]['EXPENSE_STATUS_DESCRIPTION'];
          
          let revenue = new Revenue();
          revenue.revenueId = dbRevenues[i]['REVENUE_ID'];
          revenue.property = this.property;
          revenue.contractor = null;
          revenue.expenseStatus = expenseStatus;
          revenue.revenueAmount = dbRevenues[i]['REVENUE_AMOUNT'];
          revenue.revenueType = dbRevenues[i]['REVENUE_TYPE'];
          revenue.expenseDueDate = dbRevenues[i]['EXPENSE_DUE_DATE'] ? new Date(dbRevenues[i]['EXPENSE_DUE_DATE'].substring(0, dbRevenues[i]['EXPENSE_DUE_DATE'].lastIndexOf('.'))) : null;
          revenue.amountPaid = dbRevenues[i]['AMOUNT_PAID'];
          revenue.revenueDescription = dbRevenues[i]['REVENUE_DESCRIPTION'];
          revenue.dateIncurred = dbRevenues[i]['DATE_INCURRED'] ? new Date(dbRevenues[i]['DATE_INCURRED'].substring(0, dbRevenues[i]['DATE_INCURRED'].lastIndexOf('.'))) : null;
            
          this.revenues.push(revenue);
        }
        if(this.revenues.length < 1){
          this.noRevenues=true;
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  getFormattedRevenueAmount(revenue: Revenue) {
    let formattedRevenue = (revenue.revenueType.toLowerCase() == "profit") ? "+" : "-";
    formattedRevenue = " $" + revenue.revenueAmount.toFixed(2);
    return formattedRevenue;
  }

  getRevenueStatus(revenue: Revenue) {
    if (revenue.revenueType.toLowerCase() == "profit") {
      return "profit";
    }
    return (revenue.expenseStatus.expenseStatusDescription == "paid") ? "paid" : "due " + this.getFormattedDate(revenue.expenseDueDate);
  }

  getFormattedDate(date: Date) {
    if(date){ 
      return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });}

  }

  updateDate(date: string, type: string) {
    var date_regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

    if (date_regex.test(date)) {
      let month = Number(date.substring(0, 2));
      let day = Number(date.substring(3, 5));
      let year = Number(date.substring(6, 10));
      let newDate = new Date(year, month, day);
      
      switch (type) {
        case 'date_of_purchase':
          this.property.dateOfPurchase = newDate;
          break;
        case 'date_of_sale':
          this.property.dateOfSale = newDate;
          break;
      }
    }

  }

  async getThumbnail() {
    await Storage.list("properties/" + this.property.propertyId + "/thumbnail/")
      .then(async response => {
        if (!response || response.length < 1) {
          this.noThumbnail=true;
          return;
        }
        await Storage.get(response[0].key)
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
        case 'purchase_docs':
          $(".edit-btn-purchase").addClass("d-none");
          $(".save-btn-purchase").removeClass("d-none");
          $(".delete-btn-purchase").removeClass("d-none");
          break;
        case 'utilities_docs':
          $(".edit-btn-utilities").addClass("d-none");
          $(".save-btn-utilities").removeClass("d-none");
          $(".delete-btn-utilities").removeClass("d-none");
          break;
        case 'sales_docs':
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
        case 'purchase_docs':
          $(".edit-btn-purchase").removeClass("d-none");
          $(".save-btn-purchase").addClass("d-none");
          $(".delete-btn-purchase").addClass("d-none");
          break;
        case 'utilities_docs':
          $(".edit-btn-utilities").removeClass("d-none");
          $(".save-btn-utilities").addClass("d-none");
          $(".delete-btn-utilities").addClass("d-none");
          break;
        case 'sales_docs':
          $(".edit-btn-sales").removeClass("d-none");
          $(".save-btn-sales").addClass("d-none");
          $(".delete-btn-sales").addClass("d-none");
          break;
      }
    });
  }

  async uploadFile(path: string) {
    try {
      await Storage.put('properties/' + this.property.propertyId + '/' + path + '/' + Date.now() + "-" + this.fileToUpload.name , this.fileToUpload, {});
      this.getFiles(path);
    } catch (err) {
      console.log(err);
    }  
  }

  async deleteFile(path: string, fileToDelete: string) {
    if (window.confirm("Are you sure that you want to DELETE this file?")) {
      Storage.remove('properties/' + this.property.propertyId + '/' + path + '/' + fileToDelete, {})
        .then(response => {
          this.getFiles(path).then(() => {
            this.editFiles(path);
          });          
        })
        .catch(error => {
          console.log(error);
        }); 
    }
  }

  onAlbumImageSelected(event) {
    window.open(event, '_blank');
  }

  async deleteProperty() {
    if (window.confirm("Are you sure that you want to DELETE this property?")) {
      const deleteInit = {
        body: {
          propertyId: this.property.propertyId
        }
      };
      API
      .del(this.apiName, '/properties', deleteInit)
      .then(response => {
        if (response.error) {
          window.alert("You cannot delete this property because it is referenced by a revenue.")
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
          location.reload();
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  editProperty() {
    $("ion-input").removeAttr("readonly");
    $("ion-textarea").removeAttr("readonly")
    $("ion-select").removeAttr("disabled");
  }

  async saveProperty(popup: boolean) {
    if (popup && window.confirm("Save property information?")) {
      this.savePropertyToDB();
    }
    else {
      this.savePropertyToDB();
    }
  }

  async savePropertyToDB() {
    $("ion-input").attr("readonly", "readonly");
    $("ion-textarea").attr("readonly", "readonly");
    $("ion-select").attr("disabled", "disabled");
    const putInit = {
      body: {
        property: this.property
      }
    };
    console.log(this.property);
    API
      .put(this.apiName, '/properties', putInit)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  updatePropertyType(e) {
      this.property.essentials.propertyType = e.detail.value;
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
  
  updateState(e) {
    this.property.address.state = e.detail.value;
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}