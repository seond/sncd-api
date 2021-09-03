import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Deck {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    strmId: string;

    @Column()
    strmPatchKey: string;

    @ManyToOne(() => User, user => user.decks)
    owner: User;

    @Column()
    slides: string;

    @Column()
    currentSlide: number;
}
