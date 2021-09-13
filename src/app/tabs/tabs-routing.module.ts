import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'properties',
        loadChildren: () => import('../properties/properties.module').then(m => m.PropertiesPageModule)
      },
      {
        path: 'revenues',
        loadChildren: () => import('../revenues/revenues.module').then(m => m.RevenuesPageModule)
      },
      {
        path: 'contractors',
        loadChildren: () => import('../contractors/contractors.module').then(m => m.ContractorsPageModule)
      },
      {
        path: 'taxes',
        loadChildren: () => import('../taxes/taxes.module').then(m => m.TaxesPageModule)
      },
      {
        path: 'admin',
        loadChildren: () => import('../admin/admin.module').then(m => m.AdminPageModule)
      },
      {
        path: '',
        redirectTo: '/properties',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/properties',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
