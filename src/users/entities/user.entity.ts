import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({name : 'TB_USER'})
export class UserEntity {
    @PrimaryColumn({ name : 'userId'})
    userId: string

    @Column({ name: 'password'})
    password: string

    @Column({ name: 'name'})
    name: string

    @CreateDateColumn({ name: 'createdAt'})
    createdAt: Date
}
