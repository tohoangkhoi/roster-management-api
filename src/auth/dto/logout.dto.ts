import { IsNumber } from 'class-validator';

export class LogoutDTO {
  @IsNumber()
  userId: number;
}
