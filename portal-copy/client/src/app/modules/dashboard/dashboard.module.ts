import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';  // Add this line
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthInterceptor } from '../auth/interceptors/auth.interceptor';
import { DashboardService } from './services/dashboard.service';
import { LoadingComponent } from '../layout/components/loading/loading.component';

import { Patches } from './pages/patches/patches.component';
import { SystemsComponent } from './pages/systems/systems.component';
import { Deployments } from './pages/deployments/deployments.component';
import { LogFiles } from './pages/logFiles/log-files.component';
import { HomeComponent } from './pages/home/home.component';
import { Reports } from './pages/reports/reports.component';
@NgModule({
  imports: [
    DashboardRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,  
    RouterModule,        
    AuthModule,
    HttpClientModule,
    LoadingComponent
  ],
  declarations: [
    HomeComponent,
    Patches,
    SystemsComponent,
    Deployments,
    LogFiles,
    Reports,
  ],
  providers: [
    AuthService,
    DashboardService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class DashboardModule {}
