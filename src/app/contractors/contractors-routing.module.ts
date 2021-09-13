import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContractorsPage } from './contractors.page';

const routes: Routes = [
  {
    path: '',
    component: ContractorsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContractorsPageRoutingModule {}
