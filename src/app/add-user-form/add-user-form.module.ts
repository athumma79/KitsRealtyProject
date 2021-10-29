import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUserFormPageRoutingModule } from './add-user-form-routing.module';

import { AddUserFormPage } from './add-user-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddUserFormPageRoutingModule
  ],
  declarations: [AddUserFormPage]
})
export class AddUserFormPageModule {}
