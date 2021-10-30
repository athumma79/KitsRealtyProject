import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { API, Storage } from 'aws-amplify';
import { User } from '../models/user.class';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.page.html',
  styleUrls: ['./add-user-form.page.scss'],
})
export class AddUserFormPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  newUser: User = new User();

  constructor(
    public modalController: ModalController 
  ) { }

  ngOnInit() {
  }

  updateInput(field, event) {
    let value = event.target.value;
    switch (field) {
      case 'first_name': this.newUser.firstName = value; break;
      case 'last_name': this.newUser.lastName = value; break;
      case 'email': this.newUser.email = value; break;
      case 'role':
        this.newUser.role.roleId = value;
        this.newUser.role.userRoleDescription = this.getUserRole(value);
        break;
    }
  }

  getUserRole(roleId) {
    switch (roleId) {
      case "1": return "Admin";
      case "2": return "Contractor";
      case "3": return "Employee";
    }
  }

  submit() {
    const postInit = {
      body: {
        user: this.newUser
      }
    };
    console.log(this.newUser);
    API
      .post(this.apiName, '/users', postInit)
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        alert("User with this email already exists.");
      })
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
