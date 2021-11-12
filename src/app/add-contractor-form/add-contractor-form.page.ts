import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.class';
import { API, Storage } from 'aws-amplify';
import { UserRole } from '../models/user-role.class';
import { ModalController } from '@ionic/angular';
import { Contractor } from '../models/contractor.class';


@Component({
  selector: 'app-add-contractor-form',
  templateUrl: './add-contractor-form.page.html',
  styleUrls: ['./add-contractor-form.page.scss'],
})
export class AddContractorFormPage implements OnInit {
  
  apiName = 'KitsRealtyAPI2';

  users: User[] = new Array();
  backupUsers: User[] = new Array();
  newContractor: Contractor = new Contractor();

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.loadUsers();
  }

   
  async loadUsers() {
    console.log('hello!')
    API
      .get(this.apiName, '/contractor-users', {})
      .then(response => {
        console.log(response);
        var dbUsers = response.contractors;
        for(var i = 0; i < dbUsers.length; i++) {
          let userRole = new UserRole();
          userRole.roleId = dbUsers[i]["ROLE_ID"];
          userRole.userRoleDescription = dbUsers[i]["USER_ROLE_DESCRIPTION"];

          let user = new User();
          user.userCognitoId = dbUsers[i]["USER_COGNITO_ID"];
          user.role = userRole;
          user.firstName = dbUsers[i]["FIRST_NAME"];
          user.lastName = dbUsers[i]["LAST_NAME"];
          user.email = dbUsers[i]["EMAIL"];
          user.ssn = dbUsers[i]["SSN"];

          this.users.push(user);
          this.backupUsers.push(user);
        }
        console.log(this.users);
      })
      .catch(err => {
        console.log(err);
      })
  }

  updateInput(field, event) {
    let value = event.target.value;
    switch (field) {
      case 'type': this.setContractorType(value); break;
      case 'date_hired': this.newContractor.dateHired = value; break;
      case 'start_date': this.newContractor.startDate = value; break;
      case 'end_date': this.newContractor.endDate = value; break;
      case 'company': this.newContractor.company = value; break;

    }
  }
  setContractorType(value: any){
    this.newContractor.contractorType.contractorTypeId = value;
    switch(value){
      case "1": this.newContractor.contractorType.contractorTypeDescription = "Research"; break
      case "2": this.newContractor.contractorType.contractorTypeDescription = "Bidding"; break
      case "3": this.newContractor.contractorType.contractorTypeDescription = "Remodel"; break
      case "4": this.newContractor.contractorType.contractorTypeDescription = "Real Estate"; break
      case "5": this.newContractor.contractorType.contractorTypeDescription = "Tax"; break
    }
  }

  setUser(user: User){
    this.newContractor.contractorUser = user;
    this.newContractor.contractorCognitoId = user.userCognitoId;
  }

  submit(){
    if(confirm("Set " + this.newContractor.contractorUser.firstName + " " + this.newContractor.contractorUser.lastName + " as a " + this.newContractor.contractorType.contractorTypeDescription + " contractor?")){
      var group = this.newContractor.contractorType.contractorTypeDescription.replace(' ', '_').toLowerCase() + "_contractor"
      console.log(group);
      const postInit = {
        body: {
          group: group,
          contractor: this.newContractor
        }
      };
      API
      .post(this.apiName, '/contractors', postInit)
      .then(response => {
        alert(response);
        this.dismiss();
      })
      .catch(err => {
        console.log(err);
      })
    }
  }

  sortUsers(e){
    switch(e.detail.value){
      case "firstName": this.users.sort((a, b) => a.firstName.localeCompare(b.firstName)); break;
      case "lastName": this.users.sort((a, b) => a.lastName.localeCompare(b.lastName)); break;
      case "email": this.users.sort((a, b) => a.email.localeCompare(b.email)); break;
    }
  }

  filterList(evt) {
    this.users = this.backupUsers;
    const searchTerm = evt.srcElement.value;
    if (!searchTerm) {
      return;
    }
    this.users = this.users.filter(user => {
      return ((user.lastName) ? (user.lastName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((user.firstName) ? (user.firstName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((user.email) ? (user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false);    
    });
  }
  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
