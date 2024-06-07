import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity({name : 'TB_USER'})
export class UserEntity {
    @PrimaryColumn()
    id: string

    @Column()
    password: string

    @Column()
    name: string

    @CreateDateColumn()
    createdAt: Date
}
