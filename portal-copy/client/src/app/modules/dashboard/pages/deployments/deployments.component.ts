// Import necessary modules
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeploymentResponse } from '../../models/user.model';

@Component({
  selector: 'deployments',
  templateUrl: './deployments.component.html',
  styleUrls: ['./deployments.component.scss'],
})

export class Deployments implements OnInit {
  hwidForm!: FormGroup;
  hwidResponse: DeploymentResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.hwidForm = this.fb.group({
      hwid: ['', Validators.required],
    });
  }

  checkHwid() {
    if (this.hwidForm.valid) {
      const hwid = this.hwidForm.value.hwid;
      this.dashboardService.checkPatch(hwid).subscribe(
        (response: any) => {
          this.hwidResponse = response;
        },
        (error) => {
          console.error('Error checking HWID', error);
        },
      );
    }
  }
  
}
