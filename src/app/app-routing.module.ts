import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'revenue-details',
    loadChildren: () => import('./revenue-details/revenue-details.module').then( m => m.RevenueDetailsPageModule)
  },
  {
    path: 'contractor-details',
    loadChildren: () => import('./contractor-details/contractor-details.module').then( m => m.ContractorDetailsPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
