import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin, ILoginResponse } from '../models/auth.interface';
import { APIURL } from 'src/app/core/constants/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(data: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(APIURL + 'user/login', data);
  }

  public saveUserData(userData: ILoginResponse): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }


  public checkIsLoggedIn(): boolean {
    return this.getUserData() ? true : false;
  }

  public getUserRole(): string | undefined {
    return this.getUserData()?.role
  }

  public getUserName(): string | undefined {
    return this.getUserData()?.name
  }

  public getUserData(): ILoginResponse | null {
    const userDataString = localStorage.getItem('userData');
    return userDataString ? JSON.parse(userDataString) : null;
  }

  public clearUserData(): void {
    localStorage.removeItem('userData');
  }

}
