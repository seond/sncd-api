'use strict'

import md5 from 'md5';

import { connection } from '../database';
import { User as Entity } from './entity/user';

export class User {
  id: string;
  username: string;
  password: string;
  accessToken?: string;
  dbObject: Entity;

  constructor() {
    this.dbObject = new Entity();
  }

  setPropertiesFromDbObject(dbObject: Entity) {
    this.dbObject = dbObject;
    this.id = dbObject.id;
    if (dbObject.username) {
      this.username = dbObject.username;
    }
    if (dbObject.password) {
      this.password = dbObject.password;
    }
  }

  setPropertiesFromPayload(payload: any) {
    this.username = payload.username;
    this.password = md5(payload.password);
  }

  async save(): Promise<Entity> {
    const conn = await connection;
    if (!conn) {
      return null;
    }

    this.dbObject.username = this.username;
    this.dbObject.password = this.password;
    this.dbObject.accessToken = this.accessToken;
    return await conn.manager.save(this.dbObject);
  }
}

export async function getOneByUsername(username: string): Promise<User> {
  const conn = await connection;
  if (!conn) {
    return null;
  }

  const dbObject = await conn.manager.findOne(Entity, {
    username
  });
  if (!dbObject) {
    return null;
  }

  let obj = new User();
  obj.setPropertiesFromDbObject(dbObject);
  return obj;
}

export async function getOneById(userId: string): Promise<User> {
  const conn = await connection;
  if (!conn) {
    return null;
  }

  const dbObject = await conn.manager.findOne(Entity, userId);
  if (!dbObject) {
    return null;
  }

  let obj = new User();
  obj.setPropertiesFromDbObject(dbObject);
  return obj;
}
