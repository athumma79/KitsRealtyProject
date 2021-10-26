import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddContractorFormPage } from './add-contractor-form.page';

const routes: Routes = [
  {
    path: '',
    component: AddContractorFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddContractorFormPageRoutingModule {}
