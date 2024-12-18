// home.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  public users: any[] = [];
  public updatedUsers: any[] = [];
  public outdatedUsers: any[] = [];
  public latestVersion: string = '';
  public updatedCount: number = 0;
  public outdatedCount: number = 0;
  public totalCount: number = 0;

  constructor(private router: Router, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.getConnections();
  }

  private getConnections(): void {
    this.dashboardService.getConnections().subscribe((users: any[]) => {
      this.users = users;
      this.checkVersionsAndUpdate();
    });
  }

  private checkVersionsAndUpdate(): void {
    this.dashboardService.getLatestPatch().subscribe((latestVersion: string) => {
      this.latestVersion = latestVersion;

      this.updatedUsers = [];
      this.outdatedUsers = [];

      for (const user of this.users) {
        if (user.version && user.version === this.latestVersion) {
          this.updatedUsers.push(user);
        } else {
          this.outdatedUsers.push(user);
        }
      }

      // Update counts
      this.updatedCount = this.updatedUsers.length;
      this.outdatedCount = this.outdatedUsers.length;
      this.totalCount = this.users.length;
    });
  }

  getStatus(user: any): string {
    return user.version === this.latestVersion ? 'Up to date' : 'Outdated';
  }
}
