import { Request } from 'express';
import { User } from 'src/user/user.entity';

export type CustomResquest = Request & {
  user: User;
};
