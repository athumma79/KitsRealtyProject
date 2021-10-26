import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddRevenueFormPageRoutingModule } from './add-revenue-form-routing.module';

import { AddRevenueFormPage } from './add-revenue-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddRevenueFormPageRoutingModule
  ],
  declarations: [AddRevenueFormPage]
})
export class AddRevenueFormPageModule {}
