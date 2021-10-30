import { Component, OnInit } from '@angular/core';
import { API, Storage } from 'aws-amplify';
import { ContractorDetailsPage } from '../contractor-details/contractor-details.page';
import { ContractorType } from '../models/contractor-type.class';
import { Contractor } from '../models/contractor.class';
import { UserRole } from '../models/user-role.class';
import { User } from '../models/user.class';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-contractors',
  templateUrl: './contractors.page.html',
  styleUrls: ['./contractors.page.scss'],
})
export class ContractorsPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  backupContractors: Contractor[] = new Array();
  contractors: Contractor[] = new Array();

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    API
      .get(this.apiName, '/contractors', {})
      .then(response => {
        let dbContractors = response.contractors;
        for(var i = 0; i < dbContractors.length; i++) {
          let userRole = new UserRole();
          userRole.roleId = dbContractors[i]["ROLE_ID"];
          userRole.userRoleDescription = dbContractors[i]["USER_ROLE_DESCRIPTION"];

          let user = new User();
          user.userCognitoId = dbContractors[i]["USER_COGNITO_ID"];
          user.role = userRole;
          user.firstName = dbContractors[i]["FIRST_NAME"];
          user.lastName = dbContractors[i]["LAST_NAME"];
          user.email = dbContractors[i]["EMAIL"];
          user.ssn = dbContractors[i]["SSN"];

          let contractorType = new ContractorType();
          contractorType.contractorTypeId = dbContractors[i]["CONTRACTOR_TYPE_ID"];
          contractorType.contractorTypeDescription = dbContractors[i]["CONTRACTOR_TYPE_DESCRIPTION"];

          let contractor = new Contractor();
          contractor.contractorCognitoId = dbContractors[i]["CONTRACTOR_COGNITO_ID"];
          contractor.contractorUser = user;
          contractor.contractorType = contractorType;
          contractor.dateHired = dbContractors[i]["DATE_HIRED"];
          contractor.startDate = dbContractors[i]["START_DATE"];
          contractor.endDate = dbContractors[i]["END_DATE"];
          contractor.company = dbContractors[i]["COMPANY"];
          
          this.contractors.push(contractor);
          this.backupContractors.push(contractor);
        }
        console.log(this.contractors);
      })
      .catch(error => {
        console.log(error);
      });
  }
  sortProperties(e){
    switch(e.detail.value){
      case "fName": this.contractors.sort((a, b) => a.contractorUser.firstName.localeCompare(b.contractorUser.firstName));break
      case "lName": this.contractors.sort((a, b) => a.contractorUser.lastName.localeCompare(b.contractorUser.lastName));break
      case "email": this.contractors.sort((a, b) => a.contractorUser.email.localeCompare(b.contractorUser.email));break
      case "type": this.contractors.sort((a, b) => a.contractorType.contractorTypeDescription.localeCompare(b.contractorType.contractorTypeDescription));break
      case "company": this.contractors.sort((a, b) => a.company.localeCompare(b.company));break
    }
  }
  
  filterList(evt) {
    this.contractors = this.backupContractors;
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.contractors = this.contractors.filter(contractor => {
      return ((contractor.contractorUser.lastName) ? (contractor.contractorUser.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((contractor.contractorUser.firstName) ? (contractor.contractorUser.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((contractor.contractorUser.email) ? (contractor.contractorUser.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((contractor.company) ? (contractor.company.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((contractor.contractorType.contractorTypeDescription) ? (contractor.contractorType.contractorTypeDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false);
    });
  }

  async openContractorDetails(index: number) {
    const contractorDetailsModal = await this.modalController.create({
      component: ContractorDetailsPage,
      componentProps: {
        'contractor': this.contractors[index],
      }
    });
    return await contractorDetailsModal.present();
  }

}
