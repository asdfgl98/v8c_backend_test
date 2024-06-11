import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entity";

@Entity({name : 'TB_IMAGE_URL'})
export class ImageUrl {
    @PrimaryGeneratedColumn({name : 'id'})
    id: number;

    @Column({name: 'url'})
    url: string;

    @ManyToOne(()=> Post, (post)=>post.postId, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId'})
    postId: Post;

    @DeleteDateColumn()
    deletedAt: Date | null

}