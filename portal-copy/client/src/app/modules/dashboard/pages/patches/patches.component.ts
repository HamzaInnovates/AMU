// patches.component.ts
import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'patches',
  templateUrl: './patches.component.html',
  styleUrls: ['./patches.component.scss']
})
export class Patches {
  public latestPatch: string = '';
  public patchCheckResponse: string = '';
  public latestPatchMessage: string | undefined;
  private isGetLatestPatchButtonClicked: boolean = false;
  public showLatestPatchMessage: boolean = false; 
  public patchForm: FormGroup;
  public checkPatchForm: FormGroup;
  public setPatchForm: FormGroup; 
  public fileToUpload: File | null = null;
  public fileForm: FormGroup;

  constructor(
    private dashboardService: DashboardService,
    private formBuilder: FormBuilder
  ) {
    this.patchForm = this.formBuilder.group({
    });

    this.checkPatchForm = this.formBuilder.group({
      hwid: ['', Validators.required],
    });

    this.setPatchForm = this.formBuilder.group({
      version: ['', Validators.required],
      file: [null, Validators.required]
    });

    this.fileForm = this.formBuilder.group({
      name: ['', Validators.required],
      version: ['', Validators.required],
      file: [null, Validators.required]
    });

  }


  public isButtonClicked(): boolean {
    return this.isGetLatestPatchButtonClicked;
  }

  public onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.fileForm.patchValue({
      file: file
    });
  }

  public isInvalid(controlName: string, form: FormGroup): boolean {
    const control = form.controls[controlName];
    const isControlInvalid =
      control.invalid && (control.dirty || control.touched);
    const isControlNotEmpty = control.value !== null && control.value !== '';

    return isControlInvalid && isControlNotEmpty;
  }

  public updatePatch() {
    if (this.setPatchForm.valid) {
      const version = this.setPatchForm.get('version')?.value;
      this.dashboardService.setLatestPatch(version).subscribe(
        (response: string) => {
          console.log('Latest patch set successfully:', response);
        },
        (error) => {
          console.error('Error setting latest patch:', error);
        }
      );
    }
  }

  public addFile() {
    if (this.fileForm.valid) {
      const name = this.fileForm.get('name')?.value;
      const version = this.fileForm.get('version')?.value;
      const file = this.fileForm.get('file')?.value;

      this.dashboardService.addFile(name, version, file).subscribe(
        (response: any) => {
          console.log('File added successfully:', response);
          // Add any additional logic or UI updates as needed
        },
        (error) => {
          console.error('Error adding file:', error);
        }
      );
    }
  }

}
