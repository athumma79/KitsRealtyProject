import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevenueDetailsPage } from './revenue-details.page';

const routes: Routes = [
  {
    path: '',
    component: RevenueDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevenueDetailsPageRoutingModule {}
