export class CreateUserRequest {
  id?: number
  userName: string;
  email: string;
  loginMethod: string;
  createdAt: Date
}

export class CreateAdminRequest {
  email : string 
}