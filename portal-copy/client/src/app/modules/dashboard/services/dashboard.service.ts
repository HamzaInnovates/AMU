import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICreateUser, ILeaveRequest, ISubmitAttendance, IUserResponse, IUsersResponse } from '../models/user.model';
import { APIURL, APIURL2 } from 'src/app/core/constants/api';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  declineLeaveRequest(leaveId: string) {
    throw new Error('Method not implemented.');
  }

  getEmployeeDetails: any;
  getLeaveDetails: any;
  approveLeave: any;
  declineLeave: any;

  constructor(private http: HttpClient) { }

  public getAllEmployees(): Observable<IUsersResponse>{
    return this.http.get<IUsersResponse>(APIURL + 'attendance/allatt');
  }

  public getSingleEmployee(id: string): Observable<IUserResponse>{
    return this.http.get<IUserResponse>(APIURL + `attendance/getatt/${id}`);
  }

  public submitAttendance(data: ISubmitAttendance, id: string){
    return this.http.post(APIURL + `attendance/createatt/${id}`, data);
  }

  public createEmployee(data: ICreateUser){
    return this.http.post(APIURL + `user/signup`, data);
  }

  public getLeaveRequest(id?: string): Observable<ILeaveRequest> {
    const url = id ? APIURL + `leave/getleave/${id}` : APIURL + 'leave/getleave'; 
    return this.http.get<ILeaveRequest>(url);
  }

  public makeLeaveRequest(userId: string, data: any) {
    return this.http.post(APIURL + `leave/createLeave/${userId}`, data);
  }

  public approveLeaveRequest(leaveID: string, status: 'approved' | 'rejected', name: string, userid: string) {
    const requestBody = { leaveID, status, name, userid };
  
    return this.http.post(`${APIURL}leave/approveLeaveRequestByAdmin`, requestBody);
  }

  getLeaveRequestById() {
    return this.http.get(APIURL + `leave/leaveRequestsForAdmin`);
  }
  
  getLeaveDetailsById(userId: string) {
    return this.http.get(APIURL + `leave/leaveRequests/${userId}`);
  }

  getEmployeeDetailsById(userId: string) {
    return this.http.get(APIURL + `user/fetchEmployeeDetails/${userId}`);
  }

  updateEmployeeDetailsById(userId: string, data: any) {
    return this.http.post(APIURL + `user/updateEmployeeDetails/${userId}`, data);
  }

  public getLatestPatch(): Observable<string> {
    return this.http.get<string>(APIURL2 + 'latest');
  }

  public setLatestPatch(version: string): Observable<string> {
    const requestBody = { version };
    return this.http.post<string>(APIURL2 + 'latest', requestBody);
  }

  public checkPatch(hwid: string): Observable<string> {
    const params = new HttpParams().set('hwid', hwid);
    return this.http.get<string>(APIURL2 + 'api/clients/get', { params });
  }

  public addlogs(data: any): Observable<any> {
      return this.http.post(APIURL2 + 'api/clients/insert', data);
  }

  public addFile(name: string, version: string, file: File): Observable<any> {
          const formData: FormData = new FormData();
          formData.append('name', name);
          formData.append('version', version);
          formData.append('file', file, file.name);

          return this.http.post(APIURL2 + 'upload', formData);
   }
   
  public getConnections(): Observable<any> {
      return this.http.get(APIURL2 + 'api/clients/list');
    }
  } // Add this closing curly brace
