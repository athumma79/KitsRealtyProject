import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorDetailsPage } from './contractor-details.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorDetailsPageRoutingModule {}
