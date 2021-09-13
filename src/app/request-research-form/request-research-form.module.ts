import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestResearchFormPageRoutingModule } from './request-research-form-routing.module';

import { RequestResearchFormPage } from './request-research-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestResearchFormPageRoutingModule
  ],
  declarations: [RequestResearchFormPage]
})
export class RequestResearchFormPageModule {}
