import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxDetailsPage } from './tax-details.page';

const routes: Routes = [
  {
    path: '',
    component: TaxDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxDetailsPageRoutingModule {}
