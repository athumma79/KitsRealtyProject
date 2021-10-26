import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRevenueFormPage } from './add-revenue-form.page';

const routes: Routes = [
  {
    path: '',
    component: AddRevenueFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRevenueFormPageRoutingModule {}
