import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { LayoutRoutingModule } from './layout-routing.module';
import { AuthModule } from '../auth/auth.module';
@NgModule({
  imports: [LayoutRoutingModule, HttpClientModule, AngularSvgIconModule.forRoot(), AuthModule],
})
export class LayoutModule {}
