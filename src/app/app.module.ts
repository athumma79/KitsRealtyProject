import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddContractorFormPage } from './add-contractor-form/add-contractor-form.page';
import { AmplifyUIAngularModule } from "@aws-amplify/ui-angular";
import { AddRevenueFormPage } from './add-revenue-form/add-revenue-form.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContractorDetailsPage } from './contractor-details/contractor-details.page';

@NgModule({
  declarations: [AppComponent, AddContractorFormPage, AddRevenueFormPage, ContractorDetailsPage],
  entryComponents: [AddContractorFormPage, AddRevenueFormPage, ContractorDetailsPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, AmplifyUIAngularModule, FormsModule, ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}