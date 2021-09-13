import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RevenuesPage } from './revenues.page';

const routes: Routes = [
  {
    path: '',
    component: RevenuesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RevenuesPageRoutingModule {}
