import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevenueDetailsPageRoutingModule } from './revenue-details-routing.module';

import { RevenueDetailsPage } from './revenue-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevenueDetailsPageRoutingModule
  ],
  declarations: [RevenueDetailsPage]
})
export class RevenueDetailsPageModule {}
