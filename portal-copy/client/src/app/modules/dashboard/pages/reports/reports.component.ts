import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DeploymentResponse } from '../../models/user.model';

@Component({
  selector: 'reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class Reports implements OnInit {
  leaveRequests: DeploymentResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.dashboardService.getConnections().subscribe((response: DeploymentResponse[]) => {
      this.leaveRequests = response;
    });
  }
}
