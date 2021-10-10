'use strict';

import { connection } from '../database';
import { Team as Entity } from './entity/team';

export class Team {
  id: string;
  name: string;
  description: string;
  dbObject: Entity;

  constructor(dbObject?: Entity) {
    if (dbObject) {
      this.setPropertiesFromDbObject(dbObject);
    } else {
      this.dbObject = new Entity();
    }
  }

  setPropertiesFromDbObject(dbObject: Entity) {
    this.dbObject = dbObject;
    this.id = dbObject.id;
    if (dbObject.name) {
      this.name = dbObject.name;
    }
    if (dbObject.description) {
      this.description = dbObject.description;
    }
  }

  setPropertiesFromPayload(payload: any) {
    this.name = payload.name;
    this.description = payload.description;
  }

  async save(): Promise<Entity> {
    const conn = await connection;
    if (!conn) {
      return null;
    }

    this.dbObject.name = this.name;
    this.dbObject.description = this.description;
    return await conn.manager.save(this.dbObject);
  }
}

export async function getOneById(teamId: string): Promise<Team> {
  const conn = await connection;
  if (!conn) {
    return null;
  }

  const dbObject = await conn.manager.findOne(Entity, teamId);
  if (!dbObject) {
    return null;
  }

  let obj = new Team();
  obj.setPropertiesFromDbObject(dbObject);
  return obj;
}
