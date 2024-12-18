import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ILogin, ILoginResponse } from '../../models/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        AngularSvgIconModule,
        NgClass,
        NgIf,
    ],
})
export class SignInComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  passwordTextType!: boolean;

  constructor(private readonly _formBuilder: FormBuilder, private readonly _router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: [''],
      password: [''],
    });
  }

  get f() {
    return this.form.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onSubmit() {
    this.submitted = true;
    const { name, password } = this.form.value;
    const loginData: ILogin = {
      name,
      password
    }

    if (this.form.invalid) {
      return;
    }

    console.log(loginData);

    this.authService.login(loginData).subscribe((res: ILoginResponse) => {
      this.authService.saveUserData(res);
      this._router.navigate(['/']);
    })

  }
}
