import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Deck } from './deck';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    accessToken: string;

    @OneToMany(() => Deck, deck => deck.owner)
    decks: Deck[];
}
