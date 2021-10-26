import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContractorFormPageRoutingModule } from './add-contractor-form-routing.module';

import { AddContractorFormPage } from './add-contractor-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContractorFormPageRoutingModule
  ],
  declarations: [AddContractorFormPage]
})
export class AddContractorFormPageModule {}
