import { NoteWithoutId, Note } from "../models/note.models"

class NoteWithoutIdValidator implements NoteWithoutId {
  title: string
  content: string
  private: boolean
  pinned: boolean
  dateCreated: Date
  dateUpdated: Date
  color: string
  tags: string[]
  views: number

  constructor(data: Record<string, any>) {
    this.title = data.title ?? this.error('title')
    this.content = data.content ?? this.error('content')
    this.private = data.private ?? this.error('private')
    this.pinned = data.pinned ?? this.error('pinned')
    this.dateCreated = data.dateCreated ?? this.error('dateCreated')
    this.dateUpdated = data.dateUpdated ?? this.error('dateCreated')
    this.color = data.color ?? this.error('color')
    this.tags = data.tags ?? this.error('tags')
    this.views = data.views ?? this.error('views')

    const { errors, ...thisWithoutErrors } = this
    if (Object.keys(data).length > Object.keys(thisWithoutErrors).length) {
      console.log(Object.keys(data), Object.keys(thisWithoutErrors))
      this.errors.push('No extra fields allowed! - NoteWithoutId Model')
    }
  }

  public errors: string[] = []
  error(fieldName: string) {
    this.errors.push(`There is no ${fieldName} field!`)
  }
}

export function validateNoteWithoutId(data: Record<string, any>): string[] | null {
  const validator = new NoteWithoutIdValidator(data)
  return validator.errors.length === 0 ? null : validator.errors
}

export function validaPartialNote(note: Partial<NoteWithoutId>) {
  const fullNoteWithoutId: NoteWithoutId = {
    title: '',
    content: '',
    private: false,
    pinned: true,
    dateCreated: new Date(),
    dateUpdated: new Date(),
    color: '',
    tags: [],
    views: 0
  }
  const noteKeys = Object.keys(note) as (keyof NoteWithoutId)[]
  const errors = []
  for (let key of noteKeys) {
    if (fullNoteWithoutId[key] == null) {
      errors.push(`Invalid ${key} field!`)
    }
  }
  return errors.length > 0 ? errors : null
}