import { WithoutId } from './../models/without-id.model'
import * as mongoDb from 'mongodb'
// import {Db, } from 'mongodb'
import config from '../config.json'
import { createMongoId } from '../helpers/create-mongo-id'
import { WithId } from '../models/with-id.model'

class DbService {
  private db!: mongoDb.Db
  constructor() {
    this.connect()
  }
  private async connect() {
    const client = new mongoDb.MongoClient(config.mongodb_uri)
    await client.connect()
    this.db = client.db(config.db_name)
  }
  create(data: mongoDb.Document, collection: string) {
    return this.db.collection(collection).insertOne(data)
      .then(data => data.acknowledged ? data.insertedId.toString() : null)
  }
  find<DataType extends Record<string, any> = Record<string, any>>(query = {}, collection: string) {
    // przykładowe kryteria filtrowania:
    const query2 = {
      title: '7',
      color: 'red',
      $or: [
        { visited: { $gt: 3, $lt: 10 } },
        { content: { $exists: true } },
      ]
    }

    // paginacja
    // return this.db.collection(collection).find(query).skip(10).limit(10)
    // sortowanie
    // return this.db.collection(collection).find(query).sort({ title: 1, content: -1 })
    // zwrotka to obiekt FindCursor
    return this.db.collection(collection).find<DataType>(query).toArray()
  }
  findOne<DataType extends mongoDb.Document = mongoDb.Document>(id: string, collection: string) {
    const query: WithId<mongoDb.Document> = {
      "_id": createMongoId(id)
    }
    return this.db.collection(collection).findOne<DataType>(query)
  }
  replace(id: string, data: WithoutId<mongoDb.Document>, collection: string) {
    const query = {
      "_id": createMongoId(id)
    }
    return this.db.collection(collection)
      .replaceOne(query, data)
      .then(result =>
        !!result.modifiedCount
      )
  }
  patch(id: string, data: mongoDb.Document, collection: string) {
    const query = {
      "_id": createMongoId(id)
    }
    return this.db.collection(collection)
      .updateOne(query, { $set: { ...data } })
      .then(result =>
        !!result.modifiedCount
      )
  }
  delete(id: string, collection: string) {
    const query = {
      "_id": createMongoId(id)
    }
    return this.db.collection(collection)
      .deleteOne(query)
      .then(result =>
        !!result.deletedCount
      )
  }
}
export const dbService = new DbService()