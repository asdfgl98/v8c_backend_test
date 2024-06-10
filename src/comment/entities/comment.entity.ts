import { Post } from "src/post/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'TB_COMMENT'})
export class Comment {
    @PrimaryGeneratedColumn({name: 'id'})
    id: number;

    @Column({name : 'comment'})
    comment: string;

    @ManyToOne(()=> User, (user)=>user.userId)
    @JoinColumn({name: 'userId'})
    user: User

    @ManyToOne(()=> Post, (post)=>post.postId)
    @JoinColumn({name: 'postId'})
    postId: Post

    @ManyToOne(()=>Comment, {nullable: true})
    @JoinColumn({name: 'parentCommentId', referencedColumnName: 'id'})
    parentCommentId: string



}
