import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddUserFormPage } from '../add-user-form/add-user-form.page';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  async openAddUserForm() {
    const addUserFormModal = await this.modalController.create({
      component: AddUserFormPage
    });
    return await addUserFormModal.present();
  }
}
