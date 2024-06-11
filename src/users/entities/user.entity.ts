import { Post } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity({name : 'TB_USER'})
export class User {
    @PrimaryColumn({ name : 'userId'})
    userId: string

    @Column({ name: 'password'})
    password: string

    @Column({ name: 'name'})
    name: string

    @CreateDateColumn({ name: 'createdAt'})
    createdAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @Column({ name: 'role', default: 'user'})
    role: string

    @OneToMany(()=> Post, (post)=> post.author, {cascade: true})
    posts: Post[]
}
