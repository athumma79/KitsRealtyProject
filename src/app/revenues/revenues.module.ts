import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevenuesPageRoutingModule } from './revenues-routing.module';

import { RevenuesPage } from './revenues.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevenuesPageRoutingModule
  ],
  declarations: [RevenuesPage]
})
export class RevenuesPageModule {}
