import express from 'express'
import { notesController } from '../controllers/notes.controller'

export const notesRouter = express.Router()


notesRouter.get('', notesController.getNotes)

// notesRouter.get('/:id', (req, res, next) => {
//   const id = req.params.id
//   console.log('[note] validate token', id)
//   next()
// })

notesRouter.get('/:id', notesController.getNote)
notesRouter.post('', notesController.createNote)
notesRouter.put('/:id', notesController.updateNote)
notesRouter.patch('/:id', notesController.patchNote)
notesRouter.delete('/:id', notesController.removeNote)
