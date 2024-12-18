import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { IInsertLogsRequest } from '../../models/user.model';

@Component({
  selector: 'log-files',
  templateUrl: './log-files.component.html',
  styleUrls: ['./log-files.component.scss']
})
export class LogFiles {
  newLog: IInsertLogsRequest = {
    hwid: '',      // Initialize to an appropriate default value if needed
    logs: [],      // Updated to an array of strings
    version: '',
    last_log_timestamp: ''
  };

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  addLog() {
    const name = this.authService.getUserName() || '';

    // Check if logs array is not empty and version is not empty before adding the log
    if (this.newLog.logs.length > 0 && this.newLog.version.trim() !== '') {
      this.newLog.hwid = this.newLog.hwid || 'exampleHwid';  // Use 'exampleHwid' if hwid is not provided
      this.newLog.last_log_timestamp = new Date().toISOString();

      this.dashboardService.addlogs(this.newLog).subscribe(
        () => {
          // Clear the input fields after adding the log
          this.newLog = {
            hwid: '',
            logs: [],
            version: '',
            last_log_timestamp: ''
          };
        },
        (error) => {
          console.error('Error adding log', error);
        }
      );
    }
  }
}
