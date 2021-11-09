import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxDetailsPageRoutingModule } from './tax-details-routing.module';

import { TaxDetailsPage } from './tax-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxDetailsPageRoutingModule
  ],
  declarations: [TaxDetailsPage]
})
export class TaxDetailsPageModule {}
