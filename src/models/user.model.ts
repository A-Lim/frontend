export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  status: string;
  isProfileCompleted: boolean;
  invalidLoginAttempts: number;
}
