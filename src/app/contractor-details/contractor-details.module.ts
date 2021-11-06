import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorDetailsPageRoutingModule } from './contractor-details-routing.module';

import { ContractorDetailsPage } from './contractor-details.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorDetailsPageRoutingModule,
    BrowserAnimationsModule,
    BrowserModule
  ],
  declarations: [ContractorDetailsPage]
})
export class ContractorDetailsPageModule {}
