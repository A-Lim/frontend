import { User } from 'models/user.model';

export interface LoginReponse {
  token: string;
  expiresIn: number;
  user: User;
}
