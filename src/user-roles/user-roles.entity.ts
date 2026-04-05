import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { RoleValue } from './constants/user-roles-providers.constants';

enum Roles {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}
@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.STAFF,
  })
  value: RoleValue;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  user: User;
}
