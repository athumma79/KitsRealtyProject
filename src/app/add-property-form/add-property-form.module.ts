import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPropertyFormPageRoutingModule } from './add-property-form-routing.module';

import { AddPropertyFormPage } from './add-property-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddPropertyFormPageRoutingModule
  ],
  declarations: [AddPropertyFormPage]
})
export class AddPropertyFormPageModule {}
