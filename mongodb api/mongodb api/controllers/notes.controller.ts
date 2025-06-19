import { NextFunction, Request, Response } from 'express'
import { notesService } from '../services/notes.service'
import { validaPartialNote, validateNoteWithoutId } from '../helpers/note.validators'

class NotesController {
  async getNotes(req: Request, res: Response, next: any) {
    try {
      const notes = await notesService.getNotes()
      res.status(200).send(notes)
    } catch {
      res.status(500).send()
    }
  }
  async getNote(req: Request, res: Response) {
    const id = req.params.id
    if (!id) {
      res.status(400).send('No id!')
    }
    try {
      const note = await notesService.getNote(id)
      console.log('[note] get', id)
      if (note) {
        res.status(200).send(note)
      } else {
        res.status(404).send()
      }
    } catch (err) {
      res.status(500).send((err as Error).message)
    }
  }
  async createNote(req: Request, res: Response, next: NextFunction) {
    const note = req.body
    const validationErrors = validateNoteWithoutId(note)
    if (validationErrors) {
      res.status(400).send(validationErrors)
      return
    }

    const id = await notesService.createNote(note)
    if (id) {
      res.status(201).send({ id })
    } else {
      res.status(500).send('Data store problem')
    }
  }
  async updateNote(req: Request, res: Response) {
    const id = req.params.id
    const { _id, ...note } = req.body
    const validationErrors = validateNoteWithoutId(note)
    if (validationErrors) {
      res.status(400).send(validationErrors)
      return
    }

    try {
      const result = await notesService.updateNote(id, note)
      res.status(200).send({ replaced: result })
    } catch (err) {
      res.status(500).send(err)
    }
  }
  async patchNote(req: Request, res: Response) {
    const id = req.params.id
    const { _id, ...note } = req.body
    const validationErrors = validaPartialNote(note)
    if (validationErrors) {
      res.status(400).send(validationErrors)
      return
    }
    try {
      const result = await notesService.patchNote(id, note)
      res.status(200).send({ patched: result })
    } catch (err) {
      res.status(500).send(err)
    }
  }
  async removeNote(req: Request, res: Response) {
    const id = req.params.id

    try {
      const result = await notesService.deleteNote(id)
      res.status(200).send({ deleted: result })
    } catch (err) {
      res.status(500).send(err)
    }
  }
}
export const notesController = new NotesController()