import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name : 'TB_POST'})
export class Post {
    @PrimaryGeneratedColumn({name : 'id'})
    id: number;

    @Column({name: 'title'})
    title: string;

    @Column({name: 'author'})
    author: string;

    @Column({name: 'content'})
    content: string;
    
    @Column({name: 'views', default: 0})
    views: number;

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name : 'updatedAt'})
    updatedAt: Date;

}