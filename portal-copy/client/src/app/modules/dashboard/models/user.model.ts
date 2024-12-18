export interface IUser {
  version: boolean;
  _id: string;
  name: string;
  joiningDate: Date;
  designation: string;
  daysPresent: number;
  daysAbsent: number;
  halfDays: number;
  paidOff: number;
  probationEndDate: Date;
}

export interface IUsersResponse {
  success: boolean;
  data: IUser[];
}

export interface IUserResponse {
  success: boolean;
  data: IUser;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  joiningDate: Date;
  designation: string;
  role: 'employee' | 'admin';
}

export interface ISubmitAttendance {
  userId: string;
  date: string;
  leaveType?: 'casual' | 'sick' |  null;
  status?: "present" | "absent" | "halfday" | "PTO" | null;
}
export interface ISubmitRequest{
  startDate: string;
  endDate: string;
  leaveType?: 'casual' | 'sick' | "halfday" | "PTO" | null;
  message?: string;
}

export interface ISubmitAttendanceResponse {
  success: boolean;
  data: {
    date: string;
    status: 'present' | 'absent' | 'halfday';
    leaveType?: 'casual' | 'sick' | null;
  };
}

export interface ILeaveRequest {
_id: string;
user: {
  _id: string;
  name: string;
  designation: string;
};
status: 'pending' | 'approved' | 'rejected';
startDate: string;
endDate: string;
leaveType: 'casual' | 'sick' | null;
message: string;
approvedby: string;
workingDays: number;
}

export interface ILeaveRequestResponse {
  success: boolean;
  data: ILeaveRequest;
}

export interface GetLatestPatchResponse {
  version: string;
}

export interface IInsertLogsRequest {
  hwid: string;
  logs: any[]; 
  version: any; 
  last_log_timestamp: string;
}

export interface IUserApiResponse {
  _id: string;
  user_name: string;
  machine_name: string;
  logs: any[]; // Change this type based on the actual structure of logs
  version: any; // Change this type based on the actual structure of version
  first_callback: string;
  last_callback: string;
}

export interface ISystem {
  id: string;
  userName: string;
  machineName: string;
  logs: any[]; // Change this type based on the actual structure of logs
  version: any; // Change this type based on the actual structure of version
  firstCallback: string;
  lastCallback: string;
}

export interface DeploymentResponse {
  _id: string;
  user_name: string;
  machine_name: string;
  logs: any[]; // You can replace 'any' with a more specific type if needed
  version: {
    ASSignatureVersion: string;
    AVSignatureVersion: string;
    EngineVersion: string;
    ProductVersion: string;
    ServiceVersion: string;
  };
  first_callback: string;
  last_callback: string;
  last_log_timestamp: string;
}