import mongoDb from 'mongodb'
export type WithId<Model> = Model & { _id: mongoDb.BSON.ObjectId }