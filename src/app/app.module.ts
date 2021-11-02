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

@NgModule({
  declarations: [AppComponent, AddContractorFormPage, AddRevenueFormPage],
  entryComponents: [AddContractorFormPage, AddRevenueFormPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, AmplifyUIAngularModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}