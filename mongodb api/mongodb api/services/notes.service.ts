import { WithoutId } from "mongodb"
import { NoteWithoutId, Note, NoteId } from "../models/note.models"
import { dbService } from "./db.service"

class NotesService {
  private collectionName = 'notes'
  getNotes() {
    return dbService.find<Note>({}, this.collectionName)
  }
  getNote(id: NoteId) {
    return dbService.findOne<Note>(id, this.collectionName)
  }
  async createNote(note: NoteWithoutId) {
    return dbService.create(note, this.collectionName)
  }
  updateNote(id: string, note: NoteWithoutId) {
    return dbService.replace(id, note, this.collectionName)
  }
  patchNote(id: string, note: Partial<WithoutId<Note>>) {
    return dbService.patch(id, note, this.collectionName)
  }
  deleteNote(id: NoteId) {
    return dbService.delete(id, this.collectionName)
  }
}
export const notesService = new NotesService()