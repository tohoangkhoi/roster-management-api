import { UserRole } from 'src/user-roles/user-roles.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  email: string;

  @Column({ length: 500, nullable: false })
  password: string;

  @Column({ length: 500, nullable: true })
  firstName: string;

  @Column({ length: 500, nullable: true })
  lastName: string;

  @Column({ default: false })
  blocked: boolean;

  @Column({ default: false })
  archived: boolean;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
