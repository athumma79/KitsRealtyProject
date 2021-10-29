import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { API, Storage } from 'aws-amplify';

@Component({
  selector: 'app-add-user-form',
  templateUrl: './add-user-form.page.html',
  styleUrls: ['./add-user-form.page.scss'],
})
export class AddUserFormPage implements OnInit {

  apiName = 'KitsRealtyAPI2';

  constructor(
    public modalController: ModalController 
  ) { }

  ngOnInit() {
    API
      .post(this.apiName, '/users', {})
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      })
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
