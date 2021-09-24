import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PropertiesPageRoutingModule } from './properties-routing.module';

import { PropertiesPage } from './properties.page';
import { PropertyDetailsPage } from '../property-details/property-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PropertiesPageRoutingModule,
  ],
  declarations: [PropertiesPage, PropertyDetailsPage]
})
export class PropertiesPageModule {}