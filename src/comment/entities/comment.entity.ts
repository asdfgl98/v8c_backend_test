import { Post } from "src/post/entities/post.entity";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'TB_COMMENT'})
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name : 'comment'})
    comment: string;

    @ManyToOne(()=> User, (user)=>user.userId, {nullable: false})
    @JoinColumn({name: 'userId'})
    user: User

    @Column()
    userId: string

    @ManyToOne(()=> Post, (post)=>post.comment, {nullable: false})
    @JoinColumn({name: 'postId'})
    post: Post

    @Column()
    postId: string

    @ManyToOne(()=>Comment, (comment)=>comment.children, {nullable: true})
    @JoinColumn({name: 'parentCommentId'})
    parent: Comment | null

    @Column({nullable: true})
    parentCommentId: number | null

    @OneToMany(()=>Comment, (comment)=>comment.parent)
    children: Comment[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
