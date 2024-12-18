// systems.component.ts
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ISystem, IUserApiResponse  } from '../../models/user.model';

@Component({
  selector: 'systems',
  templateUrl: './systems.component.html',
  styleUrls: ['./systems.component.scss']
})
export class SystemsComponent implements OnInit {
  public systems: ISystem[] = [];

  constructor(private dashboardService: DashboardService, private authService: AuthService) {}

  ngOnInit() {
    this.dashboardService.getConnections().subscribe((res: IUserApiResponse[]) => {
      this.systems = res.map((item) => ({
        id: item._id,
        userName: item.user_name,
        machineName: item.machine_name,
        logs: item.logs,
        version: item.version,
        firstCallback: item.first_callback,
        lastCallback: item.last_callback
      }));
    });
  }
}