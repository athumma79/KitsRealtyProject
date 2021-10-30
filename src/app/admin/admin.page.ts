import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUserFormPage } from '../add-user-form/add-user-form.page';
import { User } from '../models/user.class';
import { API, Storage } from 'aws-amplify';
import { UserRole } from '../models/user-role.class';
import { UserDetailsPage } from '../user-details/user-details.page';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  users: User[] = new Array();
  backupUsers: User[] = new Array();

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    API
      .get(this.apiName, '/users', {})
      .then(response => {
        var dbUsers = response.users;
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
      })
      .catch(err => {
        console.log(err);
      })
  }

  sortUsers(e){
    switch(e.detail.value){
      case "firstName": this.users.sort((a, b) => a.firstName.localeCompare(b.firstName)); break;
      case "lastName": this.users.sort((a, b) => a.lastName.localeCompare(b.lastName)); break;
      case "email": this.users.sort((a, b) => a.email.localeCompare(b.email)); break;
      case "role": this.users.sort((a, b) => a.role.userRoleDescription.localeCompare(b.role.userRoleDescription)); break;
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
      ((user.email) ? (user.email.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false) ||
      ((user.role.userRoleDescription) ? (user.role.userRoleDescription.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) : false);
    });
  }

  async openAddUserForm() {
    const addUserFormModal = await this.modalController.create({
      component: AddUserFormPage
    });
    return await addUserFormModal.present();
  }

  async openUserDetails(index: number) {
    const userDetailsModal = await this.modalController.create({
      component: UserDetailsPage,
      componentProps: {
        'user': this.users[index],
      }
    });
    return await userDetailsModal.present();
  }
}
