import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { Patches } from './pages/patches/patches.component';
import { SystemsComponent } from './pages/systems/systems.component';
import { Deployments } from './pages/deployments/deployments.component';
import { LogFiles } from './pages/logFiles/log-files.component';
import { Reports } from './pages/reports/reports.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'patches', component: Patches, canActivate: [AuthGuard], data: { roles: ['admin'] } },
      { path: 'systems', component: SystemsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'deployments', component: Deployments, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: 'reports', component: Reports, canActivate: [AuthGuard], data: { roles: ['admin'] }},
      { path: '**', redirectTo: 'error/404' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
