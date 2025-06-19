import { ObjectId } from 'mongodb'
import { assertMongoId } from "./assert-mongo-id.guard"

export function createMongoId(id: string) {
  assertMongoId(id)
  return new ObjectId(id)
}