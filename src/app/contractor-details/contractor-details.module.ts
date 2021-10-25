import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorDetailsPageRoutingModule } from './contractor-details-routing.module';

import { ContractorDetailsPage } from './contractor-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorDetailsPageRoutingModule
  ],
  declarations: [ContractorDetailsPage]
})
export class ContractorDetailsPageModule {}
