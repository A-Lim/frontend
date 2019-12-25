export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  status: UserStatus;
  isProfileCompleted: boolean;
  invalidLoginAttempts: number;
}

export enum UserStatus {
  active = 'active',
  unverified = 'unverified',
  locked = 'locked',
  banned = 'banned'
}
