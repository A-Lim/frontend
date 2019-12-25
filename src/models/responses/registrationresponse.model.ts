import { User } from 'models/user.model';

export interface RegistrationResponse {
  message: string;
  token: string;
  expiresIn: number;
  user: User;
  logsUserIn: boolean;
}
