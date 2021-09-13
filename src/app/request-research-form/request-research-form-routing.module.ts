import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestResearchFormPage } from './request-research-form.page';

const routes: Routes = [
  {
    path: '',
    component: RequestResearchFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestResearchFormPageRoutingModule {}
