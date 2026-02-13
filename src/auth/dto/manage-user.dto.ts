import { isBoolean, IsBoolean, IsNumber } from 'class-validator';

export class BlockUserDTO {
  @IsNumber()
  id: number;

  @IsBoolean()
  blocked: boolean;
}

export class ArchiveUserDTO {
  @IsNumber()
  userId: number;

  @IsBoolean()
  archived: boolean;
}
