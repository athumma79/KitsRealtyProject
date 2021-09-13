import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContractorsPageRoutingModule } from './contractors-routing.module';

import { ContractorsPage } from './contractors.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContractorsPageRoutingModule
  ],
  declarations: [ContractorsPage]
})
export class ContractorsPageModule {}
