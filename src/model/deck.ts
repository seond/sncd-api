'use strict'

import { Connection } from 'typeorm'

import { connection } from '../database';
import { Deck as Entity } from './entity/deck';
import { User as UserEntity } from './entity/user';
import { User, getOneById as getUserById } from './user';

export class Deck {
  id: string;
  owner: UserEntity;
  slides: string;
  currentSlide: number;
  dbObject: Entity;

  constructor() {
    this.dbObject = new Entity();
  }

  setPropertiesFromDbObject(dbObject: Entity) {
    this.dbObject = dbObject;
    this.id = dbObject.id;
    if (dbObject.owner) {
      this.owner = dbObject.owner;
    }
    if (dbObject.slides) {
      this.slides = dbObject.slides;
    }
    if (dbObject.currentSlide) {
      this.currentSlide = dbObject.currentSlide;
    }
  }

  async setPropertiesFromPayload(userId: string, payload: any) {
    const owner = await getUserById(payload.owner);

    this.owner = owner.dbObject;
    this.slides = payload.slides;
    this.currentSlide = payload.currentSlide || 0;
  }

  save(): Promise<Object> {
    return connection.then((conn: Connection) => {
      this.dbObject.owner = this.owner;
      this.dbObject.slides = this.slides;
      this.dbObject.currentSlide = this.currentSlide;
      return conn.manager.save(this.dbObject);
    });
  }

  delete(): Promise<Object> {
    return connection.then((conn: Connection) => {
      return conn.manager.remove(this.dbObject);
    });
  }
}

export function getOneById(userId: string, id: string): Promise<Object> {
  return connection
    .then((conn: Connection) => conn.manager.findOne(Entity, id))
    .then((dbObject: Entity) => {
      if (!dbObject || dbObject.owner.id !== userId) {
        return null;
      }

      let obj = new Deck();
      obj.setPropertiesFromDbObject(dbObject);

      return obj;
    });
}

export function getAll(userId: string): Promise<Object> {
  return connection
    // .then((conn: Connection) => conn.manager.find(Entity, { owner: userId }))
    .then((conn: Connection) => conn.manager.find(Entity))
    .then((dbObjects: Entity[]) => {
      if (!dbObjects) {
        return null;
      }

      return dbObjects.map(dbObject => {
        let obj = new Deck();
        obj.setPropertiesFromDbObject(dbObject);
        return obj;
      });
    });
}
