import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
