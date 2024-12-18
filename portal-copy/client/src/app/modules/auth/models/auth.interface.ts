export interface ILogin {
    name: string,
    password: string
}

export interface ILoginResponse {
    userId: string,
    token: string,
    role: 'admin' | 'employee'
    name: string
}