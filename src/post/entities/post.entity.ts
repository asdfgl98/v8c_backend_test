import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ImageUrl } from "./imageUrl.entity";
import { Comment } from "src/comment/entities/comment.entity";

@Entity({name : 'TB_POST'})
export class Post {
    @PrimaryGeneratedColumn({name: 'id'})
    id: string;

    @Column({name: 'title'})
    title: string;

    @ManyToOne(()=> User, (user)=>user.posts)
    @JoinColumn({name: 'userId'})
    author: User;

    @Column({name: 'content'})
    content: string;

    @Column({name: 'category'})
    category: string
    
    @Column({name: 'views', default: 0})
    views: number;

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name : 'updatedAt'})
    updatedAt: Date;

    @OneToMany(()=> ImageUrl, (img)=>img.url)
    imageUrl: ImageUrl[]

    @OneToMany(()=> Comment, (comment)=> comment.comment)
    comment: Comment[]

}