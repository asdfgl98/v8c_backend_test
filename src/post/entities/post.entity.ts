import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ImageUrl } from "./imageUrl.entity";
import { Comment } from "src/comment/entities/comment.entity";

@Entity({name : 'TB_POST'})
export class Post {
    @PrimaryGeneratedColumn({name: 'postId'})
    postId: string;

    @Column({name: 'title', nullable: false})
    title: string;

    @ManyToOne(()=> User, (user)=>user.posts, {nullable: false, onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId', referencedColumnName: 'userId'})
    author: User;

    @Column({name: 'content', nullable: false})
    content: string;

    @Column({name: 'category', nullable: false})
    category: string
    
    @Column({name: 'views', default: 0})
    views: number;

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name : 'updatedAt'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deletedAt'})
    deletedAt: Date;

    @OneToMany(()=> ImageUrl, (img)=>img.postId, {cascade: true})
    imageUrl: ImageUrl[]

    @OneToMany(()=> Comment, (comment)=> comment.comment)
    comment: Comment[]

}