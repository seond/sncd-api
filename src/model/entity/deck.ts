import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user';

@Entity()
export class Deck {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    strmId: string;

    // TODO: Update to the correct name (strmActionKey)
    @Column()
    strmPatchKey: string;

    @ManyToOne(() => User, user => user.decks)
    owner: User;

    @Column("text", { array: true })
    slides: string[];

    @Column()
    currentSlide: number;
}
