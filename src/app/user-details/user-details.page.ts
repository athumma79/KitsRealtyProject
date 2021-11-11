import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.class';
import { ModalController, NavParams } from '@ionic/angular';
import { API, Storage } from 'aws-amplify';
import * as $ from 'jquery';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  user: User;

  constructor(
    public modalController: ModalController, 
    public navParams: NavParams
  ) { 
      this.user = navParams.data.user;
  }

  ngOnInit() {
  }

  updateInput(field, event) {
    let value = event.target.value;
    switch (field) {
      case 'first_name': this.user.firstName = value; break;
      case 'last_name': this.user.lastName = value; break;
      case 'role':
        this.user.role.roleId = value;
        this.user.role.userRoleDescription = this.getUserRole(value);
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

  editUser() {
    $("ion-input").removeAttr("readonly");
    $(".edit-button").addClass("d-none");
    $(".save-button").removeClass("d-none");
    $(".inactive-button").removeClass("d-none");
    $(".active-button").removeClass("d-none");
  }

  async inactivate() {
    if (window.confirm("Are you sure that you want to INACTIVATE " + this.user.firstName + " " + this.user.lastName + "?")) {
      this.user.role.userRoleDescription = "Inactive"; 
      this.user.role.roleId = '0';
      const putInit = {
        body: {
          user: this.user
        }
      };
      API
        .put(this.apiName, '/users', putInit)
        .then(response => {
          location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  async activate() {
    if (window.confirm("Are you sure that you want to ACTIVATE " + this.user.firstName + " " + this.user.lastName + "?")) {
      const putInit = {
        body: {
          user: this.user
        }
      };
      API
        .put(this.apiName, '/activate', putInit)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  async saveUser() {
    if (window.confirm("Save user information?")) {
      $("ion-input").attr("readonly", "readonly");
      $("ion-select").attr("disabled", "disabled");
      $(".edit-button").removeClass("d-none");
      $(".save-button").addClass("d-none");
      $(".active-button").addClass("d-none");
      $(".inactive-button").addClass("d-none");
      const putInit = {
        body: {
          user: this.user
        }
      };
      API
        .put(this.apiName, '/users', putInit)
        .then(response => {
          console.log(response);
          location.reload();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}
